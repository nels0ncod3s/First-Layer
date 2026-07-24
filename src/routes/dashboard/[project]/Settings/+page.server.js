import { fail } from '@sveltejs/kit';

// data.project arrives from dashboard/[project]/+layout.server.js above
// this route — no load() needed here.
export const actions = {
	// Renames a project. Same validation as dashboard/+page.server.js's
	// `create` action — the DB's unique index on (user_id, lower(name))
	// is still the authoritative check.
	rename: async ({ request, params, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { error: 'You must be logged in.' });

		const formData = await request.formData();
		const name = (formData.get('name') ?? '').toString().trim();

		if (!name) {
			return fail(400, { error: 'Project name is required.' });
		}

		// No .select() here — matches the proven-working pattern from the
		// App/Auth pages' save actions. A .select().single() after the
		// update would additionally require the row to be re-readable
		// under RLS, which is a separate (and here, unverified) permission
		// from the UPDATE itself; skipping it removes that failure mode.
		const { error } = await locals.supabase
			.from('Projects')
			.update({ name })
			.eq('id', params.project)
			.eq('user_id', user.id);

		if (error) {
			if (error.code === '23505') {
				return fail(400, { error: `A project named "${name}" already exists.` });
			}
			console.error('Error renaming project:', error.message);
			return fail(500, { error: 'Could not rename project. Please try again.' });
		}

		return { success: true, id: params.project, name };
	}
};
