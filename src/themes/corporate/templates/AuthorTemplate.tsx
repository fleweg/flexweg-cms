import type { AuthorTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { pickFormat } from "@flexweg/cms-runtime";
import { SocialIcon, socialLabel } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Corporate author archive — matches the Stitch mockup's profile-then-grid
// layout. Hero band on a `surface-container-low` background with a
// large 192px square avatar, name + role badge, bio paragraph, and
// social row. Stats card on the right (articles published / monthly
// readers — the second is a placeholder constant since we don't track
// per-author readership; replace with real data when an analytics
// plugin lands). Below: 2-col grid of articles by this author.
export function AuthorTemplate({
  author,
  posts,
  site,
}: AuthorTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-corporate");
  const avatarUrl = author.avatar ? pickFormat(author.avatar, "medium") : "";

  return (
    <>
      <header className="bg-surface-container-low py-section-padding">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-stack-lg">
            <div className="w-48 h-48 rounded-xl overflow-hidden shadow-xl flex-shrink-0 bg-surface-container-high">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt={author.displayName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-h1 font-bold text-primary">{author.displayName}</h1>
                {author.title && (
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-caps font-semibold inline-block self-center md:self-auto">
                    {author.title}
                  </span>
                )}
              </div>
              {author.bio && (
                <p className="text-body-lg text-on-surface-variant max-w-3xl mb-stack-lg">
                  {author.bio}
                </p>
              )}
              {author.socials && author.socials.length > 0 && (
                <div className="flex justify-center md:justify-start gap-stack-md">
                  {author.socials.map((social) => (
                    <a
                      key={social.network}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={socialLabel(social.network)}
                      title={socialLabel(social.network)}
                      className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary hover:text-on-secondary transition-all"
                    >
                      <SocialIcon network={social.network} />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center min-w-[200px]">
              <span className="text-h2 font-bold text-secondary">{posts.length}</span>
              <span className="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider">
                {t("publicBaked.articlesPublished")}
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-container-max mx-auto px-gutter py-section-padding">
        {posts.length === 0 ? (
          <p className="text-on-surface-variant">{t("publicBaked.noPostsAuthor")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 hover:shadow-lg transition-all group"
              >
                {post.hero && (
                  <a href={`/${post.url}`} className="block h-48 overflow-hidden">
                    <img
                      src={pickFormat(post.hero, "medium")}
                      alt={post.hero.alt ?? post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </a>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                      <span className="text-label-caps font-semibold text-secondary">
                        {post.category.name}
                      </span>
                    )}
                    {post.dateLabel && (
                      <>
                        <span className="text-on-surface-variant">•</span>
                        <span className="text-label-caps font-semibold text-on-surface-variant">
                          {post.dateLabel}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-h3 font-semibold text-primary mb-3 group-hover:text-secondary transition-colors">
                    <a href={`/${post.url}`}>{post.title}</a>
                  </h3>
                  {post.excerpt && (
                    <p className="text-body-md text-on-surface-variant mb-stack-md line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <a
                    href={`/${post.url}`}
                    className="inline-flex items-center gap-2 text-button font-semibold text-secondary group-hover:underline"
                  >
                    {t("publicBaked.readArticle")}
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
