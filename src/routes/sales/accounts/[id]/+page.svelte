<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import {
    accountsStore,
    getContactsByAccount,
    getOpportunitiesByAccount,
    getActivitiesByRegarding
  } from '$lib/stores';
  import { formatCurrency, formatNumber, formatPhone } from '$lib/utils/formatting';
  import { leadRatings } from '$lib/data'; // Import leadRatings for colors
  import {
    Building2,
    Phone,
    Mail,
    Globe,
    MapPin,
    DollarSign,
    Users,
    Star,
    Edit,
    Trash2,
    ChevronLeft,
    User,
    TrendingUp,
    Calendar,
    MessageSquare,
    Save,
    X
  } from 'lucide-svelte';
  import type { Account } from '$lib/types/entities';

  const accountId = $derived($page.params.id as string | undefined);
  let account = $state<Account | undefined>(undefined);
  let activeTab = $state('general');
  let isEditing = $state(false);

  // Load account data
  $effect(() => {
    if (accountId) {
      account = accountsStore.getById(accountId);
    } else {
      account = undefined; // Ensure account is undefined for "not found" case
    }
  });

  const contacts = $derived(account ? getContactsByAccount(account.id) : []);
  const opportunities = $derived(account ? getOpportunitiesByAccount(account.id) : []);
  const activities = $derived(account ? getActivitiesByRegarding(account.id) : []);

  function handleBack() {
    goto('/sales/accounts');
  }

  function handleEdit() {
    isEditing = true;
  }

  function handleSave() {
    if (!account || !accountId) return;

    accountsStore.update(account.id, account);
    isEditing = false;
  }

  function handleCancel() {
    if (accountId) {
      account = accountsStore.getById(accountId); // Reload original data
      isEditing = false;
    }
  }

  function handleDelete() {
    // TODO: Confirm and delete
    console.log('Delete account:', account);
  }

  function handleContactClick(contactId: string) {
    goto(`/sales/contacts/${contactId}`);
  }

  function handleOpportunityClick(opportunityId: string) {
    goto(`/sales/opportunities/${opportunityId}`);
  }

  function getRatingColorClass(rating: string | undefined): string {
    const ratingOption = leadRatings.find(r => r.value === rating); // Reusing leadRatings for colors
    if (!ratingOption) return '';
    if (ratingOption.value === 'Hot') return 'text-red-500';
    if (ratingOption.value === 'Warm') return 'text-yellow-500';
    if (ratingOption.value === 'Cold') return 'text-blue-500';
    return '';
  }
</script>

{#if !account}
  <div class="flex flex-col items-center justify-center py-12">
    <Building2 class="w-16 h-16 text-text-secondary/50 mb-4" />
    <h2 class="text-xl font-semibold text-text-primary mb-2">Account Not Found</h2>
    <p class="text-text-secondary mb-4">The account you're looking for doesn't exist.</p>
    <button
      onclick={handleBack}
      class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      <ChevronLeft class="w-4 h-4" />
      Back to Accounts
    </button>
  </div>
{:else}
  <div class="max-w-full">
    <!-- Header -->
    <div class="mb-6">
      <button
        onclick={handleBack}
        class="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <ChevronLeft class="w-4 h-4" />
        Back to Accounts
      </button>

      <div class="flex items-start justify-between">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 class="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 class="text-3xl font-semibold text-text-primary mb-1">
              {account.accountName}
            </h1>
            <div class="flex items-center gap-3 text-sm text-text-secondary">
              <span>{account.accountNumber || 'No account number'}</span>
              <span>•</span>
              <span>Owner: {account.ownerName}</span>
              {#if account.accountRating}
                <span>•</span>
                                  <div class="flex items-center gap-1">
                                    <Star
                                      class="w-4 h-4 {getRatingColorClass(account.accountRating)}"
                                      fill="currentColor"
                                    />
                                    <span>{account.accountRating}</span>
                                  </div>              {/if}
            </div>
          </div>
        </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2">
                    {#if isEditing}
                      <button
                        onclick={handleCancel}
                        class="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-background transition-colors"
                      >
                        <X class="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onclick={handleSave}
                        class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Save class="w-4 h-4" />
                        Save
                      </button>
                    {:else}
                      <button
                        onclick={handleEdit}
                        class="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-background transition-colors"
                      >
                        <Edit class="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onclick={handleDelete}
                        class="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-error/10 hover:text-error transition-colors"
                      >
                        <Trash2 class="w-4 h-4" />
                        Delete
                      </button>
                    {/if}
                  </div>      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <DollarSign class="w-5 h-5 text-success" />
          </div>
          <div>
            <div class="text-xl font-bold text-text-primary">
              {formatCurrency(account.annualRevenue)}
            </div>
            <div class="text-xs text-text-secondary">Annual Revenue</div>
          </div>
        </div>
      </div>

      <div class="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
            <Users class="w-5 h-5 text-info" />
          </div>
          <div>
            <div class="text-xl font-bold text-text-primary">
              {formatNumber(account.numberOfEmployees)}
            </div>
            <div class="text-xs text-text-secondary">Employees</div>
          </div>
        </div>
      </div>

      <div class="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User class="w-5 h-5 text-primary" />
          </div>
          <div>
            <div class="text-xl font-bold text-text-primary">{contacts.length}</div>
            <div class="text-xs text-text-secondary">Contacts</div>
          </div>
        </div>
      </div>

      <div class="bg-surface p-4 rounded-lg shadow-sm border border-border">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <TrendingUp class="w-5 h-5 text-warning" />
          </div>
          <div>
            <div class="text-xl font-bold text-text-primary">{opportunities.length}</div>
            <div class="text-xs text-text-secondary">Opportunities</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-surface rounded-lg shadow-sm border border-border">
      <!-- Tab Headers -->
      <div class="border-b border-border">
        <div class="flex gap-1 px-4">
          <button
            onclick={() => (activeTab = 'general')}
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            class:border-primary={activeTab === 'general'}
            class:text-primary={activeTab === 'general'}
            class:border-transparent={activeTab !== 'general'}
            class:text-text-secondary={activeTab !== 'general'}
            class:hover:text-text-primary={activeTab !== 'general'}
          >
            General
          </button>
          <button
            onclick={() => (activeTab = 'contacts')}
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            class:border-primary={activeTab === 'contacts'}
            class:text-primary={activeTab === 'contacts'}
            class:border-transparent={activeTab !== 'contacts'}
            class:text-text-secondary={activeTab !== 'contacts'}
            class:hover:text-text-primary={activeTab !== 'contacts'}
          >
            Contacts ({contacts.length})
          </button>
          <button
            onclick={() => (activeTab = 'opportunities')}
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            class:border-primary={activeTab === 'opportunities'}
            class:text-primary={activeTab === 'opportunities'}
            class:border-transparent={activeTab !== 'opportunities'}
            class:text-text-secondary={activeTab !== 'opportunities'}
            class:hover:text-text-primary={activeTab !== 'opportunities'}
          >
            Opportunities ({opportunities.length})
          </button>
          <button
            onclick={() => (activeTab = 'activities')}
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            class:border-primary={activeTab === 'activities'}
            class:text-primary={activeTab === 'activities'}
            class:border-transparent={activeTab !== 'activities'}
            class:text-text-secondary={activeTab !== 'activities'}
            class:hover:text-text-primary={activeTab !== 'activities'}
          >
            Activities ({activities.length})
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        {#if activeTab === 'general'}
          <!-- General Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>

              <div class="flex items-start gap-3">
                <Phone class="w-5 h-5 text-text-secondary mt-0.5" />
                                  <div>
                                    <div class="text-sm text-text-secondary">Phone</div>
                                    <input
                                      type="text"
                                      bind:value={account.phone}
                                      disabled={!isEditing}
                                      class="text-text-primary bg-transparent focus:outline-none w-full"
                                    />
                                  </div>              </div>

              {#if account.email}
                <div class="flex items-start gap-3">
                  <Mail class="w-5 h-5 text-text-secondary mt-0.5" />
                  <div>
                    <div class="text-sm text-text-secondary">Email</div>
                    <input
                      type="email"
                      bind:value={account.email}
                      disabled={!isEditing}
                      class="text-primary hover:underline bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>
              {/if}

              {#if account.website}
                <div class="flex items-start gap-3">
                  <Globe class="w-5 h-5 text-text-secondary mt-0.5" />
                  <div>
                    <div class="text-sm text-text-secondary">Website</div>
                    <input
                      type="url"
                      bind:value={account.website}
                      disabled={!isEditing}
                      class="text-primary hover:underline bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>
              {/if}

              <div class="flex items-start gap-3">
                <MapPin class="w-5 h-5 text-text-secondary mt-0.5" />
                                  <div>
                                    <div class="text-sm text-text-secondary">Address</div>
                                    <textarea
                                      bind:value={account.address}
                                      disabled={!isEditing}
                                      rows="3"
                                      class="text-text-primary bg-transparent focus:outline-none w-full"
                                    ></textarea>
                                  </div>              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-text-primary mb-4">
                Company Information
              </h3>

              <div>
                <div class="text-sm text-text-secondary mb-1">Industry</div>
                <input
                  type="text"
                  bind:value={account.industry}
                  disabled={!isEditing}
                  class="text-text-primary bg-transparent focus:outline-none w-full"
                />
              </div>

              {#if account.annualRevenue !== undefined}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Annual Revenue</div>
                  <input
                    type="number"
                    bind:value={account.annualRevenue}
                    disabled={!isEditing}
                    class="text-text-primary font-semibold bg-transparent focus:outline-none w-full"
                  />
                </div>
              {/if}

              {#if account.numberOfEmployees !== undefined}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Number of Employees</div>
                  <input
                    type="number"
                    bind:value={account.numberOfEmployees}
                    disabled={!isEditing}
                    class="text-text-primary bg-transparent focus:outline-none w-full"
                  />
                </div>
              {/if}

              {#if account.description !== undefined}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Description</div>
                  <textarea
                    bind:value={account.description}
                    disabled={!isEditing}
                    rows="3"
                    class="text-text-primary bg-transparent focus:outline-none w-full"
                  ></textarea>
                </div>
              {/if}

              {#if account.parentAccountName !== undefined}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Parent Account</div>
                  <input
                    type="text"
                    bind:value={account.parentAccountName}
                    disabled={!isEditing}
                    class="text-text-primary bg-transparent focus:outline-none w-full"
                  />
                </div>
              {/if}
            </div>
          </div>
        {:else if activeTab === 'contacts'}
          <!-- Contacts List -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-text-primary">Contacts</h3>
              <button
                class="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <User class="w-4 h-4" />
                New Contact
              </button>
            </div>

            {#if contacts.length > 0}
              <div class="space-y-3">
                {#each contacts as contact (contact.id)}
                  <button
                    onclick={() => handleContactClick(contact.id)}
                    class="p-4 border border-border rounded-lg hover:bg-background/50 cursor-pointer transition-colors w-full text-left"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User class="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div class="font-medium text-text-primary mb-1">
                            {contact.fullName}
                            {#if contact.isPrimaryContact}
                              <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                Primary
                              </span>
                            {/if}
                          </div>
                          {#if contact.jobTitle}
                            <div class="text-sm text-text-secondary mb-2">
                              {contact.jobTitle}
                              {#if contact.department}
                                • {contact.department}
                              {/if}
                            </div>
                          {/if}
                          <div class="flex items-center gap-4 text-sm">
                            <div class="flex items-center gap-1.5 text-text-secondary">
                              <Mail class="w-4 h-4" />
                              {contact.email}
                            </div>
                            <div class="flex items-center gap-1.5 text-text-secondary">
                              <Phone class="w-4 h-4" />
                              {formatPhone(contact.mobilePhone)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
            {:else}
              <div class="text-center py-12">
                <User class="w-12 h-12 text-text-secondary/50 mx-auto mb-3" />
                <p class="text-text-secondary">No contacts found for this account</p>
              </div>
            {/if}
          </div>
        {:else if activeTab === 'opportunities'}
          <!-- Opportunities List -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-text-primary">Opportunities</h3>
              <button
                class="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <TrendingUp class="w-4 h-4" />
                New Opportunity
              </button>
            </div>

            {#if opportunities.length > 0}
              <div class="space-y-3">
                {#each opportunities as opportunity (opportunity.id)}
                  <button
                    onclick={() => handleOpportunityClick(opportunity.id)}
                    class="p-4 border border-border rounded-lg hover:bg-background/50 cursor-pointer transition-colors w-full text-left"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <div>
                        <div class="font-medium text-text-primary mb-1">
                          {opportunity.topic}
                        </div>
                        <div class="text-sm text-text-secondary">
                          {opportunity.salesStage} • {opportunity.probability}% probability
                        </div>
                      </div>
                      {#if opportunity.opportunityRating}
                        <span
                          class="px-2 py-1 rounded text-xs font-medium"
                          class:bg-red-100={opportunity.opportunityRating === 'Hot'}
                          class:text-red-800={opportunity.opportunityRating === 'Hot'}
                          class:bg-yellow-100={opportunity.opportunityRating === 'Warm'}
                          class:text-yellow-800={opportunity.opportunityRating === 'Warm'}
                          class:bg-blue-100={opportunity.opportunityRating === 'Cold'}
                          class:text-blue-800={opportunity.opportunityRating === 'Cold'}
                        >
                          {opportunity.opportunityRating}
                        </span>
                      {/if}
                    </div>
                    <div class="flex items-center gap-6 text-sm">
                      <div class="flex items-center gap-1.5">
                        <DollarSign class="w-4 h-4 text-success" />
                        <span class="font-medium text-text-primary">
                          {formatCurrency(opportunity.estimatedRevenue)}
                        </span>
                      </div>
                      <div class="flex items-center gap-1.5 text-text-secondary">
                        <Calendar class="w-4 h-4" />
                        Close: {new Date(opportunity.estimatedCloseDate).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
            {:else}
              <div class="text-center py-12">
                <TrendingUp class="w-12 h-12 text-text-secondary/50 mx-auto mb-3" />
                <p class="text-text-secondary">No opportunities found for this account</p>
              </div>
            {/if}
          </div>
        {:else if activeTab === 'activities'}
          <!-- Activities Timeline -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-text-primary">Activities</h3>
              <button
                class="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <MessageSquare class="w-4 h-4" />
                New Activity
              </button>
            </div>

            {#if activities.length > 0}
              <div class="space-y-4">
                {#each activities as activity (activity.id)}
                  <div class="flex gap-4">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        class:bg-blue-100={activity.activityType === 'Email'}
                        class:bg-green-100={activity.activityType === 'PhoneCall'}
                        class:bg-purple-100={activity.activityType === 'Task'}
                        class:bg-orange-100={activity.activityType === 'Appointment'}
                        class:bg-gray-100={activity.activityType === 'Note' ||
                          activity.activityType === 'Post'}
                      >
                        <MessageSquare class="w-4 h-4 text-text-secondary" />
                      </div>
                      {#if activities.indexOf(activity) < activities.length - 1}
                        <div class="w-0.5 h-full bg-border mt-2"></div>
                      {/if}
                    </div>
                    <div class="flex-1 pb-4">
                      <div class="flex items-start justify-between mb-1">
                        <div class="font-medium text-text-primary">{activity.subject}</div>
                        <div class="text-xs text-text-secondary">
                          {new Date(activity.createdOn).toLocaleDateString()}
                        </div>
                      </div>
                      <div class="text-sm text-text-secondary mb-2">
                        {activity.activityType} • {activity.ownerName}
                      </div>
                      {#if activity.description}
                        <div class="text-sm text-text-primary">{activity.description}</div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-12">
                <MessageSquare class="w-12 h-12 text-text-secondary/50 mx-auto mb-3" />
                <p class="text-text-secondary">No activities found for this account</p>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
