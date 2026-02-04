import type { FilterGroup, FilterCondition, SortConfig } from '$lib/types/grids';

// Filter store for grid views
class FilterStore {
  private filters = $state<Record<string, FilterGroup | null>>({});
  private sorts = $state<Record<string, SortConfig[]>>({});
  private searches = $state<Record<string, string>>({});

  // Get filter for a specific view
  getFilter(viewId: string): FilterGroup | null {
    return this.filters[viewId] || null;
  }

  // Set filter for a view
  setFilter(viewId: string, filter: FilterGroup | null): void {
    this.filters[viewId] = filter;
  }

  // Clear filter for a view
  clearFilter(viewId: string): void {
    this.filters[viewId] = null;
  }

  // Get sort configuration for a view
  getSort(viewId: string): SortConfig[] {
    return this.sorts[viewId] || [];
  }

  // Set sort configuration for a view
  setSort(viewId: string, sort: SortConfig[]): void {
    this.sorts[viewId] = sort;
  }

  // Toggle sort for a field
  toggleSort(viewId: string, field: string): void {
    const currentSort = this.sorts[viewId] || [];
    const existing = currentSort.find((s) => s.field === field);

    if (!existing) {
      // Add ascending sort
      this.sorts[viewId] = [{ field, direction: 'asc' }];
    } else if (existing.direction === 'asc') {
      // Change to descending
      existing.direction = 'desc';
      this.sorts[viewId] = [...currentSort];
    } else {
      // Remove sort
      this.sorts[viewId] = currentSort.filter((s) => s.field !== field);
    }
  }

  // Get search query for a view
  getSearch(viewId: string): string {
    return this.searches[viewId] || '';
  }

  // Set search query for a view
  setSearch(viewId: string, query: string): void {
    this.searches[viewId] = query;
  }

  // Clear search for a view
  clearSearch(viewId: string): void {
    this.searches[viewId] = '';
  }

  // Clear all filters, sorts, and searches for a view
  clearAll(viewId: string): void {
    this.filters[viewId] = null;
    this.sorts[viewId] = [];
    this.searches[viewId] = '';
  }

  // Add a condition to a filter
  addCondition(viewId: string, condition: FilterCondition): void {
    const currentFilter = this.filters[viewId];

    if (!currentFilter) {
      this.filters[viewId] = {
        operator: 'and',
        conditions: [condition]
      };
    } else {
      currentFilter.conditions.push(condition);
      this.filters[viewId] = { ...currentFilter };
    }
  }

  // Remove a condition from a filter
  removeCondition(viewId: string, index: number): void {
    const currentFilter = this.filters[viewId];

    if (currentFilter && currentFilter.conditions.length > index) {
      currentFilter.conditions.splice(index, 1);

      if (currentFilter.conditions.length === 0) {
        this.filters[viewId] = null;
      } else {
        this.filters[viewId] = { ...currentFilter };
      }
    }
  }
}

export const filterStore = new FilterStore();
