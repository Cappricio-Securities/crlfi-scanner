# 🔥 CRLFI Lab (CRLF Injection Testing Server)

A simple **Python-based vulnerable lab server** designed to simulate **CRLF Injection (CRLFI)** for testing security tools and learning web vulnerabilities.

---

## 🎯 What is this?

This lab helps you:

* Understand **CRLF Injection**
* Test your **CRLFI scanners**
* Practice **header injection attacks**
* Simulate real-world vulnerability behavior

---

## ⚙️ Features

* Detects CRLF payloads (`%0d%0a`)
* Simulates **HTTP header injection**
* Injects custom headers (e.g., `Set-Cookie`)
* Lightweight and easy to run
* Perfect for **local testing & bug bounty practice**

---

## 🚀 Setup & Run

### 1. Save the script

```bash
server.py
```

### 2. Run server

```bash
python3 server.py
```

### 3. Server will start at:

```
http://localhost:8000
```

---

## 🧪 Testing CRLF Injection

### ✅ Normal Request

```bash
http://localhost:8000/test
```

Response:

```
Normal Response
```

---

### 🔥 CRLF Injection Payload

```bash
http://localhost:8000/%0d%0aSet-Cookie:cappriciosec=1
```

### Expected Behavior:

* Server injects header:

```
Set-Cookie: cappriciosec=1
```

* Response:

```
CRLF Injection Successful!
```

---

## 🔍 How It Works

* Decodes URL (`%0d%0a → \r\n`)
* Detects injected CRLF sequence
* Extracts malicious header
* Adds it to HTTP response

---

## 🧠 Use Cases

* Test **CRLFI scanners**
* Validate detection logic
* Practice **header injection attacks**
* Integrate with tools like:

  * Burp Suite
  * Custom scanners (like your CRLFISCANNER)

---

## ⚠️ Disclaimer

This project is for:

* **Educational purposes only**
* **Authorized security testing**

Do NOT use against systems without permission.

---

## 👨‍💻 Author

**Karthikeyan V (karthithehacker)**
Cappricio Securities

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🔁 Share with security community
* 🛠️ Contribute improvements

---
