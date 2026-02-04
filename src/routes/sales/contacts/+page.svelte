<script lang="ts">
  import { Plus, Search, Filter, RefreshCw, MoreVertical, Mail, Phone } from 'lucide-svelte';
  import { mockContacts } from '$lib/data/contacts';
  import { formatPhone } from '$lib/utils/formatting';

  let contacts = $state(mockContacts);
  let searchTerm = $state('');
  let selectedView = $state('My Active Contacts');

  const views = [
    'My Active Contacts',
    'All Contacts',
    'Active Contacts',
    'Inactive Contacts',
    'Contacts with Accounts',
  ];

  // Filter contacts based on search
  const filteredContacts = $derived(
    contacts.filter((contact) => {
      const search = searchTerm.toLowerCase();
      return (
        contact.fullName.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        (contact.accountName && contact.accountName.toLowerCase().includes(search)) ||
        (contact.jobTitle && contact.jobTitle.toLowerCase().includes(search))
      );
    })
  );

  function handleRefresh() {
    contacts = mockContacts;
  }

  function getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name[0] || '?';
  }
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="bg-surface border-b border-border px-6 py-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-semibold text-text-primary">Contacts</h1>
        <p class="text-sm text-text-secondary mt-1">
          Manage your business contacts and relationships
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
          New Contact
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
            placeholder="Search contacts..."
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
            Full Name
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Email
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Mobile Phone
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Job Title
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Account Name
          </th>
          <th class="text-left px-6 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Owner
          </th>
          <th class="w-10"></th>
        </tr>
      </thead>
      <tbody class="bg-background divide-y divide-border">
        {#each filteredContacts as contact (contact.id)}
          <tr class="hover:bg-surface-hover transition-colors cursor-pointer">
            <td class="px-6 py-4">
              <input type="checkbox" class="rounded border-border" />
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span class="text-sm font-semibold text-primary">
                    {getInitials(contact.fullName)}
                  </span>
                </div>
                <div>
                  <a
                    href="/sales/contacts/{contact.id}"
                    class="text-primary hover:underline font-medium"
                  >
                    {contact.fullName}
                  </a>
                  {#if contact.isPrimaryContact}
                    <span
                      class="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-info/10 text-info"
                    >
                      Primary
                    </span>
                  {/if}
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <a
                href="mailto:{contact.email}"
                class="text-text-primary hover:text-primary flex items-center gap-2"
              >
                <Mail class="w-4 h-4 text-text-secondary" />
                {contact.email}
              </a>
            </td>
            <td class="px-6 py-4">
              <a
                href="tel:{contact.mobilePhone}"
                class="text-text-primary hover:text-primary flex items-center gap-2"
              >
                <Phone class="w-4 h-4 text-text-secondary" />
                {formatPhone(contact.mobilePhone)}
              </a>
            </td>
            <td class="px-6 py-4 text-text-secondary text-sm">
              {contact.jobTitle || '-'}
            </td>
            <td class="px-6 py-4 text-text-primary">
              {#if contact.accountName && contact.accountId}
                <a href="/sales/accounts/{contact.accountId}" class="hover:underline">
                  {contact.accountName}
                </a>
              {:else}
                <span class="text-text-secondary">-</span>
              {/if}
            </td>
            <td class="px-6 py-4 text-text-secondary text-sm">
              {contact.ownerName}
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

    {#if filteredContacts.length === 0}
      <div class="text-center py-12">
        <p class="text-text-secondary">No contacts found</p>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <div class="bg-surface border-t border-border px-6 py-3">
    <div class="flex items-center justify-between text-sm text-text-secondary">
      <div>
        Showing {filteredContacts.length} of {contacts.length} contacts
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
