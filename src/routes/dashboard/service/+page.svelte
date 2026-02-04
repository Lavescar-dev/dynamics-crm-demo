<script lang="ts">
  import { casesStore } from '$lib/stores/entities.svelte';
  import {
    Headphones,
    AlertCircle,
    CheckCircle,
    Clock,
    TrendingUp,
    ArrowUp,
    ArrowDown,
    BarChart3,
    Flag,
    User
  } from 'lucide-svelte';

  const cases = $derived(casesStore.getAll());

  // Calculate KPIs
  const totalCases = $derived(cases.length);
  const activeCases = $derived(cases.filter((c) => c.caseStatus === 'Active').length);
  const resolvedCases = $derived(cases.filter((c) => c.caseStatus === 'Resolved').length);
  const highPriorityCases = $derived(cases.filter((c) => c.priority === 'High').length);

  // Additional metrics
  const escalatedCases = $derived(cases.filter((c) => c.escalated).length);
  const onHoldCases = $derived(cases.filter((c) => c.caseStatus === 'On Hold').length);
  const resolvedThisMonth = $derived(
    cases.filter((c) => {
      if (c.caseStatus === 'Resolved' && c.resolvedOn) {
        const resolvedDate = new Date(c.resolvedOn);
        const now = new Date();
        return (
          resolvedDate.getMonth() === now.getMonth() &&
          resolvedDate.getFullYear() === now.getFullYear()
        );
      }
      return false;
    }).length
  );

  // Calculate average satisfaction
  const avgSatisfaction = $derived(() => {
    const rated = cases.filter((c) => c.satisfactionRating);
    if (rated.length === 0) return 0;
    const sum = rated.reduce((acc, c) => acc + (c.satisfactionRating || 0), 0);
    return (sum / rated.length).toFixed(1);
  });

  // Calculate resolution rate
  const resolutionRate = $derived(
    totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0
  );

  // Cases by type
  const questionCases = $derived(cases.filter((c) => c.caseType === 'Question').length);
  const problemCases = $derived(cases.filter((c) => c.caseType === 'Problem').length);
  const requestCases = $derived(cases.filter((c) => c.caseType === 'Request').length);

  function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

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
</script>

<div class="flex flex-col h-full overflow-y-auto">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-semibold text-text-primary mb-2">Service Dashboard</h1>
    <p class="text-text-secondary">Monitor customer service cases and performance metrics</p>
  </div>

  <!-- Main KPI Tiles -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <!-- Total Cases -->
    <div class="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Headphones class="w-6 h-6 text-primary" />
        </div>
        <div class="flex items-center gap-1 text-success text-sm">
          <ArrowUp class="w-4 h-4" />
          <span>5%</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-text-primary mb-1">{formatNumber(totalCases)}</div>
      <div class="text-sm text-text-secondary">Total Cases</div>
      <div class="mt-3 text-xs text-text-secondary">
        <span class="font-medium text-primary">{activeCases}</span> active
      </div>
    </div>

    <!-- Active Cases -->
    <div class="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
          <Clock class="w-6 h-6 text-warning" />
        </div>
        <div class="flex items-center gap-1 text-error text-sm">
          <ArrowUp class="w-4 h-4" />
          <span>3%</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-text-primary mb-1">{formatNumber(activeCases)}</div>
      <div class="text-sm text-text-secondary">Active Cases</div>
      <div class="mt-3 text-xs text-text-secondary">
        <span class="font-medium text-error">{highPriorityCases}</span> high priority
      </div>
    </div>

    <!-- Resolved Cases -->
    <div class="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
          <CheckCircle class="w-6 h-6 text-success" />
        </div>
        <div class="flex items-center gap-1 text-success text-sm">
          <ArrowUp class="w-4 h-4" />
          <span>12%</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-text-primary mb-1">{formatNumber(resolvedCases)}</div>
      <div class="text-sm text-text-secondary">Resolved Cases</div>
      <div class="mt-3 text-xs text-text-secondary">
        <span class="font-medium text-success">{resolvedThisMonth}</span> this month
      </div>
    </div>

    <!-- Customer Satisfaction -->
    <div class="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
          <TrendingUp class="w-6 h-6 text-info" />
        </div>
        <div class="flex items-center gap-1 text-success text-sm">
          <ArrowUp class="w-4 h-4" />
          <span>4%</span>
        </div>
      </div>
      <div class="text-3xl font-bold text-text-primary mb-1">{avgSatisfaction()}</div>
      <div class="text-sm text-text-secondary">Avg. Satisfaction</div>
      <div class="mt-3 text-xs text-text-secondary">out of 5.0</div>
    </div>
  </div>

  <!-- Secondary Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <!-- Resolution Rate -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-text-secondary">Resolution Rate</h3>
      </div>
      <div class="text-2xl font-bold text-text-primary mb-1">{resolutionRate}%</div>
      <div class="text-xs text-text-secondary">
        {resolvedCases} of {totalCases} cases resolved
      </div>
    </div>

    <!-- Escalated Cases -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-text-secondary">Escalated Cases</h3>
      </div>
      <div class="text-2xl font-bold text-text-primary mb-1">{formatNumber(escalatedCases)}</div>
      <div class="text-xs text-text-secondary">Requiring special attention</div>
    </div>

    <!-- On Hold -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-text-secondary">On Hold</h3>
      </div>
      <div class="text-2xl font-bold text-text-primary mb-1">{formatNumber(onHoldCases)}</div>
      <div class="text-xs text-text-secondary">Awaiting response or information</div>
    </div>
  </div>

  <!-- Charts Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    <!-- Cases by Type -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-text-primary flex items-center gap-2">
          <BarChart3 class="w-5 h-5" />
          Cases by Type
        </h2>
      </div>
      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-text-secondary">Questions</span>
            <span class="text-sm font-medium text-text-primary">{questionCases}</span>
          </div>
          <div class="w-full bg-surface-hover rounded-full h-2">
            <div
              class="bg-info h-2 rounded-full"
              style="width: {totalCases > 0 ? (questionCases / totalCases) * 100 : 0}%"
            ></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-text-secondary">Problems</span>
            <span class="text-sm font-medium text-text-primary">{problemCases}</span>
          </div>
          <div class="w-full bg-surface-hover rounded-full h-2">
            <div
              class="bg-error h-2 rounded-full"
              style="width: {totalCases > 0 ? (problemCases / totalCases) * 100 : 0}%"
            ></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-text-secondary">Requests</span>
            <span class="text-sm font-medium text-text-primary">{requestCases}</span>
          </div>
          <div class="w-full bg-surface-hover rounded-full h-2">
            <div
              class="bg-success h-2 rounded-full"
              style="width: {totalCases > 0 ? (requestCases / totalCases) * 100 : 0}%"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resolution Trend -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-text-primary flex items-center gap-2">
          <TrendingUp class="w-5 h-5" />
          Resolution Trend
        </h2>
      </div>
      <div class="flex items-center justify-center h-48 text-text-secondary">
        <div class="text-center">
          <BarChart3 class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p class="text-sm">Chart visualization coming soon</p>
          <p class="text-xs mt-2">This will display case resolution trends over time</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Active Cases List & Priority Cases -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- High Priority Cases -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Flag class="w-5 h-5 text-error" />
        High Priority Cases
      </h2>
      <div class="space-y-3">
        {#each cases
          .filter((c) => c.priority === 'High' && c.caseStatus === 'Active')
          .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
          .slice(0, 5) as caseItem}
          <a
            href="/service/cases/{caseItem.id}"
            class="flex items-start justify-between p-3 bg-background rounded-lg hover:bg-surface-hover transition-colors"
          >
            <div class="flex-1 min-w-0 mr-3">
              <div class="font-medium text-text-primary truncate">{caseItem.caseTitle}</div>
              <div class="text-sm text-text-secondary">{caseItem.customerName}</div>
              <div class="text-xs text-text-secondary mt-1">{caseItem.caseNumber}</div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium {getPriorityColor(caseItem.priority)}">
                <AlertCircle class="w-3 h-3" />
                {caseItem.priority}
              </span>
              {#if caseItem.escalated}
                <span class="text-xs text-error">Escalated</span>
              {/if}
            </div>
          </a>
        {:else}
          <div class="text-center py-8 text-text-secondary">
            <CheckCircle class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p class="text-sm">No high priority cases</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Recent Cases -->
    <div class="bg-surface rounded-lg border border-border p-6">
      <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Clock class="w-5 h-5" />
        Recent Cases
      </h2>
      <div class="space-y-3">
        {#each cases
          .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
          .slice(0, 5) as caseItem}
          <a
            href="/service/cases/{caseItem.id}"
            class="flex items-start justify-between p-3 bg-background rounded-lg hover:bg-surface-hover transition-colors"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-text-primary truncate">{caseItem.caseTitle}</div>
              <div class="text-sm text-text-secondary">{caseItem.customerName}</div>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-text-secondary">{formatDate(caseItem.createdOn)}</span>
                {#if caseItem.assignedTo}
                  <span class="text-xs text-text-secondary flex items-center gap-1">
                    <User class="w-3 h-3" />
                    {caseItem.assignedTo}
                  </span>
                {/if}
              </div>
            </div>
            <div class="ml-3">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {caseItem.caseStatus === 'Active' ? 'text-primary bg-primary/10' : caseItem.caseStatus === 'Resolved' ? 'text-success bg-success/10' : 'text-text-secondary bg-surface-hover'}">
                {caseItem.caseStatus}
              </span>
            </div>
          </a>
        {:else}
          <div class="text-center py-8 text-text-secondary">
            <p class="text-sm">No cases found</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
