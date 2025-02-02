# 🧰 MyIP - A Better IP Toolbox

<img src="https://raw.githubusercontent.com/jason5ng32/MyIP/main/public/logo.svg" width="200">

![GitHub Repo stars](https://img.shields.io/github/stars/jason5ng32/MyIP)
![GitHub forks](https://img.shields.io/github/forks/jason5ng32/myip)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fipcheck.ing&up_message=online&label=IPCheck.ing)
![PWA](https://img.shields.io/badge/PWA-Supported-blue)
![GitHub license](https://img.shields.io/github/license/jason5ng32/MyIP)

![Windows-image](https://img.shields.io/badge/-Windows-blue?logo=windows)
![MacOS-image](https://img.shields.io/badge/-MacOS-black?logo=apple)
![Linux-image](https://img.shields.io/badge/-Linux-333?logo=ubuntu)

🇺🇸 [English](README.md) | 🇨🇳 [简体中文](README_ZH.md) | 🇫🇷 [Français](README_FR.md)

👉 Demo: [https://ipcheck.ing](https://ipcheck.ing)

Notes: You can use my demo for free, and you can also deploy it yourself.

[![Deploy with Vercel](https://raw.githubusercontent.com/jason5ng32/MyIP/main/public/Vercel.svg)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjason5ng32%2FMyIP&project-name=MyIP&repository-name=MyIP)
[![Deploy with Docker](https://raw.githubusercontent.com/jason5ng32/MyIP/main/public/Docker.svg)](https://hub.docker.com/r/jason5ng32/myip)

## 👀 Main Features

* 🖥️ **View Your IPs**: Detects and displays your local IP, sourcing from multiple IPv4 and IPv6 providers.
* 🕵️ **IP Information**: Presents detailed information for all IP addresses, including country, region, ASN, geographic location, and more.
* 🚦 **Availability Check**: Tests the accessibility of various websites, such as Google, GitHub, YouTube, ChatGPT, and others.
* 🚥 **WebRTC Detection**: Identifies the IP address used during WebRTC connections.
* 🛑 **DNS Leak Test**: Shows DNS endpoint data to evaluate the risk of DNS leaks when using VPNs or proxies.
* 🚀 **Speed Test**：Test your network speed with edge networks.
* 🌐 **Global Latency Test**: Performe lantency tests on servers located in different regions around the world.
* 📡 **MTR Test**: Perform MTR tests on servers located in different regions around the world.
* 🌗 **Dark Mode**: Automatically toggles between dark and daylight modes based on system settings, with an option for manual switching.
* 📱 **Minimalist Mode**: A mobile-optimized mode that shortens page length for quick access to essential information..
* 🔍 **Search IP Information**: Provides a tool for querying information about any IP address.
* 📲 **PWA Supported**：Can be added as a desktop app on your phone as well as a Chrome app on your computer.
* ⌨️ **Keyboard Shortcuts**: Supports keyboard shortcuts for all functions, press `?` to view the shortcut list.
* 🌍 Based on availability test results, it indicates whether global internet access is currently feasible.
* 🇺🇸 🇨🇳 🇫🇷 English, Chinese, and French support.

## 📕 How to Use

There are 3 Ways to deploy:

### Deploying in a Node Environment

Make sure you have Node.js installed.

Clone the code:

```bash
git clone https://github.com/jason5ng32/MyIP.git
```

Install:

```bash
npm install
```

Build:

```bash
npm run build
```

Run:

```bash
npm start
```

The program will run on port 18966.

If you want to add Bing Maps, make the following changes before starting:

Create environment variables:

```bash
mv .env.example .env
```

Modify the Bing Maps API Key and your domain (to prevent abuse) in `.env` .

```bash
BING_MAP_API_KEY="YOUR_KEY_HERE"
ALLOWED_DOMAINS="example.com"
```

If you want to use IPInfo.io API, you can also add the following:

```bash
IPINFO_API_TOKEN="YOUR_TOKEN_HERE"
```

### Using Vercel

Click the 'Deploy to Vercel' button at the top to complete the deployment.

If you want to display maps, set the following 2 environment variables during deployment:

```bash
BING_MAP_API_KEY
ALLOWED_DOMAINS
```

If you want to use IPInfo.io API, you can also add the following:

```bash
IPINFO_API_TOKEN
```

### Using Docker

Click the 'Deploy to Docker' button at the top to complete the deployment. Or, use the following shell:

```bash
docker run -d -p 18966:18966 --name myip --restart always jason5ng32/myip:latest
```

If you wish to display maps, set the Bing Map API Key and allowed domains during deployment:

```bash
docker run -d -p 18966:18966 \
  -e BING_MAP_API_KEY="YOUR_KEY_HERE" \
  -e ALLOWED_DOMAINS="example.com" \
  --name myip \
  jason5ng32/myip:latest

```

If you want to use IPInfo.io API, you can also add the following:

```bash
docker run -d -p 18966:18966 \
  -e BING_MAP_API_KEY="YOUR_KEY_HERE" \
  -e ALLOWED_DOMAINS="example.com" \
  -e IPINFO_API_TOKEN="YOUR_TOKEN_HERE" \
  --name myip \
  jason5ng32/myip:latest

```

## 👩🏻‍💻 Advanced Usage

If you're using a proxy for internet access, consider adding this rule to your proxy configuration (modify it according to your client). This setup lets you check both your real IP and the IP when using the proxy:

```ini
# IP Testing
IP-CIDR,1.0.0.1/32,DIRECT,no-resolve
IP-CIDR6,2606:4700:4700::1111/128,DIRECT,no-resolve
DOMAIN-SUFFIX,ipify.org,Proxy
```

## 😶‍🌫️ Additional Notes

70% of the code for this program was not written by me, but generated through ChatGPT. After about 90 rounds of back-and-forth and some minor manual adjustments, all the code was completed.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=jason5ng32/MyIP&type=Date)](https://star-history.com/#jason5ng32/MyIP&Date)