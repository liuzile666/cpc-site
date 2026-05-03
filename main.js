// =========================================================
//  Coupon Coin — landing page interactions
//  1) Scroll reveal + nav scroll tint + hero parallax
//  2) Phantom wallet connect (adds CPC to wallet)
//  3) Live holder count from Solscan public API
// =========================================================

const CPC_MINT = "8W9pbRE8aPQZo89Fei36UcK7p8e9w8iTtjNc6QcBGGeJ";
const CLUSTER = "devnet";
const SOLSCAN_API = `https://api-devnet.solscan.io/token/meta?token=${CPC_MINT}`;

// ---------- Scroll reveal ----------
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = Array.from(el.parentElement.querySelectorAll(".reveal"));
          const localIdx = siblings.indexOf(el);
          el.style.transitionDelay = (localIdx * 70) + "ms";
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// ---------- Nav tint on scroll ----------
(function () {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const onScroll = () => {
    nav.style.background = window.scrollY > 20
      ? "rgba(255, 255, 255, 0.85)"
      : "rgba(255, 255, 255, 0.72)";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// ---------- Hero parallax ----------
(function () {
  const bg = document.querySelector(".hero-bg-text");
  if (!bg) return;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      bg.style.transform = `translate(-50%, calc(-50% + ${y * 0.25}px))`;
    }
  }, { passive: true });
})();

// =========================================================
//  Phantom wallet connect
// =========================================================
(function () {
  const navBtn    = document.getElementById("nav-connect");
  const inlineBtn = document.getElementById("inline-connect");
  const statusEl  = document.getElementById("connect-status");

  if (!navBtn && !inlineBtn) return;

  const setStatus = (html) => { if (statusEl) statusEl.innerHTML = html; };

  const setConnected = (pubkey) => {
    const short = pubkey.slice(0, 4) + "…" + pubkey.slice(-4);
    if (navBtn) {
      navBtn.classList.add("connected");
      navBtn.querySelector(".connect-label").textContent = short;
    }
    if (inlineBtn) {
      inlineBtn.classList.add("connected");
      inlineBtn.querySelector("span:last-child").textContent = "Connected · " + short;
    }
    setStatus(
      `Connected as <b>${short}</b>. ` +
      `To see CPC in your wallet, make sure Phantom is on <b>Devnet</b> ` +
      `(Settings → Developer → Testnet Mode) and import token ` +
      `<a href="https://solscan.io/token/${CPC_MINT}?cluster=devnet" target="_blank" rel="noopener">${CPC_MINT.slice(0,8)}…</a>.`
    );
  };

  const connect = async () => {
    const provider = window.phantom?.solana;
    if (!provider?.isPhantom) {
      setStatus(
        `Phantom not found. <a href="https://phantom.app/download" target="_blank" rel="noopener">Install Phantom →</a>`
      );
      window.open("https://phantom.app/download", "_blank", "noopener");
      return;
    }
    try {
      const resp = await provider.connect();
      const pubkey = resp.publicKey.toString();
      setConnected(pubkey);
    } catch (err) {
      setStatus(`Connection cancelled. <a href="#" id="retry-connect">Try again</a>`);
      const retry = document.getElementById("retry-connect");
      if (retry) retry.addEventListener("click", (e) => { e.preventDefault(); connect(); });
    }
  };

  if (navBtn)    navBtn.addEventListener("click", connect);
  if (inlineBtn) inlineBtn.addEventListener("click", connect);

  // Auto-reconnect if Phantom was previously trusted
  if (window.phantom?.solana?.isPhantom) {
    window.phantom.solana.connect({ onlyIfTrusted: true })
      .then((resp) => setConnected(resp.publicKey.toString()))
      .catch(() => { /* not trusted yet — user must click */ });
  }
})();

// =========================================================
//  Live holder count — Solana Devnet RPC (CORS-friendly)
//  Counts SPL token accounts for this mint with balance > 0.
// =========================================================
(function () {
  const holdersEl    = document.querySelector("#metric-holders .lm-num");
  const holdersSubEl = document.getElementById("metric-holders-sub");
  if (!holdersEl) return;

  const fmt = (n) => Number(n).toLocaleString("en-US");

  const animateTo = (val) => {
    holdersEl.textContent = fmt(val);
    holdersEl.classList.remove("pulse");
    void holdersEl.offsetWidth;
    holdersEl.classList.add("pulse");
  };

  // Multiple RPCs — fall through on rate-limit / DPI issues.
  const RPCS = [
    "https://api.devnet.solana.com",
    "https://devnet.helius-rpc.com/?api-key=11111111-1111-1111-1111-111111111111",
    "https://rpc.ankr.com/solana_devnet",
  ];

  const SPL_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

  const rpcCall = async (url, method, params) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const j = await res.json();
    if (j.error) throw new Error(j.error.message);
    return j.result;
  };

  // Primary: getProgramAccounts filtered by mint (returns all token accounts)
  const countViaProgramAccounts = async (url) => {
    const result = await rpcCall(url, "getProgramAccounts", [
      SPL_PROGRAM,
      {
        encoding: "jsonParsed",
        filters: [
          { dataSize: 165 },
          { memcmp: { offset: 0, bytes: CPC_MINT } },
        ],
      },
    ]);
    // Only count holders with positive balance
    const holders = (result || []).filter((a) => {
      const amt = a?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
      return typeof amt === "number" && amt > 0;
    }).length;
    return holders;
  };

  const fetchHolders = async () => {
    for (const rpc of RPCS) {
      try {
        const n = await countViaProgramAccounts(rpc);
        if (typeof n === "number" && n >= 0) return n;
      } catch (e) {
        // try next
      }
    }
    return null;
  };

  const refresh = async () => {
    const n = await fetchHolders();
    if (n !== null) {
      animateTo(n);
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      holdersSubEl.innerHTML =
        `live · Solana ${CLUSTER} RPC · updated ${hh}:${mm}:${ss}`;
    } else {
      holdersEl.textContent = "1+";
      holdersSubEl.innerHTML =
        `RPC rate-limited · <a href="https://solscan.io/token/${CPC_MINT}?cluster=devnet#holders" target="_blank" rel="noopener" style="color:var(--gold);">verify on Solscan ↗</a>`;
    }
  };

  refresh();
  setInterval(() => {
    if (!document.hidden) refresh();
  }, 60_000);
})();
