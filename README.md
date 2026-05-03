# Coupon Coin — Launch Site

Apple-inspired single-page site for the Coupon Coin (CPC) launch on Solana.

## What's live

- ✅ Full narrative: problem → Y Carry anchor → system → token → on-chain
- ✅ **Connect Phantom** button (nav + inline) — visitors add CPC to their wallet in one click
- ✅ **Live holders counter** — pulls from Solana Devnet RPC every 60s
- ✅ Scroll-reveal animations, nav blur on scroll, hero parallax
- ✅ Mobile responsive

## Local preview

Just open `index.html` in your browser. No build step.

```bash
open index.html
```

> The Phantom connect button only works when served over `http(s)://` or `file://` — a normal browser `open` is fine.

## Deploy to GitHub — the Xcode way (no Homebrew, no downloads)

macOS Xcode Command Line Tools ship `git` out of the box. If you've installed Xcode at any point, you already have it. If not, the first `git` command below will prompt macOS to install the tools — click **Install** and wait ~3 minutes.

### One-time setup

```bash
# 1. Verify / install Xcode git
xcode-select --install    # if prompted, click "Install" and wait
git --version             # should print something like git 2.39.x (Apple Git-...)

# 2. Configure your identity (only first time, ever)
git config --global user.name  "liuzile666"
git config --global user.email "your@email.com"
```

### Push this site to GitHub

```bash
cd ~/Desktop/cpc-site

# Create the local repo
git init
git add .
git commit -m "Launch CPC landing site"
git branch -M main

# Create the remote repo on GitHub first:
#   https://github.com/new  →  name: cpc-site  →  Public  →  Create (no README)
# Then link it:
git remote add origin https://github.com/liuzile666/cpc-site.git
git push -u origin main
```

On push, macOS will open a browser asking you to authorise via GitHub's OAuth — approve it once and git keeps the token in Keychain. No personal-access-token juggling needed.

### Enable GitHub Pages

1. Open `https://github.com/liuzile666/cpc-site`
2. **Settings → Pages**
3. Source → branch `main`, folder `/ (root)` → **Save**
4. Wait ~60 seconds. Site is live at:

```
https://liuzile666.github.io/cpc-site/
```

### Update later

```bash
cd ~/Desktop/cpc-site
git add .
git commit -m "tweak copy"
git push
```

## Custom domain (optional)

If you own something like `cpc.ycarry.club`:

1. Add CNAME record pointing to `liuzile666.github.io`
2. Repo → Settings → Pages → Custom domain → enter `cpc.ycarry.club` → Save
3. Tick "Enforce HTTPS"

## How the interactive features work

### Phantom Connect
The button checks `window.phantom?.solana` — Phantom injects this into every page when the extension is installed. Calling `provider.connect()` triggers the wallet popup, returns the user's public key, and we shorten it for display. If the visitor doesn't have Phantom, we redirect them to `phantom.app/download`.

**Devnet note for visitors**: Phantom's desktop extension hides Devnet behind **Settings → Developer Settings → Testnet Mode**. Mobile Phantom exposes it under **Settings → Developer Settings → Change Network**. The connect flow works regardless of network, but CPC balances will only appear after switching.

### Live Holders
We call Solana's public devnet RPC (`api.devnet.solana.com`) with `getProgramAccounts` filtered by the SPL token program and our mint address. The response lists every token account; we count the ones with `uiAmount > 0`. Fallback chain: official RPC → Helius → Ankr. Refresh interval: 60 seconds, paused when the tab is hidden.

## File structure

```
cpc-site/
├── index.html      single-page site
├── style.css       Apple-inspired styling
├── main.js         scroll-reveal + Phantom connect + holders poller
├── images/         hero assets + figures from the dissertation
└── README.md       this file
```

## Credits

Built by Liu Zile (Aiden) · HKU MSc IDAT Capstone · 2026.
Industry partner: Y Carry Limited.
