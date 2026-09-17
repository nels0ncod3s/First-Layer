<script>
	import MarketingNav from '$lib/components/marketing/MarketingNav.svelte';
	import MarketingFooter from '$lib/components/marketing/MarketingFooter.svelte';
	import BrandMark from '$lib/components/BrandMark.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import { highlightCode } from '$lib/highlight.js';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import Plus from '@lucide/svelte/icons/plus';
	import Users from '@lucide/svelte/icons/users';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import Layers from '@lucide/svelte/icons/layers';
	import Terminal from '@lucide/svelte/icons/terminal';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	let previewTab = $state('Users');
	let codeTab = $state('JavaScript');
	const previewTabs = ['Users', 'API keys', 'Activity'];
	const examples = [
		{
			name: 'Ada Okafor',
			email: 'ada@example.com',
			initials: 'AO',
			color: 'lavender'
		},
		{
			name: 'Alex Morgan',
			email: 'alex@example.com',
			initials: 'AM',
			color: 'mint'
		},
		{
			name: 'Sam Rivera',
			email: 'sam@example.com',
			initials: 'SR',
			color: 'peach'
		}
	];
	const snippets = {
		JavaScript: `import { FirstLayer } from "firstlayer";

// Run this on your server.
const layer = new FirstLayer({
  apiKey: process.env.FIRSTLAYER_API_KEY
});

const { user } = await layer.auth.signUp({
  email: "ada@example.com",
  password: "a-strong-unique-password"
});

console.log(user.id);`,
		'REST API': `curl -X POST \\
  https://firstlayer-backend.pxxl.run/v1/auth/signup \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: $FIRSTLAYER_API_KEY" \\
  -d '{
    "email": "ada@example.com",
    "password": "a-strong-unique-password"
  }'`
	};
	const features = [
		{
			icon: Layers,
			number: '01',
			title: 'A home for every app.',
			text: 'Keep each project’s users, settings, and credentials together. Switch projects without losing your place.'
		},
		{
			icon: Users,
			number: '02',
			title: 'Know your users.',
			text: 'See who has signed up. Manage accounts, block access, and keep your user directory organised.'
		},
		{
			icon: KeyRound,
			number: '03',
			title: 'Keys under your control.',
			text: 'Create named API keys for your integrations. Copy a new key once, and revoke it when you need to.'
		},
		{
			icon: SlidersHorizontal,
			number: '04',
			title: 'Your workflow. Your UI.',
			text: 'Use the JavaScript SDK or call the REST API from your server. Build the experience that fits your product.'
		}
	];
	const faqs = [
		{
			q: 'Who is First Layer for?',
			a: 'Developers building side projects, prototypes, and early products who want project-based user management and a straightforward API.'
		},
		{
			q: 'What can I use today?',
			a: 'Create projects, generate and revoke API keys, register and manage app users, and configure email signup. Google OAuth and magic links are planned and are marked as coming soon in the dashboard.'
		},
		{
			q: 'Can I use it with my existing stack?',
			a: 'The JavaScript SDK works from your server. The REST API can be called from any language that supports HTTP. Visit the docs for endpoints and examples.'
		},
		{
			q: 'Where should I keep my API key?',
			a: 'Keep project API keys in server environment variables. Never include a privileged key in a public browser bundle or commit it to your repository.'
		}
	];
	function handleTabs(event, tabs, current, setTab, prefix) {
		const index = tabs.indexOf(current);
		let next;
		if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
		if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
		if (event.key === 'Home') next = 0;
		if (event.key === 'End') next = tabs.length - 1;
		if (next !== undefined) {
			event.preventDefault();
			setTab(tabs[next]);
			document.getElementById(`${prefix}-${next}`)?.focus();
		}
	}
</script>

<svelte:head>
	<title>First Layer — A better foundation for your next big thing</title>
	<meta
		name="description"
		content="Project-based user management, API keys, and a straightforward developer API. Build your product on First Layer."
	/>
	<meta name="theme-color" content="#0c0b10" />
</svelte:head>

<div class="landing">
	<a href="#main-content" class="skip-link">Skip to content</a>
	<MarketingNav />
	<main id="main-content">
		<section class="hero wrap">
			<div class="hero-copy">
				<div class="eyebrow">
					<span class="tiny-dot"></span> THE FOUNDATION FOR WHAT’S NEXT
				</div>
				<h1>Your next<br />big thing.<br /><span>Starts here.</span></h1>
				<p class="hero-description">
					Give your users a place to belong.<br class="desktop-break" /> Manage accounts, projects, and
					API keys in one thoughtfully simple layer.
				</p>
				<div class="hero-actions">
					<a class="button button-lime" href="/signup"
						>Build on First Layer <ArrowUpRight size={19} /></a
					><a class="text-link" href="/docs">Explore the docs <ArrowRight size={17} /></a>
				</div>
				<div class="hero-note">
					<Check size={14} /> Free to get started <span>·</span> Your interface, your rules
				</div>
			</div>
			<div class="hero-visual">
				<div class="visual-grid" aria-hidden="true"></div>
				<div class="layer-outline outline-one" aria-hidden="true"></div>
				<div class="layer-outline outline-two" aria-hidden="true"></div>
				<div class="preview-window">
					<div class="window-toolbar">
						<span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span
							>console.firstlayer</span
						><span class="preview-label">PREVIEW</span>
					</div>
					<div class="preview-project">
						<div class="project-emblem"><BrandMark size={24} /></div>
						<div>
							<span class="mini-label">YOUR PROJECT</span>
							<h2>The next big thing</h2>
						</div>
						<ChevronDown size={16} />
					</div>
					<div class="preview-tabs" role="tablist" aria-label="Product preview">
						{#each previewTabs as tab, i}<button
								id={`preview-${i}`}
								role="tab"
								aria-selected={previewTab === tab}
								aria-controls="preview-panel"
								tabindex={previewTab === tab ? 0 : -1}
								onclick={() => (previewTab = tab)}
								onkeydown={(e) =>
									handleTabs(
										e,
										previewTabs,
										previewTab,
										(value) => (previewTab = value),
										'preview'
									)}
								>{tab === 'Users' ? 'Users' : tab}<span
									>{tab === 'Users' ? '3' : tab === 'API keys' ? '2' : '3'}</span
								></button
							>{/each}
					</div>
					<div
						class="preview-content"
						id="preview-panel"
						role="tabpanel"
						aria-labelledby={`preview-${previewTabs.indexOf(previewTab)}`}
						tabindex="0"
					>
						{#if previewTab === 'Users'}
							<div class="preview-heading">
								<span>Your people.</span><span class="muted">3 example users</span>
							</div>
							{#each examples as user}<div class="example-row">
									<span class="avatar {user.color}">{user.initials}</span>
									<div>
										<strong>{user.name}</strong><span>{user.email}</span>
									</div>
									<span class="active-badge"><i></i> Active</span>
								</div>{/each}
						{:else if previewTab === 'API keys'}
							<div class="preview-heading">
								<span>Your connections.</span><KeyRound size={17} />
							</div>
							{#each ['Production server', 'Development'] as key}<div class="example-row">
									<span class="avatar lavender"><KeyRound size={18} /></span>
									<div>
										<strong>{key}</strong><span class="mono">fl_••••••••••••</span>
									</div>
									<span class="active-badge"><i></i> Active</span>
								</div>{/each}
							<p class="preview-tip">Named keys. Clear ownership. Easy revocation.</p>
						{:else}
							<div class="preview-heading">
								<span>The latest.</span><span class="muted">Example activity</span>
							</div>
							{#each ['Ada joined your project', 'Production API key created', 'Alex joined your project'] as event, i}<div
									class="event-row"
								>
									<span class="event-dot"></span>
									<div>
										<strong>{event}</strong><span>{i + 1} minute{i ? 's' : ''} ago</span>
									</div>
									<Check size={15} />
								</div>{/each}
						{/if}
					</div>
					<div class="preview-footer">
						<span><span class="tiny-dot"></span> One project. Everything connected.</span><Layers
							size={15}
						/>
					</div>
				</div>
				<div class="connection-chip">
					<span class="chip-icon"><Check size={16} /></span>
					<div>
						<strong>One less thing to build.</strong><span>More room for your next idea.</span>
					</div>
					<span class="chip-spark">✳</span>
				</div>
				<div class="visual-caption">
					<span>01 / THE FIRST LAYER</span><span>↓ YOUR PRODUCT GOES HERE</span>
				</div>
			</div>
		</section>

		<div class="stack-band wrap">
			<span>Fits into your stack.</span>
			<div>
				<span><span class="stack-symbol">JS</span> JavaScript</span><span
					><span class="stack-symbol react">✳</span> React</span
				><span><span class="stack-symbol svelte">S</span> SvelteKit</span><span
					><Terminal size={20} /> Node.js</span
				><span><span class="stack-symbol api">&#123; &#125;</span> REST API</span>
			</div>
		</div>

		<section class="features wrap" id="platform">
			<div class="section-heading">
				<div>
					<span class="eyebrow">LESS FRICTION. MORE BUILDING.</span>
					<h2>A little less infrastructure.<br />A lot more possibility.</h2>
				</div>
				<p>
					Your app deserves your attention.<br />Keep the account management in one place.
				</p>
			</div>
			<div class="feature-grid">
				{#each features as feature}<article class="feature-card">
						<div class="feature-top">
							<span class="feature-icon"><feature.icon size={23} strokeWidth={1.5} /></span><span
								class="feature-number">{feature.number}</span
							>
						</div>
						<h3>{feature.title}</h3>
						<p>{feature.text}</p>
					</article>{/each}
			</div>
		</section>

		<section class="integration wrap" id="integration">
			<div class="integration-copy">
				<span class="eyebrow">FROM IDEA TO FIRST USER</span>
				<h2>Small setup.<br /><span>Big head start.</span></h2>
				<p>
					No new way of thinking required. Create a project, get a key, and make your first request.
				</p>
				<ol class="setup-list">
					<li>
						<span>01</span>
						<div>
							<strong>Create your project</strong>
							<p>A dedicated space for your app’s users.</p>
						</div>
					</li>
					<li>
						<span>02</span>
						<div>
							<strong>Connect your server</strong>
							<p>Install the SDK and add your API key.</p>
						</div>
					</li>
					<li>
						<span>03</span>
						<div>
							<strong>Meet your first user</strong>
							<p>Make a request. See it in your dashboard.</p>
						</div>
					</li>
				</ol>
				<a href="/docs#quickstart" class="text-link"
					>Follow the quickstart <ArrowRight size={17} /></a
				>
			</div>
			<div class="code-card">
				<div class="code-top">
					<span class="code-language">YOUR FIRST REQUEST</span><span
						class="code-top-dot"
						aria-hidden="true"
					></span>
				</div>
				<div class="code-tabs" role="tablist" aria-label="Integration examples">
					{#each Object.keys(snippets) as tab, i}<button
							id={`code-${i}`}
							role="tab"
							aria-selected={codeTab === tab}
							aria-controls="code-panel"
							tabindex={codeTab === tab ? 0 : -1}
							onclick={() => (codeTab = tab)}
							onkeydown={(e) =>
								handleTabs(e, Object.keys(snippets), codeTab, (value) => (codeTab = value), 'code')}
							>{tab}</button
						>{/each}<CopyButton text={snippets[codeTab]} label="Copy integration example" />
				</div>
				<div
					id="code-panel"
					role="tabpanel"
					aria-labelledby={`code-${Object.keys(snippets).indexOf(codeTab)}`}
					tabindex="0"
				>
					<pre><code>{@html highlightCode(snippets[codeTab])}</code></pre>
				</div>
				<div class="code-install">
					<Terminal size={16} /><code>npm install firstlayer</code><CopyButton
						text="npm install firstlayer"
						label="Copy install command"
					/>
				</div>
				<div class="code-footnote">
					<span class="tiny-dot"></span> Server-side example · Keep your API key private
				</div>
			</div>
		</section>

		<section class="manifesto">
			<div class="wrap manifesto-inner">
				<span class="eyebrow">BUILT FOR THE BUILDERS</span>
				<h2>
					You bring the idea.<br />We’ll bring <span>the first layer.</span>
				</h2>
				<div class="manifesto-bottom">
					<p>
						Side project. New venture. That idea you can’t shake.<br />Start with a foundation that
						stays out of your way.
					</p>
					<a href="/signup" class="button button-dark">Let’s build it <ArrowUpRight size={20} /></a>
				</div>
				<div class="manifesto-art" aria-hidden="true">
					<span></span><span></span><span></span>
				</div>
			</div>
		</section>

		<section class="faq wrap">
			<div>
				<span class="eyebrow">GOOD QUESTIONS</span>
				<h2>A little clarity<br />before you start.</h2>
				<a href="/docs" class="text-link">More in the docs <ArrowUpRight size={16} /></a>
			</div>
			<div class="faq-list">
				{#each faqs as faq}<details>
						<summary>{faq.q}<Plus size={19} /></summary>
						<p>{faq.a}</p>
					</details>{/each}
			</div>
		</section>
	</main>
	<MarketingFooter />
</div>

<style>
	.landing {
		background: #0c0b10;
		color: #eeeaf5;
		overflow: clip;
	}
	.wrap {
		width: 100%;
		max-width: 1280px;
		padding-inline: 40px;
		margin-inline: auto;
	}
	.eyebrow {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 1.8px;
		color: #b2a6cd;
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.tiny-dot {
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #d2f691;
		flex-shrink: 0;
	}
	.hero {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		align-items: center;
		padding-top: 84px;
		padding-bottom: 88px;
		min-height: 720px;
	}
	.hero h1 {
		font-size: clamp(64px, 6.9vw, 92px);
		line-height: 1.01;
		font-weight: 550;
		letter-spacing: -5px;
		margin: 30px 0 26px;
	}
	.hero h1 > span {
		color: #bca6ff;
	}
	.hero-description {
		color: #aaa4b7;
		font-size: 16px;
		line-height: 1.85;
		max-width: 420px;
	}
	.hero-actions {
		display: flex;
		align-items: center;
		gap: 27px;
		margin: 31px 0 22px;
	}
	.button {
		display: inline-flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		border-radius: 7px;
		padding: 16px 21px;
		font-size: 13px;
		font-weight: 650;
		transition:
			transform 0.2s,
			background 0.2s;
	}
	.button:hover {
		transform: translateY(-2px);
	}
	.button-lime {
		background: #d7f99b;
		color: #171e0e;
	}
	.button-lime:hover {
		background: #e6ffbc;
	}
	.text-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font-size: 13px;
		font-weight: 500;
		color: #d0cadc;
	}
	.text-link:hover {
		color: #fff;
	}
	.hero-note {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		color: #9e97ac;
	}
	.hero-note :global(svg) {
		color: #d7f99b;
	}
	.hero-note > span {
		padding-inline: 3px;
		color: #575060;
	}
	.hero-visual {
		position: relative;
		padding: 45px 0 55px 35px;
		min-width: 0;
	}
	.visual-grid {
		position: absolute;
		inset: -45px -100px -20px -30px;
		background-image:
			linear-gradient(#a691da0b 1px, transparent 1px),
			linear-gradient(90deg, #a691da0b 1px, transparent 1px);
		background-size: 46px 46px;
		mask-image: radial-gradient(ellipse, #000 30%, transparent 70%);
	}
	.hero-visual:before {
		content: '';
		position: absolute;
		inset: 0 -50px -30px;
		background: radial-gradient(ellipse at 50% 45%, #9b67ea27, transparent 67%);
		pointer-events: none;
	}
	.layer-outline {
		position: absolute;
		border: 1px solid #8e73c52b;
		border-radius: 15px;
		inset: 50px 0 90px 35px;
		transform: rotate(-7deg) translate(-16px, 7px);
		background: #17112050;
	}
	.outline-two {
		transform: rotate(5deg) translate(8px, -14px);
		border-color: #c1a1fa20;
	}
	.preview-window {
		position: relative;
		background: linear-gradient(130deg, #1f192b, #14121c 80%);
		border: 1px solid #a792d44a;
		border-radius: 12px;
		box-shadow: 0 40px 100px #0006;
		transform: rotate(-2deg);
	}
	.window-toolbar {
		height: 41px;
		border-bottom: 1px solid #ffffff0e;
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 0 18px;
		font-family: monospace;
		font-size: 9px;
		color: #857c96;
	}
	.window-dots {
		display: flex;
		gap: 4px;
	}
	.window-dots i {
		height: 5px;
		width: 5px;
		border-radius: 50%;
		background: #695e7b;
	}
	.preview-label {
		margin-left: auto;
		font-size: 8px;
		letter-spacing: 1px;
		color: #8f809f;
	}
	.preview-project {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 25px 22px 23px;
	}
	.project-emblem {
		height: 45px;
		width: 45px;
		border: 1px solid #a88ed240;
		background: #b69af318;
		border-radius: 10px;
		display: grid;
		place-items: center;
		color: #be9cfa;
	}
	.mini-label {
		font-size: 8px;
		letter-spacing: 1.5px;
		color: #a299b0;
	}
	.preview-project h2 {
		font-size: 16px;
		font-weight: 550;
		letter-spacing: -0.3px;
		margin-top: 4px;
	}
	.preview-project > :global(svg) {
		margin-left: auto;
		color: #887992;
	}
	.preview-tabs {
		display: flex;
		gap: 22px;
		padding: 0 22px;
		border-bottom: 1px solid #ffffff0d;
	}
	.preview-tabs button {
		padding: 0 0 13px;
		display: flex;
		gap: 7px;
		font-size: 11px;
		color: #8f839f;
		border-bottom: 2px solid transparent;
		cursor: pointer;
	}
	.preview-tabs button[aria-selected='true'] {
		color: #ded1f9;
		border-color: #b69bee;
	}
	.preview-tabs button span {
		font-size: 9px;
		background: #ffffff08;
		border-radius: 4px;
		padding: 0 5px;
	}
	.preview-content {
		padding: 19px 22px 17px;
		min-height: 239px;
	}
	.preview-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 11px;
		font-weight: 500;
		margin-bottom: 10px;
	}
	.muted {
		font-size: 9px;
		font-weight: 400;
		color: #8e829c;
	}
	.example-row {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 13px 0;
		border-bottom: 1px solid #ffffff09;
	}
	.example-row:last-child {
		border: 0;
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 31px;
		height: 31px;
		border-radius: 9px;
		font-size: 9px;
		font-weight: 600;
		flex-shrink: 0;
	}
	.lavender {
		color: #d8c3fa;
		background: #a789d725;
	}
	.mint {
		color: #b8d9c7;
		background: #73a28a22;
	}
	.peach {
		color: #e4b79d;
		background: #c0816422;
	}
	.example-row > div,
	.event-row > div {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
	.example-row strong,
	.event-row strong {
		font-weight: 500;
		font-size: 10px;
		color: #ded7e8;
	}
	.example-row > div > span,
	.event-row > div > span {
		font-size: 9px;
		color: #91859f;
	}
	.active-badge {
		margin-left: auto;
		background: #91c79d0c;
		border: 1px solid #9ccc9b13;
		padding: 4px 6px;
		border-radius: 4px;
		color: #a5c796;
		font-size: 8px;
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.active-badge i {
		height: 3px;
		width: 3px;
		border-radius: 50%;
		background: #b6db93;
	}
	.preview-footer {
		padding: 14px 22px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #ffffff0c;
		font-size: 9px;
		color: #9d8cae;
	}
	.preview-footer > span {
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.preview-footer .tiny-dot {
		height: 4px;
		width: 4px;
	}
	.connection-chip {
		position: relative;
		margin: -5px 28px 0 -20px;
		display: flex;
		align-items: center;
		gap: 12px;
		background: #292133;
		border: 1px solid #bda4df55;
		border-radius: 9px;
		box-shadow: 0 15px 35px #0004;
		padding: 15px 17px;
		transform: rotate(2deg);
	}
	.chip-icon {
		background: #d7f99b;
		color: #242d15;
		border-radius: 50%;
		width: 28px;
		height: 28px;
		display: grid;
		place-items: center;
	}
	.connection-chip > div {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.connection-chip strong {
		font-size: 12px;
		font-weight: 550;
	}
	.connection-chip > div > span {
		font-size: 9px;
		color: #a99bb9;
	}
	.chip-spark {
		color: #c1a7fc;
		font-size: 30px;
		margin-left: auto;
		line-height: 1;
	}
	.visual-caption {
		display: flex;
		justify-content: space-between;
		color: #736780;
		font-family: monospace;
		font-size: 8px;
		letter-spacing: 0.8px;
		margin-top: 34px;
	}
	.preview-tip {
		color: #8f849d;
		font-size: 10px;
		margin-top: 18px;
	}
	.event-row {
		display: flex;
		gap: 10px;
		align-items: center;
		padding: 15px 0;
		border-bottom: 1px solid #ffffff0a;
	}
	.event-dot {
		height: 6px;
		width: 6px;
		border-radius: 50%;
		background: #b79bde;
	}
	.event-row :global(svg) {
		margin-left: auto;
		color: #b4ca9b;
	}
	.mono {
		font-family: monospace;
	}
	.stack-band {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 30px;
		padding-block: 29px;
		border-top: 1px solid #ffffff10;
		border-bottom: 1px solid #ffffff10;
	}
	.stack-band > span {
		color: #7f778f;
		font-size: 12px;
	}
	.stack-band > div {
		display: flex;
		gap: 47px;
		align-items: center;
	}
	.stack-band > div > span {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 14px;
		font-weight: 500;
		color: #aaa2b9;
	}
	.stack-symbol {
		font-size: 11px;
		letter-spacing: -0.5px;
		font-weight: 700;
		color: #afa4c0;
	}
	.react {
		font-size: 24px;
	}
	.svelte {
		font-size: 22px;
		font-style: italic;
	}
	.api {
		font-size: 19px;
	}
	.features {
		padding-top: 110px;
		padding-bottom: 105px;
	}
	.section-heading {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 32px;
		margin-bottom: 40px;
	}
	.section-heading h2,
	.faq h2 {
		font-size: 40px;
		font-weight: 500;
		line-height: 1.18;
		letter-spacing: -1.8px;
		margin-top: 20px;
	}
	.section-heading > p {
		font-size: 13px;
		line-height: 1.9;
		color: #9790a4;
		margin-bottom: 4px;
	}
	.feature-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border: 1px solid #ffffff14;
		border-radius: 10px;
		overflow: hidden;
	}
	.feature-card {
		padding: 28px 25px 35px;
		background: linear-gradient(150deg, #ffffff03, transparent);
		border-right: 1px solid #ffffff12;
		transition: background 0.2s;
	}
	.feature-card:last-child {
		border: 0;
	}
	.feature-card:hover {
		background: #a689e60a;
	}
	.feature-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 38px;
	}
	.feature-icon {
		color: #b9a4e0;
	}
	.feature-number {
		font-size: 10px;
		font-family: monospace;
		color: #635a73;
	}
	.feature-card h3 {
		font-size: 16px;
		font-weight: 550;
		letter-spacing: -0.35px;
		margin-bottom: 13px;
	}
	.feature-card p {
		font-size: 12px;
		line-height: 1.95;
		color: #a097b0;
	}
	.integration {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 90px;
		align-items: center;
		padding-bottom: 120px;
	}
	.integration h2 {
		font-size: 54px;
		line-height: 1.1;
		letter-spacing: -2.5px;
		font-weight: 500;
		margin-top: 23px;
	}
	.integration h2 span {
		color: #bca6ff;
	}
	.integration-copy > p {
		font-size: 14px;
		line-height: 1.9;
		color: #a299b0;
		margin-top: 22px;
		max-width: 350px;
	}
	.setup-list {
		margin: 32px 0;
		display: flex;
		flex-direction: column;
		gap: 23px;
	}
	.setup-list li {
		display: flex;
		gap: 20px;
		align-items: flex-start;
	}
	.setup-list li > span {
		color: #a78bcf;
		font: 11px monospace;
		padding: 7px;
		border: 1px solid #9f83c930;
		border-radius: 5px;
	}
	.setup-list strong {
		font-size: 13px;
		font-weight: 550;
	}
	.setup-list p {
		font-size: 12px;
		color: #92859f;
		margin-top: 5px;
	}
	.code-card {
		background: #121016;
		border: 1px solid #ffffff1c;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 20px 80px #0003;
		min-width: 0;
	}
	.code-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 21px 25px;
		border-bottom: 1px solid #ffffff0e;
	}
	.code-language {
		font-family: monospace;
		font-size: 9px;
		letter-spacing: 1.5px;
		color: #9784ad;
	}
	.code-top-dot {
		width: 6px;
		height: 6px;
		background: #c6efa0;
		border-radius: 50%;
	}
	.code-tabs {
		display: flex;
		align-items: center;
		gap: 22px;
		padding: 15px 25px 0;
	}
	.code-tabs > button {
		font-size: 11px;
		color: #86798f;
		border-bottom: 1px solid transparent;
		padding: 8px 0 15px;
		cursor: pointer;
	}
	.code-tabs > button[aria-selected='true'] {
		color: #d3c1f0;
		border-color: #b99ae9;
	}
	.code-tabs :global(.copy-btn) {
		margin-left: auto;
		margin-bottom: 9px;
	}
	.code-card pre {
		padding: 24px 25px 28px;
		font-size: 11px;
		line-height: 1.95;
		min-height: 303px;
		overflow: auto;
		font-family: 'SFMono-Regular', Consolas, monospace;
		color: #c8c1d2;
		tab-size: 2;
	}
	.code-card :global(.tok-keyword) {
		color: #b79ae4;
	}
	.code-card :global(.tok-string) {
		color: #c9dfa0;
	}
	.code-card :global(.tok-comment) {
		color: #807589;
	}
	.code-card :global(.tok-function) {
		color: #e7c893;
	}
	.code-card :global(.tok-type) {
		color: #b5d6d9;
	}
	.code-card :global(.tok-number) {
		color: #b7d6ba;
	}
	.code-install {
		margin: 0 18px;
		padding: 12px 14px;
		background: #ffffff04;
		border: 1px solid #ffffff0a;
		border-radius: 6px;
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 11px;
		color: #b3a8c5;
	}
	.code-install :global(.copy-btn) {
		margin-left: auto;
	}
	.code-footnote {
		font-size: 9px;
		color: #8d829b;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 19px 25px;
	}
	.manifesto {
		background: #bba3f1;
		color: #21172f;
		position: relative;
		overflow: hidden;
	}
	.manifesto-inner {
		position: relative;
		padding-block: 72px;
	}
	.manifesto .eyebrow {
		color: #51406e;
	}
	.manifesto h2 {
		font-size: clamp(40px, 5.2vw, 67px);
		line-height: 1.15;
		letter-spacing: -3px;
		font-weight: 500;
		margin-top: 27px;
		position: relative;
		z-index: 1;
	}
	.manifesto h2 span {
		color: #51406e;
	}
	.manifesto-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 30px;
		margin-top: 29px;
		position: relative;
		z-index: 1;
	}
	.manifesto p {
		font-size: 13px;
		line-height: 1.9;
		color: #584671;
	}
	.button-dark {
		background: #251a36;
		color: #f1eafa;
		min-width: 175px;
	}
	.button-dark:hover {
		background: #37234c;
	}
	.manifesto-art {
		position: absolute;
		width: 250px;
		height: 260px;
		right: 105px;
		top: 0;
		opacity: 0.22;
		transform: rotate(-20deg);
	}
	.manifesto-art span {
		position: absolute;
		width: 190px;
		height: 130px;
		border: 1px solid #43235d;
		transform: skewY(-25deg);
		border-radius: 12px;
		top: 30px;
	}
	.manifesto-art span:nth-child(2) {
		top: 70px;
	}
	.manifesto-art span:nth-child(3) {
		top: 110px;
	}
	.faq {
		display: grid;
		grid-template-columns: 1fr 1.25fr;
		gap: 90px;
		padding-block: 105px;
	}
	.faq h2 {
		margin-bottom: 28px;
	}
	.faq-list details {
		border-bottom: 1px solid #ffffff15;
	}
	.faq-list summary {
		list-style: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		cursor: pointer;
		padding: 24px 0;
		font-size: 14px;
		font-weight: 500;
	}
	.faq-list summary::-webkit-details-marker {
		display: none;
	}
	.faq-list summary :global(svg) {
		color: #a898bc;
		flex-shrink: 0;
		transition: transform 0.2s;
	}
	.faq-list details[open] summary :global(svg) {
		transform: rotate(45deg);
	}
	.faq-list details p {
		font-size: 13px;
		line-height: 1.9;
		color: #a49aaf;
		padding: 0 30px 25px 0;
	}
	@media (min-width: 1400px) {
		.hero {
			padding-top: 105px;
			padding-bottom: 105px;
		}
	}
	@media (max-width: 1080px) {
		.hero h1 {
			font-size: 72px;
		}
		.hero-actions {
			gap: 18px;
		}
		.hero-actions .text-link {
			font-size: 12px;
		}
		.hero-visual {
			padding-left: 15px;
		}
		.stack-band > div {
			gap: 25px;
		}
		.feature-card {
			padding: 24px 19px;
		}
		.integration,
		.faq {
			gap: 45px;
		}
		.section-heading h2 {
			font-size: 35px;
		}
		.section-heading > p {
			max-width: 250px;
		}
		.feature-card h3 {
			font-size: 14px;
		}
	}
	@media (max-width: 800px) {
		.wrap {
			padding-inline: 24px;
		}
		.hero {
			padding-top: 55px;
			padding-bottom: 50px;
			grid-template-columns: 1fr;
			gap: 30px;
		}
		.hero h1 {
			font-size: 74px;
			letter-spacing: -4px;
		}
		.hero-description {
			max-width: 430px;
		}
		.hero-visual {
			max-width: 510px;
			width: 100%;
			margin: auto;
			padding: 25px 0 35px 20px;
		}
		.visual-caption {
			margin-top: 25px;
		}
		.stack-band {
			flex-direction: column;
			gap: 21px;
			align-items: flex-start;
		}
		.stack-band > div {
			flex-wrap: wrap;
			gap: 20px 28px;
		}
		.stack-band > div > span {
			font-size: 12px;
		}
		.features {
			padding-block: 70px;
		}
		.section-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 20px;
		}
		.section-heading > p {
			max-width: none;
		}
		.feature-grid {
			grid-template-columns: 1fr 1fr;
		}
		.feature-card {
			border-bottom: 1px solid #ffffff12;
			padding: 26px;
		}
		.feature-card:nth-child(2) {
			border-right: 0;
		}
		.feature-card:nth-child(3) {
			border-bottom: 0;
		}
		.feature-top {
			margin-bottom: 25px;
		}
		.feature-card h3 {
			font-size: 16px;
		}
		.integration {
			grid-template-columns: 1fr;
			gap: 35px;
			padding-bottom: 70px;
		}
		.integration h2 {
			font-size: 48px;
		}
		.integration-copy > p {
			max-width: 460px;
		}
		.code-card {
			max-width: 560px;
			width: 100%;
		}
		.manifesto-inner {
			padding-block: 50px;
		}
		.manifesto h2 {
			font-size: 48px;
			letter-spacing: -2px;
		}
		.manifesto-art {
			right: 10px;
			opacity: 0.12;
		}
		.manifesto-bottom {
			align-items: flex-start;
			flex-direction: column;
			gap: 25px;
		}
		.faq {
			grid-template-columns: 1fr;
			gap: 28px;
			padding-block: 65px;
		}
		.faq h2 {
			font-size: 36px;
		}
		.faq-list summary {
			padding: 22px 0;
		}
	}
	@media (max-width: 420px) {
		.hero h1 {
			font-size: 64px;
			letter-spacing: -3.5px;
		}
		.hero-actions {
			align-items: flex-start;
			flex-direction: column;
			gap: 22px;
		}
		.hero-note {
			font-size: 10px;
			gap: 6px;
		}
		.feature-grid {
			grid-template-columns: 1fr;
		}
		.feature-card {
			border-right: 0;
			border-bottom: 1px solid #ffffff12 !important;
		}
		.feature-card:last-child {
			border-bottom: 0 !important;
		}
		.feature-card p {
			font-size: 13px;
		}
		.section-heading h2 {
			font-size: 31px;
		}
		.hero-visual {
			padding-left: 8px;
		}
		.preview-tabs {
			gap: 18px;
		}
		.preview-project {
			padding-inline: 16px;
		}
		.preview-content {
			padding-inline: 16px;
		}
		.example-row {
			gap: 8px;
		}
		.active-badge {
			padding: 3px 4px;
		}
		.visual-caption {
			font-size: 7px;
		}
		.connection-chip {
			margin-left: -5px;
			margin-right: 12px;
		}
		.preview-footer {
			padding-inline: 16px;
		}
		.manifesto h2 {
			font-size: 39px;
		}
		.code-card pre {
			font-size: 10px;
			padding-inline: 18px;
		}
		.code-footnote {
			font-size: 8px;
		}
		.desktop-break {
			display: none;
		}
	}
</style>
