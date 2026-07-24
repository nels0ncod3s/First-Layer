import { API_URL } from '$env/static/private';

// data.project arrives from dashboard/[project]/+layout.server.js above
// this route. Stats are returned as an unawaited promise (streamed)
// rather than awaited here — awaiting would block the route transition
// on a full round trip through the backend (which itself re-verifies the
// session against Supabase Auth on top of the query), which is exactly
// what made opening a project feel slow compared to every other
// dashboard page that has no server load at all.
export const load = async ({ params, locals, fetch }) => {
	const { session } = await locals.safeGetSession();

	async function loadStats() {
		const res = await fetch(`${API_URL}/api/projects/${params.project}/users`, {
			headers: { Authorization: `Bearer ${session.access_token}` }
		});

		if (!res.ok) {
			console.error('Error loading user stats:', res.status, await res.text());
			return { userCount: 0, signupsToday: 0 };
		}

		const { users } = await res.json();
		const list = users ?? [];

		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const signupsToday = list.filter((u) => new Date(u.created_at) >= startOfToday).length;

		return { userCount: list.length, signupsToday };
	}

	return { stats: loadStats() };
};
