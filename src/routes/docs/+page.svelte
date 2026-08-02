<script>
	import MarketingNav from "$lib/components/marketing/MarketingNav.svelte";
	import MarketingFooter from "$lib/components/marketing/MarketingFooter.svelte";
	import CopyButton from "$lib/components/CopyButton.svelte";
	import { highlightCode } from "$lib/highlight.js";
	import Search from "@lucide/svelte/icons/search";
	import X from "@lucide/svelte/icons/x";

	const installCommand = "npm install firstlayer";

	const quickstartCode = `import { FirstLayer } from "firstlayer";

const firstlayer = new FirstLayer({ apiKey: "YOUR_API_KEY" }); // Dashboard -> your project -> API

const { user } = await firstlayer.auth.signUp({
  email: "ada@example.com",
  password: "correct horse battery staple"
});`;

	// --- Nav structure ---------------------------------------------------
	// `sections` is the flat, canonical list (id/label/order) that both
	// scroll-spy and the section markup key off of. `navGroups` just groups
	// those same ids for the sidebar — move an id between arrays to move it
	// in the nav, no need to duplicate its label anywhere.
	const sections = [
		{ id: "quickstart", label: "Quickstart" },
		{ id: "installation", label: "Installation" },
		{ id: "managing-users", label: "Managing users" },
		{ id: "api-reference", label: "API reference" }
	];

	const navGroups = [
		{ label: "Get started", items: ["quickstart", "installation"] },
		{ label: "Guides", items: ["managing-users"] },
		{ label: "Reference", items: ["api-reference"] }
	];

	// --- Per-framework installation snippets ---------------------------------
	// Usage of the published `firstlayer` npm package. The raw REST calls it
	// wraps are documented in full under Quickstart / API reference — this
	// is just the ergonomic layer on top of them.
	const frameworks = [
		{ id: "js", label: "JavaScript", file: "firstlayer.js" },
		{ id: "svelte", label: "Svelte", file: "+page.svelte" },
		{ id: "react", label: "React", file: "App.jsx" }
	];
	let activeFramework = $state("js");

	const jsCode = `import { FirstLayer } from "firstlayer";

const firstlayer = new FirstLayer({ apiKey: "YOUR_API_KEY" }); // Dashboard -> your project -> API

// Create a user
const { user } = await firstlayer.auth.signUp({
  email: "ada@example.com",
  password: "correct horse battery staple"
});

// List your users
const { users } = await firstlayer.users.list();`;

	const svelteCode = `<script>
  import { FirstLayer } from "firstlayer";

  const firstlayer = new FirstLayer({ apiKey: "YOUR_API_KEY" });

  let users = $state([]);
  let email = $state("");
  let password = $state("");

  async function createUser() {
    const { user } = await firstlayer.auth.signUp({ email, password });
    users = [...users, user];
  }

  $effect(() => {
    firstlayer.users.list().then(({ users: list }) => (users = list));
  });
<` + `/script>

<input bind:value={email} placeholder="email" />
<input bind:value={password} type="password" />
<button onclick={createUser}>Sign up</button>`;

	const reactCode = `import { useEffect, useState } from "react";
import { FirstLayer } from "firstlayer";

const firstlayer = new FirstLayer({ apiKey: "YOUR_API_KEY" });

export default function App() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    firstlayer.users.list().then(({ users }) => setUsers(users));
  }, []);

  async function createUser() {
    const { user } = await firstlayer.auth.signUp({ email, password });
    setUsers((prev) => [...prev, user]);
  }

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      <button onClick={createUser}>Sign up</button>
    </div>
  );
}`;

	const snippetsById = { js: jsCode, svelte: svelteCode, react: reactCode };
	let activeCode = $derived(snippetsById[activeFramework]);
	let activeFile = $derived(frameworks.find((f) => f.id === activeFramework)?.file ?? "");

	// --- CRUD endpoint reference ---------------------------------------------
	// `view` is per-endpoint state (request/response tab) — the array is
	// $state so mutating ep.view in the click handler below just works. Each
	// endpoint also carries a stable `id` so it can be deep-linked from the
	// "on this page" TOC and tracked by scroll-spy. `request` assumes the
	// `firstlayer` client from the Installation section is already set up.
	let endpoints = $state([
		{
			id: "ep-signup",
			method: "POST",
			path: "/v1/auth/signup",
			title: "Create a user",
			description: "Registers a new end-user under your project. Emails are unique per project.",
			request: `const { user } = await firstlayer.auth.signUp({
  email: "ada@example.com",
  password: "correct horse battery staple"
});`,
			response: `{
  "message": "User created successfully",
  "user": { "id": "…", "email": "ada@example.com", "created_at": "…" }
}`,
			view: "request"
		},
		{
			id: "ep-list-users",
			method: "GET",
			path: "/v1/users",
			title: "List users",
			description: "Returns every end-user that belongs to your project.",
			request: `const { users } = await firstlayer.users.list();`,
			response: `{
  "users": [
    { "id": "…", "email": "ada@example.com", "created_at": "…" }
  ]
}`,
			view: "request"
		},
		{
			id: "ep-get-user",
			method: "GET",
			path: "/v1/users/:id",
			title: "Get a user",
			description: "Returns a single end-user by id, scoped to your project.",
			request: `const { user } = await firstlayer.users.get("USER_ID");`,
			response: `{
  "user": { "id": "…", "email": "ada@example.com", "created_at": "…" }
}`,
			view: "request"
		},
		{
			id: "ep-update-user",
			method: "PATCH",
			path: "/v1/users/:id",
			title: "Update a user",
			description: "Updates email and/or password. Send only the fields you want to change.",
			request: `const { user } = await firstlayer.users.update("USER_ID", {
  email: "ada.new@example.com"
});`,
			response: `{
  "message": "User updated successfully",
  "user": { "id": "…", "email": "ada.new@example.com", "created_at": "…" }
}`,
			view: "request"
		},
		{
			id: "ep-delete-user",
			method: "DELETE",
			path: "/v1/users/:id",
			title: "Delete a user",
			description: "Permanently deletes an end-user from your project.",
			request: `const { id } = await firstlayer.users.delete("USER_ID");`,
			response: `{
  "message": "User deleted successfully",
  "id": "…"
}`,
			view: "request"
		}
	]);

	function methodClass(method) {
		return "method method-" + method.toLowerCase();
	}

	// --- Sidebar search ----------------------------------------------------
	// Filters the left nav — for the two content-heavy sections it also
	// matches against the endpoints they contain. This is one scrolling
	// page, not separate routes, so search narrows down where to jump
	// rather than paginating anything.
	let query = $state("");
	let searchInput = $state(null);

	function itemMatches(item, q) {
		if (!q.trim()) return true;
		const needle = q.trim().toLowerCase();
		if (item.label.toLowerCase().includes(needle)) return true;
		if (item.id === "managing-users" || item.id === "api-reference") {
			return endpoints.some(
				(ep) =>
					ep.title.toLowerCase().includes(needle) ||
					ep.path.toLowerCase().includes(needle) ||
					ep.method.toLowerCase().includes(needle)
			);
		}
		return false;
	}

	let groupedNav = $derived(
		navGroups
			.map((group) => ({
				label: group.label,
				items: group.items
					.map((id) => sections.find((s) => s.id === id))
					.filter((item) => itemMatches(item, query))
			}))
			.filter((group) => group.items.length > 0)
	);

	// "/" focuses search — the shortcut most docs sites use — but only when
	// the person isn't already typing somewhere else.
	$effect(() => {
		function onKeydown(e) {
			const tag = document.activeElement?.tagName;
			if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
				e.preventDefault();
				searchInput?.focus();
			} else if (e.key === "Escape" && document.activeElement === searchInput) {
				searchInput.blur();
			}
		}
		window.addEventListener("keydown", onKeydown);
		return () => window.removeEventListener("keydown", onKeydown);
	});

	// --- Scroll-spy ----------------------------------------------------------
	// Tracks whichever tracked heading/endpoint sits nearest the top of the
	// viewport and drives both the left nav's active state and the right
	// "on this page" TOC's active state off the one observer.
	let activeId = $state("quickstart");
	let activeSection = $derived(
		endpoints.some((ep) => ep.id === activeId) ? "managing-users" : activeId
	);

	$effect(() => {
		const ids = [
			"quickstart",
			"installation",
			"managing-users",
			...endpoints.map((ep) => ep.id),
			"api-reference"
		];
		const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
		if (!els.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting);
				if (visible.length > 0) {
					visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
					activeId = visible[0].target.id;
				}
			},
			{ rootMargin: "-100px 0px -70% 0px", threshold: [0, 1] }
		);

		els.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Docs — First Layer</title>
	<meta name="description" content="First Layer documentation." />
</svelte:head>

<div class="page">
	<div class="top-glow" aria-hidden="true"></div>

	<MarketingNav />

	<div class="docs-layout">
		<aside class="docs-nav">
			<div class="docs-nav-top">
				<span class="docs-nav-label">Documentation</span>
				<span class="docs-version">v2.0</span>
			</div>

			<div class="docs-search">
				<Search class="h-4 w-4 search-icon" aria-hidden="true" />
				<input type="text" placeholder="Search docs…" bind:value={query} bind:this={searchInput} />
				{#if query}
					<button type="button" class="search-clear" aria-label="Clear search" onclick={() => (query = "")}>
						<X class="h-3.5 w-3.5" />
					</button>
				{:else}
					<kbd>/</kbd>
				{/if}
			</div>

			<nav>
				{#if groupedNav.length === 0}
					<p class="nav-empty">No results for "{query}"</p>
				{:else}
					{#each groupedNav as group (group.label)}
						<div class="nav-group">
							<span class="nav-group-label">{group.label}</span>
							{#each group.items as item (item.id)}
								<a href="#{item.id}" class:active={activeSection === item.id}>{item.label}</a>
							{/each}
						</div>
					{/each}
				{/if}
			</nav>
		</aside>

		<main class="docs-content">
			<span class="badge">Documentation</span>
			<h1>Get started with <span class="grad">First Layer.</span></h1>
			<p class="lede">Everything you need to add multi-tenant, per-project user accounts to your app — tested against the real API, not a mockup.</p>

			<section id="quickstart">
				<h2>Quickstart</h2>
				<ol class="steps">
					<li>Create a project from your <a href="/dashboard">dashboard</a>.</li>
					<li>Open that project's <strong>API</strong> page and create a key — copy it, it's only shown once.</li>
					<li>Install the package:</li>
				</ol>
				<div class="code-window">
					<div class="flat-header">
						<span class="flat-filename">terminal</span>
						<CopyButton text={installCommand} label="Copy command" />
					</div>
					<pre class="code-body"><code>{@html highlightCode(installCommand)}</code></pre>
				</div>
				<ol class="steps" start="4">
					<li>Make your first request:</li>
				</ol>
				<div class="code-window">
					<div class="flat-header">
						<span class="flat-filename">quickstart.js</span>
						<CopyButton text={quickstartCode} label="Copy code" />
					</div>
					<pre class="code-body"><code>{@html highlightCode(quickstartCode)}</code></pre>
				</div>
				<p>Swap <code>YOUR_API_KEY</code> for the key you just copied — that's the only thing you need to change.</p>
			</section>

			<section id="installation">
				<h2>Installation</h2>
				<p>Install the official JavaScript package and skip writing the fetch boilerplate yourself.</p>

				<div class="code-window">
					<div class="flat-header">
						<span class="flat-filename">terminal</span>
						<CopyButton text={installCommand} label="Copy command" />
					</div>
					<pre class="code-body"><code>{@html highlightCode(installCommand)}</code></pre>
				</div>

				<p>Create a client with your API key, then pick your framework for a copy-pasteable starting point.</p>

				<div class="framework-tabs" role="tablist">
					{#each frameworks as f (f.id)}
						<button
							role="tab"
							aria-selected={activeFramework === f.id}
							class="framework-tab"
							class:active={activeFramework === f.id}
							onclick={() => (activeFramework = f.id)}
						>
							{f.label}
						</button>
					{/each}
				</div>

				<div class="code-window">
					<div class="flat-header">
						<span class="flat-filename">{activeFile}</span>
						<CopyButton text={activeCode} label="Copy code" />
					</div>
					<pre class="code-body"><code>{@html highlightCode(activeCode)}</code></pre>
				</div>
			</section>

			<section id="managing-users">
				<h2>Managing users (CRUD)</h2>
				<p>Every request below is scoped to your project by the <code>x-api-key</code> header — one project's key can never see or modify another project's users.</p>

				{#each endpoints as ep (ep.id)}
					<div class="endpoint" id={ep.id}>
						<div class="endpoint-head">
							<span class={methodClass(ep.method)}>{ep.method}</span>
							<code>{ep.path}</code>
							<h3 class="endpoint-title">{ep.title}</h3>
						</div>
						<p>{ep.description}</p>

						<div class="code-window">
							<div class="flat-header endpoint-view-tabs">
								<div class="view-tab-group">
									<button
										type="button"
										class="view-tab"
										class:active={ep.view === "request"}
										onclick={() => (ep.view = "request")}
									>Request</button>
									<button
										type="button"
										class="view-tab"
										class:active={ep.view === "response"}
										onclick={() => (ep.view = "response")}
									>Response</button>
								</div>
								<CopyButton text={ep.view === "request" ? ep.request : ep.response} label="Copy" />
							</div>
							<pre class="code-body"><code>{@html highlightCode(ep.view === "request" ? ep.request : ep.response)}</code></pre>
						</div>
					</div>
				{/each}
			</section>

			<section id="api-reference">
				<h2>API reference</h2>
				<p>All endpoints live under <code>https://firstlayer-backend.pxxl.run</code> — the same URL for every project, every environment. Only your API key changes.</p>
				<div class="ref-table-wrap">
					<table class="ref-table">
						<thead>
							<tr>
								<th>Method</th>
								<th>Endpoint</th>
								<th>Auth</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{#each endpoints as ep (ep.id)}
								<tr>
									<td><span class={methodClass(ep.method)}>{ep.method}</span></td>
									<td><code>{ep.path}</code></td>
									<td><code>x-api-key</code></td>
									<td>{ep.title}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		</main>

		<aside class="docs-toc">
			<span class="docs-nav-label">On this page</span>
			<nav>
				{#each sections as section (section.id)}
					<a href="#{section.id}" class:active={activeId === section.id}>{section.label}</a>
					{#if section.id === "managing-users"}
						<div class="toc-sub">
							{#each endpoints as ep (ep.id)}
								<a href="#{ep.id}" class:active={activeId === ep.id}>{ep.title}</a>
							{/each}
						</div>
					{/if}
				{/each}
			</nav>
		</aside>
	</div>

	<MarketingFooter />
</div>

<style>
	:global(body) {
		margin: 0;
		background: #08080c;
		color: #f3f4f6;
		font-family: "Geist Variable", "Geist", system-ui, sans-serif;
	}
	:global(*) {
		box-sizing: border-box;
	}
	a {
		color: inherit;
		text-decoration: none;
	}

	.page {
		position: relative;
		overflow-x: clip;
	}
	.top-glow {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 480px;
		background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124, 58, 237, 0.24), transparent 70%);
		pointer-events: none;
		z-index: 0;
	}

	.badge {
		display: inline-block;
		padding: 0.4rem 0.95rem;
		border: 1px solid rgba(124, 58, 237, 0.35);
		background: rgba(124, 58, 237, 0.1);
		border-radius: 999px;
		color: #c4b5fd;
		font-size: 0.82rem;
		margin-bottom: 1.25rem;
	}
	h1 {
		font-size: clamp(1.9rem, 3.8vw, 2.6rem);
		line-height: 1.15;
		margin: 0 0 0.9rem;
		letter-spacing: -0.02em;
	}
	.grad {
		background: linear-gradient(120deg, #fff, #c4b5fd 60%, #a78bfa);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.lede {
		color: #9ca3af;
		font-size: 1.05rem;
		margin: 0 0 3rem;
		max-width: 560px;
	}

	.docs-layout {
		max-width: 1180px;
		margin: 0 auto;
		padding: 4rem 1.5rem 5rem;
		display: grid;
		/* minmax(0, 1fr), not plain 1fr — otherwise this grid item refuses
		   to shrink below its content's intrinsic width (the code blocks,
		   via white-space: pre) and grows past its track. .page's
		   overflow-x: clip then silently cuts off that overflow instead of
		   the code block's own overflow-x: auto ever getting a chance to
		   handle it — on mobile that made part of every code sample
		   permanently unreachable, not just hard to notice. */
		grid-template-columns: 220px minmax(0, 1fr) 200px;
		gap: 3rem;
		align-items: start;
	}
	.docs-content {
		min-width: 0;
	}

	/* ---------- left nav: docs sections ---------- */
	.docs-nav {
		position: sticky;
		top: 6rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.docs-nav-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.15rem;
	}
	.docs-nav-label {
		color: #71717a;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.docs-version {
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.68rem;
		color: #a78bfa;
		border: 1px solid rgba(124, 58, 237, 0.3);
		background: rgba(124, 58, 237, 0.08);
		padding: 0.12rem 0.45rem;
		border-radius: 999px;
	}

	.docs-search {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.09);
		border-radius: 10px;
		padding: 0.5rem 0.65rem;
		margin-bottom: 0.4rem;
		transition: border-color 0.15s ease;
	}
	.docs-search:focus-within {
		border-color: rgba(124, 58, 237, 0.45);
	}
	.docs-search :global(.search-icon) {
		color: #52525b;
		flex-shrink: 0;
	}
	.docs-search input {
		flex: 1;
		min-width: 0;
		background: none;
		border: none;
		outline: none;
		color: #f3f4f6;
		font-size: 0.85rem;
		font-family: inherit;
	}
	.docs-search input::placeholder {
		color: #52525b;
	}
	.docs-search kbd {
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.72rem;
		color: #71717a;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 5px;
		padding: 0.05rem 0.4rem;
		flex-shrink: 0;
	}
	.search-clear {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		color: #71717a;
		cursor: pointer;
		padding: 0.15rem;
		flex-shrink: 0;
	}
	.search-clear:hover {
		color: #fff;
	}

	.docs-nav nav {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
	.nav-empty {
		color: #52525b;
		font-size: 0.85rem;
		margin: 0.25rem 0 0;
	}
	.nav-group {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
		margin-bottom: 1.1rem;
	}
	.nav-group:last-child {
		margin-bottom: 0;
	}
	.nav-group-label {
		color: #52525b;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		margin: 0 0 0.35rem;
	}
	.docs-nav a {
		position: relative;
		color: #9ca3af;
		font-size: 0.9rem;
		padding: 0.4rem 0 0.4rem 0.75rem;
		margin-left: -0.75rem;
		border-left: 2px solid transparent;
		transition: color 0.15s ease, border-color 0.15s ease;
	}
	.docs-nav a:hover {
		color: #fff;
	}

	/* ---------- right nav: on this page ---------- */
	.docs-toc {
		position: sticky;
		top: 6rem;
		align-self: start;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}
	.docs-toc nav {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}
	.docs-toc a {
		position: relative;
		color: #71717a;
		font-size: 0.84rem;
		padding: 0.3rem 0 0.3rem 0.75rem;
		margin-left: -0.75rem;
		border-left: 2px solid transparent;
		transition: color 0.15s ease, border-color 0.15s ease;
	}
	.docs-toc a:hover {
		color: #d4d4d8;
	}
	.toc-sub {
		display: flex;
		flex-direction: column;
		margin-left: 0.85rem;
		border-left: 1px solid rgba(255, 255, 255, 0.08);
	}
	.toc-sub a {
		font-size: 0.78rem;
		margin-left: 0;
		padding-left: 0.85rem;
	}

	/* Shared active-link treatment for both sidebars. */
	.docs-nav a.active,
	.docs-toc a.active {
		color: #c4b5fd;
		border-left-color: #7c3aed;
	}

	.docs-content section {
		padding-top: 2.5rem;
		margin-top: 2.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		scroll-margin-top: 6rem;
	}
	.docs-content section:first-of-type {
		padding-top: 0;
		margin-top: 0;
		border-top: none;
	}
	.docs-content h2 {
		font-size: 1.4rem;
		margin: 0 0 0.9rem;
	}
	.docs-content p {
		color: #9ca3af;
		line-height: 1.65;
		font-size: 0.95rem;
		margin: 0 0 1.25rem;
	}
	.docs-content code {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 5px;
		padding: 0.1rem 0.4rem;
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.85em;
		color: #d4d4d8;
	}

	.steps {
		color: #9ca3af;
		line-height: 1.8;
		font-size: 0.95rem;
		padding-left: 1.25rem;
		margin: 0 0 1.25rem;
	}
	.steps li::marker {
		color: #7c3aed;
	}

	.code-window {
		background: #12121a;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		overflow: hidden;
		margin-bottom: 1.25rem;
	}
	.flat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.65rem 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}
	.flat-filename {
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.78rem;
		color: #71717a;
	}
	.endpoint-view-tabs {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
	}
	.view-tab-group {
		display: flex;
		gap: 0.35rem;
	}
	.view-tab {
		background: none;
		border: none;
		color: #71717a;
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.74rem;
		padding: 0.3rem 0.65rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease;
	}
	.view-tab:hover {
		color: #d4d4d8;
	}
	.view-tab.active {
		background: rgba(124, 58, 237, 0.16);
		color: #c4b5fd;
	}
	.code-body {
		margin: 0;
		padding: 1.25rem 1.5rem;
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.85rem;
		line-height: 1.7;
		color: #d4d4d8;
		overflow-x: auto;
		white-space: pre;
		-webkit-overflow-scrolling: touch;
		/* Scroll-shadow affordance: solid-color masks (local attachment,
		   scroll with content) sit over shadow gradients (fixed attachment)
		   at each edge. At rest, a mask fully covers its shadow on the side
		   with nothing left to scroll; once you scroll past it, the mask
		   moves away and the shadow becomes visible — a clear "there's more
		   this way" signal without needing JS, and without needing to zoom. */
		background-image:
			linear-gradient(to right, #12121a, #12121a),
			linear-gradient(to right, #12121a, #12121a),
			linear-gradient(to right, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0)),
			linear-gradient(to left, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0));
		background-position: left center, right center, left center, right center;
		background-repeat: no-repeat;
		background-color: #12121a;
		background-size: 24px 100%, 24px 100%, 12px 100%, 12px 100%;
		background-attachment: local, local, scroll, scroll;
	}
	@media (max-width: 640px) {
		.code-body {
			font-size: 0.76rem;
			padding: 1rem 1.1rem;
		}
	}
	.code-body :global(.tok-keyword) {
		color: #569cd6;
	}
	.code-body :global(.tok-string) {
		color: #ce9178;
	}
	.code-body :global(.tok-comment) {
		color: #6a9955;
		font-style: italic;
	}
	.code-body :global(.tok-number) {
		color: #b5cea8;
	}
	.code-body :global(.tok-function) {
		color: #dcdcaa;
	}
	.code-body :global(.tok-type) {
		color: #4ec9b0;
	}

	/* ---------- framework tabs ---------- */
	.framework-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}
	.framework-tab {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: #9ca3af;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		cursor: pointer;
		transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
	}
	.framework-tab:hover {
		color: #fff;
	}
	.framework-tab.active {
		background: rgba(124, 58, 237, 0.16);
		border-color: rgba(124, 58, 237, 0.35);
		color: #c4b5fd;
	}

	/* ---------- endpoints ---------- */
	.endpoint {
		margin-bottom: 2.5rem;
		scroll-margin-top: 6rem;
	}
	.endpoint:last-child {
		margin-bottom: 0;
	}
	.endpoint-head {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.65rem;
		margin-bottom: 0.5rem;
	}
	.endpoint-head code {
		font-size: 0.9rem;
		color: #e4e4e7;
	}
	.endpoint-title {
		margin: 0;
		font-weight: 400;
		color: #71717a;
		font-size: 0.85rem;
	}

	.method {
		display: inline-flex;
		align-items: center;
		font-family: "Geist Mono Variable", "Geist Mono", monospace;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		padding: 0.2rem 0.5rem;
		border-radius: 6px;
		border: 1px solid transparent;
	}
	.method-post {
		color: #34d399;
		background: rgba(52, 211, 153, 0.1);
		border-color: rgba(52, 211, 153, 0.25);
	}
	.method-get {
		color: #60a5fa;
		background: rgba(96, 165, 250, 0.1);
		border-color: rgba(96, 165, 250, 0.25);
	}
	.method-patch {
		color: #fbbf24;
		background: rgba(251, 191, 36, 0.1);
		border-color: rgba(251, 191, 36, 0.25);
	}
	.method-delete {
		color: #f87171;
		background: rgba(248, 113, 113, 0.1);
		border-color: rgba(248, 113, 113, 0.25);
	}

	/* ---------- reference table ---------- */
	.ref-table-wrap {
		overflow-x: auto;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
	}
	.ref-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}
	.ref-table th {
		text-align: left;
		color: #71717a;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0.85rem 1.1rem;
		background: #12121a;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}
	.ref-table td {
		padding: 0.85rem 1.1rem;
		color: #d4d4d8;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		vertical-align: middle;
	}
	.ref-table tr:last-child td {
		border-bottom: none;
	}

	/* On narrower desktop/tablet widths there's no room for a third
	   column — drop the "on this page" TOC first since the left nav is
	   the more important of the two for getting around. */
	@media (max-width: 1150px) {
		.docs-layout {
			grid-template-columns: 220px minmax(0, 1fr);
		}
		.docs-toc {
			display: none;
		}
	}

	@media (max-width: 860px) {
		.docs-layout {
			grid-template-columns: minmax(0, 1fr);
			gap: 2rem;
		}
		.docs-nav {
			position: static;
		}
		.docs-nav-top,
		.nav-group-label {
			display: none;
		}
		.docs-search kbd {
			display: none;
		}
		.docs-nav nav {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 0.5rem 1.25rem;
		}
		/* Groups collapse to plain flex children so their links wrap into
		   one flat row instead of stacking into a tall vertical list. */
		.nav-group {
			display: contents;
		}
		.docs-nav a {
			margin-left: 0;
			padding-left: 0;
			border-left: none;
		}
		.docs-nav a.active {
			text-decoration: underline;
			text-decoration-color: #7c3aed;
			text-underline-offset: 4px;
		}
	}
</style>
