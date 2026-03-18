#!/usr/bin/env node
/**
 * 🔥 CRLFI-SCANNER - CRLF Injection Detection Tool
 * -----------------------------------------------
 * 👨‍💻 Author  : Karthikeyan V (karthithehacker)
 * 🌐 Website : https://karthithehacker.com
 * 🐙 GitHub  : https://github.com/Cappricio-Securities
 *
 * 📌 Description:
 * CRLFI-SCANNER is a lightweight CLI tool designed for bug bounty hunters 🐞
 * and penetration testers 🔐 to automatically detect CRLF Injection (CRLFI)
 * vulnerabilities using payload-based testing and HTTP header analysis ⚡
 *
 * The tool scans URLs, injects CRLF payloads, and analyzes responses
 * to identify header injection and response splitting issues.
 *
 * 🔑 Keywords:
 * crlf injection, crlfi scanner, header injection, response splitting,
 * bug bounty tool, pentesting, web security, ethical hacking
 *
 * ⚠️ Disclaimer:
 * This tool is intended for educational purposes 📚 and authorized
 * security testing only. Unauthorized use is strictly prohibited 🚫
 * and may be illegal.
 *
 * 🙏 Credits:
 * If you use or modify this code, please give proper credit
 * to the original author ❤️
 */
const axios = require('axios');
const { isValidUrl, normalizeProxy } = require('./validate');


function injectPayload(targetUrl, payload) {
    try {
        const urlObj = new URL(targetUrl);
        // Inject payload in path and query to trigger CRLF injection attempts.
        const suffix = payload.startsWith('/') ? payload : `/${payload}`;
        urlObj.pathname = `${urlObj.pathname.replace(/\/$/, '')}${suffix}`;
        return urlObj.toString();
    } catch (err) {
        return `${targetUrl}${payload}`;
    }
}

function parseHeaders(headers) {
    const normalized = {};
    for (const [key, value] of Object.entries(headers || {})) {
        normalized[key.toLowerCase()] = value;
    }
    return normalized;
}

function checkVulnerable(headers) {
    const h = parseHeaders(headers);
    const crlfi = h['crlfi'];
    const setCookie = h['set-cookie'];
    const hasCappricio = Array.isArray(setCookie)
        ? setCookie.some((c) => String(c).toLowerCase().includes('cappriciosec'))
        : typeof setCookie === 'string' && setCookie.toLowerCase().includes('cappriciosec');
    return { vulnerable: Boolean(crlfi || hasCappricio), crlfi, setCookie, hasCappricio };
}

async function requestWithPayload(targetUrl, payload, proxy) {
    const injected = injectPayload(targetUrl, payload);
    const options = {
        timeout: 15000,
        maxRedirects: 5,
        validateStatus: () => true,
    };

    if (proxy) {
        const parts = proxy.replace(/^https?:\/\//, '').split(':');
        const host = parts[0];
        const port = Number(parts[1] || 8080);
        if (!Number.isNaN(port)) {
            options.proxy = { host, port };
        }
    }

    try {
        const response = await axios.get(injected, options);
        return { success: true, response, injected };
    } catch (err) {
        return { success: false, error: err, injected };
    }
}

async function scanUrl(targetUrl, payloads, proxy, progressFn = () => {}) {
    if (!isValidUrl(targetUrl)) {
        return { url: targetUrl, vulnerable: false, reason: 'invalid url' };
    }

    for (const payload of payloads) {
        const { success, response, error, injected } = await requestWithPayload(targetUrl, payload, proxy);
        progressFn({ checking: injected });

        if (!success) {
            continue;
        }

        const check = checkVulnerable(response.headers);
        if (check.vulnerable) {
            return {
                url: targetUrl,
                vulnerable: true,
                reason: 'header indicators found',
                payload,
                injectedUrl: injected,
                pocUrl: injected,
                details: check,
                status: response.status,
            };
        }
    }

    return {
        url: targetUrl,
        vulnerable: false,
        reason: 'no indicator headers detected',
    };
}

async function scanBatch(urls, payloads, proxy, concurrency = 5, progressFn = () => {}) {
    const results = [];
    let active = 0;
    let index = 0;

    return new Promise((resolve) => {
        const runNext = () => {
            if (index >= urls.length && active === 0) {
                return resolve(results);
            }
            while (active < concurrency && index < urls.length) {
                const url = urls[index++];
                active += 1;
                scanUrl(url, payloads, proxy, progressFn)
                    .then((res) => {
                        results.push(res);
                        progressFn(res);
                    })
                    .catch((err) => {
                        const result = { url, vulnerable: false, reason: `scan error: ${err.message}` };
                        results.push(result);
                        progressFn(result);
                    })
                    .finally(() => {
                        active -= 1;
                        runNext();
                    });
            }
        };
        runNext();
    });
}

module.exports = {
    scanUrl,
    scanBatch,
};
