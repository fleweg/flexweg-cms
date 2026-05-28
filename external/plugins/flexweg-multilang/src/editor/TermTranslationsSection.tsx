import { useTranslation } from "react-i18next";
import {
  isValidSlug,
  useCmsData,
  type Term,
  type TermEditorSectionProps,
} from "@flexweg/cms-runtime";
import { getMultilangConfig } from "../core/config";
import type { TermTranslation } from "../types";

// Section injected into the TermRow of the categories / tags page.
// Lets the admin enter a per-language name + slug for the term.
// Patches the host's pluginPatch state via updateTerm — the row's
// Save button commits everything atomically.
export function TermTranslationsSection({ term, updateTerm }: TermEditorSectionProps) {
  const { t } = useTranslation("flexweg-multilang");
  const { settings } = useCmsData();
  const config = getMultilangConfig(settings);
  if (config.enabledLanguages.length === 0) {
    return (
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("termSection.noLanguages")}
      </p>
    );
  }

  const current = (term.translations as Record<string, TermTranslation> | undefined) ?? {};

  function patchLang(lang: string, patch: Partial<TermTranslation>) {
    // Keep every key the user has touched, even partially-filled
    // entries. Without this, typing the first character of `name`
    // while `slug` is still empty would drop the entry from the map,
    // re-render the inputs with empty values and look as if typing
    // was being ignored. The TermRow's save handler does its own
    // tidy-up before writing to the backend.
    const next = {
      ...current,
      [lang]: { ...(current[lang] ?? emptyTermTrans()), ...patch },
    };
    updateTerm({ translations: next as Record<string, unknown> });
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] uppercase tracking-wide font-semibold text-surface-500 dark:text-surface-400">
        {t("termSection.title")}
      </p>
      {config.enabledLanguages.map((lang) => {
        const tr = current[lang] ?? emptyTermTrans();
        const slugInvalid = tr.slug && !isValidSlug(tr.slug);
        const seo = tr.seo ?? {};
        function patchSeo(patch: Partial<NonNullable<TermTranslation["seo"]>>) {
          patchLang(lang, { seo: { ...seo, ...patch } });
        }
        return (
          <div key={lang} className="space-y-2 border-t border-surface-200 dark:border-surface-700 pt-2 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-start gap-2">
              <span className="text-[10px] uppercase font-semibold w-8 pt-2 text-surface-500">
                {lang}
              </span>
              <input
                type="text"
                className="input flex-1 min-w-[120px]"
                placeholder={t("termSection.name") as string}
                value={tr.name}
                onChange={(e) => patchLang(lang, { name: e.target.value })}
              />
              <div className="flex-1 min-w-[120px]">
                <input
                  type="text"
                  className="input"
                  placeholder={t("termSection.slug") as string}
                  value={tr.slug}
                  onChange={(e) => patchLang(lang, { slug: e.target.value })}
                />
                {slugInvalid && (
                  <p className="text-[10px] text-red-600 mt-0.5">
                    {t("termSection.invalidSlug")}
                  </p>
                )}
              </div>
            </div>
            <div className="pl-10 space-y-1">
              <input
                type="text"
                className="input w-full"
                placeholder={t("termSection.seoTitle") as string}
                value={seo.title ?? ""}
                onChange={(e) => patchSeo({ title: e.target.value })}
              />
              <textarea
                className="input w-full min-h-[60px] resize-y"
                placeholder={t("termSection.seoDescription") as string}
                value={seo.description ?? ""}
                onChange={(e) => patchSeo({ description: e.target.value })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function termBadge(term: Term, enabledLanguages: string[]): string | undefined {
  const map = (term.translations as Record<string, TermTranslation> | undefined) ?? {};
  const filled = enabledLanguages.filter((l) => map[l]?.name && map[l]?.slug).length;
  if (filled === 0) return undefined;
  return `${filled}/${enabledLanguages.length}`;
}

function emptyTermTrans(): TermTranslation {
  return { slug: "", name: "", description: "" };
}
