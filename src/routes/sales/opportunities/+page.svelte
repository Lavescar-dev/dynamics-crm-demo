<script lang="ts">
  import { Plus, Search, Filter, RefreshCw, MoreVertical } from 'lucide-svelte';
  import { mockOpportunities } from '$lib/data/opportunities';
  import { formatCurrency } from '$lib/utils/formatting';
  import { formatDate } from '$lib/utils/date-utils';
  import { getStatusColor } from '$lib/utils/formatting';

  let opportunities = $state(mockOpportunities);
  let searchTerm = $state('');
  let selectedView = $state('My Open Opportunities');

  const views = [
    'My Open Opportunities',
    'All Opportunities',
    'Won Opportunities',
    'Lost Opportunities',
    'Opportunities Closing This Month',
  ];

  // Filter opportunities based on search
  const filteredOpportunities = $derived(
    opportunities.filter((opp) => {
      const search = searchTerm.toLowerCase();
      return (
        opp.topic.toLowerCase().includes(search) ||
        (opp.accountName && opp.accountName.toLowerCase().includes(search)) ||
        opp.ownerName.toLowerCase().includes(search)
      );
    })
  );

  function handleRefresh() {
    opportunities = mockOpportunities;
  }

  function getRatingColor(rating: string | undefined): string {
    if (!rating) return 'bg-gray-500';
    return getStatusColor(rating);
  }
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="bg-surface border-b border-border px-6 py-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-semibold text-text-primary">Opportunities</h1>
        <p class="text-sm text-text-secondary mt-1">
          Manage your sales opportunities and pipeline
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          onclick={handleRefresh}
          class="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2"
        >
          <RefreshCw class="w-4 h-4" />
          Refresh
        </button>
        <button
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2 font-medium"
        >
          <Plus class="w-4 h-4" />
          New Opportunity
        </button>
      </div>
    </div>

    <!-- Views and Search -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <select
          bind:value={selectedView}
          class="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {#each views as view}
            <option value={view}>{view}</option>
          {/each}
        </select>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search opportunities..."
            class="pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-80"
          />
        </div>
        <button
          class="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors"
          title="Filter"
        >
          <Filter class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>

  <!-- Data Grid -->
  <div class="flex-1 overflow-auto">
    <table class="w-full">
      <thead class="bg-surface border-b border-border sticky top-0">
        <tr>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            <input type="checkbox" class="rounded border-border" />
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Topic
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Account
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Est. Revenue
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Close Date
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Probability
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Pipeline Phase
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Status
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Owner
          </th>
          <th class="w-10"></th>
        </tr>
      </thead>
      <tbody class="bg-background divide-y divide-border">
        {#each filteredOpportunities as opportunity (opportunity.id)}
          <tr class="hover:bg-surface-hover transition-colors cursor-pointer">
            <td class="px-6 py-4">
              <input type="checkbox" class="rounded border-border" />
            </td>
            <td class="px-6 py-4">
              <a
                href="/sales/opportunities/{opportunity.id}"
                class="text-primary hover:underline font-medium"
              >
                {opportunity.topic}
              </a>
              {#if opportunity.opportunityRating}
                <span
                  class="ml-2 inline-block w-2 h-2 rounded-full {getRatingColor(opportunity.opportunityRating)}"
                  title={opportunity.opportunityRating}
                ></span>
              {/if}
            </td>
            <td class="px-6 py-4 text-text-primary">
              <a href="/sales/accounts/{opportunity.accountId}" class="hover:underline">
                {opportunity.accountName}
              </a>
            </td>
            <td class="px-6 py-4 text-text-primary font-medium">
              {formatCurrency(opportunity.estimatedRevenue)}
            </td>
            <td class="px-6 py-4 text-text-secondary text-sm">
              {formatDate(opportunity.estimatedCloseDate)}
            </td>
            <td class="px-6 py-4 text-text-primary">
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-border rounded-full h-2 w-20">
                  <div
                    class="bg-primary h-2 rounded-full"
                    style="width: {opportunity.probability}%"
                  ></div>
                </div>
                <span class="text-sm">{opportunity.probability}%</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 text-xs font-medium rounded-md bg-surface text-text-primary border border-border"
              >
                {opportunity.pipelinePhase}
              </span>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 text-xs font-medium rounded-md {opportunity.status === 'Active'
                  ? 'bg-success/10 text-success'
                  : 'bg-surface text-text-secondary'}"
              >
                {opportunity.status}
              </span>
            </td>
            <td class="px-6 py-4 text-text-secondary text-sm">
              {opportunity.ownerName}
            </td>
            <td class="px-6 py-4">
              <button class="p-1 hover:bg-surface-hover rounded transition-colors">
                <MoreVertical class="w-4 h-4 text-text-secondary" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if filteredOpportunities.length === 0}
      <div class="text-center py-12">
        <p class="text-text-secondary">No opportunities found</p>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <div class="bg-surface border-t border-border px-6 py-3">
    <div class="flex items-center justify-between text-sm text-text-secondary">
      <div>
        Showing {filteredOpportunities.length} of {opportunities.length} opportunities
      </div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1 hover:bg-surface-hover rounded transition-colors disabled:opacity-50" disabled>
          Previous
        </button>
        <span class="px-3 py-1">Page 1 of 1</span>
        <button class="px-3 py-1 hover:bg-surface-hover rounded transition-colors disabled:opacity-50" disabled>
          Next
        </button>
      </div>
    </div>
  </div>
</div>
