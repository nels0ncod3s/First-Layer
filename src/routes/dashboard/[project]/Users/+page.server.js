import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

// data.project arrives from dashboard/[project]/+layout.server.js above
// this route. Forwards the dashboard session as a Bearer token — the
// backend's verifyDashboardUser middleware re-checks project ownership.
// Streamed (unawaited) so navigating here is instant — the list pops in
// once the backend round trip resolves instead of blocking the route
// transition on it.
export const load = async ({ params, locals, fetch }) => {
	const { session } = await locals.safeGetSession();
	if (!session) throw redirect(303, '/login');

	async function loadUsers() {
		const res = await fetch(`${API_URL}/api/projects/${params.project}/users`, {
			headers: { Authorization: `Bearer ${session.access_token}` }
		});

		if (!res.ok) {
			console.error('Error loading users:', res.status, await res.text());
			return [];
		}

		const { users } = await res.json();
		return users ?? [];
	}

	return { users: loadUsers() };
};

export const actions = {
	deleteUser: async ({ request, params, locals, fetch }) => {
		const { session } = await locals.safeGetSession();
		if (!session) return fail(401, { error: 'You must be logged in.' });

		const formData = await request.formData();
		const userId = formData.get('userId')?.toString();
		if (!userId) return fail(400, { error: 'Missing user id.' });

		const res = await fetch(`${API_URL}/api/projects/${params.project}/users/${userId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${session.access_token}` }
		});

		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			console.error('Error deleting user:', res.status, body);
			return fail(res.status, { error: body.error || 'Could not delete user.' });
		}

		return { deleted: true, userId };
	},

	toggleBlock: async ({ request, params, locals, fetch }) => {
		const { session } = await locals.safeGetSession();
		if (!session) return fail(401, { error: 'You must be logged in.' });

		const formData = await request.formData();
		const userId = formData.get('userId')?.toString();
		const blocked = formData.get('blocked') === 'true';
		if (!userId) return fail(400, { error: 'Missing user id.' });

		const res = await fetch(`${API_URL}/api/projects/${params.project}/users/${userId}/block`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blocked })
		});

		const body = await res.json().catch(() => ({}));

		if (!res.ok) {
			console.error('Error toggling block:', res.status, body);
			return fail(res.status, { error: body.error || 'Could not update user.' });
		}

		return { success: true, user: body.user };
	}
};
