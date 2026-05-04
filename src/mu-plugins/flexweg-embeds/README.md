# Flexweg Embeds

Adds editor blocks to embed videos, tweets and music players into your posts. Pick the right block, paste the URL, done.

## Supported providers

| Provider | Source URL examples | Renders as |
|---|---|---|
| **YouTube** | `https://youtu.be/<id>`, `youtube.com/watch?v=<id>`, `/shorts/<id>`, `/embed/<id>` | YouTube-nocookie iframe (privacy-friendly variant) |
| **Vimeo** | `vimeo.com/<id>`, `vimeo.com/video/<id>` | Vimeo player iframe |
| **Twitter / X** | `twitter.com/<user>/status/<id>`, `x.com/<user>/status/<id>` | Twitter's first-party tweet iframe |
| **Spotify** | `open.spotify.com/track/<id>`, `/album/<id>`, `/playlist/<id>`, `/episode/<id>`, `/show/<id>` | Spotify's embed iframe |

## How to use

1. In the post editor, click the **+** button on an empty paragraph.
2. Pick a provider from the **Embeds** category.
3. Paste the public URL of the content into the block's URL field.
4. The embed loads instantly in the editor preview and the same way on the published page.

If the URL doesn't match the provider's expected pattern, the block surfaces an inline error — no broken embeds end up in your published HTML.

## Implementation notes

All four providers use **first-party iframes** (no host-side JavaScript needed). That means:

- Embeds work in any browser, regardless of ad blockers or tracker blockers
- Privacy-conscious visitors can opt out at the network layer without breaking your layout
- No cumulative layout shift — iframes have fixed dimensions
- No extra `<script>` tag added to your page just because an embed appears

CSS for the embed wrappers (responsive aspect ratios, max-widths) is injected only when an embed is actually used on the page.

## Customizing the embed look

Each provider's HTML uses the following CSS classes you can override in your theme:

- `.cms-embed` — base wrapper (max-width 100%, 16:9 aspect ratio, vertical margin)
- `.cms-embed-youtube`, `.cms-embed-vimeo`, `.cms-embed-twitter`, `.cms-embed-spotify` — provider-specific overrides
- `.cms-embed iframe` — the actual iframe (full-width, no border)

For example, to make all videos full-bleed on desktop:

```css
.cms-embed-youtube,
.cms-embed-vimeo {
  max-width: none;
}
```

## When to disable it

Disable if you don't allow third-party embeds on your site for privacy reasons — the editor will fall back to plain markdown for any URL the user pastes.
