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
const os = require('os');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const DB_PATH = path.resolve(os.homedir(), 'db', 'maindb.json');

function ensureDbFile() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ chatid: '', crlfi: [] }, null, 2));
    }
}

function getDb() {
    ensureDbFile();
    const adapter = new FileSync(DB_PATH);
    const db = low(adapter);
    db.defaults({ chatid: '', crlfi: [] }).write();
    return db;
}

function incrementRunCount() {
    const db = getDb();
    const runEntries = db.get('crlfi').filter({ type: 'run_count' }).value() || [];
    const nextCount = runEntries.length > 0 ? runEntries[runEntries.length - 1].run_count + 1 : 1;
    db.get('crlfi')
        .push({ type: 'run_count', run_count: nextCount, created_at: new Date().toISOString() })
        .write();
    return nextCount;
}

function setChatId(chatid) {
    if (!chatid) return;
    const db = getDb();
    db.set('chatid', String(chatid)).write();
}

function addVulnerability(url) {
    const db = getDb();
    const existing = db.get('crlfi').find({ url, type: 'vulnerability' }).value();
    if (!existing) {
        db.get('crlfi').push({ type: 'vulnerability', url, detected_at: new Date().toISOString() }).write();
    }
}

function getData() {
    const db = getDb();
    const state = db.value();
    const runEntries = (state.crlfi || []).filter((item) => item.type === 'run_count');
    const run_count = runEntries.length ? runEntries[runEntries.length - 1].run_count : 0;
    return { ...state, run_count };
}

module.exports = {
    getDb,
    incrementRunCount,
    setChatId,
    addVulnerability,
    getData,
};
