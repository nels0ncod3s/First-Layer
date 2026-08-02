<script>
  // ============================================================
  // CopyButton — small icon button that copies `text` to the
  // clipboard and flashes a checkmark on success. Shared by the
  // hero install pill and every code-window header (landing +
  // docs pages) so copy behavior/styling only lives in one place.
  // ============================================================
  import Copy from "@lucide/svelte/icons/copy";
  import Check from "@lucide/svelte/icons/check";

  let { text = "", label = "Copy", variant = "square" } = $props();

  let copied = $state(false);
  let resetTimer;

  async function copyToClipboard() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      // Fallback for insecure contexts / older browsers where the
      // async Clipboard API isn't available.
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        // Nothing more we can do — silently give up rather than throw.
      }
      document.body.removeChild(textarea);
    }

    copied = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => (copied = false), 1800);
  }
</script>

<button
  type="button"
  class="copy-btn variant-{variant}"
  class:copied
  onclick={copyToClipboard}
  aria-label={copied ? "Copied" : label}
>
  {#if copied}
    <Check class="h-3.5 w-3.5" />
  {:else}
    <Copy class="h-3.5 w-3.5" />
  {/if}
</button>

<style>
  .copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    color: #9ca3af;
    cursor: pointer;
    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
  }
  .copy-btn:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.08);
  }
  .copy-btn.copied {
    color: #34d399;
    border-color: rgba(52, 211, 153, 0.4);
    background: rgba(52, 211, 153, 0.1);
  }

  .copy-btn.variant-square {
    width: 28px;
    height: 28px;
    border-radius: 7px;
  }
  .copy-btn.variant-round {
    width: 32px;
    height: 32px;
    border-radius: 999px;
  }
</style>
