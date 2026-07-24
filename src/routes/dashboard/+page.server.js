import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

// No load() here anymore — the project list comes from dashboard/+layout.server.js
// now, since the header switcher (which lives in the layout) needs it on
// every dashboard route, not just this grid page.

export const actions = {
	// Creates a project for the logged-in user. Called from the "Add Project"
	// form via use:enhance in +layout.svelte.
	create: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'You must be logged in.' });

		const formData = await request.formData();
		const name = (formData.get('name') ?? '').toString().trim();
		const framework = formData.get('framework')?.toString().trim() || null;

		if (!name) {
			return fail(400, { field: 'name', message: 'Project name is required.' });
		}

		const clientSecret = `fl_secret_${crypto.randomUUID().replace(/-/g, '')}`;

		const { data: project, error } = await locals.supabase
			.from('Projects')
			.insert({ name, framework, user_id: user.id, client_secret: clientSecret })
			.select()
			.single();

		if (error) {
			// Postgres unique_violation — caught by the DB's unique index on
			// (user_id, lower(name)), so this is authoritative, not just a
			// client-side guess.
			if (error.code === '23505') {
				return fail(400, {
					field: 'name',
					message: `A project named "${name}" already exists.`
				});
			}
			console.error('Error creating project:', error.message);
			return fail(500, { message: 'Could not create project. Please try again.' });
		}

		return { success: true, project };
	},

	// Deletes a project. The confirm-by-typing-the-name check is re-verified
	// here server-side, not just trusted from the client.
	delete: async ({ request, locals, fetch }) => {
		const { user, session } = await locals.safeGetSession();
		if (!user) return fail(401, { message: 'You must be logged in.' });

		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const projectName = formData.get('projectName')?.toString() ?? '';
		const confirmName = formData.get('confirmName')?.toString() ?? '';

		if (!id) return fail(400, { message: 'Missing project id.' });
		if (confirmName !== projectName) {
			return fail(400, { message: "Confirmation text doesn't match the project name." });
		}

		// Clean up dependent rows (api_keys, project_users) via the backend's
		// service-role client first — this app's own Supabase client only has
		// RLS-scoped access to Projects, never those two tables, so it can't
		// do this itself. Best-effort: if the backend call fails, still go
		// ahead with the actual project delete below rather than blocking
		// the primary action on a cleanup step.
		try {
			const cleanupRes = await fetch(`${API_URL}/api/projects/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${session.access_token}` }
			});
			if (!cleanupRes.ok) {
				console.error('Error cleaning up project dependents:', cleanupRes.status, await cleanupRes.text());
			}
		} catch (err) {
			console.error('Error reaching backend to clean up project dependents:', err.message);
		}

		const { data: deletedRows, error } = await locals.supabase
			.from('Projects')
			.delete()
			.eq('id', id)
			.eq('user_id', user.id)
			.select();

		if (!error && (!deletedRows || deletedRows.length === 0)) {
			// Supabase doesn't error when RLS silently blocks a delete — it
			// just matches 0 rows. Without this check the UI removes the
			// project optimistically and it reappears on the next reload.
			console.error('Delete matched 0 rows — check the delete RLS policy on Projects.');
			return fail(403, {
				message: 'Could not delete this project. Please try again or contact support.'
			});
		}

		if (error) {
			console.error('Error deleting project:', error.message);
			return fail(500, { message: 'Could not delete project. Please try again.' });
		}

		return { success: true, deletedId: id };
	}
};
