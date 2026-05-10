import type { AuthorTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { pickFormat } from "@flexweg/cms-runtime";
import { SocialIcon, socialLabel } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Storefront author archive — portrait + bio on top, signature
// products grid below. Phase 5 will polish this further (large
// circular avatar, role badge, signature collection block).
export function AuthorTemplate({
  author,
  posts,
  site,
}: AuthorTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-storefront");
  const avatarUrl = author.avatar ? pickFormat(author.avatar, "medium") : "";

  return (
    <>
      <header className="bg-surface-container-low py-section-gap-mobile md:py-section-gap-desktop">
        <div className="max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            {avatarUrl && (
              <div className="w-32 h-32 rounded-full overflow-hidden mb-stack-md ring-4 ring-surface-container-lowest">
                <img
                  src={avatarUrl}
                  alt={author.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-sm">
              {author.displayName}
            </h1>
            {author.title && (
              <p className="text-label-caps font-semibold text-secondary uppercase tracking-widest mb-stack-md">
                {author.title}
              </p>
            )}
            {author.bio && (
              <p className="text-body-lg text-on-surface-variant mb-stack-md max-w-xl">
                {author.bio}
              </p>
            )}
            {author.socials && author.socials.length > 0 && (
              <div className="flex gap-stack-sm">
                {author.socials.map((social) => (
                  <a
                    key={social.network}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLabel(social.network)}
                    title={socialLabel(social.network)}
                    className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-transparent transition-all"
                  >
                    <SocialIcon network={social.network} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="max-w-container-max mx-auto px-gutter md:px-gutter-desktop py-section-gap-mobile md:py-section-gap-desktop">
        {posts.length === 0 ? (
          <p className="text-on-surface-variant">{t("publicBaked.noPostsAuthor")}</p>
        ) : (
          <>
            <h2 className="display-serif text-headline-md md:text-display-md text-on-surface mb-stack-lg">
              {t("publicBaked.signatureCollection")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md md:gap-stack-lg">
              {posts.map((post) => (
                <article key={post.id} className="storefront-product-card flex flex-col">
                  {post.hero && (
                    <a
                      href={`/${post.url}`}
                      className="block aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-lowest mb-stack-md"
                    >
                      <img
                        src={pickFormat(post.hero, "medium")}
                        alt={post.hero.alt ?? post.title}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  )}
                  <h3 className="font-serif text-headline-sm text-on-surface">
                    <a href={`/${post.url}`}>{post.title}</a>
                  </h3>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
