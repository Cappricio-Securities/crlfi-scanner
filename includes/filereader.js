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
const fs = require('fs');
const { sanitizeUrl } = require('./utils');

async function readUrlsFromFile(filePath) {
    if (!filePath) {
        throw new Error('No file path provided to read URLs.');
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

    const urls = lines
        .map((line) => {
            try {
                return sanitizeUrl(line);
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    return urls;
}

module.exports = {
    readUrlsFromFile,
};
