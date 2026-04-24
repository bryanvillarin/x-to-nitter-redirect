// ==UserScript==
// @name         X.com → Nitter redirect (with fallbacks)
// @namespace    https://github.com/bryanvillarin/x-to-nitter-redirect
// @version      1.0.0
// @description  Redirect x.com and twitter.com URLs to a Nitter instance (default: xcancel.com), with fallback cycling and a menu toggle.
// @author       Bryan Villarin
// @homepage     https://bryanvillarin.link
// @supportURL   https://bryanvillarin.link/contact/
// @match        *://x.com/*
// @match        *://*.x.com/*
// @match        *://twitter.com/*
// @match        *://*.twitter.com/*
// @run-at       document-start
// @updateURL     https://raw.githubusercontent.com/bryanvillarin/x-to-nitter-redirect/main/x-to-nitter-redirect.user.js
// @downloadURL   https://raw.githubusercontent.com/bryanvillarin/x-to-nitter-redirect/main/x-to-nitter-redirect.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // Ordered by preference. Primary first; rest are fallbacks.
    // Verified against the official Nitter instances wiki.
    // Check https://status.d420.de/ if instances stop working.
    const INSTANCES = [
        'xcancel.com',
        'nitter.poast.org',
        'nitter.privacyredirect.com',
        'nitter.tiekoetter.com',
        'nitter.catsarch.com',
    ];

    // Hosts we want to redirect FROM. Explicit allowlist avoids accidentally
    // catching subdomains like help.x.com or developer.x.com.
    const REDIRECTABLE_HOSTS = [
        'x.com', 'www.x.com',
        'twitter.com', 'www.twitter.com',
        'mobile.x.com', 'mobile.twitter.com',
    ];

    const host = window.location.hostname;

    // --- Stored state ---
    const enabled = GM_getValue('enabled', true);
    const currentInstanceIndex = GM_getValue('instanceIndex', 0);
    const currentInstance = INSTANCES[currentInstanceIndex] || INSTANCES[0];

    // --- Menu commands ---
    GM_registerMenuCommand(
        (enabled ? '✅ Redirect: ON' : '⛔ Redirect: OFF') + ' (click to toggle)',
        () => {
            GM_setValue('enabled', !enabled);
            GM_notification({
                text: 'Redirect turned ' + (!enabled ? 'ON' : 'OFF') + '. Reload the page to apply.',
                title: 'X → Nitter',
                timeout: 3000,
            });
        }
    );

    GM_registerMenuCommand(
        '🔄 Cycle instance (current: ' + currentInstance + ')',
        () => {
            const next = (currentInstanceIndex + 1) % INSTANCES.length;
            GM_setValue('instanceIndex', next);
            GM_notification({
                text: 'Now using ' + INSTANCES[next] + '. Reload to apply.',
                title: 'X → Nitter',
                timeout: 3000,
            });
        }
    );

    GM_registerMenuCommand(
        '↩️ Reset to primary (' + INSTANCES[0] + ')',
        () => {
            GM_setValue('instanceIndex', 0);
            GM_notification({
                text: 'Reset to ' + INSTANCES[0] + '. Reload to apply.',
                title: 'X → Nitter',
                timeout: 3000,
            });
        }
    );

    // --- Redirect logic ---
    if (!enabled) return;
    if (!REDIRECTABLE_HOSTS.includes(host)) return;

    const newUrl = 'https://' + currentInstance +
                   window.location.pathname +
                   window.location.search +
                   window.location.hash;

    // replace() avoids polluting browser history with the x.com URL
    window.location.replace(newUrl);
})();
