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
const Data = require('./const');

async function reportToApi(vulnerableUrl, chatid) {
    if (!chatid) {
        return { success: false, message: 'chatid is empty; skipping reporting.' };
    }

    try {
        const payload = {
            Tname: 'crlfi',
            chatid: String(chatid),
            data: String(vulnerableUrl),
            bugname: Data.bugname,
            Priority: 'Low',
        };
        const result = await axios.post(Data.api, payload, {
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return { success: true, data: result.data };
    } catch (err) {
        return { success: false, message: err.message || 'Failed reporting to API' };
    }
}

module.exports = {
    reportToApi,
};
