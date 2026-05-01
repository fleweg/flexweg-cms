import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentType, ReactElement } from "react";
import { applyFiltersSync } from "./pluginRegistry";
import type { BaseLayoutProps } from "../themes/types";

// Sentinel emitted by themes' BaseLayout components inside <head>. After
// React produces the static markup, we replace it with whatever the
// "page.head.extra" filter chain returned. This sidesteps the fact that
// React doesn't let us emit raw HTML inside <head> via JSX cleanly.
const HEAD_EXTRA_SENTINEL = '<meta name="x-cms-head-extra"/>';
const HEAD_EXTRA_SENTINEL_FALLBACK = '<meta name="x-cms-head-extra">';

export interface RenderPageOptions<TInner extends object> {
  base: ComponentType<BaseLayoutProps>;
  baseProps: Omit<BaseLayoutProps, "children" | "extraHead">;
  template: ComponentType<TInner>;
  templateProps: TInner;
}

export function renderPageToHtml<TInner extends object>(
  opts: RenderPageOptions<TInner>,
): string {
  const extraHead = applyFiltersSync<string>("page.head.extra", "", opts.baseProps);
  const tree: ReactElement = (
    <opts.base {...opts.baseProps}>
      <opts.template {...opts.templateProps} />
    </opts.base>
  );
  let html = renderToStaticMarkup(tree);
  // Replace whichever sentinel form React emitted. self-closing void-element
  // serialization may differ across React versions, so we try both.
  if (html.includes(HEAD_EXTRA_SENTINEL)) {
    html = html.replace(HEAD_EXTRA_SENTINEL, extraHead);
  } else if (html.includes(HEAD_EXTRA_SENTINEL_FALLBACK)) {
    html = html.replace(HEAD_EXTRA_SENTINEL_FALLBACK, extraHead);
  }
  return "<!doctype html>" + html;
}
