import { API_URL } from '$env/static/private';

// data.project arrives from dashboard/[project]/+layout.server.js above
// this route. There's no dedicated audit-log table (and this route can't
// add one), so the feed is derived from data we already have: every user
// signup and every API key creation, merged and sorted by time. Revoked
// keys show their current state as a badge rather than a fabricated
// "revoked at" event, since we don't actually store when that happened.
// Streamed (unawaited) so navigating here is instant.
export const load = async ({ params, locals, fetch }) => {
	const { session } = await locals.safeGetSession();
	const headers = { Authorization: `Bearer ${session.access_token}` };

	async function loadEvents() {
		const [usersRes, keysRes] = await Promise.all([
			fetch(`${API_URL}/api/projects/${params.project}/users`, { headers }),
			fetch(`${API_URL}/api/projects/${params.project}/keys`, { headers })
		]);

		const users = usersRes.ok ? (await usersRes.json()).users ?? [] : [];
		const keys = keysRes.ok ? (await keysRes.json()).keys ?? [] : [];

		if (!usersRes.ok) console.error('Error loading users for logs:', usersRes.status);
		if (!keysRes.ok) console.error('Error loading keys for logs:', keysRes.status);

		return [
			...users.map((u) => ({
				type: 'user_created',
				timestamp: u.created_at,
				title: 'New user signed up',
				detail: u.email
			})),
			...keys.map((k) => ({
				type: 'key_created',
				timestamp: k.created_at,
				title: 'API key created',
				detail: k.name,
				status: k.is_active ? 'active' : 'revoked'
			}))
		].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
	}

	return { events: loadEvents() };
};
