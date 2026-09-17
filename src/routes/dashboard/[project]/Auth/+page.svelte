<script>
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	let { data, form } = $props();

	let isSaving = $state(false);
</script>

<svelte:head><title>Authentication — {data.project.name} — First Layer</title></svelte:head>

<div class="max-w-2xl p-6 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-100 space-y-6">
	<div>
		<h1 class="text-2xl font-medium tracking-tight">Authentication Providers</h1>
		<p class="text-zinc-400 text-sm">
			Control exactly how users can sign up and sign in to your applications.
		</p>
	</div>

	<form
		method="POST"
		action="?/updateProviders"
		use:enhance={() => {
			isSaving = true;
			return async ({ result, update }) => {
				await update();
				isSaving = false;
				if (result.type === 'success') {
					toast.success('Authentication settings updated!');
				} else if (result.type === 'failure') {
					toast.error(result.data?.error || 'Failed to update authentication settings.');
				}
			};
		}}
		class="space-y-6"
	>
		<input type="hidden" name="projectId" value={data.project.id} />

		<div class="space-y-4">
			<!-- Provider 1: Email / Password -->
			<label
				class="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
			>
				<div class="space-y-0.5">
					<span class="text-sm font-semibold">Email & Password</span>
					<p class="text-xs text-zinc-500">
						Allow signups using standard username and password combinations.
					</p>
				</div>
				<input
					type="checkbox"
					name="authEmail"
					checked={data.project.auth_email}
					class="h-5 w-5 accent-violet-500 rounded bg-zinc-900 border-zinc-800"
				/>
			</label>

			<!-- Provider 2: Google Social Login — not implemented yet -->
			<label
				class="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800 opacity-50 cursor-not-allowed"
			>
				<div class="space-y-0.5">
					<span class="text-sm font-semibold flex items-center gap-2">
						Google OAuth <span
							class="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded font-normal"
							>Coming soon</span
						>
					</span>
					<p class="text-xs text-zinc-500">
						Enable one-click Google Sign-in buttons directly inside your app integrations.
					</p>
				</div>
				<input
					type="checkbox"
					disabled
					class="h-5 w-5 accent-violet-500 rounded bg-zinc-900 border-zinc-800 cursor-not-allowed"
				/>
			</label>

			<!-- Provider 3: Magic Links — not implemented yet -->
			<label
				class="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800 opacity-50 cursor-not-allowed"
			>
				<div class="space-y-0.5">
					<span class="text-sm font-semibold flex items-center gap-2">
						Passwordless Magic Links <span
							class="px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded font-normal"
							>Coming soon</span
						>
					</span>
					<p class="text-xs text-zinc-500">
						Send passwordless OTP login links straight to user inboxes.
					</p>
				</div>
				<input
					type="checkbox"
					disabled
					class="h-5 w-5 accent-violet-500 rounded bg-zinc-900 border-zinc-800 cursor-not-allowed"
				/>
			</label>
		</div>

		<div class="flex items-center justify-between pt-2">
			<a
				href="/docs#quickstart"
				class="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
			>
				Need a plug-and-play snippet? See the docs
			</a>
			<button
				type="submit"
				disabled={isSaving}
				class="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 text-sm"
			>
				{isSaving ? 'Saving Configurations...' : 'Save Changes'}
			</button>
		</div>
	</form>
</div>
