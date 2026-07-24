<script>
  // ============================================================
  // First Layer — Auth-as-a-Service landing page
  // Svelte 5 (runes mode). Drop into src/routes/+page.svelte
  // ============================================================
  import { scale } from "svelte/transition";
  import { highlightCode } from "$lib/highlight.js";
  import MarketingNav from "$lib/components/marketing/MarketingNav.svelte";
  import MarketingFooter from "$lib/components/marketing/MarketingFooter.svelte";
  import KeyRound from "@lucide/svelte/icons/key-round";
  import ShieldCheck from "@lucide/svelte/icons/shield-check";
  import Zap from "@lucide/svelte/icons/zap";
  import Puzzle from "@lucide/svelte/icons/puzzle";
  import Terminal from "@lucide/svelte/icons/terminal";
  import JavaScriptIcon from "$lib/Icons/javascript.svelte";
  import SvelteIcon from "$lib/Icons/svelte.svelte";
  import ReactIcon from "$lib/Icons/react.svelte";

  // --- Framework snippets ---------------------------------------------
  // Real REST calls against the real backend — there's no published
  // @firstlayer/sdk package yet, so these match the docs page exactly
  // rather than pretending one exists.
  const frameworks = [
    {
      id: "js",
      label: "JavaScript",
      icon: JavaScriptIcon,
      file: "auth.js",
      code: `const API_URL = "http://localhost:4000"; // your backend's URL
const API_KEY = "YOUR_API_KEY";          // Dashboard -> your project -> API

async function signUp(email, password) {
  const res = await fetch(API_URL + "/v1/auth/signup", {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}`,
    },
    {
      id: "svelte",
      label: "Svelte",
      icon: SvelteIcon,
      file: "+page.svelte",
      code: `<script>
  const API_URL = "http://localhost:4000";
  const API_KEY = "YOUR_API_KEY";

  let email = $state("");
  let password = $state("");

  async function signUp() {
    const res = await fetch(API_URL + "/v1/auth/signup", {
      method: "POST",
      headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
<` + `/script>`,
    },
    {
      id: "react",
      label: "React",
      icon: ReactIcon,
      file: "App.jsx",
      code: `const API_URL = "http://localhost:4000";
const API_KEY = "YOUR_API_KEY";

async function signUp(email, password) {
  const res = await fetch(API_URL + "/v1/auth/signup", {
    method: "POST",
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}`,
    },
  ];

  let activeId = $state("js");
  let active = $derived(frameworks.find((f) => f.id === activeId));
  let highlighted = $derived(highlightCode(active.code));

  // --- Live authentication demo (signature element) — a clean, minimal
  // "verify -> verified" motion instead of a typed-out fake login form.
  // Loops on its own; respects prefers-reduced-motion by freezing on the
  // "verified" frame instead of animating.
  let authPhase = $state("verifying"); // verifying | verified

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  $effect(() => {
    let cancelled = false;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      authPhase = "verified";
      return;
    }

    (async () => {
      while (!cancelled) {
        authPhase = "verifying";
        await wait(1800);
        if (cancelled) return;

        authPhase = "verified";
        await wait(2800);
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
    };
  });

  // --- Scroll reveal ---
  function reveal(node) {
    node.classList.add("reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      },
    };
  }

  // --- Email capture ---
  let email = $state("");
  let submitted = $state(false);
  function handleGetKey() {
    if (!email.includes("@")) return;
    submitted = true;
  }

  const logos = ["Voltra", "Kesho Pay", "Nimbus", "Ledger&Co", "Patchwork", "Orbital"];
</script>

<svelte:head>
  <title>First Layer — Authentication that scales with your code</title>
  <meta
    name="description"
    content="Secure, multi-tenant authentication, passkeys, and session management in under 5 lines of code."
  />
</svelte:head>

<div class="page">
  <div class="top-glow" aria-hidden="true"></div>

  <!-- NAV -->
  <MarketingNav />

  <!-- HERO -->
  <header class="hero">
    <div class="hero-grid" aria-hidden="true"></div>

    <div class="hero-content">
      <span class="badge">Introducing v2.0 — enterprise-grade speed</span>

      <h1>
        Authentication that scales
        <span class="grad">with your code, not your budget.</span>
      </h1>

      <p class="lede">
        Multi-tenant auth, passkeys, and session management in under five
        lines of code. Built for the way modern teams actually ship.
      </p>

      <div class="cta-row">
        <a class="btn-solid btn-lg" href="/signup">Start free — deploy in 5m</a>
      </div>
    </div>

    <!-- Signature element: a clean, minimal "verifying -> verified" motion
         that reads as authentication at a glance, without a gimmicky typed
         login form. -->
    <div class="auth-orb" use:reveal>
      <div class="window-chrome">
        <span></span><span></span><span></span>
        <span class="chrome-title">authentication · live</span>
      </div>

      <div class="orb-body">
        <div class="orb-rings" aria-hidden="true">
          <span class="orb-ring"></span>
          <span class="orb-ring"></span>
          <span class="orb-ring"></span>

          <div class="orb-core" class:verified={authPhase === "verified"}>
            {#key authPhase}
              <div class="orb-icon" in:scale={{ duration: 350, start: 0.6 }} out:scale={{ duration: 200, start: 0.6 }}>
                {#if authPhase === "verified"}
                  <ShieldCheck class="h-7 w-7" />
                {:else}
                  <KeyRound class="h-7 w-7" />
                {/if}
              </div>
            {/key}
          </div>
        </div>

        <div class="orb-status">
          {#if authPhase === "verified"}
            <span class="status-dot"></span>
            <span>Session verified · issued in 42ms</span>
          {:else}
            <span class="orb-status-dot-pulse"></span>
            <span>Verifying request…</span>
          {/if}
        </div>

        <!-- Always rendered (space reserved either way) so the page below
             the hero doesn't shift up/down as this cycles in and out. -->
        <div class="orb-token" class:visible={authPhase === "verified"}>sess_2f8a9c4b7e21</div>
      </div>
    </div>
  </header>

  <!-- SDK SECTION -->
  <section class="sdk" use:reveal>
    <div class="sdk-layout">
      <div class="sdk-text">
        <h2>Built by developers, for developers.</h2>
        <p>
          A plain REST API under the hood — call it from anywhere with
          nothing to install. Pick a framework to see it in five lines.
        </p>
      </div>

      <div class="sdk-code-flat">
        <div class="sdk-tabs" role="tablist">
          {#each frameworks as f}
            <button
              role="tab"
              aria-selected={activeId === f.id}
              aria-label={f.label}
              class="sdk-tab"
              class:active={activeId === f.id}
              onclick={() => (activeId = f.id)}
            >
              <f.icon class="sdk-tab-icon" />
              <span class="sdk-tab-tooltip" role="tooltip">{f.label}</span>
            </button>
          {/each}
        </div>

        <div class="code-window">
          <div class="flat-header">
            <span class="flat-filename">{active.file}</span>
          </div>
          <pre class="code-body"><code>{@html highlighted}</code></pre>
        </div>
      </div>
    </div>
  </section>

  <!-- PILLARS -->
  <section class="pillars" use:reveal>
    <div class="pillars-head">
      <span class="pillars-eyebrow">Why First Layer</span>
      <h2>Everything you need, nothing you don't.</h2>
    </div>

    <div class="bento-grid">
      <article class="bento-tile tile-speed">
        <div class="tile-glow" aria-hidden="true"></div>
        <div class="tile-icon"><Zap class="h-5 w-5" /></div>
        <div class="tile-stat">&lt;5ms</div>
        <h3>Edge-native speed</h3>
        <p>JWTs verified at the edge, in every region your users actually are — no cold starts, no round trip to one origin server.</p>
      </article>

      <article class="bento-tile tile-security">
        <div class="tile-icon"><ShieldCheck class="h-5 w-5" /></div>
        <span class="tile-tag">SOC2</span>
        <h3>Total security</h3>
        <p>Phishing-resistant passkeys and MFA on by default — not bolted on.</p>
      </article>

      <article class="bento-tile tile-customizable">
        <div class="tile-icon"><Puzzle class="h-5 w-5" /></div>
        <span class="tile-tag">headless / UI</span>
        <h3>Fully customizable</h3>
        <p>Headless APIs when you want full control, themed components when you don't.</p>
      </article>

      <article class="bento-tile tile-rest">
        <div class="tile-icon"><Terminal class="h-5 w-5" /></div>
        <span class="tile-tag">REST</span>
        <h3>A plain REST API</h3>
        <p>No SDK lock-in, no vendor black box — call it from anywhere with a normal HTTP client, in any language.</p>
      </article>
    </div>
  </section>

  <!-- SOCIAL PROOF -->
  <section class="proof" use:reveal>
    <p class="proof-label">Trusted by teams shipping fast</p>
    <div class="logo-wall">
      {#each logos as logo}
        <span class="logo-item">{logo}</span>
      {/each}
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="final-cta" use:reveal>
    <div class="final-cta-inner">
      <h2>Ready to secure your application?</h2>
      <p>Get an API key in seconds. No credit card required.</p>

      {#if !submitted}
        <div class="cta-input-row">
          <input
            type="email"
            placeholder="you@company.com"
            bind:value={email}
            onkeydown={(e) => e.key === "Enter" && handleGetKey()}
          />
          <button class="btn-solid" onclick={handleGetKey}>Get API key</button>
        </div>
      {:else}
        <p class="cta-success">Check your inbox — your key is on its way.</p>
      {/if}
    </div>
  </section>

  <!-- FOOTER -->
  <MarketingFooter />
</div>

<style>
  :global(body) {
    margin: 0;
    background: #08080c;
    color: #f3f4f6;
    font-family: "Geist Variable", "Geist", system-ui, sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  .page {
    position: relative;
    overflow-x: clip;
  }

  /* ---------- top radial glow ---------- */
  .top-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 560px;
    background: radial-gradient(
      ellipse 70% 60% at 50% 0%,
      rgba(124, 58, 237, 0.28),
      transparent 70%
    );
    /* Belt-and-suspenders on top of the gradient's own fade: guarantees
       this never has a hard bottom edge that could show through into
       whatever section follows the hero, regardless of hero height. */
    mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 640px) {
    .top-glow {
      height: 420px;
      background: radial-gradient(
        ellipse 130% 55% at 50% 0%,
        rgba(124, 58, 237, 0.38),
        transparent 72%
      );
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* ---------- shared buttons ---------- */
  .btn-solid,
  .btn-outline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.65rem 1.2rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
    cursor: pointer;
    border: 1px solid transparent;
  }
  .btn-solid {
    background: #7c3aed;
    color: #fff;
  }
  .btn-solid:hover {
    transform: translateY(-1px);
    background: #8b5cf6;
    box-shadow: 0 0 24px rgba(124, 58, 237, 0.45);
  }
  .btn-outline {
    border-color: rgba(255, 255, 255, 0.16);
    color: #f3f4f6;
  }
  .btn-outline:hover {
    border-color: rgba(255, 255, 255, 0.35);
  }
  .btn-lg {
    padding: 0.85rem 1.6rem;
    font-size: 1rem;
  }

  /* ---------- hero ---------- */
  .hero {
    position: relative;
    padding: 3rem 1.5rem 5rem;
    max-width: 1180px;
    margin: 0 auto;
  }
  .hero-grid {
    position: absolute;
    inset: -2rem 0 auto 0;
    height: 620px;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 42px 42px;
    -webkit-mask-image: radial-gradient(circle at 50% 15%, black 0%, transparent 65%);
    mask-image: radial-gradient(circle at 50% 15%, black 0%, transparent 65%);
    z-index: -1;
  }
  .hero-content {
    max-width: 760px;
    margin: 0 auto;
    text-align: center;
  }
  .badge {
    display: inline-block;
    padding: 0.4rem 0.95rem;
    border: 1px solid rgba(124, 58, 237, 0.35);
    background: rgba(124, 58, 237, 0.1);
    border-radius: 999px;
    color: #c4b5fd;
    font-size: 0.82rem;
    margin-bottom: 1.75rem;
  }
  h1 {
    font-size: clamp(2.4rem, 5.4vw, 4.2rem);
    line-height: 1.08;
    margin: 0 0 1.4rem;
    letter-spacing: -0.02em;
  }
  .grad {
    display: block;
    background: linear-gradient(120deg, #fff, #c4b5fd 60%, #a78bfa);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .lede {
    color: #9ca3af;
    font-size: 1.1rem;
    max-width: 560px;
    margin: 0 auto 2.25rem;
    line-height: 1.6;
  }
  .cta-row {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }

  /* ---------- signature auth orb ---------- */
  .auth-orb {
    max-width: 640px;
    margin: 0 auto;
    background: #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
  }
  .window-chrome {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .window-chrome span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #3f3f46;
  }
  .window-chrome span:nth-child(1) {
    background: #f87171;
  }
  .window-chrome span:nth-child(2) {
    background: #fbbf24;
  }
  .window-chrome span:nth-child(3) {
    background: #34d399;
  }
  .chrome-title {
    margin-left: 0.5rem;
    color: #71717a;
    font-size: 0.78rem;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 8px #34d399;
    flex-shrink: 0;
  }

  .orb-body {
    padding: 3rem 1.75rem 2.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .orb-rings {
    position: relative;
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .orb-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(124, 58, 237, 0.35);
    animation: ring-pulse 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  .orb-ring:nth-child(2) {
    animation-delay: 0.9s;
  }
  .orb-ring:nth-child(3) {
    animation-delay: 1.8s;
  }
  @keyframes ring-pulse {
    0% {
      transform: scale(0.5);
      opacity: 0;
    }
    15% {
      opacity: 0.5;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
  .orb-core {
    position: relative;
    z-index: 1;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(124, 58, 237, 0.12);
    border: 1px solid rgba(124, 58, 237, 0.4);
    color: #c4b5fd;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
  }
  .orb-core.verified {
    background: rgba(52, 211, 153, 0.14);
    border-color: rgba(52, 211, 153, 0.5);
    color: #34d399;
    box-shadow: 0 0 24px rgba(52, 211, 153, 0.35);
  }
  .orb-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .orb-status {
    margin-top: 1.75rem;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    color: #9ca3af;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.8rem;
  }
  .orb-status-dot-pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #a78bfa;
    flex-shrink: 0;
    animation: pulse-dot 1.2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 1;
    }
  }
  .orb-token {
    margin-top: 0.85rem;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.72rem;
    color: #52525b;
    letter-spacing: 0.02em;
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .orb-token.visible {
    opacity: 1;
  }

  /* ---------- sdk section ---------- */
  .sdk {
    max-width: 1180px;
    margin: 0 auto;
    padding: 3rem 1.5rem 5rem;
  }
  .sdk-layout {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 3rem;
    align-items: center;
  }
  .sdk-text h2 {
    font-size: clamp(1.8rem, 3.4vw, 2.4rem);
    margin: 0 0 0.9rem;
  }
  .sdk-text p {
    color: #9ca3af;
    line-height: 1.6;
    max-width: 420px;
  }
  .sdk-code-flat {
    background: #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    overflow: hidden;
  }
  .sdk-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    padding: 0.75rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .sdk-tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .sdk-tab-icon {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    opacity: 0.75;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
  .sdk-tab:hover .sdk-tab-icon,
  .sdk-tab:focus-visible .sdk-tab-icon {
    opacity: 1;
    transform: scale(1.08);
  }
  .sdk-tab.active {
    background: rgba(124, 58, 237, 0.16);
  }
  .sdk-tab.active .sdk-tab-icon {
    opacity: 1;
  }
  .sdk-tab-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: #1c1c24;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #e4e4e7;
    font-size: 0.72rem;
    font-weight: 500;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
    z-index: 10;
  }
  .sdk-tab:hover .sdk-tab-tooltip,
  .sdk-tab:focus-visible .sdk-tab-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .code-window {
    display: flex;
    flex-direction: column;
  }
  .flat-header {
    padding: 0.65rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .flat-filename {
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.78rem;
    color: #71717a;
  }
  .code-body {
    margin: 0;
    padding: 1.75rem;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.88rem;
    line-height: 1.7;
    color: #d4d4d8;
    overflow-x: auto;
  }
  .code-body :global(.tok-keyword) {
    color: #569cd6;
  }
  .code-body :global(.tok-string) {
    color: #ce9178;
  }
  .code-body :global(.tok-comment) {
    color: #6a9955;
    font-style: italic;
  }
  .code-body :global(.tok-number) {
    color: #b5cea8;
  }
  .code-body :global(.tok-function) {
    color: #dcdcaa;
  }
  .code-body :global(.tok-type) {
    color: #4ec9b0;
  }

  @media (max-width: 860px) {
    .sdk-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .sdk-text p {
      max-width: none;
    }
  }

  /* ---------- pillars / bento grid ---------- */
  .pillars {
    max-width: 1180px;
    margin: 0 auto;
    padding: 1rem 1.5rem 5rem;
  }
  .pillars-head {
    max-width: 560px;
    margin-bottom: 2.25rem;
  }
  .pillars-eyebrow {
    display: inline-block;
    color: #22d3ee;
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.65rem;
  }
  .pillars-head h2 {
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    margin: 0;
  }

  .bento-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "speed security customizable"
      "speed rest rest";
    gap: 1.25rem;
  }
  .bento-tile {
    position: relative;
    background: #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 1.9rem;
    overflow: hidden;
    transition: border-color 0.25s ease, transform 0.25s ease;
  }
  .bento-tile:hover {
    border-color: rgba(139, 92, 246, 0.5);
    transform: translateY(-3px);
  }
  .tile-icon {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 10px;
    background: rgba(139, 92, 246, 0.14);
    border: 1px solid rgba(139, 92, 246, 0.32);
    color: #c4b5fd;
    margin-bottom: 1rem;
  }
  .tile-tag {
    position: absolute;
    top: 1.9rem;
    right: 1.9rem;
    font-family: "Geist Mono Variable", "Geist Mono", monospace;
    font-size: 0.72rem;
    color: #22d3ee;
    border: 1px solid rgba(34, 211, 238, 0.3);
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
  }
  .bento-tile h3 {
    position: relative;
    z-index: 1;
    margin: 0 0 0.55rem;
    font-size: 1.12rem;
  }
  .bento-tile p {
    position: relative;
    z-index: 1;
    margin: 0;
    color: #9ca3af;
    line-height: 1.6;
    font-size: 0.92rem;
    max-width: 34ch;
  }

  .tile-speed {
    grid-area: speed;
    background:
      radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.18), transparent 60%),
      #12121a;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 280px;
  }
  .tile-glow {
    position: absolute;
    inset: -25% -30% auto auto;
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%);
    pointer-events: none;
  }
  .tile-stat {
    position: relative;
    z-index: 1;
    font-size: 2.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    background: linear-gradient(120deg, #fff, #c4b5fd);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 1.5rem 0 0.6rem;
  }

  .tile-security {
    grid-area: security;
  }
  .tile-customizable {
    grid-area: customizable;
  }
  .tile-rest {
    grid-area: rest;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .tile-rest p {
    max-width: 46ch;
  }

  @media (max-width: 780px) {
    .bento-grid {
      grid-template-columns: 1fr;
      grid-template-areas: none;
    }
    .tile-speed,
    .tile-security,
    .tile-customizable,
    .tile-rest {
      grid-area: auto;
    }
    .tile-speed {
      min-height: 0;
    }
  }

  /* ---------- social proof ---------- */
  .proof {
    max-width: 1180px;
    margin: 0 auto;
    padding: 1rem 1.5rem 5rem;
    text-align: center;
  }
  .proof-label {
    color: #71717a;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 1.75rem;
  }
  .logo-wall {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2.5rem 3.5rem;
    padding: 0 1rem;
  }
  .logo-item {
    color: #52525b;
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.02em;
    filter: grayscale(1);
    transition: color 0.2s ease;
  }
  .logo-item:hover {
    color: #a1a1aa;
  }

  /* ---------- final cta ---------- */
  .final-cta {
    margin: 0 1.5rem 5rem;
    max-width: 1180px;
    margin-inline: auto;
    border-radius: 24px;
    background:
      radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.35), transparent 55%),
      radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.18), transparent 50%),
      #12121a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 4rem 2rem;
    text-align: center;
  }
  .final-cta-inner h2 {
    font-size: clamp(1.7rem, 3.2vw, 2.3rem);
    margin: 0 0 0.6rem;
  }
  .final-cta-inner p {
    color: #9ca3af;
    margin: 0 0 2rem;
  }
  .cta-input-row {
    display: flex;
    justify-content: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .cta-input-row input {
    background: #08080c;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: #f3f4f6;
    font-size: 0.95rem;
    min-width: 260px;
  }
  .cta-input-row input:focus {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
  }
  .cta-success {
    color: #34d399;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    .final-cta {
      margin: 0 1rem 3.5rem;
      padding: 2.75rem 1.25rem;
      border-radius: 20px;
    }
    .cta-input-row {
      flex-direction: column;
      align-items: stretch;
    }
    .cta-input-row input {
      min-width: 0;
      width: 100%;
    }
    .cta-input-row button {
      width: 100%;
    }
  }

  /* ---------- scroll reveal ---------- */
  :global(.reveal) {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }
  :global(.reveal-in) {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.reveal) {
      opacity: 1;
      transform: none;
      transition: none;
    }
    .orb-ring {
      animation: none;
      opacity: 0;
    }
    .orb-status-dot-pulse {
      animation: none;
    }
  }
</style>
