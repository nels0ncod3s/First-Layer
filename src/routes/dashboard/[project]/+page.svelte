<script>
	import { goto, preloadData } from "$app/navigation";
	import { dashboard } from "$lib/stores/dashboard.svelte.js";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	import ArrowLeft from "@lucide/svelte/icons/arrow-left";
	import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
	import Settings from "@lucide/svelte/icons/settings";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import Users from "@lucide/svelte/icons/users";
	import Monitor from "@lucide/svelte/icons/monitor";
	import ShieldCheck from "@lucide/svelte/icons/shield-check";
	import UserPlus from "@lucide/svelte/icons/user-plus";
	import KeyRound from "@lucide/svelte/icons/key-round";
	import Github from "$lib/Icons/github-mark.svelte";
	import Google from "$lib/Icons/google.svelte";

	// `data.project` is inherited from dashboard/[project]/+layout.server.js.
	// `data.stats` (userCount/signupsToday) is a streamed promise from this
	// route's own +page.server.js — the cards render a loading state until
	// it resolves, rather than blocking the whole navigation on it. Active
	// Sessions / Verification Rate stay "—" — there's no session tracking or
	// email verification in this system yet, so a real "0" there would
	// misleadingly imply we're measuring it.
	let { data } = $props();

	function buildStats(stats) {
		return [
			{ label: "Total Users", value: String(stats.userCount), icon: Users },
			{ label: "Signups Today", value: String(stats.signupsToday), icon: UserPlus },
			{ label: "Active Sessions", value: "—", icon: Monitor },
			{ label: "Verification Rate", value: "—", icon: ShieldCheck }
		];
	}

	const placeholderStats = [
		{ label: "Total Users", value: "…", icon: Users },
		{ label: "Signups Today", value: "…", icon: UserPlus },
		{ label: "Active Sessions", value: "—", icon: Monitor },
		{ label: "Verification Rate", value: "—", icon: ShieldCheck }
	];

	const quickActions = [
		{
			label: "Create API key",
			icon: KeyRound,
			disabled: false,
			onclick: () => goto(`/dashboard/${data.project.id}/API`),
			onmouseenter: () => preloadData(`/dashboard/${data.project.id}/API`)
		},
		{ label: "Configure Google", icon: Google, disabled: true },
		{ label: "Configure GitHub", icon: Github, disabled: true },
		{ label: "Invite teammate", icon: UserPlus, disabled: true }
	];
</script>

<div class="w-full pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8">
	<div class="flex items-center justify-between mb-6">
		<button
			class="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
			onclick={() => goto("/dashboard")}
		>
			<ArrowLeft class="h-3.5 w-3.5" />
			All projects
		</button>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						size="icon"
						class="h-8 w-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
						aria-label="Project options"
					>
						<EllipsisVertical class="h-4 w-4" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="bg-zinc-900 border-zinc-800 text-zinc-100">
				<DropdownMenu.Item
					class="gap-2 focus:bg-zinc-800 focus:text-zinc-100"
					onclick={() => goto(`/dashboard/${data.project.id}/Settings`)}
				>
					<Settings class="h-4 w-4" />
					Project settings
				</DropdownMenu.Item>
				<DropdownMenu.Separator class="bg-zinc-800" />
				<DropdownMenu.Item
					class="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
					onclick={() => dashboard.requestDelete(data.project)}
				>
					<Trash2 class="h-4 w-4" />
					Delete project
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<div class="space-y-6">
		<div>
			<h2 class="text-base font-semibold text-zinc-100">{data.project.name}</h2>
			<p class="text-sm text-zinc-500 mt-1">What's happening across {data.project.name} today.</p>
		</div>

		<!-- Stat cards -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
			{#await data.stats}
				{#each placeholderStats as stat (stat.label)}
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 animate-pulse">
						<div class="flex items-start justify-between gap-2">
							<span class="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-zinc-500 leading-tight">{stat.label}</span>
							<div class="h-7 w-7 shrink-0 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
								<stat.icon class="h-3.5 w-3.5 text-violet-400" />
							</div>
						</div>
						<div class="mt-3">
							<span class="text-2xl sm:text-3xl font-bold text-zinc-100">{stat.value}</span>
						</div>
					</div>
				{/each}
			{:then stats}
				{#each buildStats(stats) as stat (stat.label)}
					<div class="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
						<div class="flex items-start justify-between gap-2">
							<span class="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-zinc-500 leading-tight">{stat.label}</span>
							<div class="h-7 w-7 shrink-0 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
								<stat.icon class="h-3.5 w-3.5 text-violet-400" />
							</div>
						</div>
						<div class="mt-3">
							<span class="text-2xl sm:text-3xl font-bold text-zinc-100">{stat.value}</span>
						</div>
					</div>
				{/each}
			{/await}
		</div>

		<!-- Quick actions -->
		<div>
			<h3 class="text-sm font-semibold text-zinc-300 mb-3">Quick actions</h3>
			<div class="grid sm:grid-cols-2 gap-2.5">
				{#each quickActions as action (action.label)}
					<button
						type="button"
						disabled={action.disabled}
						onclick={action.onclick}
						onmouseenter={action.onmouseenter}
						class="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-left text-sm font-medium text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors disabled:opacity-40 disabled:pointer-events-none"
					>
						<action.icon class="h-4 w-4 text-zinc-400 shrink-0" />
						{action.label}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
