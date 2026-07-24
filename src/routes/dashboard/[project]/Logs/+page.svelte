<script>
	import * as Empty from '$lib/components/ui/empty/index.js';
	import Files from '@lucide/svelte/icons/files';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import KeyRound from '@lucide/svelte/icons/key-round';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { data } = $props();

	function formatTimestamp(iso) {
		return new Date(iso).toLocaleString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-100">Activity Logs</h1>
		<p class="text-sm text-zinc-400">A feed of user signups and API key activity on this project.</p>
	</div>

	{#await data.events}
		<div class="rounded-2xl border border-zinc-800 bg-zinc-900/30 py-16 flex items-center justify-center">
			<LoaderCircle class="h-5 w-5 text-zinc-600 animate-spin" />
		</div>
	{:then events}
		{#if events.length === 0}
			<Empty.Root class="border border-dashed border-zinc-800 bg-zinc-900/30 rounded-2xl py-16">
				<Empty.Header>
					<Empty.Media variant="icon" class="bg-violet-500/10 border border-violet-500/20 text-violet-400">
						<Files class="h-5 w-5" />
					</Empty.Media>
					<Empty.Title class="text-zinc-100">No activity yet</Empty.Title>
					<Empty.Description class="text-zinc-500">
						Events will appear here once your API starts receiving requests.
					</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		{:else}
			<div class="rounded-xl border border-zinc-800 bg-[#0c0c0e] p-2 shadow-sm">
				<div class="divide-y divide-zinc-800/50">
					{#each events as event, i (event.type + event.timestamp + i)}
						<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 text-xs">
							<span class="text-zinc-500 whitespace-nowrap font-mono">{formatTimestamp(event.timestamp)}</span>

							<div class="h-6 w-6 shrink-0 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
								{#if event.type === 'user_created'}
									<UserPlus class="h-3.5 w-3.5 text-violet-400" />
								{:else}
									<KeyRound class="h-3.5 w-3.5 text-violet-400" />
								{/if}
							</div>

							<span class="text-zinc-200 font-medium flex-1">{event.title}</span>

							{#if event.status === 'revoked'}
								<span class="inline-flex items-center rounded-md bg-zinc-800 px-1.5 py-0.5 text-3xs font-semibold text-zinc-500 uppercase tracking-wide">Revoked</span>
							{/if}

							<span class="text-zinc-500 sm:text-right font-mono">{event.detail}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/await}
</div>
