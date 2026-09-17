<script>
	import { preloadData } from '$app/navigation';
	import { getDashboard } from '$lib/stores/dashboard.svelte.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Plus from '@lucide/svelte/icons/plus';
	import Search from '@lucide/svelte/icons/search';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Settings from '@lucide/svelte/icons/settings';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Layers from '@lucide/svelte/icons/layers';
	import Users from '@lucide/svelte/icons/users';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import BookOpen from '@lucide/svelte/icons/book-open';
	const dashboard = getDashboard();
	let { data } = $props();
	let searchQuery = $state('');
	let sortBy = $state('recent');
	let searchInputEl;
	let filteredProjects = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();
		const projects = dashboard.projects.filter(
			(project) => !query || project.name.toLowerCase().includes(query)
		);
		return projects.sort((a, b) =>
			sortBy === 'name'
				? a.name.localeCompare(b.name)
				: new Date(b.created_at) - new Date(a.created_at)
		);
	});
	function aggregateCounts(counts) {
		return dashboard.projects.reduce(
			(total, p) => ({
				keys: total.keys + (counts[p.id]?.keyCount ?? 0),
				users: total.users + (counts[p.id]?.userCount ?? 0)
			}),
			{ keys: 0, users: 0 }
		);
	}
	function formatDate(iso) {
		return iso
			? new Date(iso).toLocaleDateString(undefined, {
					month: 'short',
					day: 'numeric',
					year: 'numeric'
				})
			: '—';
	}
	function frameworkLabel(framework) {
		return (
			{
				nextjs: 'Next.js',
				nodejs: 'Node.js',
				python: 'Python',
				go: 'Go',
				react: 'React',
				svelte: 'Svelte',
				sveltekit: 'SvelteKit',
				vue: 'Vue',
				angular: 'Angular',
				vanilla: 'JavaScript'
			}[framework] ??
			framework ??
			'Application'
		);
	}
	function handleKeydown(event) {
		if (
			!dashboard.dialogOpen &&
			!dashboard.deleteTarget &&
			(event.metaKey || event.ctrlKey) &&
			event.key.toLowerCase() === 'k'
		) {
			event.preventDefault();
			searchInputEl?.focus();
		}
	}
</script>

<svelte:head><title>Projects — First Layer</title></svelte:head>
<svelte:window onkeydown={handleKeydown} />
<div class="projects-page">
	<header class="page-heading">
		<div>
			<span class="page-eyebrow">YOUR WORKSPACE</span>
			<h1>Your next big things.</h1>
			<p>All your applications, with a solid first layer.</p>
		</div>
		<button class="dashboard-primary" onclick={() => dashboard.openAddDialog()}
			><Plus size={17} /> Create project</button
		>
	</header>
	<div class="workspace-stats">
		<div>
			<span class="stat-icon"><Layers size={18} /></span>
			<div>
				<span>Projects</span><strong>{dashboard.projects.length}</strong>
			</div>
		</div>
		<div>
			<span class="stat-icon"><Users size={18} /></span>
			<div>
				<span>App users</span><strong
					>{#await data.counts}…{:then counts}{aggregateCounts(counts)
							.users}{:catch}—{/await}</strong
				>
			</div>
		</div>
		<div>
			<span class="stat-icon"><KeyRound size={18} /></span>
			<div>
				<span>API keys</span><strong
					>{#await data.counts}…{:then counts}{aggregateCounts(counts)
							.keys}{:catch}—{/await}</strong
				>
			</div>
		</div>
	</div>
	<section class="project-section" aria-label="Your projects">
		<div class="project-toolbar">
			<h2>Projects <span>{dashboard.projects.length}</span></h2>
			<div class="toolbar-controls">
				<div class="search-field">
					<Search size={16} /><input
						bind:this={searchInputEl}
						aria-label="Search projects"
						type="search"
						placeholder="Find a project…"
						bind:value={searchQuery}
					/><kbd>⌘ / Ctrl K</kbd>
				</div>
				<select aria-label="Sort projects" bind:value={sortBy}
					><option value="recent">Newest first</option><option value="name">Name A–Z</option
					></select
				>
			</div>
		</div>
		{#if dashboard.projects.length === 0}
			<div class="workspace-empty">
				<span class="empty-layers"><Layers size={34} strokeWidth={1.4} /></span><span
					class="page-eyebrow">EVERY GREAT APP STARTS SOMEWHERE</span
				>
				<h2>Let’s lay the foundation.</h2>
				<p>
					Create a project to give your app its own users,<br class="hidden sm:block" /> credentials,
					and authentication settings.
				</p>
				<button class="dashboard-primary" onclick={() => dashboard.openAddDialog()}
					><Plus size={17} /> Create your first project</button
				><a href="/docs#quickstart">Or take a look at the quickstart <ArrowUpRight size={14} /></a>
			</div>
		{:else if filteredProjects.length === 0}
			<div class="search-empty">
				<Search size={28} />
				<h3>No projects found</h3>
				<p>Try a different name or clear your search.</p>
				<button class="dashboard-secondary" onclick={() => (searchQuery = '')}>Clear search</button>
			</div>
		{:else}
			<ul class="projects-grid">
				{#each filteredProjects as project (project.id)}<li class="project-card">
						<div class="card-top">
							<span class="project-avatar">{project.name.slice(0, 2).toUpperCase()}</span><span
								class="framework-tag">{frameworkLabel(project.framework)}</span
							><DropdownMenu.Root
								><DropdownMenu.Trigger
									>{#snippet child({ props })}<button
											{...props}
											type="button"
											class="card-menu"
											aria-label={`Options for ${project.name}`}
											><EllipsisVertical size={17} /></button
										>{/snippet}</DropdownMenu.Trigger
								><DropdownMenu.Content
									align="end"
									class="bg-zinc-900 border-zinc-800 text-zinc-100 min-w-48"
									><DropdownMenu.Item
										class="gap-2 focus:bg-zinc-800"
										onclick={() => dashboard.openProjectSettings(project)}
										><Settings size={15} />Project settings</DropdownMenu.Item
									><DropdownMenu.Separator class="bg-zinc-800" /><DropdownMenu.Item
										class="gap-2 text-red-400 focus:bg-red-500/10"
										onclick={() => dashboard.requestDelete(project)}
										><Trash2 size={15} />Delete project</DropdownMenu.Item
									></DropdownMenu.Content
								></DropdownMenu.Root
							>
						</div>
						<a
							class="project-link"
							href={`/dashboard/${project.id}`}
							onmouseenter={() => preloadData(`/dashboard/${project.id}`)}
							onfocus={() => preloadData(`/dashboard/${project.id}`)}
							><div>
								<h3>{project.name}</h3>
								<p>Created {formatDate(project.created_at)}</p>
							</div>
							<ArrowUpRight size={19} />
							<div class="card-counts">
								{#await data.counts}<span>Loading project details…</span>{:then counts}<span
										><Users size={13} />{counts[project.id]?.userCount ?? 0} users</span
									><span><KeyRound size={13} />{counts[project.id]?.keyCount ?? 0} keys</span
									>{:catch}<span>Details unavailable</span>{/await}
							</div></a
						>
					</li>{/each}
				<li>
					<button class="new-project-card" onclick={() => dashboard.openAddDialog()}
						><span><Plus size={23} /></span><strong>Room for your next idea.</strong><span
							>Create another project</span
						></button
					>
				</li>
			</ul>
		{/if}
	</section>
	<aside class="workspace-guide">
		<span class="guide-icon"><BookOpen size={22} /></span>
		<div>
			<h3>A few lines. Your first user.</h3>
			<p>The quickstart takes you from a project to your first API request.</p>
		</div>
		<a href="/docs#quickstart">Open quickstart <ArrowUpRight size={16} /></a>
	</aside>
</div>

<style>
	.projects-page {
		max-width: 1200px;
		margin: auto;
	}
	.page-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 25px;
		margin: 18px 0 33px;
	}
	.page-eyebrow {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 1.7px;
		color: #9c8eb5;
	}
	.page-heading h1 {
		font-size: 32px;
		font-weight: 550;
		letter-spacing: -1.3px;
		line-height: 1.2;
		margin: 13px 0 9px;
	}
	.page-heading p {
		font-size: 13px;
		color: #9c95a9;
	}
	.workspace-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border: 1px solid #ffffff12;
		border-radius: 10px;
		background: #ffffff02;
		margin-bottom: 38px;
	}
	.workspace-stats > div {
		padding: 23px 25px;
		display: flex;
		align-items: center;
		gap: 16px;
		border-right: 1px solid #ffffff10;
	}
	.workspace-stats > div:last-child {
		border: 0;
	}
	.stat-icon {
		display: grid;
		place-items: center;
		color: #ae9bc9;
		background: #a78bfa0a;
		border: 1px solid #a78bfa17;
		border-radius: 9px;
		width: 41px;
		height: 41px;
	}
	.workspace-stats > div > div {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.workspace-stats > div > div > span {
		font-size: 11px;
		color: #9e95ad;
	}
	.workspace-stats strong {
		font-size: 25px;
		font-weight: 500;
		letter-spacing: -0.8px;
		font-variant-numeric: tabular-nums;
	}
	.project-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 18px;
		margin-bottom: 23px;
	}
	.project-toolbar h2 {
		font-size: 15px;
		font-weight: 550;
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.project-toolbar h2 > span {
		border: 1px solid #ffffff15;
		background: #ffffff04;
		color: #a79ab7;
		font-size: 10px;
		padding: 2px 6px;
		border-radius: 4px;
	}
	.toolbar-controls {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.search-field {
		border: 1px solid #ffffff15;
		background: #ffffff03;
		border-radius: 7px;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 11px;
		min-height: 38px;
		color: #887a9b;
	}
	.search-field:focus-within {
		border-color: #ae94e9;
	}
	.search-field input {
		background: none;
		width: 155px;
		color: #ddd5e9;
		font-size: 12px;
		outline: none;
		min-width: 0;
	}
	.search-field input::placeholder {
		color: #a398b0;
	}
	.search-field kbd {
		font: 9px monospace;
		color: #8d809e;
		border: 1px solid #ffffff12;
		border-radius: 4px;
		padding: 3px;
		white-space: nowrap;
	}
	.toolbar-controls select {
		font-size: 11px;
		min-height: 38px;
		background: #17131f;
		color: #b7a9c7;
		border: 1px solid #ffffff15;
		border-radius: 7px;
		padding: 0 10px;
		max-width: 140px;
	}
	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
		gap: 18px;
	}
	.project-card {
		border: 1px solid #ffffff13;
		border-radius: 11px;
		overflow: hidden;
		background: linear-gradient(130deg, #ffffff04, transparent);
		transition:
			transform 0.2s,
			border-color 0.2s,
			background 0.2s;
	}
	.project-card:hover,
	.project-card:focus-within {
		border-color: #b296e649;
		transform: translateY(-3px);
		background: #a78bfa07;
	}
	.card-top {
		display: flex;
		gap: 10px;
		align-items: center;
		padding: 22px 22px 0;
	}
	.project-avatar {
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: #b299e618;
		border: 1px solid #b299e623;
		color: #c1a7ea;
		font: 13px monospace;
		display: grid;
		place-items: center;
	}
	.framework-tag {
		font-size: 9px;
		color: #a89ab7;
		border: 1px solid #ffffff10;
		border-radius: 4px;
		padding: 4px 7px;
	}
	.card-menu {
		margin-left: auto;
		display: grid;
		place-items: center;
		height: 32px;
		width: 32px;
		border-radius: 6px;
		color: #92839f;
		cursor: pointer;
	}
	.card-menu:hover {
		background: #ffffff07;
		color: #d6c3ef;
	}
	.project-link {
		display: flex;
		flex-wrap: wrap;
		gap: 25px;
		padding: 24px 22px 20px;
		align-items: center;
	}
	.project-link > div:first-child {
		flex: 1;
		min-width: 0;
	}
	.project-link h3 {
		font-size: 17px;
		font-weight: 550;
		letter-spacing: -0.35px;
		overflow-wrap: anywhere;
	}
	.project-link p {
		font-size: 11px;
		color: #9888aa;
		margin-top: 7px;
	}
	.project-link > :global(svg) {
		color: #8f7da6;
	}
	.card-counts {
		display: flex;
		gap: 20px;
		border-top: 1px solid #ffffff0b;
		padding-top: 16px;
		width: 100%;
		font-size: 11px;
		color: #afa0c0;
	}
	.card-counts > span {
		display: flex;
		gap: 7px;
		align-items: center;
	}
	.new-project-card {
		height: 100%;
		min-height: 211px;
		width: 100%;
		border: 1px dashed #ffffff17;
		border-radius: 11px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}
	.new-project-card:hover {
		background: #a78bfa05;
		border-color: #a78bfa45;
	}
	.new-project-card > span:first-child {
		display: grid;
		place-items: center;
		height: 35px;
		width: 35px;
		border-radius: 8px;
		background: #a78bfa0a;
		color: #b09cca;
		margin-bottom: 5px;
	}
	.new-project-card strong {
		font-size: 12px;
		color: #b5a6c6;
		font-weight: 500;
	}
	.new-project-card > span:last-child {
		font-size: 10px;
		color: #a092ae;
	}
	.workspace-guide {
		display: flex;
		align-items: center;
		gap: 17px;
		padding: 25px;
		border: 1px solid #a78bfa1a;
		background: linear-gradient(100deg, #a78bfa09, transparent);
		border-radius: 9px;
		margin-top: 35px;
	}
	.guide-icon {
		color: #ad96d4;
	}
	.workspace-guide h3 {
		font-size: 13px;
		font-weight: 550;
	}
	.workspace-guide p {
		font-size: 12px;
		color: #a499b3;
		margin-top: 6px;
	}
	.workspace-guide a {
		margin-left: auto;
		white-space: nowrap;
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 11px;
		color: #c2aedc;
	}
	.workspace-guide a:hover {
		color: #e7d6ff;
	}
	.workspace-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		border: 1px dashed #a78bfa33;
		border-radius: 12px;
		padding: 55px 25px;
		background: radial-gradient(ellipse at 50% 35%, #a78bfa0a, transparent 65%);
	}
	.empty-layers {
		color: #b99de4;
		background: #a78bfa0d;
		border: 1px solid #a78bfa23;
		padding: 18px;
		border-radius: 15px;
		margin-bottom: 25px;
	}
	.workspace-empty h2 {
		font-size: 27px;
		font-weight: 500;
		letter-spacing: -1px;
		margin-top: 14px;
	}
	.workspace-empty p {
		font-size: 13px;
		line-height: 1.9;
		color: #a69bb4;
		margin: 13px 0 25px;
	}
	.workspace-empty > a {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		color: #a997c0;
		margin-top: 20px;
	}
	.search-empty {
		display: flex;
		flex-direction: column;
		gap: 16px;
		align-items: center;
		text-align: center;
		padding: 60px 20px;
		color: #9e8fb1;
		border: 1px dashed #ffffff18;
		border-radius: 12px;
	}
	.search-empty h3 {
		color: #d8cde7;
		font-size: 17px;
	}
	.search-empty p {
		font-size: 12px;
	}
	@media (max-width: 760px) {
		.page-heading {
			align-items: flex-start;
			flex-direction: column;
			margin-top: 8px;
			gap: 20px;
		}
		.page-heading h1 {
			font-size: 29px;
		}
		.workspace-stats > div {
			padding: 18px 14px;
			gap: 10px;
		}
		.stat-icon {
			width: 30px;
			height: 30px;
		}
		.workspace-stats strong {
			font-size: 22px;
		}
		.workspace-stats > div > div > span {
			font-size: 10px;
		}
		.project-toolbar {
			align-items: flex-start;
			flex-direction: column;
		}
		.toolbar-controls {
			width: 100%;
		}
		.search-field {
			flex: 1;
			min-width: 0;
		}
		.search-field input {
			width: 100%;
		}
		.search-field kbd {
			display: none;
		}
		.workspace-guide {
			align-items: flex-start;
			flex-wrap: wrap;
			padding: 22px;
		}
		.workspace-guide > div {
			flex: 1;
		}
		.workspace-guide a {
			margin-left: 39px;
		}
		.workspace-guide p {
			line-height: 1.8;
		}
		.workspace-stats {
			margin-bottom: 28px;
		}
	}
	@media (max-width: 400px) {
		.stat-icon {
			display: none;
		}
		.workspace-stats > div {
			padding: 17px;
		}
		.toolbar-controls select {
			max-width: 115px;
		}
		.workspace-empty {
			padding: 40px 20px;
		}
		.workspace-empty h2 {
			font-size: 23px;
		}
	}
</style>
