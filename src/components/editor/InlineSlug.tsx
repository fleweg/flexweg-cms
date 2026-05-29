import { AlertCircle, Info, Link as LinkIcon } from "lucide-react";
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
  // True when the slug is the empty string AND would block save. Shows
  // an amber "Slug required" hint instead of the red invalid-format
  // message — empty isn't a *wrong* value, just an incomplete one, so
  // the affordance should feel like guidance, not a validation error.
  requiredHint?: string;
  // Friendly informational message shown when the auto-slug machinery
  // had to suffix the user's intended slug (e.g. "my-post-2" because
  // "my-post" was already taken). Surfacing the collision owner lets
  // the user understand WHY the suffix was added instead of guessing.
  // Rendered in blue (informational), not red (error).
  autoSuggestMessage?: string;
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
  requiredHint,
  autoSuggestMessage,
}: InlineSlugProps) {
  const { t } = useTranslation();
  // When the slug is empty AND the parent passed a `requiredHint`, the
  // Save button will be disabled. Show the hint in amber to communicate
  // "needed to save" without the red "you typed something wrong"
  // connotation of `invalid`.
  const showRequired = !slug && !!requiredHint;

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
        <p className="mt-1 flex items-center gap-1 text-red-600 font-sans">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{invalidMessage}</span>
        </p>
      )}
      {!invalid && collisionMessage && (
        <p className="mt-1 flex items-center gap-1 text-red-600 font-sans">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{collisionMessage}</span>
        </p>
      )}
      {!invalid && !collisionMessage && showRequired && (
        <p className="mt-1 flex items-center gap-1 text-amber-600 dark:text-amber-400 font-sans">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{requiredHint}</span>
        </p>
      )}
      {!invalid && !collisionMessage && !showRequired && autoSuggestMessage && (
        <p className="mt-1 flex items-center gap-1 text-sky-600 dark:text-sky-400 font-sans">
          <Info className="h-3 w-3 shrink-0" />
          <span>{autoSuggestMessage}</span>
        </p>
      )}
    </div>
  );
}
