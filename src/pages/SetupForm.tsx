import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import flexwegLogo from "../assets/flexweg-logo.png";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { LocaleSwitcher } from "../components/ui/LocaleSwitcher";
import {
  buildConfigJsSource,
  type FlexwegRuntimeConfig,
} from "../lib/runtimeConfig";
import {
  SetupApiError,
  testFlexwegConnection,
  uploadConfigJs,
  type SetupFlexwegConfig,
} from "../lib/setupApi";
import {
  collections,
  configDocs,
  getAuthClient,
  getDb,
  initFirebaseFromSetup,
} from "../services/firebase";
import { DEFAULT_FLEXWEG_API_BASE_URL } from "../services/flexwegConfig";
import { syncThemeAssets } from "../services/themeSync";
import { isRootDeployment } from "../lib/adminBase";

interface FormState {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  adminEmail: string;
  adminPassword: string;
  flexwegApiKey: string;
  flexwegSiteUrl: string;
  flexwegApiBaseUrl: string;
}

// Derives a sensible default for the Flexweg site URL by stripping the
// path off the page's current origin. The admin is conventionally
// deployed at `<site>/admin/`, so the page hosting the SetupForm lives
// under the very URL the user wants to type in. Pre-filling saves the
// copy/paste — they can still edit if their public site URL differs
// from the admin host (e.g. admin on a separate subdomain).
//
// Skipped on localhost — `http://localhost:4173` is never a useful
// default for a Flexweg public site URL during local testing.
function defaultSiteUrl(): string {
  if (typeof window === "undefined") return "";
  const h = window.location.hostname;
  if (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "[::1]" ||
    h === "::1" ||
    h === "0.0.0.0" ||
    h.endsWith(".localhost")
  ) {
    return "";
  }
  return window.location.origin;
}

const INITIAL_STATE: FormState = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  adminEmail: "",
  adminPassword: "",
  flexwegApiKey: "",
  flexwegSiteUrl: defaultSiteUrl(),
  flexwegApiBaseUrl: DEFAULT_FLEXWEG_API_BASE_URL,
};

type ErrorKind =
  | "missingFields"
  | "rootDeployment"
  | "firebaseAuth"
  | "firebaseAuthInvalidCredential"
  | "emailNotVerified"
  | "wrongAdminEmail"
  | "rulesNotPinned"
  | "flexwegAuth"
  | "flexwegNetwork"
  | "firestoreRules"
  | "firestoreOther"
  | "uploadFailed"
  | "generic";

interface ErrorState {
  kind: ErrorKind;
  detail?: string;
}

// Map a Firebase Auth error to a translation key used by the form.
function authErrorTranslationKey(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "setup.errors.firebaseAuthInvalidCredential";
    case "auth/user-not-found":
      return "setup.errors.firebaseAuthUserNotFound";
    case "auth/invalid-email":
      return "setup.errors.firebaseAuthInvalidEmail";
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
      return "setup.errors.firebaseInvalidApiKey";
    case "auth/network-request-failed":
      return "setup.errors.firebaseNetwork";
    case "auth/too-many-requests":
      return "setup.errors.firebaseTooManyRequests";
    case "auth/operation-not-allowed":
      return "setup.errors.firebaseOperationNotAllowed";
    case "auth/user-disabled":
      return "setup.errors.firebaseUserDisabled";
    default:
      return "setup.errors.firebaseAuthGeneric";
  }
}

type WizardStep = "welcome" | "terms" | "firebase" | "flexweg";

export function SetupForm() {
  const { t } = useTranslation();
  // Three-step wizard: welcome screen with Firebase tutorial CTA, then
  // the terms-of-use acceptance, then the actual configuration form.
  // The welcome and terms steps prime the user on the (free) Firebase
  // prerequisite + their responsibilities before throwing 11 form
  // fields at them.
  const [wizardStep, setWizardStep] = useState<WizardStep>("welcome");
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<string | null>(null);
  // Append-only timeline of completed steps. Drives the progress overlay
  // so the user sees what's already done while the current step spins.
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [error, setError] = useState<ErrorState | null>(null);
  const [done, setDone] = useState(false);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function trimmed(): FormState {
    return {
      ...form,
      apiKey: form.apiKey.trim(),
      authDomain: form.authDomain.trim(),
      projectId: form.projectId.trim(),
      storageBucket: form.storageBucket.trim(),
      messagingSenderId: form.messagingSenderId.trim(),
      appId: form.appId.trim(),
      adminEmail: form.adminEmail.trim().toLowerCase(),
      flexwegApiKey: form.flexwegApiKey.trim(),
      flexwegSiteUrl: form.flexwegSiteUrl.trim().replace(/\/+$/, ""),
      flexwegApiBaseUrl:
        form.flexwegApiBaseUrl.trim().replace(/\/+$/, "") ||
        DEFAULT_FLEXWEG_API_BASE_URL,
    };
  }

  function validateFirebase(state: FormState): boolean {
    const required: Array<keyof FormState> = [
      "apiKey",
      "authDomain",
      "projectId",
      "storageBucket",
      "messagingSenderId",
      "appId",
      "adminEmail",
    ];
    for (const k of required) {
      if (!state[k]) return false;
    }
    if (!form.adminPassword) return false;
    if (!/.+@.+\..+/.test(state.adminEmail)) return false;
    return true;
  }

  function validateFlexweg(state: FormState): boolean {
    const required: Array<keyof FormState> = [
      "flexwegApiKey",
      "flexwegSiteUrl",
      "flexwegApiBaseUrl",
    ];
    for (const k of required) {
      if (!state[k]) return false;
    }
    return true;
  }

  // Sub-step 1: Firebase configuration. Validates the Firebase fields,
  // initialises the SDK, signs the admin in, verifies the email match,
  // requires email verification, and probes Firestore to confirm the
  // rules pin this email as bootstrap admin. On success, transitions
  // the wizard to the Flexweg sub-step. No writes to Firestore or
  // Flexweg happen here — those are Sub-step 2's job, so the user can
  // bail mid-setup without leaving stale state behind.
  async function handleFirebaseSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setProgressLog([]);

    if (isRootDeployment()) {
      setError({ kind: "rootDeployment" });
      setSubmitting(false);
      return;
    }

    const state = trimmed();
    if (!validateFirebase(state)) {
      setError({ kind: "missingFields" });
      setSubmitting(false);
      return;
    }

    const runtimeConfig: FlexwegRuntimeConfig = {
      firebase: {
        apiKey: state.apiKey,
        authDomain: state.authDomain,
        projectId: state.projectId,
        storageBucket: state.storageBucket,
        messagingSenderId: state.messagingSenderId,
        appId: state.appId,
      },
    };

    const logDone = (label: string) => setProgressLog((prev) => [...prev, label]);
    try {
      // 1. Initialise Firebase + sign in.
      setStep(t("setup.steps.signInFirebase"));
      initFirebaseFromSetup(runtimeConfig);
      try {
        await signInWithEmailAndPassword(
          getAuthClient(),
          state.adminEmail,
          form.adminPassword,
        );
      } catch (err) {
        const detailKey = authErrorTranslationKey(err);
        const fbErr = err as { code?: string; message?: string };
        if (detailKey === "setup.errors.firebaseAuthInvalidCredential") {
          setError({ kind: "firebaseAuthInvalidCredential" });
          setSubmitting(false);
          setStep(null);
          return;
        }
        let detail = t(detailKey);
        if (detailKey === "setup.errors.firebaseAuthGeneric") {
          if (fbErr.code) detail += ` [${fbErr.code}]`;
          if (fbErr.message) detail += `: ${fbErr.message}`;
        }
        setError({ kind: "firebaseAuth", detail });
        setSubmitting(false);
        setStep(null);
        return;
      }
      logDone(t("setup.steps.signInFirebase"));

      // 2. Email match.
      const signedInEmail = (
        getAuthClient().currentUser?.email ?? ""
      ).toLowerCase();
      if (signedInEmail !== state.adminEmail) {
        setError({ kind: "wrongAdminEmail" });
        setSubmitting(false);
        setStep(null);
        return;
      }

      // 2b. Email verified.
      const cu = getAuthClient().currentUser;
      if (cu && !cu.emailVerified) {
        try {
          await sendEmailVerification(cu);
        } catch (err) {
          console.warn("[setup] sendEmailVerification failed:", err);
        }
        setError({ kind: "emailNotVerified", detail: state.adminEmail });
        setSubmitting(false);
        setStep(null);
        return;
      }

      // 2c. Rules pinned (probe `config/admin`).
      try {
        await getDoc(doc(getDb(), collections.config, configDocs.admin));
      } catch (err) {
        const code = (err as { code?: string })?.code ?? "";
        if (code === "permission-denied") {
          setError({ kind: "rulesNotPinned", detail: state.adminEmail });
          setSubmitting(false);
          setStep(null);
          return;
        }
        throw err;
      }

      // Firebase sub-step done — transition to the Flexweg form. Keep
      // the progress log accumulated so the user sees the Firebase
      // checks already completed when sub-step 2 starts.
      setStep(null);
      setSubmitting(false);
      setWizardStep("flexweg");
    } catch (err) {
      setError({
        kind: "generic",
        detail: (err as Error).message,
      });
      setSubmitting(false);
      setStep(null);
    }
  }

  // Sub-step 2: Flexweg configuration. Validates the Flexweg fields,
  // tests the API key, writes config/flexweg to Firestore, uploads
  // the populated config.js to Flexweg, and syncs theme assets.
  // Reaches this only after Firebase sub-step has signed in + probed
  // the rules — the auth session is still alive, so writes are safe.
  async function handleFlexwegSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    // Don't reset progressLog — we want to keep the Firebase check
    // entries visible so the user sees the cumulative completion.

    const state = trimmed();
    if (!validateFlexweg(state)) {
      setError({ kind: "missingFields" });
      setSubmitting(false);
      return;
    }

    const runtimeConfig: FlexwegRuntimeConfig = {
      firebase: {
        apiKey: state.apiKey,
        authDomain: state.authDomain,
        projectId: state.projectId,
        storageBucket: state.storageBucket,
        messagingSenderId: state.messagingSenderId,
        appId: state.appId,
      },
    };
    const flexwegConfig: SetupFlexwegConfig = {
      apiKey: state.flexwegApiKey,
      siteUrl: state.flexwegSiteUrl,
      apiBaseUrl: state.flexwegApiBaseUrl,
    };

    const logDone = (label: string) => setProgressLog((prev) => [...prev, label]);
    try {
      // 3. Test Flexweg API.
      setStep(t("setup.steps.testFlexweg"));
      try {
        await testFlexwegConnection(flexwegConfig);
      } catch (err) {
        if (err instanceof SetupApiError) {
          if (err.status === 401 || err.status === 403) {
            setError({ kind: "flexwegAuth" });
          } else {
            setError({
              kind: "generic",
              detail: t("setup.errors.flexwegHttp", {
                status: err.status,
                detail: err.message,
              }),
            });
          }
        } else {
          setError({ kind: "flexwegNetwork" });
        }
        setSubmitting(false);
        setStep(null);
        return;
      }
      logDone(t("setup.steps.testFlexweg"));

      // 4. Write config/flexweg to Firestore.
      setStep(t("setup.steps.writeFirestore"));
      try {
        await setDoc(doc(getDb(), collections.config, configDocs.flexweg), {
          apiKey: flexwegConfig.apiKey,
          siteUrl: flexwegConfig.siteUrl,
          apiBaseUrl: flexwegConfig.apiBaseUrl,
        });
      } catch (err) {
        const code = (err as { code?: string })?.code ?? "";
        if (code === "permission-denied") {
          setError({
            kind: "firestoreRules",
            detail: state.adminEmail,
          });
        } else {
          setError({
            kind: "firestoreOther",
            detail: (err as Error).message,
          });
        }
        setSubmitting(false);
        setStep(null);
        return;
      }
      logDone(t("setup.steps.writeFirestore"));

      // 5. Upload config.js to Flexweg.
      setStep(t("setup.steps.uploadConfig"));
      try {
        const source = buildConfigJsSource(runtimeConfig);
        await uploadConfigJs(flexwegConfig, source);
      } catch (err) {
        setError({
          kind: "uploadFailed",
          detail: err instanceof Error ? err.message : String(err),
        });
        setSubmitting(false);
        setStep(null);
        return;
      }
      logDone(t("setup.steps.uploadConfig"));

      // 6. Sync theme assets (non-fatal).
      setStep(t("setup.steps.syncThemes"));
      try {
        await syncThemeAssets(undefined, undefined);
      } catch (err) {
        console.error("[setup] theme assets sync failed:", err);
      }
      logDone(t("setup.steps.syncThemes"));

      setDone(true);
      setStep(null);
      window.setTimeout(() => {
        const next = new URL(window.location.href);
        next.searchParams.set("_setup", String(Date.now()));
        window.location.replace(next.toString());
      }, 2000);
    } catch (err) {
      setError({
        kind: "generic",
        detail: (err as Error).message,
      });
      setSubmitting(false);
      setStep(null);
    }
  }

  return (
    <div className="relative min-h-full flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950 overflow-hidden">
      {/* Floating colour blobs — branding accent reused from
          flexweg.com's home. Lives behind the form (z-index: 0) and
          ignores pointer events. CSS in src/index.css. */}
      <div className="flexweg-blobs" aria-hidden="true">
        <div className="flexweg-blob flexweg-blob-1"></div>
        <div className="flexweg-blob flexweg-blob-2"></div>
        <div className="flexweg-blob flexweg-blob-3"></div>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <LocaleSwitcher />
      </div>
      {/* Render the overlay through a portal on <body> so its mount /
          unmount doesn't shuffle siblings inside the form tree. The
          form's card and the overlay used to be siblings of the same
          parent, and the conditional mount triggered "Node.insertBefore"
          DOM errors when browser extensions (Grammarly, translators,
          password managers) had injected nodes into the form area —
          React's diff couldn't reconcile the unexpected children. With
          a portal, the overlay's DOM lives on document.body, isolated
          from whatever the extensions are doing inside the form. */}
      {(submitting || done) &&
        createPortal(
          <SetupProgressOverlay
            step={step}
            progressLog={progressLog}
            done={done}
          />,
          document.body,
        )}
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center gap-2.5 justify-center mb-6">
          <img
            src={flexwegLogo}
            alt="Flexweg"
            className="h-10 w-10 rounded-xl shadow-card object-cover"
          />
          <div className="text-center">
            <p className="text-base font-semibold leading-none">
              {t("setup.title")}
            </p>
            <p className="text-[11px] text-surface-500 mt-0.5 dark:text-surface-400">
              {t("setup.subtitle")}
            </p>
          </div>
        </div>

        <Stepper currentStep={wizardStep} />

        {isRootDeployment() && (
          <div className="mb-4 rounded-lg bg-amber-50 text-amber-800 ring-1 ring-amber-200 px-4 py-3 text-sm dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-700/50">
            <p className="font-semibold">
              {t("setup.errors.rootDeploymentTitle")}
            </p>
            <p className="text-xs mt-1.5 leading-relaxed">
              {t("setup.errors.rootDeploymentHint")}
            </p>
          </div>
        )}

        {wizardStep === "welcome" ? (
          <WelcomeStep onContinue={() => setWizardStep("terms")} />
        ) : wizardStep === "terms" ? (
          <TermsStep
            onAccept={() => setWizardStep("firebase")}
            onBack={() => setWizardStep("welcome")}
          />
        ) : wizardStep === "firebase" ? (
        <div className="card p-6">
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {t("setup.introFirebase")}
          </p>

          <form onSubmit={handleFirebaseSubmit} className="mt-6 space-y-6">
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                {t("setup.sections.firebase")}
              </legend>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {t("setup.help.firebase")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label={t("setup.fields.apiKey")}
                  value={form.apiKey}
                  onChange={(v) => patch("apiKey", v)}
                  required
                  autoFocus
                />
                <Field
                  label={t("setup.fields.authDomain")}
                  placeholder="your-project.firebaseapp.com"
                  value={form.authDomain}
                  onChange={(v) => patch("authDomain", v)}
                  required
                />
                <Field
                  label={t("setup.fields.projectId")}
                  placeholder="your-project"
                  value={form.projectId}
                  onChange={(v) => patch("projectId", v)}
                  required
                />
                <Field
                  label={t("setup.fields.storageBucket")}
                  placeholder="your-project.appspot.com"
                  value={form.storageBucket}
                  onChange={(v) => patch("storageBucket", v)}
                  required
                />
                <Field
                  label={t("setup.fields.messagingSenderId")}
                  value={form.messagingSenderId}
                  onChange={(v) => patch("messagingSenderId", v)}
                  required
                />
                <Field
                  label={t("setup.fields.appId")}
                  value={form.appId}
                  onChange={(v) => patch("appId", v)}
                  required
                />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                {t("setup.sections.admin")}
              </legend>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {t("setup.help.admin")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  type="email"
                  label={t("setup.fields.adminEmail")}
                  placeholder="you@company.com"
                  value={form.adminEmail}
                  onChange={(v) => patch("adminEmail", v)}
                  required
                  autoComplete="email"
                />
                <Field
                  type="password"
                  label={t("setup.fields.adminPassword")}
                  placeholder="••••••••"
                  value={form.adminPassword}
                  onChange={(v) => patch("adminPassword", v)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </fieldset>

            <div aria-live="polite" aria-atomic="true">
              {error ? (
                <div className="rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200 px-3 py-2 text-sm dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700/50">
                  <ErrorMessage error={error} />
                  {error.kind === "emailNotVerified" && <ResendVerificationButton />}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setWizardStep("terms")}
                className="btn-secondary flex-1 justify-center"
                disabled={submitting || done}
              >
                {t("setup.terms.back")}
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 justify-center"
                disabled={submitting || done}
              >
                {t("setup.continueToFlexweg")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
        ) : (
        // wizardStep === "flexweg"
        <div className="card p-6">
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {t("setup.introFlexweg")}
          </p>

          <form onSubmit={handleFlexwegSubmit} className="mt-6 space-y-6">
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                {t("setup.sections.flexweg")}
              </legend>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {t("setup.help.flexweg")}
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Field
                    label={t("setup.fields.flexwegApiKey")}
                    value={form.flexwegApiKey}
                    onChange={(v) => patch("flexwegApiKey", v)}
                    required
                    autoFocus
                  />
                  <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-1">
                    {t("setup.help.flexwegApiKeyHint")}{" "}
                    <a
                      href="https://www.flexweg.com/account/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {t("setup.help.flexwegApiKeyLink")}
                    </a>
                    .
                  </p>
                </div>
                <Field
                  label={t("setup.fields.flexwegSiteUrl")}
                  placeholder="https://your-site.flexweg.com"
                  value={form.flexwegSiteUrl}
                  onChange={(v) => patch("flexwegSiteUrl", v)}
                  required
                />
                <Field
                  label={t("setup.fields.flexwegApiBaseUrl")}
                  value={form.flexwegApiBaseUrl}
                  onChange={(v) => patch("flexwegApiBaseUrl", v)}
                  required
                />
              </div>
            </fieldset>

            <div aria-live="polite" aria-atomic="true">
              {error ? (
                <div className="rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200 px-3 py-2 text-sm dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700/50">
                  <ErrorMessage error={error} />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setWizardStep("firebase");
                }}
                className="btn-secondary flex-1 justify-center"
                disabled={submitting || done}
              >
                {t("setup.terms.back")}
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 justify-center"
                disabled={submitting || done}
              >
                {t("setup.submit")}
              </button>
            </div>
          </form>
        </div>
        )}

        <p className="text-[11px] text-surface-400 text-center mt-4 dark:text-surface-500">
          {t("setup.footer")}
        </p>
      </div>
    </div>
  );
}

interface StepperProps {
  currentStep: WizardStep;
}

function Stepper({ currentStep }: StepperProps) {
  const { t } = useTranslation();
  const steps: Array<{ id: WizardStep; label: string }> = [
    { id: "welcome", label: t("setup.stepper.welcome") },
    { id: "terms", label: t("setup.stepper.terms") },
    { id: "firebase", label: t("setup.stepper.firebase") },
    { id: "flexweg", label: t("setup.stepper.flexweg") },
  ];
  const activeIndex = steps.findIndex((s) => s.id === currentStep);
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {steps.map((s, idx) => {
        const isActive = idx === activeIndex;
        const isDone = idx < activeIndex;
        return (
          <div key={s.id} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={
                  "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors " +
                  (isDone
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-surface-200 text-surface-500 dark:bg-surface-800 dark:text-surface-400")
                }
              >
                {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
              </div>
              <span
                className={
                  "text-xs font-medium " +
                  (isActive
                    ? "text-surface-900 dark:text-surface-50"
                    : "text-surface-500 dark:text-surface-400")
                }
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={
                  "h-px w-8 transition-colors " +
                  (isDone
                    ? "bg-emerald-500"
                    : "bg-surface-300 dark:bg-surface-700")
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface WelcomeStepProps {
  onContinue: () => void;
}

function WelcomeStep({ onContinue }: WelcomeStepProps) {
  const { t } = useTranslation();
  // Tutorial URL is exposed as a translation key so it can be retargeted
  // per locale (e.g. localized blog posts) without a code change. Default
  // value points at Firebase's own setup docs — already free, official
  // and 5-minute friendly.
  const tutorialUrl = t("setup.welcome.tutorialUrl");
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
        {t("setup.welcome.heading")}
      </h2>
      <p className="text-sm text-surface-600 dark:text-surface-300 mt-3">
        {t("setup.welcome.intro")}
      </p>
      <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/60 dark:bg-blue-950/40">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
          {t("setup.welcome.firebaseTitle")}
        </h3>
        <p className="text-xs text-blue-800/90 dark:text-blue-300/90 mt-1.5 leading-relaxed">
          {t("setup.welcome.firebaseBody")}
        </p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href={tutorialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 justify-center"
        >
          <BookOpen className="h-4 w-4" />
          {t("setup.welcome.tutorialButton")}
        </a>
        <button
          type="button"
          onClick={onContinue}
          className="btn-primary flex-1 justify-center"
        >
          {t("setup.welcome.haveAccountButton")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface TermsStepProps {
  onAccept: () => void;
  onBack: () => void;
}

// 7 sections of plain-language terms. Keys live under setup.terms.section{N}
// so we can index over them in a stable order and translate once per locale.
const TERMS_SECTION_COUNT = 7;

function TermsStep({ onAccept, onBack }: TermsStepProps) {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
        {t("setup.terms.title")}
      </h2>
      <p className="text-sm text-surface-600 dark:text-surface-300 mt-3">
        {t("setup.terms.intro")}
      </p>

      <div className="mt-5 max-h-80 overflow-y-auto pr-2 space-y-4 rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-900/40">
        {Array.from({ length: TERMS_SECTION_COUNT }, (_, i) => i + 1).map(
          (n) => (
            <section key={n}>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                {t(`setup.terms.section${n}.title`)}
              </h3>
              <p className="text-xs text-surface-600 dark:text-surface-300 mt-1.5 leading-relaxed">
                {t(`setup.terms.section${n}.body`)}
              </p>
            </section>
          ),
        )}
      </div>

      <label className="mt-5 flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-surface-300 text-blue-600 focus:ring-blue-500 dark:border-surface-600 dark:bg-surface-800"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <span className="text-sm text-surface-700 dark:text-surface-200">
          {t("setup.terms.accept")}
        </span>
      </label>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary flex-1 justify-center"
        >
          {t("setup.terms.back")}
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={!accepted}
          className="btn-primary flex-1 justify-center"
        >
          {t("setup.terms.continue")}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  autoComplete,
  autoFocus,
}: FieldProps) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
    </div>
  );
}

function ErrorMessage({ error }: { error: ErrorState }) {
  const { t } = useTranslation();
  switch (error.kind) {
    case "missingFields":
      return <span>{t("setup.errors.missingFields")}</span>;
    case "rootDeployment":
      return (
        <div className="space-y-1.5">
          <p>{t("setup.errors.rootDeploymentTitle")}</p>
          <p className="text-xs">{t("setup.errors.rootDeploymentHint")}</p>
        </div>
      );
    case "firebaseAuth":
      return <span>{error.detail ?? t("setup.errors.firebaseAuthGeneric")}</span>;
    case "firebaseAuthInvalidCredential":
      return (
        <div className="space-y-1.5">
          <p>{t("setup.errors.firebaseAuthInvalidCredential")}</p>
          <p className="text-xs whitespace-pre-line leading-relaxed">
            {t("setup.errors.firebaseAuthInvalidCredentialHint")}
          </p>
        </div>
      );
    case "wrongAdminEmail":
      return <span>{t("setup.errors.wrongAdminEmail")}</span>;
    case "rulesNotPinned":
      return (
        <div className="space-y-1.5">
          <p>{t("setup.errors.rulesNotPinnedTitle")}</p>
          <p className="text-xs leading-relaxed">
            {t("setup.errors.rulesNotPinnedHint", { email: error.detail ?? "" })}
          </p>
        </div>
      );
    case "emailNotVerified":
      return (
        <div className="space-y-1.5">
          <p>{t("setup.errors.emailNotVerifiedTitle")}</p>
          <p className="text-xs leading-relaxed">
            {t("setup.errors.emailNotVerifiedHint", {
              email: error.detail ?? "",
            })}
          </p>
        </div>
      );
    case "flexwegAuth":
      return <span>{t("setup.errors.flexwegAuth")}</span>;
    case "flexwegNetwork":
      return <span>{t("setup.errors.flexwegNetwork")}</span>;
    case "firestoreRules":
      return (
        <div className="space-y-1.5">
          <p>{t("setup.errors.firestoreRulesTitle")}</p>
          <p className="text-xs">
            {t("setup.errors.firestoreRulesHint", { email: error.detail })}
          </p>
        </div>
      );
    case "firestoreOther":
      return (
        <span>
          {t("setup.errors.firestoreOther")}: {error.detail}
        </span>
      );
    case "uploadFailed":
      return (
        <span>
          {t("setup.errors.uploadFailed")}
          {error.detail ? `: ${error.detail}` : ""}
        </span>
      );
    case "generic":
    default:
      return <span>{error.detail ?? t("setup.errors.generic")}</span>;
  }
}

interface ProgressOverlayProps {
  step: string | null;
  progressLog: string[];
  done: boolean;
}

// Inline button rendered alongside the "email not verified" error.
// Re-triggers Firebase's `sendEmailVerification` for the currently
// signed-in user. The user is still signed in at this point — the
// SetupForm aborts the flow before sign-out, so getCurrentUser()
// returns the user we just authenticated. Self-contained: tracks its
// own busy / sent / error state so the SetupForm doesn't have to.
function ResendVerificationButton() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleResend() {
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg(null);
    const u = getAuthClient().currentUser;
    if (!u) {
      // Edge case: user signed out between the failed submit and the
      // resend click. We can't send without a user — surface a clear
      // failure and let the user retry the full submit.
      setStatus("failed");
      setErrorMsg(t("setup.errors.emailNotVerifiedResendNoUser"));
      return;
    }
    try {
      await sendEmailVerification(u);
      setStatus("sent");
    } catch (err) {
      setStatus("failed");
      const e = err as { code?: string; message?: string };
      // Rate-limit is the most common failure mode here (Firebase
      // throttles to a handful of sends per hour). Surface the raw
      // code so the user knows whether to wait or fix something.
      const detail = e.code ? `[${e.code}]` : "";
      const msg = e.message ?? "";
      setErrorMsg([detail, msg].filter(Boolean).join(" ").trim());
    }
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <button
        type="button"
        onClick={handleResend}
        disabled={status === "sending"}
        className="inline-flex items-center gap-1.5 rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-medium px-2.5 py-1.5 transition-colors dark:bg-red-700 dark:hover:bg-red-600"
      >
        {status === "sending" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {status === "sending"
          ? t("setup.errors.emailNotVerifiedResending")
          : status === "sent"
            ? t("setup.errors.emailNotVerifiedResent")
            : t("setup.errors.emailNotVerifiedResend")}
      </button>
      {status === "sent" && (
        <span className="text-xs text-emerald-700 dark:text-emerald-300">
          {t("setup.errors.emailNotVerifiedResentDetail")}
        </span>
      )}
      {status === "failed" && errorMsg && (
        <span className="text-xs">
          {t("setup.errors.emailNotVerifiedResendFailed")}
          {errorMsg ? `: ${errorMsg}` : ""}
        </span>
      )}
    </div>
  );
}

// Full-screen overlay rendered while the SetupForm submit handler is
// running. Without this the form looked frozen on slow networks (the
// inline button-loader was easy to miss) — feedback on intermittent
// reports of "after I clicked submit, I just got a blue page even
// though it actually worked".
function SetupProgressOverlay({ step, progressLog, done }: ProgressOverlayProps) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm p-6">
      <div className="card w-full max-w-md p-6 text-center">
        {done ? (
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
        ) : (
          <Loader2 className="h-10 w-10 text-blue-500 mx-auto mb-4 animate-spin" />
        )}
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-50">
          {done ? t("setup.success") : t("setup.submitting")}
        </h2>
        {!done && step && (
          <p className="text-sm text-surface-600 dark:text-surface-300 mt-2">
            {step}
          </p>
        )}
        {progressLog.length > 0 && (
          <ul className="mt-5 space-y-1.5 text-left">
            {progressLog.map((entry, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-surface-500 dark:text-surface-400"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        )}
        {done && (
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-4">
            {t("setup.reloadingHint")}
          </p>
        )}
      </div>
    </div>
  );
}
