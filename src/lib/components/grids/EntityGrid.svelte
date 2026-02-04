<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { cn } from '$lib/utils';
  import type { ColumnDefinition, ViewDefinition } from '$lib/types/grids';
  import { Button } from '$lib/components/ui/button';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { ArrowUp, ArrowDown } from 'lucide-svelte';

  import type { Snippet } from 'svelte'; // Import Snippet

  let {
    data,
    columns,
    viewId,
    views,
    onViewChange,
    onRowClick,
    enableSelection = false,
    emptyMessage = 'No records found.',
    pageSize = 10,
    children, // Add children to props
  } = $props<{
    data: Record<string, any>[]; // Modified here
    columns: ColumnDefinition[];
    viewId: string;
    views: ViewDefinition[];
    onViewChange: (viewId: string) => void;
    onRowClick: (id: string) => void;
    enableSelection?: boolean;
    emptyMessage?: string;
    pageSize?: number;
    children?: { // Define snippets for named slots
      'view-selector'?: () => Snippet; // Snippets are functions that return a Snippet
      'command-bar'?: () => Snippet;
    }
  }>();

  let currentPage = $state(1);
  let totalPages = $derived(Math.ceil(data.length / pageSize));
  let paginatedData = $derived(data.slice((currentPage - 1) * pageSize, currentPage * pageSize));

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

  // Sorting
  let sortColumn = $state<string | null>(null);
  let sortDirection = $state<'asc' | 'desc'>('asc');

  function handleSort(field: string) {
    if (!columns.find((col: ColumnDefinition) => col.field === field)?.sortable) return;

    if (sortColumn === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = field;
      sortDirection = 'asc';
    }
  }

  let sortedData = $derived.by(() => { // Modified here
    if (!sortColumn) return data;
    const sorted = [...data].sort((a, b) => {
      // Ensure sortColumn is not null before using it as an index
      if (sortColumn === null) return 0;

      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      // Fallback for other types or if values are undefined/null
      return 0;
    });
    return sorted; // Added return statement
  });

  // Selection
  let selectedRows = $state<Set<string>>(new Set());

  function toggleRowSelection(id: string) {
    if (selectedRows.has(id)) {
      selectedRows.delete(id);
    } else {
      selectedRows.add(id);
    }
  }

  function toggleAllSelection(checked: boolean) {
    if (checked) {
      selectedRows = new Set(data.map((row: Record<string, any>) => row.id)); // Modified here
    } else {
      selectedRows = new Set();
    }
  }

  let allRowsSelected = $derived(selectedRows.size === data.length && data.length > 0);
  let someRowsSelected = $derived(selectedRows.size > 0 && selectedRows.size < data.length);

  let currentViewName = $derived.by(() => views.find((v: ViewDefinition) => v.id === viewId)?.name || 'Grid View'); // Modified here

  // Expose selected rows for parent components
  $effect(() => {
    // console.log('Selected Rows:', Array.from(selectedRows));
  });
</script>

<div class="entity-grid bg-background rounded-lg border border-border">
  <div class="grid-header p-4 border-b border-border flex items-center justify-between">
    <div class="flex items-center gap-2">
      <!-- View Selector -->
      {#if children?.['view-selector']}
        {@render children['view-selector']()}
      {/if}
      <span class="text-lg font-semibold text-text-primary">
        {currentViewName}
      </span>
    </div>
    <!-- Other header elements like quick search, command bar can go here via snippets -->
    {#if children?.['command-bar']}
      {@render children['command-bar']()}
    {/if}
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left text-text-secondary">
      <thead class="text-xs text-text-secondary uppercase bg-gray-50 border-b border-border sticky top-0">
        <tr>
          {#if enableSelection}
            <th scope="col" class="p-4 w-12">
              <Checkbox
                checked={allRowsSelected}
                onCheckedChange={(e: boolean) => toggleAllSelection(e)}
                class={cn(someRowsSelected && 'bg-primary border-primary')}
              />
            </th>
          {/if}
          {#each columns as col: ColumnDefinition}
            <th
              scope="col"
              class={cn('px-6 py-3', col.sortable && 'cursor-pointer select-none')}
              onclick={() => handleSort(col.field)}
            >
              <div class="flex items-center">
                {col.header}
                {#if col.sortable && sortColumn === col.field}
                  {#if sortDirection === 'asc'}
                    <ArrowUp class="w-3 h-3 ml-1" />
                  {:else}
                    <ArrowDown class="w-3 h-3 ml-1" />
                  {/if}
                {/if}
              </div>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#if sortedData.length === 0}
          <tr>
            <td colspan={columns.length + (enableSelection ? 1 : 0)} class="px-6 py-4 text-center text-text-secondary">
              {emptyMessage}
            </td>
          </tr>
        {:else}
          {#each paginatedData as row: Record<string, any> (row.id)}
            <tr
              class="bg-surface border-b border-border hover:bg-gray-50 cursor-pointer"
              onclick={() => onRowClick(row.id)}
            >
              {#if enableSelection}
                <td class="p-4 w-12">
                  <Checkbox checked={selectedRows.has(row.id)} onCheckedChange={(e: boolean) => toggleRowSelection(row.id)} />
                </td>
              {/if}
              {#each columns as col: ColumnDefinition}
                <td class="px-6 py-4">
                  {#if col.render}
                    {@html col.render(row[col.field], row)}
                  {:else}
                    {row[col.field]}
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>

  {#if totalPages > 1}
    <div class="grid-footer p-4 border-t border-border flex items-center justify-between">
      <div class="text-text-secondary text-sm">
        Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, data.length)} of {data.length} records
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" onclick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <div class="flex gap-1">
          {#each Array(totalPages).keys() as i}
            <Button
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              size="sm"
              onclick={() => goToPage(i + 1)}
            >
              {i + 1}
            </Button>
          {/each}
        </div>
        <Button variant="outline" size="sm" onclick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  {/if}
</div>