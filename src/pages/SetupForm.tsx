import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Loader2, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
  flexwegSiteUrl: "",
  flexwegApiBaseUrl: DEFAULT_FLEXWEG_API_BASE_URL,
};

type ErrorKind =
  | "missingFields"
  | "firebaseAuth"
  | "wrongAdminEmail"
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
    default:
      return "setup.errors.firebaseAuthGeneric";
  }
}

type WizardStep = "welcome" | "form";

export function SetupForm() {
  const { t } = useTranslation();
  // Two-step wizard: welcome screen with Firebase tutorial CTA, then the
  // actual configuration form. The welcome step is mostly informative —
  // it primes the user on the (free) Firebase prerequisite before
  // throwing 11 form fields at them.
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

  function validate(state: FormState): boolean {
    const required: Array<keyof FormState> = [
      "apiKey",
      "authDomain",
      "projectId",
      "storageBucket",
      "messagingSenderId",
      "appId",
      "adminEmail",
      "flexwegApiKey",
      "flexwegSiteUrl",
      "flexwegApiBaseUrl",
    ];
    for (const k of required) {
      if (!state[k]) return false;
    }
    if (!form.adminPassword) return false;
    if (!/.+@.+\..+/.test(state.adminEmail)) return false;
    return true;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    const state = trimmed();
    if (!validate(state)) {
      setError({ kind: "missingFields" });
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
      adminEmail: state.adminEmail,
    };
    const flexwegConfig: SetupFlexwegConfig = {
      apiKey: state.flexwegApiKey,
      siteUrl: state.flexwegSiteUrl,
      apiBaseUrl: state.flexwegApiBaseUrl,
    };

    setSubmitting(true);
    setProgressLog([]);
    const logDone = (label: string) => setProgressLog((prev) => [...prev, label]);
    try {
      // 1. Initialise Firebase + sign in. Validates the Firebase config
      // (fails immediately with auth/api-key-not-valid otherwise) and
      // produces an authenticated session for the Firestore write.
      setStep(t("setup.steps.signInFirebase"));
      try {
        initFirebaseFromSetup(runtimeConfig);
      } catch (err) {
        // initFirebaseFromSetup throws if Firebase is already initialised
        // — happens when the user retries after a partial failure. Reset
        // is intentionally not exposed; reload to recover.
        setError({ kind: "generic", detail: (err as Error).message });
        setSubmitting(false);
        setStep(null);
        return;
      }
      try {
        await signInWithEmailAndPassword(
          getAuthClient(),
          state.adminEmail,
          form.adminPassword,
        );
      } catch (err) {
        const detailKey = authErrorTranslationKey(err);
        setError({ kind: "firebaseAuth", detail: t(detailKey) });
        setSubmitting(false);
        setStep(null);
        return;
      }
      logDone(t("setup.steps.signInFirebase"));

      // 2. Verify the signed-in identity matches the configured admin
      // email. Cheap sanity check — guards against the user typing
      // mismatched emails in the form.
      const signedInEmail = (
        getAuthClient().currentUser?.email ?? ""
      ).toLowerCase();
      if (signedInEmail !== state.adminEmail) {
        setError({ kind: "wrongAdminEmail" });
        setSubmitting(false);
        setStep(null);
        return;
      }

      // 3. Test the Flexweg API key BEFORE writing to Firestore. If the
      // key is wrong we don't want a stale config/flexweg doc lingering.
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

      // 4. Write config/flexweg to Firestore. This is where Firestore
      // rules misconfiguration shows up — we surface a specific message
      // so the user knows to update their rules with the admin email.
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

      // 5. Upload populated config.js to Flexweg. After this lands and
      // the user reloads, the resolver picks up the values from
      // window.__FLEXWEG_CONFIG__ and the SetupForm never shows again.
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

      // 6. Sync theme assets — uploads each theme's CSS bundle and
      // companion JS files to /theme-assets/. Without this, the first
      // published page would 404 on its stylesheet because no theme
      // CSS exists on the public site yet. Failures here are non-fatal:
      // the user can re-trigger the sync from Themes → Sync theme
      // assets later, but we want the happy path to leave them with a
      // ready-to-publish admin.
      setStep(t("setup.steps.syncThemes"));
      try {
        await syncThemeAssets(undefined, undefined);
      } catch (err) {
        // Non-fatal: log and continue. The form completes either way
        // because the critical config (Firebase + Flexweg + Firestore)
        // is already persisted.
        console.error("[setup] theme assets sync failed:", err);
      }
      logDone(t("setup.steps.syncThemes"));

      // Success. Force a full page reload so the next boot picks up the
      // freshly-uploaded config.js from Flexweg and goes through the
      // normal authenticated path. 2 s leaves enough time to read the
      // success message; modern browsers do a no-cache reload of the
      // top-level URL so the new config.js is fetched fresh.
      setDone(true);
      setStep(null);
      window.setTimeout(() => window.location.reload(), 2000);
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
      {(submitting || done) && (
        <SetupProgressOverlay
          step={step}
          progressLog={progressLog}
          done={done}
        />
      )}
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center gap-2.5 justify-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-card">
            <Settings className="h-5 w-5 text-white" />
          </div>
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

        {wizardStep === "welcome" ? (
          <WelcomeStep onContinue={() => setWizardStep("form")} />
        ) : (
        <div className="card p-6">
          <p className="text-sm text-surface-600 dark:text-surface-300">
            {t("setup.intro")}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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

            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                {t("setup.sections.flexweg")}
              </legend>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                {t("setup.help.flexweg")}
              </p>
              <div className="grid grid-cols-1 gap-3">
                <Field
                  label={t("setup.fields.flexwegApiKey")}
                  value={form.flexwegApiKey}
                  onChange={(v) => patch("flexwegApiKey", v)}
                  required
                />
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

            {error && (
              <div className="rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200 px-3 py-2 text-sm dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700/50">
                <ErrorMessage error={error} />
              </div>
            )}

            {done ? (
              <div className="rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-2 text-sm flex items-start gap-2 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700/50">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{t("setup.success")}</span>
              </div>
            ) : (
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={submitting}
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {submitting
                  ? step ?? t("setup.submitting")
                  : t("setup.submit")}
              </button>
            )}
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
    { id: "form", label: t("setup.stepper.configuration") },
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
    case "firebaseAuth":
      return <span>{error.detail ?? t("setup.errors.firebaseAuthGeneric")}</span>;
    case "wrongAdminEmail":
      return <span>{t("setup.errors.wrongAdminEmail")}</span>;
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
