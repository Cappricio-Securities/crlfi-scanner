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
const path = require('path');
const { parseArgs, fetchPayloads, sanitizeUrl } = require('./utils');
const { printHelp, showBanner } = require('./help');
const { readUrlsFromFile } = require('./filereader');
const { isValidUrl, isValidProxy } = require('./validate');
const { scanBatch } = require('./scan');
const { reportToApi } = require('./bot');
const { incrementRunCount, setChatId, addVulnerability, getData } = require('./db');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bright: '\x1b[1m',
};

async function run() {
    const args = await parseArgs(process.argv);

    if (args.help) {
        printHelp();
        return;
    }

    if (args.chatid && !args.url && !args.list) {
        await setChatId(args.chatid);
        console.log(`[+] chatid saved: ${args.chatid}`);
        return;
    }

    if (!args.url && !args.list) {
        throw new Error('Either -u/--url or -l/--list is required.');
    }

    if (args.proxy && !isValidProxy(args.proxy)) {
        throw new Error('Invalid proxy format. Use host:port');
    }

    let urls = [];
    if (args.url) {
        const normalized = sanitizeUrl(args.url);
        if (!isValidUrl(normalized)) {
            throw new Error('Invalid URL provided for -u/--url');
        }
        urls.push(normalized);
    }

    if (args.list) {
        const listPath = path.resolve(process.cwd(), args.list);
        if (!fs.existsSync(listPath)) {
            throw new Error(`URL list file not found: ${listPath}`);
        }
        urls = urls.concat(await readUrlsFromFile(listPath));
    }

    urls = [...new Set(urls)].filter((u) => isValidUrl(u));
    if (!urls.length) {
        throw new Error('No valid URLs to scan.');
    }

    const payloads = await fetchPayloads();
    if (!payloads.length) {
        throw new Error('No payloads loaded.');
    }

    await incrementRunCount();
    if (args.chatid) {
        await setChatId(args.chatid);
    }

    const dbData = await getData();
    const chatid = args.chatid || dbData.chatid;

    showBanner();
    console.log(`\n[+] Starting CRLF injection scan for ${urls.length} target(s)...\n`);

    const ongoing = new Set();
    const progress = (result) => {
        if (result.checking) {
            process.stdout.write(`${colors.white}Checking ===> ${result.checking}${colors.reset}\n`);
            return;
        }
        if (result.vulnerable) {
            console.log(`${colors.red}${colors.bright}\n💸[Vulnerable]${colors.reset} ======> ${colors.white}${colors.bright}${result.url}${colors.reset}`);
            console.log(`${colors.green}${colors.bright}📸PoC-Url->$ ${result.pocUrl}${colors.reset}\n`);
        } else {
            console.log(`${colors.red}[✘] Not Vulnerable: ${result.url} | ${result.reason}${colors.reset}`);
        }
    };

    const scanResults = await scanBatch(urls, payloads, args.proxy, 5, progress);
    const vulnerable = scanResults.filter((r) => r.vulnerable);

    for (const item of vulnerable) {
        await addVulnerability(item.url);
        if (chatid) {
            const report = await reportToApi(item.url, chatid);
            if (report.success) {
                console.log(`${colors.green}[+] Bot reported vulnerability for ${item.url}${colors.reset}`);
            } else {
                console.log(`${colors.yellow}[!] Bot reporting failed: ${report.message || report.data}${colors.reset}`);
            }
        }
    }

    if (args.output) {
        const outFile = path.resolve(process.cwd(), args.output);
        fs.writeFileSync(outFile, vulnerable.map((x) => x.url).join('\n') + '\n', 'utf8');
        console.log(`\n[+] Saved ${vulnerable.length} vulnerable URL(s) to ${outFile}`);
    }

    const finalData = await getData();
    console.log(`\n[+] Scan completed. vulnerable=${vulnerable.length} run_count=${finalData.run_count}`);
    if (finalData.chatid) {
        console.log(`[+] chatid configured: ${finalData.chatid}`);
    }
}

module.exports = { run };
