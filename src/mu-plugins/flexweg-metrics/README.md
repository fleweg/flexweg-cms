# Flexweg Metrics

Adds two informational cards to the admin dashboard:

1. **Flexweg storage** — calls `GET /api/v1/files/storage-limits` and renders progress bars for the active plan's storage and file-count quotas. When either quota crosses the 80 % "near limit" threshold (signalled by the API's `warnings.*_near_limit` flags), an **Upgrade** CTA links out to <https://www.flexweg.com/pricing>.
2. **Firestore** — runs `getCountFromServer()` aggregation queries against the admin's collections (`posts`, `terms`, `media`, `users`) and reports the per-collection counts plus the grand total. The free tier limits (50 K reads / 20 K writes per day, 1 GiB storage) are reminded in a footer note.

## Dashboard card hook

This plugin demonstrates the `pluginApi.registerDashboardCard()` hook. Any plugin (regular or must-use) can contribute additional cards:

```ts
api.registerDashboardCard({
  id: "<plugin-id>/<card>",
  priority: 50,        // lower runs first; default 100
  component: MyCard,   // takes no props
});
```

Cards render in a 3-column grid (1 col on mobile, 2 on `md`, 3 on `lg`) below the four built-in stat cards. Each card is responsible for its own loading / error / empty state — the registry passes no props.

## Why "must-use"

The dashboard is the admin's landing page; the storage card is the only proactive nudge to upgrade the Flexweg plan before hitting the wall mid-publish. Demoting the plugin to optional would mean a freshly-installed CMS would never warn an admin about an exhausted quota until they noticed in the Flexweg account console. We trade UI flexibility for a useful default.

## What this plugin does NOT do

- **Real Firestore billing metrics** (daily reads, writes, network egress) are exposed only through Firebase's Cloud Monitoring API, which requires service-account credentials. A browser-only client cannot fetch them safely. For real billing data, open the [Firebase Console → Usage](https://console.firebase.google.com/) directly.
- **Polling** — the storage card calls the API once on dashboard mount, with a manual refresh button. It is not a live monitor.

## Configuration

None. The plugin reads its Flexweg credentials from `config/flexweg` like every other Flexweg-aware service. When the API key is absent, the storage card surfaces a one-click link to **Settings → General** instead of an error.
