import { fail } from '@sveltejs/kit';

// No load() needed here — data.project already arrives from
// dashboard/[project]/+layout.server.js above this route.
export const actions = {
	updateProviders: async ({ request, params, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();

		// Google OAuth and Magic Links aren't implemented anywhere in the
		// backend yet (auth_google/auth_magic_link are disabled, "coming
		// soon" toggles in the UI) — only persist the one provider that's
		// actually real, so this save can't silently stomp those columns.
		const authEmail = formData.get('authEmail') === 'on';

		const { error } = await locals.supabase
			.from('Projects')
			.update({ auth_email: authEmail })
			.eq('id', params.project) // project id now comes from the URL
			.eq('user_id', user.id);

		if (error) {
			console.error('Error updating auth providers:', error.message);
			return fail(500, { error: 'Failed to update auth providers.' });
		}

		return { success: true };
	}
};
