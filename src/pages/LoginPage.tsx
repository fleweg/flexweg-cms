import { useState, type FormEvent } from "react";
import { LayoutDashboard, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signIn, sendResetEmail, authErrorKey } from "../services/auth";
import { LocaleSwitcher } from "../components/ui/LocaleSwitcher";

export function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorKey("auth.emailPasswordRequired");
      return;
    }
    setSubmitting(true);
    setErrorKey(null);
    setInfo(null);
    try {
      await signIn(email, password);
    } catch (err) {
      setErrorKey(authErrorKey(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword() {
    if (!email.trim()) {
      setErrorKey("auth.enterEmailFirst");
      return;
    }
    setErrorKey(null);
    setInfo(null);
    try {
      await sendResetEmail(email);
      setInfo(t("auth.resetEmailSent", { email: email.trim() }));
    } catch (err) {
      setErrorKey(authErrorKey(err));
    }
  }

  return (
    <div className="relative min-h-full flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
      <div className="absolute top-4 right-4 z-10">
        <LocaleSwitcher />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-card">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-semibold leading-none">{t("common.appName")}</p>
            <p className="text-[11px] text-surface-500 mt-0.5 dark:text-surface-400">Static publisher</p>
          </div>
        </div>

        <div className="card p-6">
          <h1 className="text-base font-semibold text-surface-900 dark:text-surface-50">
            {t("auth.signIn")}
          </h1>
          <p className="text-sm text-surface-500 mt-1 dark:text-surface-400">
            {t("auth.signInSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="login-email">
                {t("auth.email")}
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                autoFocus
              />
            </div>
            <div>
              <label className="label" htmlFor="login-password">
                {t("auth.password")}
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
              />
            </div>

            {errorKey && (
              <div className="rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200 px-3 py-2 text-sm dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700/50">
                {t(errorKey)}
              </div>
            )}
            {info && (
              <div className="rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-3 py-2 text-sm dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700/50">
                {info}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitting ? t("auth.signingIn") : t("auth.signIn")}
            </button>

            <button
              type="button"
              className="btn-ghost w-full text-sm"
              onClick={handleResetPassword}
              disabled={submitting}
            >
              {t("auth.forgotPassword")}
            </button>
          </form>
        </div>

        <p className="text-[11px] text-surface-400 text-center mt-4 dark:text-surface-500">
          {t("auth.footer")}
        </p>
      </div>
    </div>
  );
}
