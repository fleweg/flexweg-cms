import type { AuthorTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { pickFormat } from "@flexweg/cms-runtime";
import { SocialIcon, socialLabel } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Editorial author archive (mockup-faithful):
//
//   • Bento profile section: 8-col bio (avatar + eyebrow + display
//     title + bio paragraph) with a 4-col stat panel on the right
//     (articles published count + joined date — both derived from
//     the resolved post list and the user record).
//   • A border-bottom heading ("Recent Publications") and a 3-col
//     bento article grid: 1 large card spanning 2 cols (image +
//     display-lg title + excerpt) + 2 smaller cards.
//
// Stats are computed from the data we already have. "Joined date"
// uses the user's earliest known post when available — we don't
// surface profile.createdAt yet.
export function AuthorTemplate({
  author,
  posts,
  site,
}: AuthorTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-magazine");
  const avatarUrl = author.avatar ? pickFormat(author.avatar, "small") : "";

  // Earliest publish date across the author's posts — used as a soft
  // proxy for "joined" until we expose user.createdAt to themes.
  const earliestMs = posts.reduce<number | null>((acc, p) => {
    const ms = p.publishedAt?.toMillis?.() ?? p.createdAt?.toMillis?.() ?? null;
    if (ms == null) return acc;
    return acc == null || ms < acc ? ms : acc;
  }, null);
  let joinedLabel: string | undefined;
  if (earliestMs != null) {
    try {
      joinedLabel = new Intl.DateTimeFormat(site.settings.language || "en", {
        month: "short",
        year: "numeric",
      }).format(new Date(earliestMs));
    } catch {
      joinedLabel = new Date(earliestMs).toDateString();
    }
  }

  // Bento split: first card large (col-span-2), then two singles.
  const [featured, second, third, ...rest] = posts;

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter">
      {/* Profile bento */}
      <section className="mb-stack-lg grid grid-cols-1 md:grid-cols-12 gap-stack-md items-start">
        <div className="md:col-span-8 space-y-stack-md">
          <div className="flex items-center gap-stack-md">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-outline-variant bg-surface-container shrink-0">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={author.displayName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <span className="block text-secondary uppercase tracking-widest text-xs font-semibold mb-1">
                {t("publicBaked.author")}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl text-primary">
                {author.displayName}
              </h1>
              {/* Job title (e.g. "Journaliste") sits under the
                  display name — replaces the legacy email fallback
                  with a piece of editorial signal. */}
              {author.title && (
                <p className="font-sans text-xs uppercase tracking-widest font-semibold text-secondary mt-stack-sm">
                  {author.title}
                </p>
              )}
            </div>
          </div>
          {author.bio && (
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              {author.bio}
            </p>
          )}
          {/* Visible social links — already filtered server-side by
              the publisher, this template only renders. New tab +
              rel=noopener so external profiles don't share referrer
              context with the magazine site. */}
          {author.socials && author.socials.length > 0 && (
            <div className="flex gap-stack-md text-on-surface-variant">
              {author.socials.map((s) => (
                <a
                  key={s.network}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabel(s.network)}
                  title={socialLabel(s.network)}
                  className="hover:text-primary transition-colors"
                >
                  <SocialIcon network={s.network} size={20} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-4 grid grid-cols-2 gap-stack-sm">
          <div className="bg-surface-container-low p-stack-md flex flex-col justify-center border border-outline-variant">
            <span className="text-on-surface-variant uppercase tracking-widest text-xs font-semibold">
              {t("publicBaked.recentPublications")}
            </span>
            <span className="font-serif text-4xl text-primary">{posts.length}</span>
          </div>
          {joinedLabel && (
            <div className="bg-surface-container-low p-stack-md flex flex-col justify-center border border-outline-variant">
              <span className="text-on-surface-variant uppercase tracking-widest text-xs font-semibold">
                {t("publicBaked.author")}
              </span>
              <span className="font-serif text-xl text-primary">{joinedLabel}</span>
            </div>
          )}
        </div>
      </section>

      {/* Articles */}
      <div className="flex justify-between items-end border-b border-outline-variant pb-stack-sm mb-stack-lg">
        <h2 className="font-serif text-2xl text-primary">
          {t("publicBaked.recentPublications")}
        </h2>
      </div>

      {posts.length === 0 ? (
        <p className="text-on-surface-variant">{t("publicBaked.noPostsAuthor")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md mb-stack-lg">
            {featured && (
              <article className="md:col-span-2 group">
                <a href={`/${featured.url}`} className="block space-y-stack-sm">
                  {featured.hero && (
                    <div className="aspect-video overflow-hidden bg-surface-container">
                      <img
                        src={pickFormat(featured.hero, "large")}
                        alt={featured.hero.alt ?? ""}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    {featured.category && (
                      <span className="block text-secondary uppercase tracking-widest text-xs font-semibold">
                        {featured.category.name}
                      </span>
                    )}
                    <h3 className="font-serif text-3xl md:text-4xl font-medium text-primary leading-tight group-hover:underline decoration-1">
                      {featured.title}
                    </h3>
                    {featured.excerpt && (
                      <p className="text-base text-on-surface-variant line-clamp-2">
                        {featured.excerpt}
                      </p>
                    )}
                  </div>
                </a>
              </article>
            )}
            {[second, third].filter(Boolean).map((post) => (
              <article key={post!.id} className="group">
                <a href={`/${post!.url}`} className="block space-y-stack-sm">
                  {post!.hero && (
                    <div className="aspect-square overflow-hidden bg-surface-container">
                      <img
                        src={pickFormat(post!.hero, "medium")}
                        alt={post!.hero.alt ?? ""}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    {post!.category && (
                      <span className="block text-secondary uppercase tracking-widest text-xs font-semibold">
                        {post!.category.name}
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-medium text-primary group-hover:underline decoration-1">
                      {post!.title}
                    </h3>
                  </div>
                </a>
              </article>
            ))}
          </div>

          {rest.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {rest.map((post) => (
                <li key={post.id}>
                  <a href={`/${post.url}`} className="group block">
                    {post.hero && (
                      <div className="aspect-[4/3] overflow-hidden bg-surface-container mb-stack-md">
                        <img
                          src={pickFormat(post.hero, "medium")}
                          alt={post.hero.alt ?? ""}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      {post.category && (
                        <span className="block text-secondary uppercase tracking-widest text-xs font-semibold">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="font-serif text-xl font-medium text-primary group-hover:text-secondary transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
