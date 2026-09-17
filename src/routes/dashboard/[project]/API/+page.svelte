<script>
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Empty from '$lib/components/ui/empty/index.js';

	import KeyRound from '@lucide/svelte/icons/key-round';
	import Plus from '@lucide/svelte/icons/plus';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { data, form } = $props();

	let createOpen = $state(false);
	let newKeyName = $state('');
	let isCreating = $state(false);

	let revokeTarget = $state(null);
	let isRevoking = $state(false);

	let copied = $state(false);
	let copyTimer;
	onDestroy(() => clearTimeout(copyTimer));

	function closeCreateDialog() {
		createOpen = false;
		newKeyName = '';
	}

	function handleCreateOpenChange(open) {
		if (open) {
			createOpen = true;
		} else {
			closeCreateDialog();
		}
	}

	async function copyKey() {
		if (!form?.apiKey) return;
		try {
			await navigator.clipboard.writeText(form.apiKey);
			copied = true;
			toast.success('Copied to clipboard');
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 2000);
		} catch {
			copied = false;
			toast.error('Could not copy. Select the key and copy it manually.');
		}
	}

	function submitCreate() {
		isCreating = true;
		return async ({ result, update }) => {
			isCreating = false;
			if (result.type === 'success' && result.data?.apiKey) {
				toast.success("API key created — copy it now, you won't see it again.");
				closeCreateDialog();
			} else if (result.type === 'failure') {
				toast.error(result.data?.error || 'Could not create API key.');
			}
			await update();
		};
	}

	function submitRevoke() {
		isRevoking = true;
		return async ({ result, update }) => {
			isRevoking = false;
			if (result.type === 'success') {
				toast.success('API key revoked');
				revokeTarget = null;
			} else if (result.type === 'failure') {
				toast.error(result.data?.error || 'Could not revoke API key.');
			}
			await update();
		};
	}

	function formatDate(iso) {
		if (!iso) return '';
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head><title>API keys — {data.project.name} — First Layer</title></svelte:head>

<div class="max-w-3xl space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-medium tracking-tight text-zinc-100">API Keys</h1>
			<p class="text-zinc-400 text-sm mt-1">
				Generate keys to authenticate requests to the First Layer API from your app.
			</p>
		</div>
		<Button
			class="bg-[#bba3f1] hover:bg-[#ccb6ff] text-[#21172d] gap-1.5 shrink-0"
			onclick={() => (createOpen = true)}
		>
			<Plus class="h-4 w-4" />
			Create key
		</Button>
	</div>

	{#if form?.apiKey}
		<div class="rounded-xl border border-violet-500/30 bg-violet-500/5 p-5 space-y-3">
			<div class="flex items-center gap-2 text-sm font-semibold text-violet-300">
				<KeyRound class="h-4 w-4" />
				Save this key now — you won't be able to see it again
			</div>
			<div class="flex gap-2">
				<code
					class="flex-1 rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-sm font-mono text-zinc-100 overflow-x-auto"
					>{form.apiKey}</code
				>
				<Button
					variant="outline"
					class="border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-800 shrink-0 gap-1.5"
					onclick={copyKey}
				>
					{#if copied}
						<Check class="h-4 w-4" />
						Copied
					{:else}
						<Copy class="h-4 w-4" />
						Copy
					{/if}
				</Button>
			</div>
		</div>
	{/if}

	{#await data.keys}
		<div
			class="rounded-2xl border border-zinc-800 bg-zinc-900/30 py-16 flex items-center justify-center"
		>
			<LoaderCircle class="h-5 w-5 text-zinc-600 animate-spin" />
		</div>
	{:then keys}
		{#if keys.length === 0}
			<Empty.Root class="border border-dashed border-zinc-800 bg-zinc-900/30 rounded-2xl py-16">
				<Empty.Header>
					<Empty.Media
						variant="icon"
						class="bg-violet-500/10 border border-violet-500/20 text-violet-400"
					>
						<KeyRound class="h-5 w-5" />
					</Empty.Media>
					<Empty.Title class="text-zinc-100">No API keys yet</Empty.Title>
					<Empty.Description class="text-zinc-500">
						Create a key to start calling the First Layer API from your app.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button
						class="bg-[#bba3f1] hover:bg-[#ccb6ff] text-[#21172d] gap-1.5"
						onclick={() => (createOpen = true)}
					>
						<Plus class="h-4 w-4" />
						Create key
					</Button>
				</Empty.Content>
			</Empty.Root>
		{:else}
			<ul class="rounded-xl border border-zinc-800 bg-[#0c0c0e] divide-y divide-zinc-800/50">
				{#each keys as key (key.id)}
					<li class="flex items-center justify-between gap-4 px-5 py-4">
						<div class="min-w-0">
							<div class="flex flex-wrap items-center gap-2">
								<span class="text-sm font-medium text-zinc-100 truncate">{key.name}</span>
								{#if key.is_active}
									<Badge variant="outline" class="border-emerald-500/30 text-emerald-400"
										>Active</Badge
									>
								{:else}
									<Badge variant="outline" class="border-zinc-700 text-zinc-500">Revoked</Badge>
								{/if}
							</div>
							<p class="text-xs font-mono text-zinc-500 mt-1 truncate">
								{key.key_hint}
							</p>
							<p class="text-xs text-zinc-600 mt-0.5">
								Created {formatDate(key.created_at)}
							</p>
						</div>
						{#if key.is_active}
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
								aria-label="Revoke key"
								onclick={() => (revokeTarget = key)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	{/await}
</div>

<!-- Create key dialog -->
<Dialog.Root open={createOpen} onOpenChange={handleCreateOpenChange}>
	<Dialog.Content class="sm:max-w-md bg-zinc-950 border border-zinc-800 text-zinc-100">
		<Dialog.Header>
			<Dialog.Title class="text-zinc-100">Create a new API key</Dialog.Title>
			<Dialog.Description class="text-zinc-400">
				Give it a name so you can tell keys apart later — e.g. "Production" or "Local dev".
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="?/createKey" use:enhance={submitCreate} class="grid gap-4 pt-2">
			<div class="grid gap-2">
				<Label for="key-name" class="text-zinc-300">Key name</Label>
				<Input
					id="key-name"
					name="name"
					placeholder="Production"
					bind:value={newKeyName}
					autofocus
					class="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500"
				/>
			</div>

			<Dialog.Footer class="mt-2 bg-zinc-950 border-zinc-800/60">
				<Button
					type="button"
					variant="outline"
					class="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
					onclick={closeCreateDialog}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isCreating}
					class="bg-[#bba3f1] hover:bg-[#ccb6ff] text-[#21172d]"
				>
					{isCreating ? 'Creating...' : 'Create key'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Revoke confirmation -->
<Dialog.Root open={revokeTarget !== null} onOpenChange={(open) => !open && (revokeTarget = null)}>
	<Dialog.Content class="sm:max-w-sm bg-zinc-950 border border-zinc-800 text-zinc-100">
		<Dialog.Header>
			<Dialog.Title class="text-zinc-100">Revoke API key</Dialog.Title>
			<Dialog.Description class="text-zinc-400">
				"{revokeTarget?.name}" will stop working immediately. This can't be undone.
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="?/revokeKey" use:enhance={submitRevoke} class="contents">
			<input type="hidden" name="keyId" value={revokeTarget?.id ?? ''} />

			<Dialog.Footer class="mt-2 bg-zinc-950 border-zinc-800/60">
				<Button
					type="button"
					variant="outline"
					class="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
					onclick={() => (revokeTarget = null)}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isRevoking} class="bg-red-600 hover:bg-red-500 text-white">
					{isRevoking ? 'Revoking...' : 'Revoke'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
