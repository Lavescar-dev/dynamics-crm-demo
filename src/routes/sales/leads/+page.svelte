<script lang="ts">
  import { leadsStore } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { Plus, Filter, Download, RefreshCw } from 'lucide-svelte';
  import EntityGrid from '$lib/components/grids/EntityGrid.svelte';
  import GridHeader from '$lib/components/grids/GridHeader.svelte';
  import type { ColumnDefinition, ViewDefinition } from '$lib/types/grids';
  import { leadStatuses, leadRatings } from '$lib/data';
  import { cn } from '$lib/utils';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { applyFilterGroup } from '$lib/utils/filters';

  let currentViewId = $state('my-active-leads');
  let searchQuery = $state('');

  const leadColumns: ColumnDefinition[] = [
    {
      field: 'fullName',
      header: 'Full Name',
      sortable: true,
      filterable: true,
      resizable: true,
      visible: true,
      render: (value: string, row: { jobTitle?: string }) => `
        <div class="text-sm font-medium text-text-primary">${value}</div>
        <div class="text-xs text-text-secondary">${row.jobTitle || 'No job title'}</div>
      `,
    },
    { field: 'companyName', header: 'Company', sortable: true, filterable: true, resizable: true, visible: true },
    { field: 'email', header: 'Email', sortable: true, filterable: false, resizable: true, visible: true },
    { field: 'phone', header: 'Phone', sortable: false, filterable: false, resizable: true, visible: true },
    {
      field: 'leadStatus',
      header: 'Status',
      sortable: true,
      filterable: true,
      resizable: true,
      visible: true,
      render: (value: string) => {
        const statusOption = leadStatuses.find(s => s.value === value);
        return `
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusOption?.color ? `bg-[${statusOption.color}/10] text-[${statusOption.color}] border-[${statusOption.color}/20]` : 'bg-gray-100 text-gray-800 border-gray-200'}">
            ${value}
          </span>
        `;
      },
    },
    {
      field: 'rating',
      header: 'Rating',
      sortable: true,
      filterable: true,
      resizable: true,
      visible: true,
      render: (value: string) => {
        const ratingOption = leadRatings.find(r => r.value === value);
        return `
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ratingOption?.color ? `bg-[${ratingOption.color}/10] text-[${ratingOption.color}] border-[${ratingOption.color}/20]` : 'bg-gray-100 text-gray-800 border-gray-200'}">
            ${value}
          </span>
        `;
      },
    },
    { field: 'leadSource', header: 'Lead Source', sortable: true, filterable: false, resizable: true, visible: true },
  ];

  const leadViews: ViewDefinition[] = [
    {
      id: 'my-active-leads',
      name: 'My Active Leads',
      type: 'system',
      isDefault: true,
      isPersonal: false,
      columns: leadColumns,
      filters: { operator: 'and', conditions: [{ field: 'ownerId', operator: 'equals', value: 'user-001' }] },
    },
    {
      id: 'all-leads',
      name: 'All Leads',
      type: 'system',
      isDefault: false,
      isPersonal: false,
      columns: leadColumns,
      filters: null,
    },
    {
      id: 'new-leads',
      name: 'New Leads',
      type: 'system',
      isDefault: false,
      isPersonal: false,
      columns: leadColumns,
      filters: { operator: 'and', conditions: [{ field: 'leadStatus', operator: 'equals', value: 'New' }] },
    },
    {
      id: 'qualified-leads',
      name: 'Qualified Leads',
      type: 'system',
      isDefault: false,
      isPersonal: false,
      columns: leadColumns,
      filters: { operator: 'and', conditions: [{ field: 'leadStatus', operator: 'equals', value: 'Qualified' }] },
    },
  ];

  let allLeads = $derived(leadsStore.getAll());

  let filteredAndSearchedLeads = $derived.by(() => { // Using derived.by
    let data = allLeads;

    // Apply view filters
    const currentView = leadViews.find(v => v.id === currentViewId);
    if (currentView?.filters) {
      data = applyFilterGroup(data, currentView.filters);
    }

    // Apply search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      data = data.filter(lead =>
        lead.fullName.toLowerCase().includes(lowerCaseQuery) ||
        lead.companyName.toLowerCase().includes(lowerCaseQuery) ||
        lead.email.toLowerCase().includes(lowerCaseQuery) ||
        lead.phone.toLowerCase().includes(lowerCaseQuery)
      );
    }
    return data;
  });

  function handleRowClick(leadId: string) {
    goto(`/sales/leads/${leadId}`);
  }

  function handleNewLead() {
    goto('/sales/leads/new');
  }

  function handleViewChange(viewId: string) {
    currentViewId = viewId;
  }

  function handleSearch(value: string) {
    searchQuery = value;
  }
</script>

<div class="h-full flex flex-col">
  <GridHeader
    entityType="lead"
    views={leadViews}
    currentViewId={currentViewId}
    onViewChange={handleViewChange}
    onSearch={handleSearch}
    searchValue={searchQuery}
    commandBarContent={command_bar}
  />
  {#snippet command_bar()}
    <div class="flex items-center gap-3">
      <Button variant="outline" size="sm" onclick={() => leadsStore.reset()}>
        <RefreshCw class="w-4 h-4 mr-2" />
        Refresh
      </Button>
      <Button variant="outline" size="sm">
        <Download class="w-4 h-4 mr-2" />
        Export
      </Button>
      <Button size="sm" onclick={handleNewLead}>
        <Plus class="w-4 h-4 mr-2" />
        New Lead
      </Button>
    </div>
  {/snippet}

  <div class="flex-1 overflow-hidden">
    <EntityGrid
      data={filteredAndSearchedLeads}
      columns={leadColumns}
      viewId={currentViewId}
      views={leadViews}
      onViewChange={handleViewChange}
      onRowClick={handleRowClick}
      enableSelection={true}
      emptyMessage={searchQuery ? 'No leads found matching your search.' : 'No leads available.'}
    />
  </div>
</div>