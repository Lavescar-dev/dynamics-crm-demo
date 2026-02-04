<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { contactsStore } from '$lib/stores';
  import {
    Save,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    CheckSquare,
    ChevronRight,
    User,
    Building2,
    MapPin,
    Edit,
    Trash2,
    X
  } from 'lucide-svelte';
  import { preferredContactMethods } from '$lib/data/option-sets';
  import type { Contact } from '$lib/types/entities';
  import { cn } from '$lib/utils'; // Import cn utility
  import { formatDate } from '$lib/utils/date-utils'; // Re-add formatDate utility

  const contactId = $derived($page.params.id as string | undefined);
  let contact = $state<Contact | undefined>(undefined);
  let activeTab = $state('summary');
  let isEditing = $state(false);

  // Load or initialize contact data
  $effect(() => {
    if (contactId === 'new') {
      contact = {
        id: crypto.randomUUID(),
        firstName: '',
        lastName: '',
        fullName: '',
        email: '',
        mobilePhone: '',
        jobTitle: '',
        parentAccountId: undefined,
        parentAccountName: undefined,
        preferredContactMethod: 'Email',
        doNotEmail: false,
        doNotPhone: false,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        description: '',
        birthdate: undefined,
        businessPhone: '',
        department: '',
        status: 'Active',
        isPrimaryContact: false,
        createdOn: new Date(),
        modifiedOn: new Date(),
        createdBy: 'Current User',
        modifiedBy: 'Current User',
        ownerId: 'user-001',
        ownerName: 'Current User',
      };
      isEditing = true;
    } else if (contactId) {
      contact = contactsStore.getById(contactId);
    } else {
      contact = undefined;
    }
  });

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'details', label: 'Details' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'cases', label: 'Cases' },
    { id: 'activities', label: 'Activities' },
  ];

  function handleBack() {
    goto('/sales/contacts');
  }

  function handleEdit() {
    isEditing = true;
  }

  function handleSave() {
    if (!contact || !contactId) return;

    if (contactId === 'new') {
      const newContact = contactsStore.create(contact);
      goto(`/sales/contacts/${newContact.id}`);
    } else {
      contactsStore.update(contact.id, contact);
      isEditing = false;
    }
  }

  function handleSaveAndClose() {
    handleSave();
    setTimeout(() => handleBack(), 100);
  }

  function handleCancel() {
    if (contactId === 'new') {
      handleBack();
    } else if (contactId) {
      contact = contactsStore.getById(contactId); // Reload original data
      isEditing = false;
    }
  }

  function handleDelete() {
    // TODO: Implement delete functionality
    console.log('Delete contact:', contact);
  }

  function getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name[0] || '?';
  }
</script>

{#if contact === undefined}
  <div class="flex items-center justify-center h-full">
    <div class="text-center">
      <h2 class="text-xl font-semibold text-text-primary mb-2">Contact Not Found</h2>
      <p class="text-text-secondary mb-4">The contact you're looking for doesn't exist.</p>
      <a href="/sales/contacts" class="text-primary hover:underline"> Back to Contacts </a>
    </div>
  </div>
{:else}
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="bg-surface border-b border-border px-6 py-4">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 text-sm text-text-secondary mb-2">
            <a href="/sales/contacts" class="hover:text-text-primary">Contacts</a>
            <ChevronRight class="w-4 h-4" />
            <span class="text-text-primary">{contact.fullName}</span>
          </div>
          <div class="flex items-center gap-4 mb-2">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-2xl font-semibold text-primary">
                {getInitials(contact.fullName)}
              </span>
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-text-primary">{contact.fullName}</h1>
              {#if contact.jobTitle}
                <p class="text-text-secondary">{contact.jobTitle}</p>
              {/if}
            </div>
          </div>
          <div class="flex items-center gap-4 text-sm text-text-secondary">
            <span>Owner: {contact.ownerName}</span>
            <span>•</span>
            <span>Modified: {formatDate(contact.modifiedOn)}</span>
            {#if contact.isPrimaryContact}
              <span>•</span>
              <span class="px-2 py-0.5 text-xs font-medium rounded bg-info/10 text-info">
                Primary Contact
              </span>
            {/if}
          </div>
        </div>
        <div class="flex items-center gap-2">
          {#if isEditing}
            <button
              onclick={handleCancel}
              class="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button
              onclick={handleSave}
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2 font-medium"
            >
              <Save class="w-4 h-4" />
              Save
            </button>
          {:else}
            <button
              class="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2"
            >
              <Mail class="w-4 h-4" />
              Email
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2"
            >
              <Phone class="w-4 h-4" />
              Call
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2"
            >
              <Calendar class="w-4 h-4" />
              Meeting
            </button>
            <button
              onclick={handleEdit}
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2 font-medium"
            >
              <Edit class="w-4 h-4" />
              Edit
            </button>
            <button class="p-2 hover:bg-surface-hover rounded-md transition-colors" onclick={handleDelete}>
              <Trash2 class="w-5 h-5 text-text-secondary" />
            </button>
          {/if}
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 border-b border-border -mb-4">
        {#each tabs as tab}
          <button
            onclick={() => (activeTab = tab.id)}
            class={cn(
              'px-4 py-2 text-sm font-medium transition-colors relative',
              activeTab === tab.id
                ? 'text-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.label}
            {#if activeTab === tab.id}
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto">
      <div class="max-w-7xl mx-auto p-6">
        {#if activeTab === 'summary'}
          <div class="grid grid-cols-3 gap-6">
            <!-- Main Form -->
            <div class="col-span-2 space-y-6">
              <div class="bg-surface border border-border rounded-lg p-6">
                <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <User class="w-5 h-5" />
                  Contact Information
                </h2>
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-text-primary mb-1">
                      First Name <span class="text-error">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      bind:value={contact.firstName}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-text-primary mb-1">
                      Last Name <span class="text-error">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      bind:value={contact.lastName}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="jobTitle" class="block text-sm font-medium text-text-primary mb-1">
                      Job Title
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      bind:value={contact.jobTitle}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="department" class="block text-sm font-medium text-text-primary mb-1">
                      Department
                    </label>
                    <input
                      id="department"
                      type="text"
                      bind:value={contact.department}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-text-primary mb-1">
                      Email <span class="text-error">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      bind:value={contact.email}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="mobilePhone" class="block text-sm font-medium text-text-primary mb-1">
                      Mobile Phone
                    </label>
                    <input
                      id="mobilePhone"
                      type="tel"
                      bind:value={contact.mobilePhone}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="businessPhone" class="block text-sm font-medium text-text-primary mb-1">
                      Business Phone
                    </label>
                    <input
                      id="businessPhone"
                      type="tel"
                      bind:value={contact.businessPhone}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="preferredContactMethod" class="block text-sm font-medium text-text-primary mb-1">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContactMethod"
                      bind:value={contact.preferredContactMethod}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    >
                      <option value="">--Select--</option>
                      {#each preferredContactMethods as method}
                        <option value={method.value}>{method.label}</option>
                      {/each}
                    </select>
                  </div>
                </div>
              </div>

              <div class="bg-surface border border-border rounded-lg p-6">
                <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Building2 class="w-5 h-5" />
                  Company Information
                </h2>
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-2">
                    <label for="accountName" class="block text-sm font-medium text-text-primary mb-1">
                      Account Name
                    </label>
                    <input
                      id="accountName"
                      type="text"
                      bind:value={contact.parentAccountName}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-surface border border-border rounded-lg p-6">
                <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <MapPin class="w-5 h-5" />
                  Address Information
                </h2>
                <div class="grid grid-cols-2 gap-6">
                  <div class="col-span-2">
                    <label for="address" class="block text-sm font-medium text-text-primary mb-1">
                      Street Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      bind:value={contact.address}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="city" class="block text-sm font-medium text-text-primary mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      bind:value={contact.city}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="state" class="block text-sm font-medium text-text-primary mb-1">
                      State/Province
                    </label>
                    <input
                      id="state"
                      type="text"
                      bind:value={contact.state}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="zipCode" class="block text-sm font-medium text-text-primary mb-1">
                      ZIP/Postal Code
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      bind:value={contact.zipCode}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="country" class="block text-sm font-medium text-text-primary mb-1">
                      Country/Region
                    </label>
                    <input
                      id="country"
                      type="text"
                      bind:value={contact.country}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-surface border border-border rounded-lg p-6">
                <h2 class="text-lg font-semibold text-text-primary mb-4">Description</h2>
                <textarea
                  id="description"
                  bind:value={contact.description}
                  disabled={!isEditing}
                  rows="4"
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-100 disabled:text-text-secondary"
                ></textarea>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Quick Info -->
              <div class="bg-surface border border-border rounded-lg p-6">
                <h3 class="text-sm font-semibold text-text-primary mb-4 uppercase">Quick Info</h3>
                <div class="space-y-3">
                  <div>
                    <div class="text-xs text-text-secondary mb-1">Email</div>
                    <a href="mailto:{contact.email}" class="text-sm text-primary hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <div>
                    <div class="text-xs text-text-secondary mb-1">Mobile Phone</div>
                    <a href="tel:{contact.mobilePhone}" class="text-sm text-text-primary hover:text-primary">
                      {contact.mobilePhone}
                    </a>
                  </div>
                  {#if contact.businessPhone}
                    <div>
                      <div class="text-xs text-text-secondary mb-1">Business Phone</div>
                      <a href="tel:{contact.businessPhone}" class="text-sm text-text-primary hover:text-primary">
                        {contact.businessPhone}
                      </a>
                    </div>
                  {/if}
                  {#if contact.accountName}
                    <div>
                      <div class="text-xs text-text-secondary mb-1">Account</div>
                      <a href="/sales/accounts/{contact.accountId}" class="text-sm text-primary hover:underline">
                        {contact.accountName}
                      </a>
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Communication Preferences -->
              <div class="bg-surface border border-border rounded-lg p-6">
                <h3 class="text-sm font-semibold text-text-primary mb-4 uppercase">
                  Communication Preferences
                </h3>
                <div class="space-y-3">
                  <label for="doNotEmail" class="flex items-center gap-2">
                    <input
                      id="doNotEmail"
                      type="checkbox"
                      bind:checked={contact.doNotEmail}
                      disabled={!isEditing}
                      class="rounded border-border disabled:opacity-50"
                    />
                    <span class="text-sm text-text-primary">Do Not Email</span>
                  </label>
                  <label for="doNotPhone" class="flex items-center gap-2">
                    <input
                      id="doNotPhone"
                      type="checkbox"
                      bind:checked={contact.doNotPhone}
                      disabled={!isEditing}
                      class="rounded border-border disabled:opacity-50"
                    />
                    <span class="text-sm text-text-primary">Do Not Phone</span>
                  </label>
                  {#if contact.preferredContactMethod}
                    <div class="pt-2 border-t border-border">
                      <div class="text-xs text-text-secondary mb-1">Preferred Method</div>
                      {#if isEditing}
                        <select
                          id="preferredContactMethodSelect"
                          bind:value={contact.preferredContactMethod}
                          class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                        >
                          <option value="">--Select--</option>
                          {#each preferredContactMethods as method}
                            <option value={method.value}>{method.label}</option>
                          {/each}
                        </select>
                      {:else}
                        <div class="text-sm text-text-primary font-medium">
                          {contact.preferredContactMethod}
                        </div>
                      {/if}
                    </div>
                  {/if}
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-surface border border-border rounded-lg p-6">
                <h3 class="text-sm font-semibold text-text-primary mb-4 uppercase">Quick Actions</h3>
                <div class="space-y-2">
                  <button
                    class="w-full px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2 border border-border"
                  >
                    <Mail class="w-4 h-4" />
                    Send Email
                  </button>
                  <button
                    class="w-full px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2 border border-border"
                  >
                    <Phone class="w-4 h-4" />
                    Log Call
                  </button>
                  <button
                    class="w-full px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2 border border-border"
                  >
                    <Calendar class="w-4 h-4" />
                    Schedule Meeting
                  </button>
                  <button
                    class="w-full px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2 border border-border"
                  >
                    <CheckSquare class="w-4 h-4" />
                    Create Task
                  </button>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="bg-surface border border-border rounded-lg p-6">
                <h3 class="text-sm font-semibold text-text-primary mb-4 uppercase">
                  Recent Activity
                </h3>
                <div class="space-y-3 text-sm">
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                      <Mail class="w-4 h-4 text-info" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-text-primary font-medium">Email sent</div>
                      <div class="text-text-secondary text-xs">3 days ago</div>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Phone class="w-4 h-4 text-success" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-text-primary font-medium">Phone call completed</div>
                      <div class="text-text-secondary text-xs">1 week ago</div>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <Calendar class="w-4 h-4 text-warning" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-text-primary font-medium">Meeting scheduled</div>
                      <div class="text-text-secondary text-xs">2 weeks ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {:else if activeTab === 'details'}
          <div class="bg-surface border border-border rounded-lg p-6">
            <h2 class="text-lg font-semibold text-text-primary mb-4">Additional Details</h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label for="birthdate" class="block text-sm font-medium text-text-primary mb-1">
                  Birth Date
                </label>
                <input
                  id="birthdate"
                  type="date"
                  bind:value={contact.birthdate}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-text-primary mb-1">
                  Status
                </label>
                <select
                  id="status"
                  bind:value={contact.status}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div class="col-span-2">
                <label for="ownerName" class="block text-sm font-medium text-text-primary mb-1">
                  Owner
                </label>
                <input
                  id="ownerName"
                  type="text"
                  bind:value={contact.ownerName}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                />
              </div>
            </div>
          </div>
        {:else}
          <div class="bg-surface border border-border rounded-lg p-12 text-center">
            <User class="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-text-primary mb-2">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <p class="text-text-secondary">This section is under development</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
