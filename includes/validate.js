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
function isValidUrl(value) {
    if (!value || typeof value !== 'string') return false;
    try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

function isValidProxy(value) {
    if (!value || typeof value !== 'string') return false;
    const parts = value.split(':');
    if (parts.length !== 2) return false;
    const [host, portStr] = parts;
    if (!host || host.length < 1) return false;
    const port = Number(portStr);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) return false;
    return true;
}

function normalizeProxy(value) {
    if (!value) return null;
    return value.startsWith('http://') || value.startsWith('https://') ? value : `http://${value}`;
}

module.exports = {
    isValidUrl,
    isValidProxy,
    normalizeProxy,
};
