<script>
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { getDashboard } from '$lib/stores/dashboard.svelte.js';
	const dashboard = getDashboard();

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import Trash2 from '@lucide/svelte/icons/trash-2';

	let { data, form } = $props();

	let name = $state('');
	let isSaving = $state(false);

	// Keep the field in sync if the project data refreshes underneath us
	// (e.g. after a successful rename triggers invalidateAll()).
	$effect(() => {
		name = data.project.name;
	});

	function submitRename() {
		isSaving = true;
		return async ({ result, update }) => {
			isSaving = false;
			if (result.type === 'success' && result.data?.name) {
				toast.success('Project renamed');
				// Update the project label immediately while refreshed data loads.
				dashboard.projects = dashboard.projects.map((p) =>
					p.id === result.data.id ? { ...p, name: result.data.name } : p
				);
			} else if (result.type === 'failure') {
				toast.error(result.data?.error || 'Could not rename project.');
			}
			await update({ reset: false });
		};
	}

	function formatDate(iso) {
		if (!iso) return '—';
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head><title>Project settings — {data.project.name} — First Layer</title></svelte:head>

<div class="space-y-6 max-w-2xl">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-medium tracking-tight text-zinc-100">Project Settings</h1>
		<p class="text-sm text-zinc-400">Manage this project's details, or remove it entirely.</p>
	</div>

	<!-- Project details -->
	<div class="rounded-xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-sm space-y-5">
		<form method="POST" action="?/rename" use:enhance={submitRename} class="space-y-2">
			<Label for="project-name" class="text-sm font-medium text-zinc-300">Project name</Label>
			<div class="flex gap-2">
				<Input
					id="project-name"
					name="name"
					bind:value={name}
					required
					class="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-violet-500"
				/>
				<Button
					type="submit"
					disabled={isSaving || !name.trim() || name.trim() === data.project.name}
					class="bg-[#bba3f1] hover:bg-[#ccb6ff] text-[#21172d] shrink-0"
				>
					{isSaving ? 'Saving...' : 'Save'}
				</Button>
			</div>
		</form>

		<div class="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800/60 text-sm">
			<div>
				<p class="text-xs uppercase tracking-wide text-zinc-500 mb-1">Project ID</p>
				<p class="font-mono text-zinc-300 truncate" title={data.project.id}>
					{data.project.id}
				</p>
			</div>
			<div>
				<p class="text-xs uppercase tracking-wide text-zinc-500 mb-1">Created</p>
				<p class="text-zinc-300">{formatDate(data.project.created_at)}</p>
			</div>
			{#if data.project.framework}
				<div>
					<p class="text-xs uppercase tracking-wide text-zinc-500 mb-1">Framework</p>
					<p class="text-zinc-300 capitalize">{data.project.framework}</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Danger zone -->
	<div class="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-6 shadow-sm">
		<h2 class="text-sm font-semibold text-red-400 mb-1">Danger zone</h2>
		<p class="text-xs text-zinc-500 mb-4">Deleting a project is permanent and can't be undone.</p>
		<Button
			variant="outline"
			class="gap-2 border-red-500/30 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
			onclick={() => dashboard.requestDelete(data.project)}
		>
			<Trash2 class="h-4 w-4" />
			Delete project
		</Button>
	</div>
</div>
