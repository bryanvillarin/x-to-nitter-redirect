# X to Nitter Redirect

Tampermonkey userscript that redirects `x.com` and `twitter.com` URLs to a [Nitter](https://github.com/zedeus/nitter) instance (default: [xcancel.com](https://xcancel.com)). Read tweets shared in Slack, email, or anywhere else without hitting X's login wall.

Includes a Tampermonkey menu for toggling the redirect and cycling through fallback instances when your primary one is down.

## How It Works

1. **Matches** `x.com`, `twitter.com`, and their `www.` / `mobile.` variants.
2. **Redirects** the full URL — path, query string, and hash — to the currently selected Nitter instance.
3. **Runs at `document-start`** to minimize any flash of the original X page.
4. **Uses `window.location.replace()`** so the `x.com` URL doesn't pollute browser history.

## Menu Commands

Click the **Tampermonkey icon** in your browser toolbar while on an `x.com` or `twitter.com` page. The menu only appears on matched pages — not on other sites, and not on excluded subdomains like `help.x.com`.

| Command | What it does |
|---------|-------------|
| **✅ Redirect: ON / ⛔ Redirect: OFF** | Toggle the redirect. Useful when you need to log in to X or access account settings. |
| **🔄 Cycle instance** | Rotate to the next fallback instance. Use when your current one is slow or down. |
| **↩️ Reset to primary** | Jump back to the first instance in the list (xcancel.com by default). |

Changes apply on the next page load. Settings persist across browser restarts via `GM_setValue`.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Click [`x-to-nitter-redirect.user.js`](https://raw.githubusercontent.com/bryanvillarin/x-to-nitter-redirect/main/x-to-nitter-redirect.user.js).
3. When Tampermonkey prompts you to install, click **Install**.
4. Click any `x.com` or `twitter.com` link.

The script runs automatically. No config needed.

## Fallback Instances

The script rotates through these instances, all verified against the [official Nitter wiki](https://github.com/zedeus/nitter/wiki/Instances):

| # | Instance | Location |
|---|----------|----------|
| 1 | `xcancel.com` | US (primary) |
| 2 | `nitter.poast.org` | US |
| 3 | `nitter.privacyredirect.com` | Finland |
| 4 | `nitter.tiekoetter.com` | Germany |
| 5 | `nitter.catsarch.com` | US / Germany |

Bookmark [status.d420.de](https://status.d420.de/) for live instance health. To edit the list, modify the `INSTANCES` array near the top of the script.

## Known Limitations

| Limitation | Impact |
|-----------|--------|
| **Flash of original page** | On Chromium MV3, `document-start` injection has a small delay. Occasional brief flash of X before the redirect fires. This is a browser-level limitation — Tampermonkey can't fully eliminate it. |
| **Instance downtime** | Nitter instances depend on rotating X session tokens and can go offline without warning. Cycle to a fallback via the menu, or disable temporarily. |
| **No SPA interception** | The script only fires on full page loads, not in-page navigation within x.com. Not relevant for the typical use case of clicking a tweet link from outside. |
| **Subdomains excluded** | Only the hosts in the allowlist are redirected. `help.x.com`, `developer.x.com`, etc. are left alone by design. |
| **`/i/` paths excluded** | URLs under `x.com/i/` — Articles, Spaces, live broadcasts, and OAuth flows — are intentionally skipped. Nitter can't render any of them, and redirecting OAuth flows would silently break X login. |

## Version History

| Version | Changes |
|---------|---------|
| **1.1.0** | Added `@exclude` rules for `x.com/i/*` and `twitter.com/i/*` to skip X Articles, Spaces, broadcasts, and OAuth flows that Nitter cannot render. |
| **1.0.0** | Initial release — redirects `x.com` / `twitter.com` / `www.` / `mobile.` variants to a Nitter instance. Menu toggle for enable/disable. Cycle-through support for five verified fallback instances. Persistent state via `GM_setValue`. |

## Contributing

Found a bug? Have an idea?

- Open an issue on GitHub
- Reach out: [bryanvillarin.link/contact](https://bryanvillarin.link/contact/)

## License

[MIT License](LICENSE)

---

* **Bryan Villarin**
* [bryanvillarin.link](https://bryanvillarin.link) · [allnarfedup.blog](https://allnarfedup.blog)
