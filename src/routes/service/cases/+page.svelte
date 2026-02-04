<script lang="ts">
  import { casesStore } from '$lib/stores/entities.svelte';
  import { AlertCircle, CheckCircle, Clock, Filter, Plus, Search } from 'lucide-svelte';
  import type { Case } from '$lib/types/entities';

  let searchQuery = $state('');
  let statusFilter = $state<string>('all');
  let priorityFilter = $state<string>('all');

  const cases = $derived(casesStore.getAll());

  const filteredCases = $derived(() => {
    let result = cases;

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.caseStatus === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((c) => c.priority === priorityFilter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.caseNumber.toLowerCase().includes(query) ||
          c.caseTitle.toLowerCase().includes(query) ||
          c.customerName.toLowerCase().includes(query)
      );
    }

    return result;
  });

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High':
        return 'text-error bg-error/10';
      case 'Normal':
        return 'text-warning bg-warning/10';
      case 'Low':
        return 'text-success bg-success/10';
      default:
        return 'text-text-secondary bg-surface-hover';
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'text-primary bg-primary/10';
      case 'Resolved':
        return 'text-success bg-success/10';
      case 'Cancelled':
        return 'text-text-secondary bg-surface-hover';
      case 'On Hold':
        return 'text-warning bg-warning/10';
      default:
        return 'text-text-secondary bg-surface-hover';
    }
  }

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-3xl font-semibold text-text-primary">Cases</h1>
        <p class="text-text-secondary mt-1">Manage customer service cases</p>
      </div>
      <a
        href="/service/cases/new"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus class="w-4 h-4" />
        New Case
      </a>
    </div>

    <!-- Filters and Search -->
    <div class="flex gap-4 items-center bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search cases..."
          class="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div class="flex items-center gap-2">
        <Filter class="w-4 h-4 text-text-secondary" />
        <select
          bind:value={statusFilter}
          class="px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Resolved">Resolved</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          bind:value={priorityFilter}
          class="px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Priority</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Cases Grid -->
  <div class="flex-1 bg-surface rounded-lg border border-border overflow-hidden">
    <div class="overflow-x-auto h-full">
      <table class="w-full">
        <thead class="bg-surface-hover sticky top-0 z-10">
          <tr class="border-b border-border">
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Case Number
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Title
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Customer
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Priority
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Created On
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#each filteredCases() as caseItem (caseItem.id)}
            <tr class="hover:bg-surface-hover transition-colors cursor-pointer">
              <td class="px-6 py-4 whitespace-nowrap">
                <a
                  href="/service/cases/{caseItem.id}"
                  class="text-primary hover:underline font-medium"
                >
                  {caseItem.caseNumber}
                </a>
              </td>
              <td class="px-6 py-4">
                <div class="text-text-primary font-medium">{caseItem.caseTitle}</div>
                <div class="text-sm text-text-secondary">{caseItem.subject}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-text-primary">{caseItem.customerName}</div>
                <div class="text-sm text-text-secondary">{caseItem.customerType}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium {getPriorityColor(
                    caseItem.priority
                  )}"
                >
                  {#if caseItem.priority === 'High'}
                    <AlertCircle class="w-3 h-3" />
                  {:else if caseItem.priority === 'Normal'}
                    <Clock class="w-3 h-3" />
                  {:else}
                    <CheckCircle class="w-3 h-3" />
                  {/if}
                  {caseItem.priority}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(
                    caseItem.caseStatus
                  )}"
                >
                  {caseItem.caseStatus}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-text-secondary">
                {formatDate(caseItem.createdOn)}
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="6" class="px-6 py-12 text-center text-text-secondary">
                <div class="flex flex-col items-center gap-2">
                  <AlertCircle class="w-12 h-12 text-text-secondary/50" />
                  <p class="text-lg font-medium">No cases found</p>
                  <p class="text-sm">Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Summary Bar -->
  <div class="mt-4 flex items-center justify-between text-sm text-text-secondary bg-surface px-4 py-3 rounded-lg border border-border">
    <div class="flex items-center gap-6">
      <div>
        <span class="font-medium text-text-primary">{filteredCases().length}</span> cases
      </div>
      <div>
        <span class="font-medium text-primary">{cases.filter((c) => c.caseStatus === 'Active').length}</span> active
      </div>
      <div>
        <span class="font-medium text-success">{cases.filter((c) => c.caseStatus === 'Resolved').length}</span> resolved
      </div>
      <div>
        <span class="font-medium text-error">{cases.filter((c) => c.priority === 'High').length}</span> high priority
      </div>
    </div>
  </div>
</div>
