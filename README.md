# Coupon Coin — Launch Site

Apple-inspired single-page site for the Coupon Coin (CPC) launch on Solana.

## Local preview

Just open `index.html` in your browser. No build step.

```bash
open index.html
```

## Deploy to GitHub Pages (3 minutes)

You already have `liuzile666/cpc-token-assets` on GitHub. We'll put the site in a separate repo for cleanliness.

### Option A — New repo (recommended)

1. Go to https://github.com/new
2. Name it `cpc-site` (or anything you prefer)
3. Choose **Public**
4. Don't initialise with README — click **Create repository**
5. On the new repo page → **Add file → Upload files**
6. Drag the **entire contents** of the `cpc-site` folder (not the folder itself) into the upload zone:
   - `index.html`
   - `style.css`
   - `main.js`
   - `images/` folder
7. Click **Commit changes**
8. Go to **Settings → Pages**
9. Under **Source**, pick branch `main`, folder `/ (root)` → **Save**
10. Wait ~60 seconds. Your site is live at:
    ```
    https://liuzile666.github.io/cpc-site/
    ```

### Option B — Reuse cpc-token-assets repo

Same workflow, but upload into the existing `cpc-token-assets` repo under a `site/` folder. Then your URL becomes:
```
https://liuzile666.github.io/cpc-token-assets/site/
```

## Custom domain (optional)

If you own something like `cpc.ycarry.club`:

1. Add CNAME record pointing to `liuzile666.github.io`
2. Repo → Settings → Pages → Custom domain → enter `cpc.ycarry.club` → Save
3. Tick "Enforce HTTPS"

## File structure

```
cpc-site/
├── index.html      single-page site
├── style.css       Apple-inspired styling
├── main.js         scroll-reveal + parallax
├── images/         hero assets + figures from the dissertation
└── README.md       this file
```

## Credits

Built by Liu Zile (Aiden) · HKU MSc IDAT Capstone · 2026.
Industry partner: Y Carry Limited.
