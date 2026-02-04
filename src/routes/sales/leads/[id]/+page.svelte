<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { leadsStore } from '$lib/stores';
  import {
    ArrowLeft,
    Save,
    X,
    Mail,
    Phone,
    Building2,
    Briefcase,
    MapPin,
    Calendar,
    User,
    Star,
    TrendingUp,
    FileText,
    Clock
  } from 'lucide-svelte';
  import type { Lead } from '$lib/types/entities';

  const leadId = $derived($page.params.id as string | undefined); // Explicitly type as string | undefined
  let lead = $state<Lead | undefined>(undefined);
  let activeTab = $state<'general' | 'details' | 'timeline'>('general');
  let isEditing = $state(false);

  // Load or initialize lead data
  $effect(() => {
    if (leadId === 'new') {
      // Initialize new lead with default values
      lead = {
        id: crypto.randomUUID(), // Generate a new ID for new leads
        topic: '',
        firstName: '',
        lastName: '',
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        mobilePhone: '',
        jobTitle: '',
        leadStatus: 'New',
        rating: 'Warm',
        leadSource: 'Web',
        createdOn: new Date(),
        modifiedOn: new Date(),
        createdBy: 'Current User',
        modifiedBy: 'Current User',
        ownerId: 'user-001', // Mock current user
        ownerName: 'Current User',
        status: 'Active'
      };
      isEditing = true;
    } else if (leadId) {
      // Load existing lead
      lead = leadsStore.getById(leadId);
    } else {
      // If no leadId and not 'new', it's an invalid state, maybe redirect or show error
      lead = undefined; // Ensure lead is undefined for "not found" case
    }
  });

  function handleBack() {
    goto('/sales/leads');
  }

  function handleSave() {
    if (!lead || !leadId) return; // Ensure lead and leadId are defined

    if (leadId === 'new') {
      // Create new lead
      const newLead = leadsStore.create(lead); // Use the lead object directly
      goto(`/sales/leads/${newLead.id}`);
    } else {
      // Update existing lead
      leadsStore.update(lead.id, lead); // Use lead.id which is guaranteed to be a string
      isEditing = false;
    }
  }

  function handleSaveAndClose() {
    handleSave();
    setTimeout(() => handleBack(), 100);
  }

  function handleCancel() {
    if (leadId === 'new') {
      handleBack();
    } else if (leadId) { // Only reload if there's an existing leadId
      // Reload lead data
      lead = leadsStore.getById(leadId);
      isEditing = false;
    }
  }

  // Update fullName when firstName or lastName changes, only if lead is defined
  $effect(() => {
    if (lead && (lead.firstName !== undefined || lead.lastName !== undefined)) {
      lead.fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
    }
  });

  // Helper function to get status badge color
  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'New': 'bg-info/10 text-info border-info/20',
      'Contacted': 'bg-primary/10 text-primary border-primary/20',
      'Qualified': 'bg-success/10 text-success border-success/20',
      'Lost': 'bg-error/10 text-error border-error/20',
      'Disqualified': 'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20'
    };
    return colors[status] || 'bg-text-secondary/10 text-text-secondary border-text-secondary/20';
  }

  function getRatingColor(rating: string): string {
    const colors: Record<string, string> = {
      'Hot': 'bg-error/10 text-error border-error/20',
      'Warm': 'bg-warning/10 text-warning border-warning/20',
      'Cold': 'bg-info/10 text-info border-info/20'
    };
    return colors[rating] || 'bg-text-secondary/10 text-text-secondary border-text-secondary/20';
  }

  function formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

{#if !lead}
  <div class="flex items-center justify-center h-full">
    <div class="text-center">
      <p class="text-text-secondary text-lg">Lead not found</p>
      <button
        onclick={handleBack}
        class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors"
      >
        Back to Leads
      </button>
    </div>
  </div>
{:else}
  <div class="h-full flex flex-col">
    <!-- Page Header -->
    <div class="bg-surface border-b border-border px-6 py-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <button
            onclick={handleBack}
            class="p-2 hover:bg-background rounded transition-colors"
            title="Back to Leads"
          >
            <ArrowLeft class="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h1 class="text-2xl font-semibold text-text-primary">
              {leadId === 'new' ? 'New Lead' : lead.fullName || 'Untitled Lead'}
            </h1>
            <p class="text-sm text-text-secondary mt-1">
              {lead.companyName || 'No company'} • {lead.jobTitle || 'No job title'}
            </p>
          </div>
          {#if leadId !== 'new'}
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusColor(lead.leadStatus)}">
                {lead.leadStatus}
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getRatingColor(lead.rating)}">
                {lead.rating}
              </span>
            </div>
          {/if}
        </div>
        <div class="flex items-center gap-3">
          {#if isEditing}
            <button
              onclick={handleCancel}
              class="px-4 py-2 text-sm border border-border rounded hover:bg-background transition-colors text-text-primary"
            >
              <X class="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              onclick={handleSave}
              class="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-hover transition-colors"
            >
              <Save class="w-4 h-4 inline mr-2" />
              Save
            </button>
            <button
              onclick={handleSaveAndClose}
              class="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-hover transition-colors"
            >
              <Save class="w-4 h-4 inline mr-2" />
              Save & Close
            </button>
          {:else}
            <button
              onclick={() => isEditing = true}
              class="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-hover transition-colors"
            >
              Edit
            </button>
          {/if}
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-6 border-b border-border -mb-4">
        <button
          class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors {activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}"
          onclick={() => activeTab = 'general'}
        >
          General
        </button>
        <button
          class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors {activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}"
          onclick={() => activeTab = 'details'}
        >
          Details
        </button>
        <button
          class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors {activeTab === 'timeline' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}"
          onclick={() => activeTab = 'timeline'}
        >
          Timeline
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-6">
      {#if activeTab === 'general'}
        <div class="max-w-4xl mx-auto">
          <!-- Summary Section -->
          <div class="bg-surface rounded-lg border border-border p-6 mb-6">
            <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <User class="w-5 h-5" />
              Contact Information
            </h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-text-secondary mb-2">
                  First Name <span class="text-error">*</span>
                </label>
                <input
                  id="firstName"
                  bind:value={lead.firstName}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-text-secondary mb-2">
                  Last Name <span class="text-error">*</span>
                </label>
                <input
                  id="lastName"
                  bind:value={lead.lastName}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <Mail class="w-4 h-4" />
                  Email <span class="text-error">*</span>
                </label>
                <input
                  id="email"
                  bind:value={lead.email}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <Phone class="w-4 h-4" />
                  Business Phone
                </label>
                <input
                  id="phone"
                  bind:value={lead.phone}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="mobilePhone" class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <Phone class="w-4 h-4" />
                  Mobile Phone
                </label>
                <input
                  id="mobilePhone"
                  bind:value={lead.mobilePhone}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="jobTitle" class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <Briefcase class="w-4 h-4" />
                  Job Title
                </label>
                <input
                  id="jobTitle"
                  bind:value={lead.jobTitle}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
            </div>
          </div>

          <!-- Company Information -->
          <div class="bg-surface rounded-lg border border-border p-6 mb-6">
            <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Building2 class="w-5 h-5" />
              Company Information
            </h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label for="companyName" class="block text-sm font-medium text-text-secondary mb-2">
                  Company Name <span class="text-error">*</span>
                </label>
                <input
                  id="companyName"
                  bind:value={lead.companyName}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="industryCode" class="block text-sm font-medium text-text-secondary mb-2">
                  Industry
                </label>
                <input
                  id="industryCode"
                  bind:value={lead.industryCode}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="revenue" class="block text-sm font-medium text-text-secondary mb-2">
                  Annual Revenue
                </label>
                <input
                  id="revenue"
                  bind:value={lead.revenue}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="numberOfEmployees" class="block text-sm font-medium text-text-secondary mb-2">
                  Number of Employees
                </label>
                <input
                  id="numberOfEmployees"
                  bind:value={lead.numberOfEmployees}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
            </div>
          </div>

          <!-- Lead Information -->
          <div class="bg-surface rounded-lg border border-border p-6 mb-6">
            <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp class="w-5 h-5" />
              Lead Information
            </h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label for="topic" class="block text-sm font-medium text-text-secondary mb-2">
                  Topic
                </label>
                <input
                  id="topic"
                  bind:value={lead.topic}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="rating" class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <Star class="w-4 h-4" />
                  Rating
                </label>
                <select
                  id="rating"
                  bind:value={lead.rating}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                >
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>
              <div>
                <label for="leadStatus" class="block text-sm font-medium text-text-secondary mb-2">
                  Status
                </label>
                <select
                  id="leadStatus"
                  bind:value={lead.leadStatus}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                  <option value="Disqualified">Disqualified</option>
                </select>
              </div>
              <div>
                <label for="leadSource" class="block text-sm font-medium text-text-secondary mb-2">
                  Lead Source
                </label>
                <select
                  id="leadSource"
                  bind:value={lead.leadSource}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                >
                  <option value="Web">Web</option>
                  <option value="Phone">Phone</option>
                  <option value="Referral">Referral</option>
                  <option value="Partner">Partner</option>
                  <option value="Event">Event</option>
                  <option value="Advertisement">Advertisement</option>
                </select>
              </div>
              <div class="col-span-2">
                <label for="description" class="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <FileText class="w-4 h-4" />
                  Description
                </label>
                <textarea
                  id="description"
                  bind:value={lead.description}
                  disabled={!isEditing}
                  rows="4"
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div class="bg-surface rounded-lg border border-border p-6">
            <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <MapPin class="w-5 h-5" />
              Address Information
            </h2>
            <div class="grid grid-cols-2 gap-6">
              <div class="col-span-2">
                <label for="address" class="block text-sm font-medium text-text-secondary mb-2">
                  Street Address
                </label>
                <input
                  id="address"
                  bind:value={lead.address}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="city" class="block text-sm font-medium text-text-secondary mb-2">
                  City
                </label>
                <input
                  id="city"
                  bind:value={lead.city}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="state" class="block text-sm font-medium text-text-secondary mb-2">
                  State/Province
                </label>
                <input
                  id="state"
                  bind:value={lead.state}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="zipCode" class="block text-sm font-medium text-text-secondary mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  id="zipCode"
                  bind:value={lead.zipCode}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="country" class="block text-sm font-medium text-text-secondary mb-2">
                  Country
                </label>
                <input
                  id="country"
                  bind:value={lead.country}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface text-text-primary disabled:bg-background disabled:text-text-secondary"
                />
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === 'details'}
        <div class="max-w-4xl mx-auto">
          <div class="bg-surface rounded-lg border border-border p-6">
            <h2 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Clock class="w-5 h-5" />
              System Information
            </h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label for="createdOn" class="block text-sm font-medium text-text-secondary mb-2">
                  Created On
                </label>
                <div id="createdOn" class="text-text-primary">{formatDate(lead.createdOn)}</div>
              </div>
              <div>
                <label for="createdBy" class="block text-sm font-medium text-text-secondary mb-2">
                  Created By
                </label>
                <div id="createdBy" class="text-text-primary">{lead.createdBy}</div>
              </div>
              <div>
                <label for="modifiedOn" class="block text-sm font-medium text-text-secondary mb-2">
                  Modified On
                </label>
                <div id="modifiedOn" class="text-text-primary">{formatDate(lead.modifiedOn)}</div>
              </div>
              <div>
                <label for="modifiedBy" class="block text-sm font-medium text-text-secondary mb-2">
                  Modified By
                </label>
                <div id="modifiedBy" class="text-text-primary">{lead.modifiedBy}</div>
              </div>
              <div>
                <label for="owner" class="block text-sm font-medium text-text-secondary mb-2">
                  Owner
                </label>
                <div id="owner" class="text-text-primary">{lead.ownerName}</div>
              </div>
              <div>
                <label for="recordStatus" class="block text-sm font-medium text-text-secondary mb-2">
                  Record Status
                </label>
                <div id="recordStatus" class="text-text-primary">{lead.status}</div>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === 'timeline'}
        <div class="max-w-4xl mx-auto">
          <div class="bg-surface rounded-lg border border-border p-6">
            <div class="text-center py-12">
              <Clock class="w-12 h-12 text-text-tertiary mx-auto mb-4" />
              <h3 class="text-lg font-medium text-text-primary mb-2">Timeline Coming Soon</h3>
              <p class="text-text-secondary">
                Activity timeline will show all interactions, notes, and history for this lead.
              </p>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}
