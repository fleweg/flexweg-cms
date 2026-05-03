import { Link as LinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InlineSlugProps {
  slug: string;
  onChange: (next: string) => void;
  // Optional path prefix shown read-only before the editable slug — e.g.
  // "category-slug/" when a primary term is selected.
  pathPrefix?: string;
  // Optional ".html" suffix to suggest the final URL shape on the public
  // site. Not editable; purely visual.
  pathSuffix?: string;
  invalid?: boolean;
  invalidMessage?: string;
  collisionMessage?: string;
}

// Permalink strip rendered just under the inline title. Matches
// Gutenberg's "Permalink:" label + inline editable slug. Validation
// errors and collisions are surfaced inline in red.
export function InlineSlug({
  slug,
  onChange,
  pathPrefix,
  pathSuffix,
  invalid,
  invalidMessage,
  collisionMessage,
}: InlineSlugProps) {
  const { t } = useTranslation();

  return (
    <div className="text-xs text-surface-500 dark:text-surface-400">
      <div className="flex flex-wrap items-center gap-1.5 font-mono">
        <span className="inline-flex items-center gap-1 font-sans text-surface-400 dark:text-surface-500">
          <LinkIcon className="h-3 w-3" />
          {t("posts.edit.permalink")}:
        </span>
        {pathPrefix && <span>{pathPrefix}</span>}
        <input
          type="text"
          value={slug}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-[120px] flex-1 border-0 bg-transparent p-0 font-mono text-xs text-surface-700 underline decoration-dotted underline-offset-4 focus:outline-none focus:ring-0 focus:underline dark:text-surface-200"
        />
        {pathSuffix && <span>{pathSuffix}</span>}
      </div>
      {invalid && invalidMessage && (
        <p className="mt-1 text-red-600 font-sans">{invalidMessage}</p>
      )}
      {!invalid && collisionMessage && (
        <p className="mt-1 text-red-600 font-sans">{collisionMessage}</p>
      )}
    </div>
  );
}
