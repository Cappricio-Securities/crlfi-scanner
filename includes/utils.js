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

async function parseArgs(argv) {
    const args = {
        help: false,
        url: null,
        list: null,
        proxy: null,
        output: null,
        chatid: null,
    };

    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '-h' || arg === '--help') {
            args.help = true;
        } else if (arg === '-u' || arg === '--url') {
            args.url = argv[++i];
        } else if (arg === '-l' || arg === '--list') {
            args.list = argv[++i];
        } else if (arg === '-p' || arg === '--proxy') {
            args.proxy = argv[++i];
        } else if (arg === '-o' || arg === '--output') {
            args.output = argv[++i];
        } else if (arg === '--chatid') {
            args.chatid = argv[++i];
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    if (!args.help) {
        if (!args.url && !args.list && !args.chatid) {
            throw new Error('Either -u/--url or -l/--list is required, or use --chatid alone to configure chat id.');
        }
        if (args.url && args.list) {
            throw new Error('Use only one input method: -u/--url or -l/--list.');
        }
    }
    return args;
}

async function fetchPayloads() {
    try {
        const res = await axios.get(Data.payloadurl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'crlfiscanner/1.0',
            },
        });
        const data = res.data || '';
        const lines = data
            .split('\n')
            .map((x) => x.trim())
            .filter((x) => x && !x.startsWith('#'));
        if (!lines.length) {
            throw new Error('Empty payload list from remote source.');
        }
        return lines;
    } catch (err) {
        console.warn('Warning: could not fetch remote payloads, using fallback set.');
        return [
            '%0d%0aSet-Cookie:%20cappriciosec=1%3BPath=/',
            '%0d%0acrlfi:1',
            '%0d%0aX-Injected:1',
        ];
    }
}

function sanitizeUrl(url) {
    if (!url) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    return `http://${trimmed}`;
}

module.exports = {
    parseArgs,
    fetchPayloads,
    sanitizeUrl,
};
