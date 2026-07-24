import { fail } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';

// data.project arrives from dashboard/[project]/+layout.server.js above
// this route. Every call to the backend forwards the dashboard user's
// Supabase access token as a Bearer token — the backend's
// verifyDashboardUser middleware re-checks that this project actually
// belongs to that user before touching any keys.
// `keys` is returned as an unawaited promise (streamed) rather than
// awaited here — otherwise every navigation to this page has to wait on
// a round trip through the backend (which itself re-verifies the
// session against Supabase Auth) before the route even transitions,
// which is exactly the "slight delay" other dashboard pages don't have
// because they have no server load at all. Streaming lets the page shell
// render immediately and the key list pop in via {#await} once ready.
export const load = async ({ params, locals, fetch }) => {
	const { session } = await locals.safeGetSession();

	async function loadKeys() {
		const res = await fetch(`${API_URL}/api/projects/${params.project}/keys`, {
			headers: { Authorization: `Bearer ${session.access_token}` }
		});

		if (!res.ok) {
			console.error('Error loading API keys:', res.status, await res.text());
			return [];
		}

		const { keys } = await res.json();
		return keys ?? [];
	}

	return { keys: loadKeys() };
};

export const actions = {
	createKey: async ({ request, params, locals }) => {
		const { session } = await locals.safeGetSession();
		if (!session) return fail(401, { error: 'You must be logged in.' });

		const formData = await request.formData();
		const name = (formData.get('name') ?? '').toString().trim();

		const res = await fetch(`${API_URL}/api/projects/${params.project}/keys`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: name || undefined })
		});

		const body = await res.json();

		if (!res.ok) {
			console.error('Error creating API key:', res.status, body);
			return fail(res.status, { error: body.error || 'Could not create API key.' });
		}

		// apiKey (the raw key) only ever exists in this one response — the
		// page shows it once, then it's gone for good.
		return { success: true, apiKey: body.apiKey, keyDetails: body.keyDetails };
	},

	revokeKey: async ({ request, params, locals }) => {
		const { session } = await locals.safeGetSession();
		if (!session) return fail(401, { error: 'You must be logged in.' });

		const formData = await request.formData();
		const keyId = formData.get('keyId')?.toString();
		if (!keyId) return fail(400, { error: 'Missing key id.' });

		const res = await fetch(`${API_URL}/api/projects/${params.project}/keys/${keyId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${session.access_token}` }
		});

		if (!res.ok) {
			const body = await res.json().catch(() => ({}));
			console.error('Error revoking API key:', res.status, body);
			return fail(res.status, { error: body.error || 'Could not revoke API key.' });
		}

		return { revoked: true, keyId };
	}
};
