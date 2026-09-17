<script>
	import { goto } from '$app/navigation';
	import { getDashboard } from '$lib/stores/dashboard.svelte.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import { highlightCode } from '$lib/highlight.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Settings from '@lucide/svelte/icons/settings';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Users from '@lucide/svelte/icons/users';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import FileClock from '@lucide/svelte/icons/file-clock';
	import Check from '@lucide/svelte/icons/check';
	import Terminal from '@lucide/svelte/icons/terminal';
	const dashboard = getDashboard();
	let { data } = $props();
	const snippet = `import { FirstLayer } from "firstlayer";

// Initialise on your server, never in the browser.
const layer = new FirstLayer({
  apiKey: process.env.FIRSTLAYER_API_KEY
});

const { user } = await layer.auth.signUp({
  email: "ada@example.com",
  password: "a-strong-unique-password"
});`;
	const actions = [
		{
			title: 'API keys',
			description: 'Connect your app to First Layer.',
			segment: 'API',
			icon: KeyRound
		},
		{
			title: 'User directory',
			description: 'Manage the people in your app.',
			segment: 'Users',
			icon: Users
		},
		{
			title: 'Authentication',
			description: 'Configure your signup options.',
			segment: 'Auth',
			icon: SlidersHorizontal
		},
		{
			title: 'Activity',
			description: 'See user and key creation events.',
			segment: 'Logs',
			icon: FileClock
		}
	];
</script>

<svelte:head><title>{data.project.name} — First Layer</title></svelte:head>
<div class="overview-page">
	<div class="overview-back">
		<a href="/dashboard"><ArrowLeft size={14} />All projects</a><DropdownMenu.Root
			><DropdownMenu.Trigger
				>{#snippet child({ props })}<button
						{...props}
						class="dashboard-secondary"
						aria-label="Project options"><EllipsisVertical size={17} /></button
					>{/snippet}</DropdownMenu.Trigger
			><DropdownMenu.Content align="end" class="bg-zinc-900 border-zinc-800 text-zinc-100"
				><DropdownMenu.Item
					class="gap-2 focus:bg-zinc-800"
					onclick={() => goto(`/dashboard/${data.project.id}/Settings`)}
					><Settings size={15} />Project settings</DropdownMenu.Item
				><DropdownMenu.Separator class="bg-zinc-800" /><DropdownMenu.Item
					class="gap-2 text-red-400 focus:bg-red-500/10"
					onclick={() => dashboard.requestDelete(data.project)}
					><Trash2 size={15} />Delete project</DropdownMenu.Item
				></DropdownMenu.Content
			></DropdownMenu.Root
		>
	</div>
	<header class="overview-heading">
		<div>
			<span class="page-eyebrow">PROJECT OVERVIEW</span>
			<h1>{data.project.name}</h1>
			<p>A foundation for your app. A home for your users.</p>
		</div>
		<span class="provider-pill" class:disabled={!data.project.auth_email}
			><span></span>Email signup {data.project.auth_email ? 'enabled' : 'disabled'}</span
		>
	</header>
	<div class="overview-stats">
		{#await data.stats}<div class="stat-card" aria-busy="true">
				<span class="stat-icon"><Users size={20} /></span><span>Total app users</span><strong
					>…</strong
				>
			</div>
			<div class="stat-card" aria-busy="true">
				<span class="stat-icon"><UserPlus size={20} /></span><span>Signups today</span><strong
					>…</strong
				>
			</div>{:then stats}<div class="stat-card">
				<span class="stat-icon"><Users size={20} /></span><span>Total app users</span><strong
					>{stats.userCount}</strong
				><a href={`/dashboard/${data.project.id}/Users`}
					>View directory <ArrowUpRight size={14} /></a
				>
			</div>
			<div class="stat-card">
				<span class="stat-icon"><UserPlus size={20} /></span><span>Signups today</span><strong
					>{stats.signupsToday}</strong
				><span class="stat-footnote">New accounts created today.</span>
			</div>{:catch}<div class="stat-card">
				<span>Project details unavailable</span><a href={`/dashboard/${data.project.id}/Users`}
					>Open the user directory <ArrowUpRight size={14} /></a
				>
			</div>{/await}
	</div>
	<section class="getting-started">
		<div class="setup-heading">
			<div>
				<span class="page-eyebrow">A GOOD PLACE TO START</span>
				<h2>Connect your first layer.</h2>
				<p>Three steps from a new project to your first user.</p>
			</div>
			<a class="dashboard-secondary" href="/docs#quickstart"
				>Quickstart <ArrowUpRight size={14} /></a
			>
		</div>
		<ol class="integration-steps">
			<li>
				<span class="step-number complete"><Check size={17} /></span>
				<div>
					<span class="step-label">FOUNDATION LAID</span>
					<h3>Your project is ready</h3>
					<p>Users and keys belong to this project.</p>
				</div>
			</li>
			<li>
				<span class="step-number">02</span>
				<div>
					<span class="step-label">CONNECT YOUR SERVER</span>
					<h3>Create an API key</h3>
					<p>Give your integration a named credential.</p>
					<a href={`/dashboard/${data.project.id}/API`}
						>Manage API keys <ArrowUpRight size={13} /></a
					>
				</div>
			</li>
			<li>
				<span class="step-number">03</span>
				<div>
					<span class="step-label">MAKE IT YOURS</span>
					<h3>Register your first user</h3>
					<p>Follow the docs, then check your directory.</p>
					<a href="/docs#quickstart">Make your first request <ArrowUpRight size={13} /></a>
				</div>
			</li>
		</ol>
	</section>
	<div class="overview-bottom">
		<section class="project-shortcuts">
			<h2>Your project, at a glance.</h2>
			<p>Everything you need to keep building.</p>
			<div class="shortcuts-grid">
				{#each actions as action}<a href={`/dashboard/${data.project.id}/${action.segment}`}
						><span class="shortcut-icon"><action.icon size={19} /></span>
						<div>
							<h3>{action.title}</h3>
							<p>{action.description}</p>
						</div>
						<ArrowUpRight size={16} /></a
					>{/each}
			</div>
			<div class="upcoming-note">
				<span>ON THE HORIZON</span>
				<p>Google OAuth and magic links are coming soon.</p>
			</div>
		</section>
		<section class="overview-code">
			<div class="code-header">
				<span><Terminal size={15} />your first request</span><CopyButton
					text={snippet}
					label="Copy server integration example"
				/>
			</div>
			<pre><code>{@html highlightCode(snippet)}</code></pre>
			<div class="code-reminder">Keep API keys in server environment variables.</div>
		</section>
	</div>
</div>

<style>
	.provider-pill.disabled {
		color: #b0a6be;
		border-color: #ffffff18;
		background: #ffffff03;
	}
	.provider-pill.disabled span {
		background: #8c7b9c;
	}
	.overview-page {
		max-width: 1200px;
		margin: auto;
	}
	.overview-back {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 0 23px;
	}
	.overview-back > a {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 11px;
		color: #ac9dbe;
	}
	.overview-back > a:hover {
		color: #e0d1f5;
	}
	.page-eyebrow {
		font-size: 9px;
		font-weight: 600;
		color: #a38ebc;
		letter-spacing: 1.7px;
	}
	.overview-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 30px;
	}
	.overview-heading h1 {
		font-size: 32px;
		font-weight: 550;
		letter-spacing: -1px;
		margin-top: 12px;
		overflow-wrap: anywhere;
	}
	.overview-heading p {
		font-size: 13px;
		color: #a296b1;
		margin-top: 8px;
	}
	.provider-pill {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 11px;
		color: #a7bf98;
		border: 1px solid #bfd7a51a;
		background: #bfd7a509;
		padding: 7px 10px;
		border-radius: 20px;
		white-space: nowrap;
	}
	.provider-pill > span {
		height: 4px;
		width: 4px;
		border-radius: 50%;
		background: #c1dc99;
	}
	.overview-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
		margin-bottom: 30px;
	}
	.stat-card {
		position: relative;
		padding: 24px;
		border: 1px solid #ffffff13;
		border-radius: 10px;
		background: #ffffff02;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
	}
	.stat-card > span:not(.stat-icon) {
		font-size: 11px;
		color: #a598b5;
	}
	.stat-card strong {
		font-size: 36px;
		line-height: 1.2;
		font-weight: 500;
		letter-spacing: -1px;
		font-variant-numeric: tabular-nums;
	}
	.stat-icon {
		position: absolute;
		right: 24px;
		top: 24px;
		color: #ad95d0;
		background: #ae92d60d;
		border: 1px solid #ae92d617;
		border-radius: 8px;
		padding: 8px;
	}
	.stat-card a {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 11px;
		color: #c3afd9;
		margin-top: 5px;
	}
	.stat-card .stat-footnote {
		font-size: 10px !important;
		margin-top: 5px;
		color: #a296b0 !important;
	}
	.getting-started {
		padding: 28px;
		border: 1px solid #b698e72a;
		border-radius: 11px;
		background: linear-gradient(130deg, #a78bfa09, transparent);
		margin-bottom: 35px;
	}
	.setup-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
	}
	.setup-heading h2 {
		font-size: 23px;
		letter-spacing: -0.75px;
		font-weight: 500;
		margin: 9px 0;
	}
	.setup-heading p {
		font-size: 12px;
		color: #a094b0;
	}
	.integration-steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 25px;
		margin-top: 30px;
		padding-top: 27px;
		border-top: 1px solid #b698e717;
	}
	.integration-steps li {
		display: flex;
		align-items: flex-start;
		gap: 13px;
	}
	.step-number {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		font: 10px monospace;
		height: 30px;
		width: 30px;
		border: 1px solid #b799e933;
		border-radius: 8px;
		color: #b9a0d7;
		background: #a78bfa09;
	}
	.step-number.complete {
		background: #d7f99b14;
		border-color: #d7f99b23;
		color: #c5e79a;
	}
	.step-label {
		font-size: 8px;
		letter-spacing: 1px;
		color: #a08aac;
	}
	.integration-steps h3 {
		font-size: 12px;
		font-weight: 550;
		margin-top: 8px;
	}
	.integration-steps p {
		font-size: 11px;
		color: #a397b0;
		line-height: 1.8;
		margin-top: 7px;
	}
	.integration-steps a {
		font-size: 11px;
		color: #c2a9df;
		display: flex;
		align-items: center;
		gap: 7px;
		margin-top: 15px;
	}
	.integration-steps a:hover {
		color: #e4cdff;
	}
	.overview-bottom {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
	}
	.project-shortcuts h2 {
		font-size: 17px;
		font-weight: 500;
		letter-spacing: -0.4px;
	}
	.project-shortcuts > p {
		font-size: 11px;
		color: #a296b2;
		margin-top: 7px;
	}
	.shortcuts-grid {
		display: grid;
		gap: 10px;
		margin-top: 20px;
	}
	.shortcuts-grid > a {
		display: flex;
		align-items: center;
		gap: 13px;
		padding: 17px;
		border: 1px solid #ffffff12;
		background: #ffffff02;
		border-radius: 9px;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.shortcuts-grid > a:hover {
		border-color: #a78bfa45;
		background: #a78bfa07;
	}
	.shortcut-icon {
		color: #b19acb;
	}
	.shortcuts-grid h3 {
		font-size: 12px;
		font-weight: 500;
	}
	.shortcuts-grid p {
		font-size: 12px;
		color: #a093b1;
		margin-top: 5px;
	}
	.shortcuts-grid > a > :global(svg) {
		margin-left: auto;
		color: #8b769f;
		flex-shrink: 0;
	}
	.overview-code {
		min-width: 0;
		border: 1px solid #ffffff15;
		border-radius: 10px;
		overflow: hidden;
		background: #0c0b10;
		align-self: start;
	}
	.code-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 17px 20px;
		border-bottom: 1px solid #ffffff0c;
	}
	.code-header > span {
		display: flex;
		align-items: center;
		gap: 9px;
		font: 10px monospace;
		color: #b5a2c9;
	}
	.overview-code pre {
		padding: 25px 20px;
		font-size: 12px;
		line-height: 1.95;
		overflow: auto;
		color: #ccc2d7;
	}
	.overview-code :global(.tok-keyword) {
		color: #bfa1ec;
	}
	.overview-code :global(.tok-string) {
		color: #cae5a0;
	}
	.overview-code :global(.tok-comment) {
		color: #8d809b;
	}
	.overview-code :global(.tok-function) {
		color: #e0c093;
	}
	.overview-code :global(.tok-type) {
		color: #b1d2da;
	}
	.code-reminder {
		padding: 15px 20px;
		font-size: 11px;
		color: #a28bb9;
		border-top: 1px solid #ffffff0b;
	}
	.upcoming-note {
		margin-top: 25px;
		border-top: 1px solid #ffffff0c;
		padding-top: 21px;
	}
	.upcoming-note > span {
		font-size: 8px;
		letter-spacing: 1.2px;
		color: #a28dae;
	}
	.upcoming-note p {
		font-size: 11px;
		margin-top: 8px;
		color: #a296b0;
	}
	@media (max-width: 1000px) {
		.integration-steps {
			gap: 15px;
		}
		.integration-steps li {
			flex-direction: column;
			gap: 9px;
		}
		.overview-bottom {
			gap: 22px;
		}
	}
	@media (max-width: 760px) {
		.overview-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 18px;
		}
		.overview-heading h1 {
			font-size: 29px;
		}
		.overview-stats {
			gap: 12px;
		}
		.stat-card {
			padding: 19px;
		}
		.stat-icon {
			right: 19px;
			top: 19px;
			padding: 5px;
		}
		.stat-card strong {
			font-size: 30px;
		}
		.stat-card .stat-footnote {
			font-size: 9px !important;
			line-height: 1.6;
		}
		.getting-started {
			padding: 23px;
		}
		.setup-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 17px;
		}
		.integration-steps {
			grid-template-columns: 1fr;
			gap: 25px;
		}
		.integration-steps li {
			flex-direction: row;
			gap: 15px;
		}
		.integration-steps h3 {
			font-size: 13px;
		}
		.integration-steps p {
			font-size: 11px;
		}
		.overview-bottom {
			grid-template-columns: 1fr;
			gap: 30px;
		}
	}
</style>
