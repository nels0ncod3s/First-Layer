// lib/stores/dashboard.svelte.js
//
// Shared UI state for the dashboard: the header's project list + switcher
// dropdown, and the Add/Delete Project modals (both rendered once in
// dashboard/+layout.svelte so they're reachable from any dashboard route).
//
// "Which project is active" is NOT stored here — it lives in the URL
// (/dashboard/[project]/...), so it survives refreshes and deep links.
// Read it via `$page.params.project` / `$page.data.project` in components.
//
// Persistence lives in dashboard/+page.server.js's `create`/`delete` Form
// Actions. This store does NOT talk to Supabase directly.

import { goto, invalidateAll } from '$app/navigation';
import { getContext, setContext } from 'svelte';

class DashboardStore {
	projects = $state([]);

	// --- Header project switcher dropdown ---------------------------------
	switcherOpen = $state(false);

	// --- Add Project modal --------------------------------------------------
	dialogOpen = $state(false);
	newProjectName = $state('');
	newProjectFramework = $state('');
	nameError = $state('');

	// --- Delete Project modal -----------------------------------------------
	deleteTarget = $state(null);
	deleteConfirmText = $state('');

	get canDelete() {
		return this.deleteTarget !== null && this.deleteConfirmText === this.deleteTarget.name;
	}

	/** Cheap client-side hint only — the DB's unique index is the real check. */
	isNameTaken(name) {
		const normalized = name.trim().toLowerCase();
		return this.projects.some((p) => p.name.toLowerCase() === normalized);
	}

	// --- Sync from server ------------------------------------------------------
	/** Called from +page.svelte (and now +layout.svelte's parent data) with the load result. */
	setProjects(projects) {
		this.projects = projects ?? [];
	}

	// --- Add Project ---------------------------------------------------------
	openAddDialog() {
		this.dialogOpen = true;
		this.switcherOpen = false;
	}

	closeAddDialog() {
		this.dialogOpen = false;
		this.nameError = '';
		this.newProjectName = '';
		this.newProjectFramework = '';
	}

	/** Called after the `create` Form Action returns the saved project. */
	async addProject(project) {
		this.projects = [...this.projects, project];
		this.closeAddDialog();

		// Post-creation redirect: land directly on the new project's workspace.
		// Awaited on purpose — see the comment below.
		await goto(`/dashboard/${project.id}`);

		// `data.projects` (used by the grid page and the header switcher)
		// comes from dashboard/+layout.server.js. SvelteKit only reruns a
		// *layout's* load when something invalidates it — it does NOT do
		// this automatically just because the user navigated away and
		// came back. Without a nudge here, navigating back to /dashboard
		// later would silently reuse the layout's pre-creation project
		// list, and the project just added would seem to vanish until a
		// hard refresh.
		//
		// This has to run AFTER the goto() above resolves, not at the same
		// time as it — invalidateAll() is itself a (re)navigation, and
		// firing two of those at once is exactly what caused the loading
		// bar to get stuck before. Sequencing them means the goto() clears
		// the bar first, then this one runs and clears cleanly on its own.
		// It runs while we're still nested under /dashboard/[project],
		// which shares the same parent layout, so this does reach it.
		await invalidateAll();
	}

	// --- Navigation ------------------------------------------------------------
	openProject(project) {
		this.switcherOpen = false;
		goto(`/dashboard/${project.id}`);
	}

	openProjectSettings(project) {
		this.switcherOpen = false;
		goto(`/dashboard/${project.id}/Settings`);
	}

	/** Used by the header project switcher — same effect as openProject. */
	switchProject(project) {
		this.openProject(project);
	}

	toggleSwitcher() {
		this.switcherOpen = !this.switcherOpen;
	}

	closeSwitcher() {
		this.switcherOpen = false;
	}

	// --- Delete Project --------------------------------------------------------
	requestDelete(project) {
		this.deleteTarget = project;
		this.deleteConfirmText = '';
		this.switcherOpen = false;
	}

	cancelDelete() {
		this.deleteTarget = null;
		this.deleteConfirmText = '';
	}

	/** Called after the `delete` Form Action confirms the row was removed. */
	removeProject(id) {
		this.projects = this.projects.filter((p) => p.id !== id);
		this.deleteTarget = null;
		this.deleteConfirmText = '';
	}
}

// One instance per dashboard layout. Never share user data across SSR requests.
const DASHBOARD_CONTEXT = Symbol('first-layer-dashboard');
export function createDashboard(projects) {
	const dashboard = new DashboardStore();
	dashboard.setProjects(projects);
	setContext(DASHBOARD_CONTEXT, dashboard);
	return dashboard;
}
export function getDashboard() {
	const dashboard = getContext(DASHBOARD_CONTEXT);
	if (!dashboard) throw new Error('Dashboard context is missing');
	return dashboard;
}
