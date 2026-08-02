<script>
	import { preloadData } from "$app/navigation";
	import { dashboard } from "$lib/stores/dashboard.svelte.js";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";

	import Plus from "@lucide/svelte/icons/plus";
	import Search from "@lucide/svelte/icons/search";
	import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
	import Settings from "@lucide/svelte/icons/settings";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import PackagePlus from "@lucide/svelte/icons/package-plus";

	// This page only owns the grid content now — the "workspace" view moved
	// to dashboard/[project]/+page.svelte, and the Add/Delete modals moved
	// to +layout.svelte (both are reachable from more than just this page
	// now). `data.projects` comes from dashboard/+layout.server.js.
	let { data } = $props();

	// Effects don't run during SSR, so relying on $effect alone means the
	// server renders the store's initial empty array — real projects only
	// appear after the client hydrates and the effect fires. That's the
	// "empty state flashes before my projects show up" bug. This direct
	// call runs during the normal top-to-bottom script evaluation (both on
	// the server and on the client's first pass), so the very first render
	// already has the real data.
	dashboard.setProjects(data.projects);

	// Effect still needed for subsequent updates — e.g. after a form action
	// triggers SvelteKit's default invalidateAll() and `data` changes on an
	// already-mounted component, where a plain top-level statement wouldn't
	// re-run.
	$effect(() => {
		dashboard.setProjects(data.projects);
	});

	function formatDate(iso) {
		if (!iso) return "—";
		return new Date(iso).toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	}

	// Sums the per-project key/user counts (already fetched for the cards)
	// into totals for the stats strip — no extra request, just addition
	// over data that's already on the page.
	function aggregateCounts(counts) {
		let keys = 0;
		let users = 0;
		for (const p of dashboard.projects) {
			const c = counts[p.id];
			if (c) {
				keys += c.keyCount;
				users += c.userCount;
			}
		}
		return { keys, users };
	}

	// --- Search ---------------------------------------------------------------
	let searchQuery = $state("");
	let searchInputEl = $state(null);
	let filteredProjects = $derived(
		searchQuery.trim()
			? dashboard.projects.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
			: dashboard.projects
	);

	// Cmd+K (Mac) / Ctrl+K (Windows/Linux) jumps straight to the search
	// input from anywhere on this page. The label shown in the input
	// itself is resolved client-side only (navigator isn't available
	// during SSR).
	let shortcutLabel = $state("Ctrl K");
	$effect(() => {
		if (navigator.platform.toUpperCase().includes("MAC")) shortcutLabel = "⌘K";
	});

	function handleGlobalKeydown(e) {
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
			e.preventDefault();
			searchInputEl?.focus();
		}
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<!-- The sidebar, Sidebar.Provider, Sidebar.Trigger, the breadcrumb, and the
     Add/Delete Project dialogs are all provided by +layout.svelte — don't
     repeat them here. -->

<div class="w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8">
	<!-- Stats strip — Total Projects is free (array length), API Keys /
	     Users are summed client-side from the same per-project counts
	     already fetched for the card metadata below. No new requests, and
	     nothing here is a number we can't actually back with real data
	     (no MAU/request-rate/error-rate — that would need session and
	     request tracking that doesn't exist in this system yet). -->
	{#if dashboard.projects.length > 0}
		<div class="grid grid-cols-3 gap-3 mb-6">
			<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
				<p class="text-xs text-zinc-500">Total Projects</p>
				<p class="text-2xl font-semibold text-zinc-100 mt-1">{dashboard.projects.length}</p>
			</div>
			<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
				<p class="text-xs text-zinc-500">API Keys</p>
				<p class="text-2xl font-semibold text-zinc-100 mt-1">
					{#await data.counts}
						<span class="text-zinc-600">···</span>
					{:then counts}
						{aggregateCounts(counts).keys}
					{/await}
				</p>
			</div>
			<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
				<p class="text-xs text-zinc-500">Total Users</p>
				<p class="text-2xl font-semibold text-zinc-100 mt-1">
					{#await data.counts}
						<span class="text-zinc-600">···</span>
					{:then counts}
						{aggregateCounts(counts).users}
					{/await}
				</p>
			</div>
		</div>
	{/if}

	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
		<div class="flex items-center gap-2 sm:ml-auto">
			<div class="relative flex-1 sm:flex-none">
				<Search class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
				<Input
					type="search"
					placeholder="Search projects..."
					bind:value={searchQuery}
					bind:ref={searchInputEl}
					class="pl-8 pr-12 w-full sm:w-56 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
				/>
				<kbd
					class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500"
				>
					{shortcutLabel}
				</kbd>
			</div>

			<Button
				class="bg-violet-600 hover:bg-violet-400 text-white hover:text-white gap-1.5"
				variant="ghost"
				onclick={() => dashboard.openAddDialog()}
			>
				<Plus class="h-4 w-4" />
				Add Project
			</Button>
		</div>
	</div>

	<!-- Empty state -->
	{#if dashboard.projects.length === 0}
		<div class="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-16 sm:py-20 flex flex-col items-center text-center">
			<div class="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
				<PackagePlus class="h-6 w-6 text-violet-400" />
			</div>
			<h2 class="text-base sm:text-lg font-semibold text-zinc-100">No projects yet</h2>
			<p class="text-sm text-zinc-500 mt-1.5 max-w-xs">
				Create your first project to start issuing API keys and managing users.
			</p>
			<Button
				class="mt-6 gap-1.5 border border-zinc-800 bg-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100"
				variant="ghost"
				onclick={() => dashboard.openAddDialog()}
			>
				<Plus class="h-4 w-4" />
				Add Project
			</Button>
		</div>
	{:else if filteredProjects.length === 0}
		<!-- No search results -->
		<div class="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-16 flex flex-col items-center text-center">
			<Search class="h-6 w-6 text-zinc-600 mb-3" />
			<h2 class="text-sm font-medium text-zinc-300">No projects match "{searchQuery}"</h2>
			<Button
				class="mt-4 text-zinc-400 hover:text-zinc-100"
				variant="ghost"
				size="sm"
				onclick={() => (searchQuery = "")}
			>
				Clear search
			</Button>
		</div>
	{:else}
		<!-- "My Projects" card grid — folder metaphor, mirroring 2.html:
		     a back shell with a tab (now showing the framework, instead of
		     being purely decorative), two "papers" that peek out further on
		     hover, and a front sleeve holding the name/meta + options menu.
		     Recolored to this app's own dark zinc + violet tokens instead of
		     2.html's green — same shapes and motion, our palette. -->
		<ul class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
			{#each filteredProjects as project (project.id)}
				<li class="folder-card group">
					<!-- Back shell + tab (decorative) -->
					<div class="folder-back" aria-hidden="true">
						<div class="folder-tab">
							<span class="folder-tab-label">
								{project.framework === "nextjs" ? "Next.js" : project.framework || "Project"}
							</span>
						</div>
					</div>

					<!-- Papers peeking out (decorative) -->
					<div class="folder-papers" aria-hidden="true">
						<div class="paper paper-1"></div>
						<div class="paper paper-2"></div>
					</div>

					<!-- Front sleeve -->
					<div class="folder-front">
						<a
							href={`/dashboard/${project.id}`}
							onmouseenter={() => preloadData(`/dashboard/${project.id}`)}
							onfocus={() => preloadData(`/dashboard/${project.id}`)}
							class="folder-info"
						>
							<h3 class="folder-title">{project.name}</h3>
							<span class="folder-meta">
								{formatDate(project.created_at)}
								{#await data.counts}
									<span class="text-zinc-600">· loading…</span>
								{:then counts}
									{@const stats = counts[project.id] ?? { keyCount: 0, userCount: 0 }}
									· {stats.keyCount}
									{stats.keyCount === 1 ? "key" : "keys"} · {stats.userCount}
									{stats.userCount === 1 ? "user" : "users"}
								{/await}
							</span>
						</a>

						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<button {...props} type="button" class="menu-btn" aria-label="Project options">
										<EllipsisVertical class="h-4 w-4" />
									</button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" class="bg-zinc-900 border-zinc-800 text-zinc-100">
								<DropdownMenu.Item
									class="gap-2 focus:bg-zinc-800 focus:text-zinc-100"
									onclick={() => dashboard.openProjectSettings(project)}
								>
									<Settings class="h-4 w-4" />
									Project settings
								</DropdownMenu.Item>
								<DropdownMenu.Separator class="bg-zinc-800" />
								<DropdownMenu.Item
									class="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
									onclick={() => dashboard.requestDelete(project)}
								>
									<Trash2 class="h-4 w-4" />
									Delete project
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</li>
			{/each}

			{#if !searchQuery.trim()}
				<!-- Dashed "add" tile, styled to sit in the grid as another card
				     slot rather than leaving a hard stop after the last real
				     project. Hidden while actively searching so it doesn't read
				     as a stray result. -->
				<li>
					<button
						type="button"
						onclick={() => dashboard.openAddDialog()}
						class="group flex h-[210px] w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors"
					>
						<div
							class="h-10 w-10 rounded-xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-center group-hover:border-violet-500/40 group-hover:bg-violet-500/10 transition-colors"
						>
							<Plus class="h-5 w-5 text-zinc-500 group-hover:text-violet-400 transition-colors" />
						</div>
						<span class="text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">
							New project
						</span>
					</button>
				</li>
			{/if}
		</ul>
	{/if}
</div>

<style>
	/* Folder card — same three-piece structure as 2.html (back shell + tab,
	   peeking papers, front sleeve), just recolored to this app's own dark
	   zinc + violet tokens instead of 2.html's green/white. Card itself
	   carries the hover lift; the papers get an extra shift on top of that,
	   same as 2.html. */
	.folder-card {
		position: relative;
		height: 210px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		border-radius: 16px;
		transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.folder-card:hover {
		transform: translateY(-4px);
	}

	/* Back shell */
	.folder-back {
		position: absolute;
		inset: 0;
		background: #27272a; /* zinc-800 */
		border: 1px solid #3f3f46; /* zinc-700 */
		border-radius: 16px;
	}

	/* Tab — carries the framework name instead of being purely decorative */
	.folder-tab {
		position: absolute;
		top: -10px;
		left: 14px;
		max-width: calc(100% - 28px);
		height: 24px;
		display: flex;
		align-items: center;
		padding: 0 12px;
		background: #27272a;
		border: 1px solid #3f3f46;
		border-bottom: none;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}
	.folder-tab-label {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #a1a1aa; /* zinc-400 */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Papers peeking out */
	.folder-papers {
		position: absolute;
		top: 16px;
		left: 14px;
		right: 14px;
		height: 78px;
		z-index: 1;
	}
	.paper {
		position: absolute;
		bottom: 0;
		border-radius: 8px 8px 0 0;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.35);
		transition: transform 0.25s ease;
	}
	.paper-1 {
		left: 4px;
		width: 68%;
		height: 60px;
		transform: rotate(-3deg);
		opacity: 0.85;
		background: #3f3f46; /* zinc-700 */
	}
	.paper-2 {
		right: 4px;
		width: 78%;
		height: 70px;
		transform: rotate(2deg);
		/* subtle violet tint at the top edge only — a hint of brand color
		   on the "inside" of the folder without dyeing the whole card */
		background: linear-gradient(165deg, #4c1d95 0%, #3f3f46 45%);
	}
	.folder-card:hover .paper-1 {
		transform: rotate(-6deg) translateY(-4px);
	}
	.folder-card:hover .paper-2 {
		transform: rotate(4deg) translateY(-6px);
	}

	/* Front sleeve */
	.folder-front {
		position: relative;
		z-index: 2;
		min-height: 104px;
		background: linear-gradient(180deg, #18181b 0%, #09090b 100%);
		border: 1px solid #27272a;
		border-radius: 14px;
		padding: 14px 16px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 12px;
		box-shadow:
			0 -4px 14px rgba(0, 0, 0, 0.25),
			0 8px 18px rgba(0, 0, 0, 0.3);
	}

	.folder-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		text-decoration: none;
		border-radius: 6px;
	}
	.folder-info:focus-visible {
		outline: 2px solid #8b5cf6;
		outline-offset: 3px;
	}
	.folder-title {
		margin: 0;
		color: #f4f4f5; /* zinc-100 */
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.folder-meta {
		color: #c4b5fd; /* violet-300 */
		font-size: 0.75rem;
		font-weight: 500;
	}

	.menu-btn {
		flex-shrink: 0;
		background: rgba(255, 255, 255, 0.06);
		border: none;
		color: #f4f4f5;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.2s;
	}
	.menu-btn:hover {
		background: rgba(255, 255, 255, 0.14);
	}
	.menu-btn:focus-visible {
		outline: 2px solid #8b5cf6;
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.folder-card,
		.paper {
			transition: none;
		}
	}
</style>