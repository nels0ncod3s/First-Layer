<script>
	import { page } from '$app/state';
	import BrandMark from '$lib/components/BrandMark.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	let menuOpen = $state(false);
	let menuButton;
	const links = [
		{ href: '/docs', label: 'Documentation' },
		{ href: '/pricing', label: 'Pricing' },
		{ href: '/changelog', label: 'Changelog' }
	];
	$effect(() => {
		page.url.pathname;
		menuOpen = false;
	});
	function onKeydown(event) {
		if (event.key === 'Escape' && menuOpen) {
			menuOpen = false;
			menuButton?.focus();
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />
<nav class="marketing-nav" aria-label="Main navigation" data-sveltekit-preload-data="hover">
	<div class="nav-inner">
		<a class="brand" href="/" aria-label="First Layer home"
			><BrandMark /><span>first layer<span class="brand-period">.</span></span></a
		>
		<div class="nav-links">
			{#each links as link}<a
					href={link.href}
					aria-current={page.url.pathname === link.href ? 'page' : undefined}>{link.label}</a
				>{/each}
		</div>
		<div class="nav-actions">
			<a href="/login" class="login-link">Log in</a><a href="/signup" class="nav-cta"
				>Start building <ArrowUpRight size={15} /></a
			>
		</div>
		<button
			bind:this={menuButton}
			class="menu-toggle"
			aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
			aria-expanded={menuOpen}
			aria-controls="mobile-navigation"
			onclick={() => (menuOpen = !menuOpen)}
			>{#if menuOpen}<X size={23} />{:else}<Menu size={23} />{/if}</button
		>
	</div>
	{#if menuOpen}<div id="mobile-navigation" class="mobile-menu">
			{#each links as link}<a href={link.href}>{link.label}<ArrowUpRight size={16} /></a>{/each}
			<div class="mobile-actions">
				<a href="/login">Log in</a><a class="nav-cta" href="/signup"
					>Start building <ArrowUpRight size={16} /></a
				>
			</div>
		</div>{/if}
</nav>

<style>
	.marketing-nav {
		position: sticky;
		top: 0;
		z-index: 40;
		background: #0c0b10ed;
		backdrop-filter: blur(20px);
		border-bottom: 1px solid #ffffff12;
		color: #f2f0f7;
	}
	.nav-inner {
		max-width: 1280px;
		margin: auto;
		padding: 0 40px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 11px;
		font-size: 23px;
		font-weight: 650;
		letter-spacing: -1px;
		white-space: nowrap;
	}
	.brand :global(svg) {
		color: #b7a2ff;
	}
	.brand-period {
		color: #cff58c;
	}
	.nav-links,
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 30px;
	}
	.nav-links a,
	.login-link {
		font-size: 13px;
		font-weight: 500;
		color: #a9a5b4;
		transition: color 0.2s;
	}
	.nav-links a:hover,
	.nav-links a[aria-current],
	.login-link:hover {
		color: #fff;
	}
	.nav-actions {
		gap: 25px;
	}
	.nav-cta {
		display: inline-flex;
		gap: 18px;
		align-items: center;
		justify-content: center;
		background: #b7a2ff;
		color: #21172d;
		border-radius: 7px;
		padding: 12px 18px;
		font-size: 13px;
		font-weight: 650;
		transition:
			background 0.2s,
			transform 0.2s;
	}
	.nav-cta:hover {
		background: #c8b8ff;
		transform: translateY(-1px);
	}
	.menu-toggle {
		display: none;
		padding: 10px;
		color: #eee;
		border: 1px solid #ffffff1a;
		border-radius: 8px;
	}
	.mobile-menu {
		padding: 8px 24px 24px;
		border-top: 1px solid #ffffff12;
	}
	.mobile-menu > a {
		display: flex;
		justify-content: space-between;
		padding: 16px 0;
		border-bottom: 1px solid #ffffff12;
		font-size: 15px;
	}
	.mobile-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
	}
	@media (min-width: 761px) {
		.mobile-menu {
			display: none;
		}
	}
	@media (max-width: 940px) {
		.nav-inner {
			padding: 0 24px;
		}
		.nav-links {
			gap: 20px;
		}
		.nav-actions {
			gap: 16px;
		}
		.brand {
			font-size: 21px;
		}
	}
	@media (max-width: 760px) {
		.nav-inner {
			height: 70px;
		}
		.nav-links,
		.nav-actions {
			display: none;
		}
		.menu-toggle {
			display: flex;
		}
	}
</style>
