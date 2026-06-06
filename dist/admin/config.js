// Runtime config bootstrap. Loaded synchronously by /admin/index.html
// before the main JS bundle, so the resolver in src/lib/runtimeConfig.ts
// can read window.__FLEXWEG_CONFIG__ during module init.
//
// In a fresh deployment with no values baked in via .env, this file ships
// with __FLEXWEG_CONFIG__ === null, which makes the admin render the
// first-run setup form. After the user completes that form, the admin
// rewrites this file on Flexweg with the actual config — subsequent
// reloads behave exactly like a build that had .env values inlined at
// compile time.
window.__FLEXWEG_CONFIG__ = null;
