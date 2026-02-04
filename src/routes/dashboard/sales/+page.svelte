<script lang="ts">
  import { leadsStore, opportunitiesStore } from '$lib/stores/entities.svelte';
  import {
    TrendingUp,
    Users,
    DollarSign,
    Target,
    ArrowUp,
    ArrowDown,
    BarChart3,
    PieChart
  } from 'lucide-svelte';

  const leads = $derived(leadsStore.getAll());
  const opportunities = $derived(opportunitiesStore.getAll());

  // Calculate KPIs
  const totalLeads = $derived(leads.length);
  const openOpportunities = $derived(
    opportunities.filter((o) => o.salesStage !== 'Closed Won' && o.salesStage !== 'Closed Lost')
      .length
  );
  const totalPipelineValue = $derived(
    opportunities
      .filter((o) => o.salesStage !== 'Closed Won' && o.salesStage !== 'Closed Lost')
      .reduce((sum, o) => sum + o.estimatedRevenue, 0)
  );
  const wonThisMonth = $derived(
    opportunities.filter((o) => {
      if (o.salesStage === 'Closed Won' && o.actualCloseDate) {
        const closeDate = new Date(o.actualCloseDate);
        const now = new Date();
        return (
          closeDate.getMonth() === now.getMonth() &&
          closeDate.getFullYear() === now.getFullYear()
        );
      }
      return false;
    }).length
  );

  // Additional metrics
  const hotLeads = $derived(leads.filter((l) => l.rating === 'Hot').length);
  const qualifiedLeads = $derived(leads.filter((l) => l.leadStatus === 'Qualified').length);
  const highValueOpps = $derived(
    opportunities.filter((o) => o.estimatedRevenue >= 300000).length
  );
  const closingSoon = $derived(
    opportunities.filter((o) => {
      const closeDate = new Date(o.estimatedCloseDate);
      const now = new Date();
      const daysUntilClose = Math.floor(
        (closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return (
        daysUntilClose <= 30 &&
        daysUntilClose >= 0 &&
        o.salesStage !== 'Closed Won' &&
        o.salesStage !== 'Closed Lost'
      );
    }).length
  );

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
</script>

<div class="flex flex-col h-full overflow-y-auto">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-semibold text-text-primary mb-2">Sales Dashboard</h1>
    <p class="text-text-secondary">Monitor your sales pipeline and performance metrics</p>
  </div>

  <!-- Main KPI Tiles -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <!-- Total Leads -->
    <div class="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Users class="w-6 h-6 text-primary" />
        </div>
        <div class="flex items-center gap-1 text-success text-sm">
          <ArrowUp class="w-4 h-4" />
          <span>12%</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-text-primary mb-1">{formatNumber(totalLeads)}</div>
      <div class="text-sm text-text-secondary">Total Leads</div>
      <div class="mt-3 text-xs text-text-secondary">
        <span class="font-medium text-warning">{hotLeads}</span> hot leads
      </div>
    </div>

    <!-- Open Opportunities -->
    <div class="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
          <Target class="w-6 h-6 text-success" />
        </div>
        <div class="flex items-center gap-1 text-success text-sm">
          <ArrowUp class="w-4 h-4" />
          <span>8%</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-text-primary mb-1">
        {formatNumber(openOpportunities)}
      </div>
      <div class="text-sm text-text-secondary">Open Opportunities</div>
      <div class="mt-3 text-xs text-text-secondary">
        <span class="font-medium text-warning">{closingSoon}</span> closing within 30 days
      </div>
    </div>

    <!-- Total Pipeline Value -->
    <div class="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
          <DollarSign class="w-6 h-6 text-info" />
        </div>
        <div class="flex items-center gap-1 text-success text-sm">
          <ArrowUp class="w-4 h-4" />
          <span>15%</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-text-primary mb-1">
        {formatCurrency(totalPipelineValue)}
      </div>
      <div class="text-sm text-text-secondary">Total Pipeline Value</div>
      <div class="mt-3 text-xs text-text-secondary">
        <span class="font-medium text-success">{highValueOpps}</span> high-value deals
      </div>
    </div>

    <!-- Won This Month -->
    <div class="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
          <TrendingUp class="w-6 h-6 text-success" />
        </div>
        <div class="flex items-center gap-1 text-error text-sm">
          <ArrowDown class="w-4 h-4" />
          <span>3%</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-text-primary mb-1">{formatNumber(wonThisMonth)}</div>
      <div class="text-sm text-text-secondary">Won This Month</div>
      <div class="mt-3 text-xs text-text-secondary">vs. last month</div>
    </div>
  </div>

  <!-- Secondary Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <!-- Lead Conversion Rate -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-text-secondary">Lead Conversion Rate</h3>
      </div>
      <div class="text-2xl font-bold text-text-primary mb-1">
        {totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0}%
      </div>
      <div class="text-xs text-text-secondary">
        {qualifiedLeads} of {totalLeads} leads qualified
      </div>
    </div>

    <!-- Average Deal Size -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-text-secondary">Average Deal Size</h3>
      </div>
      <div class="text-2xl font-bold text-text-primary mb-1">
        {formatCurrency(openOpportunities > 0 ? totalPipelineValue / openOpportunities : 0)}
      </div>
      <div class="text-xs text-text-secondary">Across all open opportunities</div>
    </div>

    <!-- Win Rate -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-text-secondary">Win Rate</h3>
      </div>
      <div class="text-2xl font-bold text-text-primary mb-1">68%</div>
      <div class="text-xs text-text-secondary">Last 90 days</div>
    </div>
  </div>

  <!-- Charts Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <!-- Pipeline by Stage -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-text-primary flex items-center gap-2">
          <BarChart3 class="w-5 h-5" />
          Pipeline by Stage
        </h2>
      </div>
      <div class="flex items-center justify-center h-64 text-text-secondary">
        <div class="text-center">
          <PieChart class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p class="text-sm">Chart visualization coming soon</p>
          <p class="text-xs mt-2">
            This will display opportunity distribution across sales stages
          </p>
        </div>
      </div>
    </div>

    <!-- Revenue Forecast -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-text-primary flex items-center gap-2">
          <TrendingUp class="w-5 h-5" />
          Revenue Forecast
        </h2>
      </div>
      <div class="flex items-center justify-center h-64 text-text-secondary">
        <div class="text-center">
          <BarChart3 class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p class="text-sm">Chart visualization coming soon</p>
          <p class="text-xs mt-2">
            This will display projected revenue by quarter
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Recent Activity & Pipeline Health -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Pipeline Health -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <h2 class="text-lg font-semibold text-text-primary mb-4">Pipeline Health</h2>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
          <div>
            <div class="font-medium text-text-primary">Strong Pipeline</div>
            <div class="text-sm text-text-secondary">
              {formatCurrency(totalPipelineValue)} in active opportunities
            </div>
          </div>
          <div class="text-success">
            <ArrowUp class="w-6 h-6" />
          </div>
        </div>

        <div class="flex items-center justify-between p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div>
            <div class="font-medium text-text-primary">Follow-up Needed</div>
            <div class="text-sm text-text-secondary">{hotLeads} hot leads require attention</div>
          </div>
          <div class="text-warning">
            <Users class="w-6 h-6" />
          </div>
        </div>

        <div class="flex items-center justify-between p-4 bg-info/10 border border-info/20 rounded-lg">
          <div>
            <div class="font-medium text-text-primary">Closing Soon</div>
            <div class="text-sm text-text-secondary">
              {closingSoon} opportunities expected to close this month
            </div>
          </div>
          <div class="text-info">
            <Target class="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>

    <!-- Top Opportunities -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <h2 class="text-lg font-semibold text-text-primary mb-4">Top Opportunities</h2>
      <div class="space-y-3">
        {#each opportunities
          .filter((o) => o.salesStage !== 'Closed Won' && o.salesStage !== 'Closed Lost')
          .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
          .slice(0, 5) as opp}
          <a
            href="/sales/opportunities/{opp.id}"
            class="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-surface-hover transition-colors"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-text-primary truncate">{opp.topic}</div>
              <div class="text-sm text-text-secondary">{opp.accountName}</div>
            </div>
            <div class="text-right ml-4">
              <div class="font-medium text-success">{formatCurrency(opp.estimatedRevenue)}</div>
              <div class="text-xs text-text-secondary">{opp.pipelinePhase}</div>
            </div>
          </a>
        {:else}
          <div class="text-center py-8 text-text-secondary">
            <p class="text-sm">No open opportunities</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
