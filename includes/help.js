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
const chalk = require('chalk');
function printHelp() {
    showBanner();
    console.log('Usage: crlfi-scanner [options]\n');
    console.log('Options:');
    console.log('  -h, --help        Show this help menu');
    console.log('  -u, --url         Single URL to scan');
    console.log('  -l, --list        File path containing URLs (one per line)');
    console.log('  -p, --proxy       Optional proxy like 127.0.0.1:8080');
    console.log('  -o, --output      File path to save vulnerable URLs');
    console.log('  --chatid          Connect with your Telegram bot\n');
    console.log('Examples:');
    console.log('  crlfi-scanner -u https://example.com');
    console.log('  crlfi-scanner -l urls.txt -o output.txt');
    console.log('  crlfi-scanner -l urls.txt -p 127.0.0.1:8080');
   
}

function showBanner() {
    const banner = `
 ██████╗██████╗ ██╗     ███████╗██╗                         
██╔════╝██╔══██╗██║     ██╔════╝██║                         
██║     ██████╔╝██║     █████╗  ██║                         
██║     ██╔══██╗██║     ██╔══╝  ██║                         
╚██████╗██║  ██║███████╗██║     ██║                         
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝                         
                                                            
███████╗ ██████╗ █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗ 
██╔════╝██╔════╝██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗
███████╗██║     ███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
╚════██║██║     ██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
███████║╚██████╗██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║
╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
`;


console.log(chalk.blue(banner));
console.log(chalk.white('                                   Website: cappriciosec.com'));
    const tag = `\ncrlfi-scanner - CRLF injection scanner\n`;
    console.log(chalk.bold(tag));
}

module.exports = {
    printHelp,
    showBanner,
};
