<script>
	import BrandMark from '$lib/components/BrandMark.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
</script>

<footer class="marketing-footer">
	<div class="footer-main">
		<div>
			<a href="/" class="brand"><BrandMark size={28} />first layer.</a>
			<p>Your product, one layer closer.</p>
		</div>
		<nav aria-label="Footer navigation">
			<a href="/docs">Documentation <ArrowUpRight size={14} /></a><a href="/pricing"
				>Pricing <ArrowUpRight size={14} /></a
			><a href="/changelog">Changelog <ArrowUpRight size={14} /></a>
		</nav>
	</div>
	<div class="footer-bottom">
		<span>© {new Date().getFullYear()} First Layer</span><span>Built for the people who build.</span
		><a href="/signup">Let’s build something.</a>
	</div>
</footer>

<style>
	.marketing-footer {
		max-width: 1280px;
		margin: auto;
		padding: 60px 40px 25px;
		color: #8f899e;
	}
	.footer-main {
		display: flex;
		justify-content: space-between;
		gap: 40px;
		padding-bottom: 50px;
		border-bottom: 1px solid #ffffff14;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 24px;
		font-weight: 650;
		color: #eeeaf6;
		letter-spacing: -1px;
	}
	.brand :global(svg) {
		color: #b7a2ff;
	}
	.footer-main p {
		font-size: 14px;
		margin-top: 18px;
	}
	.footer-main nav {
		display: flex;
		gap: 38px;
		align-items: flex-start;
		padding-top: 8px;
	}
	.footer-main nav a {
		display: flex;
		gap: 12px;
		align-items: center;
		font-size: 13px;
		color: #b3aebf;
	}
	.footer-main nav a:hover {
		color: #fff;
	}
	.footer-bottom {
		padding-top: 24px;
		display: flex;
		justify-content: space-between;
		gap: 20px;
		font-size: 12px;
	}
	.footer-bottom a {
		color: #c2b4e8;
	}
	@media (max-width: 640px) {
		.marketing-footer {
			padding: 40px 24px 24px;
		}
		.footer-main {
			flex-direction: column;
			padding-bottom: 30px;
			gap: 24px;
		}
		.footer-main nav {
			gap: 24px;
			flex-wrap: wrap;
		}
		.footer-bottom {
			flex-wrap: wrap;
		}
		.footer-bottom > span:nth-child(2) {
			display: none;
		}
	}
</style>
