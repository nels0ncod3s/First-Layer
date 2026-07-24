<script>
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	import * as Empty from '$lib/components/ui/empty/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import Users from '@lucide/svelte/icons/users';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Ban from '@lucide/svelte/icons/ban';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	let { data } = $props();

	let deleteTarget = $state(null);
	let isDeleting = $state(false);

	function formatDate(iso) {
		if (!iso) return '—';
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function submitDelete() {
		isDeleting = true;
		return async ({ result, update }) => {
			isDeleting = false;
			if (result.type === 'success' && result.data?.deleted) {
				toast.success('User deleted');
				deleteTarget = null;
			} else if (result.type === 'failure') {
				toast.error(result.data?.error || 'Could not delete user.');
			}
			await update();
		};
	}

	function submitToggleBlock(user) {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				toast.success(user.is_blocked ? 'User unblocked' : 'User blocked');
			} else if (result.type === 'failure') {
				toast.error(result.data?.error || 'Could not update user.');
			}
			await update();
		};
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-zinc-100">Users</h1>
		<p class="text-sm text-zinc-400">
			End-users created in this project via the API — real accounts, not team members.
		</p>
	</div>

	{#await data.users}
		<div class="rounded-2xl border border-zinc-800 bg-zinc-900/30 py-16 flex items-center justify-center">
			<LoaderCircle class="h-5 w-5 text-zinc-600 animate-spin" />
		</div>
	{:then users}
		{#if users.length === 0}
			<Empty.Root class="border border-dashed border-zinc-800 bg-zinc-900/30 rounded-2xl py-16">
				<Empty.Header>
					<Empty.Media variant="icon" class="bg-violet-500/10 border border-violet-500/20 text-violet-400">
						<Users class="h-5 w-5" />
					</Empty.Media>
					<Empty.Title class="text-zinc-100">No users yet</Empty.Title>
					<Empty.Description class="text-zinc-500">
						Users will show up here as soon as your app calls <code class="text-zinc-400">POST /v1/auth/signup</code> with a project API key.
					</Empty.Description>
				</Empty.Header>
			</Empty.Root>
		{:else}
			<!-- Table Container -->
			<div class="overflow-hidden rounded-xl border border-zinc-800 bg-[#0c0c0e] shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm text-zinc-300">
						<thead class="border-b border-zinc-800 bg-[#0e0e11] text-xs font-semibold uppercase tracking-wider text-zinc-500">
							<tr>
								<th class="px-6 py-4">Email</th>
								<th class="px-6 py-4">User ID</th>
								<th class="px-6 py-4">Created</th>
								<th class="px-6 py-4">Status</th>
								<th class="px-6 py-4"><span class="sr-only">Actions</span></th>
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-800/50">
							{#each users as user (user.id)}
								<tr class="hover:bg-zinc-900/30 transition-colors">
									<td class="whitespace-nowrap px-6 py-4 font-medium text-zinc-100">{user.email}</td>
									<td class="whitespace-nowrap px-6 py-4 font-mono text-xs text-zinc-500">{user.id}</td>
									<td class="whitespace-nowrap px-6 py-4 text-zinc-400">{formatDate(user.created_at)}</td>
									<td class="whitespace-nowrap px-6 py-4">
										{#if user.is_blocked}
											<Badge variant="outline" class="border-red-500/30 text-red-400">Blocked</Badge>
										{:else}
											<Badge variant="outline" class="border-emerald-500/30 text-emerald-400">Active</Badge>
										{/if}
									</td>
									<td class="whitespace-nowrap px-6 py-4 text-right">
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												{#snippet child({ props })}
													<Button
														{...props}
														variant="ghost"
														size="icon"
														class="h-8 w-8 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
														aria-label="User options"
													>
														<EllipsisVertical class="h-4 w-4" />
													</Button>
												{/snippet}
											</DropdownMenu.Trigger>
											<DropdownMenu.Content align="end" class="bg-zinc-900 border-zinc-800 text-zinc-100">
												<DropdownMenu.Item class="gap-2 p-0 focus:bg-zinc-800 focus:text-zinc-100">
													<form
														method="POST"
														action="?/toggleBlock"
														use:enhance={() => submitToggleBlock(user)}
														class="w-full"
													>
														<input type="hidden" name="userId" value={user.id} />
														<input type="hidden" name="blocked" value={String(!user.is_blocked)} />
														<button type="submit" class="flex w-full items-center gap-2 px-2 py-1.5 text-left">
															{#if user.is_blocked}
																<CircleCheck class="h-4 w-4" />
																Unblock user
															{:else}
																<Ban class="h-4 w-4" />
																Block user
															{/if}
														</button>
													</form>
												</DropdownMenu.Item>
												<DropdownMenu.Separator class="bg-zinc-800" />
												<DropdownMenu.Item
													variant="destructive"
													class="gap-2"
													onclick={() => (deleteTarget = user)}
												>
													<Trash2 class="h-4 w-4" />
													Delete user
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	{/await}
</div>

<!-- Delete confirmation -->
<Dialog.Root open={deleteTarget !== null} onOpenChange={(open) => !open && (deleteTarget = null)}>
	<Dialog.Content class="sm:max-w-sm bg-zinc-950 border border-zinc-800 text-zinc-100">
		<Dialog.Header>
			<Dialog.Title class="text-zinc-100">Delete user</Dialog.Title>
			<Dialog.Description class="text-zinc-400">
				"{deleteTarget?.email}" will be permanently deleted. This can't be undone.
			</Dialog.Description>
		</Dialog.Header>

		<form method="POST" action="?/deleteUser" use:enhance={submitDelete} class="contents">
			<input type="hidden" name="userId" value={deleteTarget?.id ?? ''} />

			<Dialog.Footer class="mt-2 bg-zinc-950 border-zinc-800/60">
				<Button
					type="button"
					variant="outline"
					class="border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
					onclick={() => (deleteTarget = null)}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isDeleting} class="bg-red-600 hover:bg-red-500 text-white">
					{isDeleting ? 'Deleting...' : 'Delete'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
