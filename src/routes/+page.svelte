<script lang="ts">
  import { LayoutDashboard, TrendingUp, Headphones, Users } from 'lucide-svelte';
</script>

<div class="max-w-7xl mx-auto">
  <div class="mb-8">
    <h1 class="text-3xl font-semibold text-text-primary mb-2">Welcome to Vertex CRM</h1>
    <p class="text-text-secondary">Get started by selecting a module or viewing your dashboards</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Sales Dashboard Card -->
    <a
      href="/dashboard/sales"
      class="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <TrendingUp class="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-text-primary">Sales Dashboard</h2>
          <p class="text-sm text-text-secondary">Track your sales pipeline</p>
        </div>
      </div>
      <p class="text-text-secondary text-sm">
        View opportunities, leads, accounts, and sales performance metrics.
      </p>
    </a>

    <!-- Service Dashboard Card -->
    <a
      href="/dashboard/service"
      class="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
          <Headphones class="w-6 h-6 text-success" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-text-primary">Service Dashboard</h2>
          <p class="text-sm text-text-secondary">Manage customer cases</p>
        </div>
      </div>
      <p class="text-text-secondary text-sm">
        Monitor active cases, track resolutions, and customer satisfaction metrics.
      </p>
    </a>

    <!-- Leads Card -->
    <a
      href="/sales/leads"
      class="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
          <Users class="w-6 h-6 text-warning" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-text-primary">Leads</h2>
          <p class="text-sm text-text-secondary">Manage sales leads</p>
        </div>
      </div>
      <p class="text-text-secondary text-sm">
        View and qualify leads, track engagement, and convert to opportunities.
      </p>
    </a>

    <!-- Accounts Card -->
    <a
      href="/sales/accounts"
      class="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
          <LayoutDashboard class="w-6 h-6 text-info" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-text-primary">Accounts</h2>
          <p class="text-sm text-text-secondary">Manage customer accounts</p>
        </div>
      </div>
      <p class="text-text-secondary text-sm">
        Access account details, contacts, opportunities, and activity history.
      </p>
    </a>

    <!-- Opportunities Card -->
    <a
      href="/sales/opportunities"
      class="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
          <TrendingUp class="w-6 h-6 text-error" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-text-primary">Opportunities</h2>
          <p class="text-sm text-text-secondary">Track sales opportunities</p>
        </div>
      </div>
      <p class="text-text-secondary text-sm">
        Manage deals through your sales pipeline and close more business.
      </p>
    </a>

    <!-- Cases Card -->
    <a
      href="/service/cases"
      class="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-border"
    >
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
          <Headphones class="w-6 h-6 text-warning" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-text-primary">Cases</h2>
          <p class="text-sm text-text-secondary">Resolve customer issues</p>
        </div>
      </div>
      <p class="text-text-secondary text-sm">
        Track and resolve customer service cases with SLA management.
      </p>
    </a>
  </div>

  <!-- Quick Stats -->
  <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
    <div class="bg-surface p-6 rounded-lg shadow border border-border text-center">
      <div class="text-3xl font-bold text-primary mb-2">42</div>
      <div class="text-sm text-text-secondary">Active Leads</div>
    </div>

    <div class="bg-surface p-6 rounded-lg shadow border border-border text-center">
      <div class="text-3xl font-bold text-success mb-2">33</div>
      <div class="text-sm text-text-secondary">Opportunities</div>
    </div>

    <div class="bg-surface p-6 rounded-lg shadow border border-border text-center">
      <div class="text-3xl font-bold text-warning mb-2">13</div>
      <div class="text-sm text-text-secondary">Active Cases</div>
    </div>

    <div class="bg-surface p-6 rounded-lg shadow border border-border text-center">
      <div class="text-3xl font-bold text-info mb-2">$2.5M</div>
      <div class="text-sm text-text-secondary">Pipeline Value</div>
    </div>
  </div>
</div>
