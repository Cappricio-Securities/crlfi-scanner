# CRLFISCANNER

CRLFISCANNER is a professional Node.js CLI tool for detecting CRLF Injection vulnerabilities by sending payload-based HTTP requests, analyzing response headers, and optionally reporting findings to an API/Telegram bot.

<div align="center">

![Logo](https://cappriciosec.com/admin_university/university_automation/images/img_69baab83600993.37380383.png)

[![npm version](https://img.shields.io/npm/v/crlfi-scanner?style=for-the-badge&color=00ff41)](https://www.npmjs.com/package/crlfiscanner)
[![MIT License](https://img.shields.io/badge/License-MIT-00ff41?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![Node Version](https://img.shields.io/badge/Node.js-v14+-00ff41?style=for-the-badge&logo=node.js)](https://nodejs.org/)

</div>

## 🎯 What is CRLFISCANNER?

**CRLFISCANNER** is a bug bounty automation CLI built for security researchers to detect CRLF injection quickly in target endpoints.

It simplifies scanning by:

* Dynamically loading CRLF payloads
* Injecting payloads into each target URL
* Checking response headers for injection indicators
* Logging vulnerable hosts to local database
* Reporting vulnerabilities to API/Telegram bot

> ⚠️ **DISCLAIMER**: Use this tool only for authorized security testing and education. Unauthorized attacks are illegal.

## 📌 Features

* 🌐 Payload-based URL scanning
* 📂 Single URL and URL list support
* 🚦 Proxy support for Burp/HTTP proxy
* ⚡ Concurrency control (limit requests)
* 🧠 CRLF detection via response headers (`crlfi`, `Set-Cookie` containing `cappriciosec`)
* 🧾 Local DB logging (lowdb) for run_count and vulnerabilities
* 📡 Optional API/Telegram reporting with chatid
* 🎨 Color output with status formatting

## ⚠️ Requirements

* Node.js v14+
* npm

## ⚡ Installation

```bash
npm install crlfi-scanner -g 
```

## 🚀 Usage

```bash
crlfi-scanner -h
```

## 🤖 Configure Telegram Bot

* Open Telegram and search for
  👉 [`@CappricioSecuritiesTools_bot`](https://web.telegram.org/k/#@CappricioSecuritiesTools_bot)

* Click **Start** or send `/start`, then tap the **Get Chat ID** button.
* Copy the **Chat ID** shown by the bot.
```bash
crlfi-scanner --chatid yourchatid
#EG : crlfi-scanner --chatid 1151520582
```

> 💡 **Tip:** Once configured, you’ll receive real-time notifications and alerts from crlfi-scanner directly in Telegram.


### Single URL

```bash
crlfi-scanner -u https://example.com
```

### URL List

`urls.txt`:
```
https://example.com
https://site2.com
```

```bash
crlfi-scanners -l urls.txt
```

### Optional flags

```bash
crlfi-scanner -u https://example.com -p 127.0.0.1:8080 -o output.txt --chatid 12345
```

## 📊 Options

| Flag | Description |
| --- | --- |
| `-h, --help` | Show help |
| `-u, --url` | Single target URL |
| `-l, --list` | File with URLs |
| `-p, --proxy` | Optional proxy host:port |
| `-o, --output` | Save vulnerable URLs |
| `--chatid` | Telegram/chat id for reporting |

## 🖥️ Example Output

```bash
crlfiscanner -u http://localhost:8000


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

                                   Website: cappriciosec.com

crlfi-scanner - CRLF injection scanner


[+] Starting CRLF injection scan for 1 target(s)...

Checking ===> http://localhost:8000/end/www.cappriciosec.com
Checking ===> http://localhost:8000/end/%0D%0ASet-Cookie:cappriciosec=cappriciosec

💸[Vulnerable] ======> http://localhost:8000/end
📸PoC-Url->$ http://localhost:8000/end/%0D%0ASet-Cookie:cappriciosec=cappriciosec

[+] Bot reported vulnerability for http://localhost:8000/end
[+] Saved 1 vulnerable URL(s) to output.txt
```

## 📂 Project Structure

```
crlfiscanner/
├── crlfiscanner.js
├── includes/
│   ├── help.js
│   ├── utils.js
│   ├── filereader.js
│   ├── validate.js
│   ├── scan.js
│   ├── bot.js
│   ├── db.js
│   ├── app.js
├── LICENSE
├── package.json
```

## 🛠️ Troubleshooting

* `Invalid URL` → ensure URL starts with `http://` or `https://`
* `Either -u/--url or -l/--list is required.` → provide one input mode
* Proxy errors → verify proxy and connection


## 🎯 Use Cases

* Detect CRLF injection vulnerabilities automatically  
* Test header injection and response splitting  
* Scan endpoints at scale for CRLFI issues  
* Support bug bounty recon workflows  
* Assist manual security testing with validated results  

## 📬 Feedback

📧 [contact@karthithehacker.com](mailto:contact@karthithehacker.com)



## 📜 License

MIT License



## 👨‍💻 Author

**KarthiTheHacker**

* 🌐 [https://karthithehacker.com](https://karthithehacker.com)
* 🐙 [https://github.com/karthi-the-hacker](https://github.com/karthi-the-hacker)

## 👨‍💻 Author
**KarthiTheHacker**

