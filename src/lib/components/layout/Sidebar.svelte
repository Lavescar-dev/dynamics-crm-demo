<script lang="ts">
  import { page } from '$app/stores';
  import { navigationStore } from '$lib/stores';
  import { siteMapConfig } from '$lib/config/sitemap';
  import {
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Headphones,
    Megaphone,
    Activity,
    LayoutDashboard,
    Users,
    Target,
    Building2,
    Contact,
    FileText,
    ShoppingCart,
    Receipt,
    AlertCircle,
    Inbox,
    BookOpen,
    Calendar,
    Rocket,
    List,
    Zap,
    CheckSquare
  } from 'lucide-svelte';

  const navState = navigationStore.state;
  const currentArea = $derived(navState.currentArea);
  const isCollapsed = $derived(navState.isSidebarCollapsed);

  // Icon mapping
  const iconMap: Record<string, any> = {
    TrendingUp,
    Headphones,
    Megaphone,
    Activity,
    LayoutDashboard,
    Users,
    Target,
    Building2,
    Contact,
    FileText,
    ShoppingCart,
    Receipt,
    AlertCircle,
    Inbox,
    BookOpen,
    Calendar,
    Rocket,
    List,
    Zap,
    CheckSquare
  };

  function getIcon(iconName?: string) {
    return iconName && iconMap[iconName] ? iconMap[iconName] : Users;
  }

  function setArea(areaId: string) {
    navigationStore.setCurrentArea(areaId);
  }

  function toggleCollapse() {
    navigationStore.toggleSidebar();
  }

  // Get current area configuration
  const areaConfig = $derived(
    siteMapConfig.areas.find((a) => a.id === currentArea) || siteMapConfig.areas[0]
  );
</script>

<aside
  class="sidebar bg-surface border-r border-border flex flex-col transition-all duration-300 shadow-sm"
  class:collapsed={isCollapsed}
>
  <!-- Area Switcher -->
  <div class="area-switcher border-b border-border p-2">
    <div class="flex items-center gap-2 mb-2">
      {#each siteMapConfig.areas as area}
{#each [area] as a}
        {@const Icon = getIcon(a.icon)}
        <button
          onclick={() => setArea(a.id)}
          class="flex-1 p-2 rounded transition-colors"
          class:bg-primary={currentArea === a.id}
          class:text-white={currentArea === a.id}
          class:hover:bg-gray-100={currentArea !== a.id}
          title={a.title}
        >
          <Icon class="w-5 h-5 mx-auto" />
          {#if !isCollapsed}
            <span class="text-xs mt-1 block">{a.title}</span>
          {/if}
        </button>
        {/each}
      {/each}
    </div>
  </div>

  <!-- Navigation Items -->
  <nav class="flex-1 overflow-y-auto p-2">
    {#if areaConfig}
      <div class="space-y-4">
        {#each areaConfig.groups as group}
          <div class="nav-group">
            {#if !isCollapsed}
              <h3 class="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 py-2">
                {group.title}
              </h3>
            {/if}

            <ul class="space-y-1">
              {#each group.items as item}
                {#snippet navItem()}
                  {@const isActive = $page.url.pathname.startsWith(item.url)}
                  {@const ItemIcon = getIcon(item.icon)}
                  <a
                    href={item.url}
                    class="flex items-center gap-3 px-3 py-2 rounded transition-colors"
                    class:bg-primary={isActive}
                    class:text-white={isActive}
                    class:hover:bg-gray-100={!isActive}
                    title={isCollapsed ? item.title : ''}
                  >
                    <ItemIcon class="w-5 h-5 flex-shrink-0" />
                    {#if !isCollapsed}
                      <span class="text-sm">{item.title}</span>
                    {/if}
                    {#if item.badge && !isCollapsed}
                      <span class="ml-auto text-xs bg-error text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    {/if}
                  </a>
                {/snippet}
                <li>
                  {@render navItem()}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/if}
  </nav>

  <!-- Collapse Toggle -->
  <div class="border-t border-border p-2">
    <button
      onclick={toggleCollapse}
      class="w-full p-2 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
      title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {#if isCollapsed}
        <ChevronRight class="w-5 h-5" />
      {:else}
        <ChevronLeft class="w-5 h-5" />
      {/if}
    </button>
  </div>
</aside>

<style>
  .sidebar {
    width: 240px;
    min-height: 0;
  }

  .sidebar.collapsed {
    width: 64px;
  }

  .area-switcher button {
    min-width: 0;
  }

  nav {
    scrollbar-width: thin;
  }
</style>
