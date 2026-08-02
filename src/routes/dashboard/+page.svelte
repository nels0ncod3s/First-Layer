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
	import FolderKanban from "@lucide/svelte/icons/folder-pen";

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
		<!-- "My Projects" card grid — each card is one connected folder
		     silhouette (clip-path, not a separate floating tab piece), with
		     a lighter "inside" panel behind it that becomes visible as the
		     front cover recedes slightly on hover — closed at rest, open
		     on hover. -->
		<ul class="grid gap-5 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
			{#each filteredProjects as project (project.id)}
				<li class="group relative min-h-[168px] overflow-hidden rounded-[14px]">
					<div class="folder-body" aria-hidden="true"></div>
					<svg class="folder-corner" viewBox="1 2 13 9" aria-hidden="true">
						<path
							d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
						/>
					</svg>

					<div class="relative z-10 px-6 pb-6 pt-9 min-h-[168px] flex flex-col justify-between">
						<a
							href={`/dashboard/${project.id}`}
							onmouseenter={() => preloadData(`/dashboard/${project.id}`)}
							onfocus={() => preloadData(`/dashboard/${project.id}`)}
							class="flex items-start gap-4 w-full text-left pr-8"
						>
							<div class="h-12 w-12 shrink-0 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
								<FolderKanban class="h-6 w-6 text-violet-400" />
							</div>
							<div class="min-w-0 pt-1">
								<p class="font-semibold text-lg text-zinc-100 truncate">{project.name}</p>
								{#if project.framework}
									<span
										class="inline-block mt-1.5 rounded-full border border-zinc-700 bg-zinc-800/60 px-2 py-0.5 text-[11px] font-medium text-zinc-400 capitalize"
									>
										{project.framework === "nextjs" ? "Next.js" : project.framework}
									</span>
								{/if}
							</div>
						</a>

						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button
										{...props}
										variant="ghost"
										size="icon"
										class="absolute top-4 right-4 h-8 w-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
										aria-label="Project options"
									>
										<EllipsisVertical class="h-4 w-4" />
									</Button>
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

						<p class="text-xs text-zinc-500">
							{formatDate(project.created_at)}
							{#await data.counts}
								<span class="text-zinc-600">· loading…</span>
							{:then counts}
								{@const stats = counts[project.id] ?? { keyCount: 0, userCount: 0 }}
								· {stats.keyCount}
								{stats.keyCount === 1 ? "key" : "keys"} · {stats.userCount}
								{stats.userCount === 1 ? "user" : "users"}
							{/await}
						</p>
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
						class="group flex min-h-[168px] w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 transition-colors"
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
	/* Folder card, built from two pieces instead of one stretched shape —
	   stretching the whole icon path with preserveAspectRatio="none" across
	   a ~2:1 card warped the curves and corners non-uniformly (icon is
	   natively ~1.16:1). Splitting it avoids that entirely:
	   - .folder-corner draws only the tab + notch, cropped tightly out of
	     Lucide's own "folder" path and rendered at its true, undistorted
	     aspect ratio (uniform px-per-unit on both axes) — never stretched.
	   - .folder-body is a plain div using normal border-radius for the
	     other three corners, which CSS always renders perfectly circular
	     regardless of the card's actual width. Its top-left corner is
	     square and sits underneath .folder-corner, which supplies the real
	     (rounded) top-left corner instead.
	   Both pieces share the exact same fill/border so the seam where they
	   meet is invisible. Static — no hover state. */
	.folder-corner {
		position: absolute;
		top: -7.5px;
		left: -7.5px;
		width: 97.5px;
		height: 67.5px;
		overflow: hidden;
		z-index: 1;
	}
	.folder-corner path {
		fill: #17171a;
		stroke: #27272a;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.folder-body {
		position: absolute;
		top: 22.5px;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 0 14px 14px 14px;
		background: #17171a;
		border: 1px solid #27272a;
	}
</style>