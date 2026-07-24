<footer class="footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<a class="brand" href="/">
				<span class="brand-mark" aria-hidden="true">⌁</span>
				First Layer
			</a>
			<p class="status">
				<span class="status-dot"></span>
				All systems operational
			</p>
		</div>

		<nav class="footer-links">
			<a href="/pricing">Pricing</a>
			<a href="/changelog">Changelog</a>
			<a href="/docs">Docs</a>
		</nav>

		<p class="copyright">© 2026 First Layer, Inc.</p>
	</div>
</footer>

<style>
	a {
		color: inherit;
		text-decoration: none;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1.05rem;
	}
	.brand-mark {
		color: #a78bfa;
		font-size: 1.2rem;
	}

	.footer {
		max-width: 1180px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}
	.footer-inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem 2rem;
	}
	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.footer-links {
		display: flex;
		gap: 1.75rem;
	}
	.footer-links a {
		color: #9ca3af;
		font-size: 0.9rem;
		transition: color 0.15s ease;
	}
	.footer-links a:hover {
		color: #fff;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #9ca3af;
		font-size: 0.85rem;
		margin: 0;
	}
	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #34d399;
		box-shadow: 0 0 8px #34d399;
		flex-shrink: 0;
	}
	.copyright {
		color: #52525b;
		font-size: 0.8rem;
		margin: 0;
	}

	@media (max-width: 640px) {
		.footer-inner {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
