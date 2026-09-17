<script>
	import { onMount } from 'svelte';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	let visible = $state(false);
	onMount(() => {
		visible = !document.cookie.match(/(?:^|; )cookie_consent=/);
	});
	function acknowledge() {
		document.cookie = `cookie_consent=acknowledged; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
		visible = false;
	}
</script>

{#if visible}
	<aside class="cookie-notice" aria-label="Essential cookies">
		<ShieldCheck size={20} />
		<div>
			<strong>Just the essentials.</strong>
			<p>We use cookies to keep you signed in. No tracking or advertising cookies.</p>
		</div>
		<button onclick={acknowledge}>Got it</button>
	</aside>
{/if}

<style>
	.cookie-notice {
		position: fixed;
		bottom: 20px;
		left: 20px;
		z-index: 50;
		max-width: 440px;
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 18px;
		background: #211a2dee;
		border: 1px solid #bba3f133;
		backdrop-filter: blur(20px);
		box-shadow: 0 10px 40px #0004;
		border-radius: 10px;
		color: #dfd1ef;
	}
	.cookie-notice > :global(svg) {
		color: #bba3f1;
		flex-shrink: 0;
		margin-top: 1px;
	}
	.cookie-notice strong {
		font-size: 12px;
		font-weight: 550;
	}
	.cookie-notice p {
		font-size: 11px;
		line-height: 1.8;
		color: #b4a5c5;
		margin-top: 5px;
	}
	.cookie-notice button {
		white-space: nowrap;
		flex-shrink: 0;
		padding: 8px 12px;
		background: #bba3f1;
		color: #241a33;
		border-radius: 6px;
		font-size: 11px;
		font-weight: 600;
	}
	@media (max-width: 640px) {
		.cookie-notice {
			bottom: 12px;
			left: 12px;
			right: 12px;
			max-width: none;
			padding: 15px;
			gap: 10px;
		}
		.cookie-notice p {
			font-size: 11px;
		}
		.cookie-notice button {
			padding: 9px 11px;
		}
	}
</style>
