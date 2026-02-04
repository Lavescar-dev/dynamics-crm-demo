<script lang="ts">
  import { navigationStore } from '$lib/stores';
  import { siteMapConfig } from '$lib/config/sitemap';
  import type { SiteMapConfiguration, NavigationGroup, NavigationItem } from '$lib/types/navigation';
  import type { ViewDefinition } from '$lib/types/grids';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu';
  import { Button } from '$lib/components/ui/button';
  import { ChevronDown, Search } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';

  // import type { Snippet } from 'svelte'; // Removed this line

  let {
    entityType,
    views,
    currentViewId,
    onViewChange,
    onSearch,
    searchValue,
    commandBarContent, // New prop for command bar content
  } = $props<{
    entityType: string;
    views: ViewDefinition[];
    currentViewId: string;
    onViewChange: (viewId: string) => void;
    onSearch: (value: string) => void;
    searchValue: string;
    commandBarContent?: () => any; // Use 'any' for Snippet type if it's causing issues.
  }>();

  let currentViewName = $derived.by(() => views.find((v: ViewDefinition) => v.id === currentViewId)?.name || 'Select View');

  // Determine current entity title for breadcrumbs/display
  const rawAreaConfig = $derived.by(() => siteMapConfig.areas.find(area =>
    area.groups.some(group => group.items.some(item => item.id === entityType))
  ));

  let entityTitle = $derived.by(() => {
    // rawAreaConfig is the unwrapped value (NavigationArea | undefined)
    if (!rawAreaConfig) return entityType; // Fallback to entityType if config is not found

    return rawAreaConfig.groups
      .flatMap((group: NavigationGroup) => group.items)
      .find((item: NavigationItem) => item.id === entityType)?.title || entityType;
  });
</script>

<div class="flex items-center justify-between py-4 px-6 bg-surface border-b border-border">
  <div class="flex items-center space-x-4">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" class="flex items-center gap-2">
          <span class="font-semibold text-text-primary">
            {currentViewName}
          </span>
          <ChevronDown class="w-4 h-4 text-text-secondary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-[200px]">
        {#each views as view}
          <DropdownMenuItem>
            <button class="w-full text-left" onclick={() => onViewChange(view.id)}>
              {view.name}
            </button>
          </DropdownMenuItem>
        {/each}
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Entity title for context -->
    <h2 class="text-xl font-semibold text-text-primary">
      {entityTitle}
    </h2>
  </div>

  <div class="flex items-center space-x-4">
    <!-- Quick Find Search Bar -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
      <Input
        type="text"
        placeholder="Quick Find"
        class="pl-9 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        bind:value={searchValue}
        oninput={() => onSearch(searchValue)}
      />
    </div>

    <!-- Command Bar Slot -->
    {#if commandBarContent}
      {@render commandBarContent()}
    {/if}
  </div>
</div>