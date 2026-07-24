<script>
    import { logout } from "$lib/services/auth";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { dashboard } from "$lib/stores/dashboard.svelte.js";

    import Users from "@lucide/svelte/icons/users";
    import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
    import LogOut from "@lucide/svelte/icons/log-out";
    import Logs from "@lucide/svelte/icons/files";
    import Settings from "@lucide/svelte/icons/settings";
    import Folder from "@lucide/svelte/icons/folder";
    import Auth from "@lucide/svelte/icons/shield";
    import UserCog from "@lucide/svelte/icons/user-cog";
    import APIKey from "@lucide/svelte/icons/key";

    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar/index.js";

    // avatarUrl is optional — falls back to initials if not provided
    let { userName = "User", userEmail = "", avatarUrl = "" } = $props();

    const sidebar = Sidebar.useSidebar();

    // The URL owns "which project is active" — this is what makes the
    // sidebar automatically reflect whichever project's pages you're
    // currently on, and survive a page refresh.
    let activeProjectId = $derived($page.params.project ?? null);

    async function signOut() {
        await logout();
        goto("/login");
    }

    function initials(name) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    function handleNavigate() {
        if (sidebar.isMobile) sidebar.setOpenMobile(false);
    }

    // Collapsed sidebar shows only the brand icon + page icons — clicking
    // the brand while collapsed is the way back to the expanded state.
    function handleBrandClick() {
        if (sidebar.state === "collapsed") sidebar.toggle();
    }

    const items = [
        { id: "users", title: "Users", segment: "Users", icon: Users },
        { id: "auth", title: "Authentication", segment: "Auth", icon: Auth },
        { id: "api", title: "API Keys", segment: "API", icon: APIKey },
        { id: "logs", title: "Logs", segment: "Logs", icon: Logs },
        { id: "settings", title: "Settings", segment: "Settings", icon: Settings },
    ];
</script>

<Sidebar.Root collapsible="icon" class="bg-zinc-950 text-zinc-100 border-zinc-800">

    <!-- Brand / logo. Collapsed (icon) mode hides the wordmark and the
         trigger — clicking the brand icon itself expands the sidebar
         again, so there's always a way back in without hunting for a
         separate control. -->
    <Sidebar.Header class="border-b border-zinc-800 bg-zinc-950 h-[60px] justify-center">
        <div class="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <button
                type="button"
                onclick={handleBrandClick}
                class="flex items-center gap-2 min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                aria-label="First Layer"
            >
                <div class="h-7 w-7 rounded-md bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0">
                    <div class="h-2 w-2 rounded-sm bg-violet-400"></div>
                </div>
                <span class="font-semibold tracking-tight text-zinc-100 group-data-[collapsible=icon]:hidden">First Layer</span>
            </button>
            <Sidebar.Trigger class="ml-auto h-7 w-7 rounded-md hover:bg-zinc-800 transition-colors shrink-0 group-data-[collapsible=icon]:hidden" />
        </div>
    </Sidebar.Header>

    <Sidebar.Content class="bg-zinc-950">
        <Sidebar.Group>
            <Sidebar.GroupContent>
                <Sidebar.Menu class="gap-1.5">

                    <!-- Projects — never project-scoped, always enabled -->
                    <Sidebar.MenuItem>
                        <Sidebar.MenuButton
                            isActive={$page.url.pathname === "/dashboard"}
                            class="h-11 text-base [&_svg]:size-5 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[active=true]:bg-zinc-800 data-[active=true]:text-zinc-100"
                        >
                            {#snippet child({ props })}
                                <a href="/dashboard" {...props} onclick={handleNavigate}>
                                    <Folder />
                                    <span>Projects</span>
                                </a>
                            {/snippet}
                        </Sidebar.MenuButton>
                    </Sidebar.MenuItem>

                    {#each items as item (item.id)}
                        <Sidebar.MenuItem>
                            {#if activeProjectId}
                                {@const url = `/dashboard/${activeProjectId}/${item.segment}`}
                                <Sidebar.MenuButton
                                    isActive={$page.url.pathname === url}
                                    class="h-11 text-base [&_svg]:size-5 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[active=true]:bg-zinc-800 data-[active=true]:text-zinc-100"
                                >
                                    {#snippet child({ props })}
                                        <a href={url} {...props} onclick={handleNavigate}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            {:else}
                                <!-- No active project yet: greyed out, prompts project
                                     creation instead of navigating anywhere. -->
                                <Sidebar.MenuButton
                                    class="h-11 text-base [&_svg]:size-5 text-zinc-600 cursor-not-allowed hover:bg-transparent hover:text-zinc-600"
                                    onclick={() => {
                                        handleNavigate();
                                        dashboard.openAddDialog();
                                    }}
                                >
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Sidebar.MenuButton>
                            {/if}
                        </Sidebar.MenuItem>
                    {/each}

                </Sidebar.Menu>
            </Sidebar.GroupContent>
        </Sidebar.Group>
    </Sidebar.Content>

    <!-- Profile + logout -->
    <Sidebar.Footer class="border-t border-zinc-800 bg-zinc-950">
        <Sidebar.MenuItem class="list-none">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <button
                            {...props}
                            class="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-zinc-800 transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                        >
                            <Avatar.Root class="h-7 w-7 shrink-0">
                                {#if avatarUrl}
                                    <Avatar.Image src={avatarUrl} alt={userName} class="object-cover" />
                                {/if}
                                <Avatar.Fallback class="text-xs bg-violet-500/20 text-violet-300">
                                    {initials(userName)}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div class="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                                <p class="text-sm font-medium text-zinc-100 truncate">{userName}</p>
                                <p class="text-xs text-zinc-400/70 truncate">{userEmail}</p>
                            </div>
                            <ChevronsUpDown class="h-4 w-4 text-zinc-500 shrink-0 group-data-[collapsible=icon]:hidden" />
                        </button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    class="w-56 bg-zinc-900 border-zinc-800 text-zinc-100"
                    side="top"
                    align="start"
                >
                    <DropdownMenu.Item
                        class="gap-2 focus:bg-zinc-800 focus:text-zinc-100 p-0"
                    >

                        <a href="/dashboard/Account" 
                        class="flex w-full items-center gap-2 w-full px-2 py-1.5"
                        onclick={handleNavigate}
                        >
                            <UserCog class="h-4 w-4" />
                                Account settings
                        </a>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator class="bg-zinc-800" />
                    <DropdownMenu.Item
                        onclick={signOut}
                        variant="destructive"
                        class="gap-2"
                    >
                        <LogOut class="h-4 w-4" />
                        Log out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </Sidebar.MenuItem>
    </Sidebar.Footer>

</Sidebar.Root>