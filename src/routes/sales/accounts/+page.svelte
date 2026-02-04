<script lang="ts">
  import { accountsStore } from '$lib/stores';
  import { formatCurrency, formatNumber } from '$lib/utils/formatting';
  import { Search, Plus, Building2, Mail, Phone, Users, DollarSign } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let searchQuery = $state('');

  const accounts = $derived(accountsStore.getAll());

  const filteredAccounts = $derived(
    searchQuery.trim()
      ? accountsStore.search(searchQuery, [
          'accountName',
          'phone',
          'email',
          'industry',
          'city',
          'state'
        ])
      : accounts
  );

  function handleRowClick(accountId: string) {
    goto(`/sales/accounts/${accountId}`);
  }

  function handleNewAccount() {
    // TODO: Open new account form
    console.log('Create new account');
  }
</script>

<div class="max-w-full">
  <!-- Header -->
  <div class="mb-6">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-3xl font-semibold text-text-primary flex items-center gap-3">
          <Building2 class="w-8 h-8 text-primary" />
          Accounts
        </h1>
        <p class="text-text-secondary mt-1">
          Manage customer and partner accounts
        </p>
      </div>
      <button
        onclick={handleNewAccount}
        class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
      >
        <Plus class="w-4 h-4" />
        New Account
      </button>
    </div>

    <!-- Search Bar -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search accounts by name, email, phone, industry..."
          class="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary placeholder:text-text-secondary"
        />
      </div>
      <div class="text-sm text-text-secondary">
        {filteredAccounts.length} account{filteredAccounts.length !== 1 ? 's' : ''}
      </div>
    </div>
  </div>

  <!-- Accounts Table -->
  <div class="bg-surface rounded-lg shadow-sm border border-border overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-background border-b border-border">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Account Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Phone
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Industry
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Annual Revenue
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Employees
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border">
          {#each filteredAccounts as account (account.id)}
            <tr
              onclick={() => handleRowClick(account.id)}
              class="hover:bg-background/50 cursor-pointer transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 class="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div class="font-medium text-text-primary">
                      {account.accountName}
                    </div>
                    <div class="text-sm text-text-secondary">
                      {account.accountNumber || 'No account number'}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-sm text-text-primary">
                  <Phone class="w-4 h-4 text-text-secondary" />
                  {account.phone || '-'}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-sm text-text-primary">
                  <Mail class="w-4 h-4 text-text-secondary" />
                  {account.email || '-'}
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {account.industry}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-sm text-text-primary font-medium">
                  <DollarSign class="w-4 h-4 text-success" />
                  {account.annualRevenue ? formatCurrency(account.annualRevenue) : '-'}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-sm text-text-primary">
                  <Users class="w-4 h-4 text-text-secondary" />
                  {account.numberOfEmployees ? formatNumber(account.numberOfEmployees) : '-'}
                </div>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center gap-2">
                  <Building2 class="w-12 h-12 text-text-secondary/50" />
                  <p class="text-text-secondary">
                    {searchQuery ? 'No accounts found matching your search' : 'No accounts available'}
                  </p>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Summary Stats -->
  {#if filteredAccounts.length > 0}
    <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 class="w-5 h-5 text-primary" />
          </div>
          <div>
            <div class="text-2xl font-bold text-text-primary">
              {filteredAccounts.length}
            </div>
            <div class="text-sm text-text-secondary">Total Accounts</div>
          </div>
        </div>
      </div>

      <div class="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <DollarSign class="w-5 h-5 text-success" />
          </div>
          <div>
            <div class="text-2xl font-bold text-text-primary">
              {formatCurrency(
                filteredAccounts.reduce((sum, acc) => sum + (acc.annualRevenue || 0), 0)
              )}
            </div>
            <div class="text-sm text-text-secondary">Total Revenue</div>
          </div>
        </div>
      </div>

      <div class="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
            <Users class="w-5 h-5 text-info" />
          </div>
          <div>
            <div class="text-2xl font-bold text-text-primary">
              {formatNumber(
                filteredAccounts.reduce((sum, acc) => sum + (acc.numberOfEmployees || 0), 0)
              )}
            </div>
            <div class="text-sm text-text-secondary">Total Employees</div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
