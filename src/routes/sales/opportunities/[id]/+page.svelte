<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { opportunitiesStore } from '$lib/stores';
  import {
    Save,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    CheckSquare,
    FileText,
    ChevronRight,
    Edit,
    Trash2,
    X,
  } from 'lucide-svelte';
  import { formatCurrency, formatPercentage } from '$lib/utils/formatting';
  import { formatDate } from '$lib/utils/date-utils';
  import { salesStages, pipelinePhases } from '$lib/data/option-sets';
  import type { Opportunity } from '$lib/types/entities';
  import { cn } from '$lib/utils'; // Import cn utility

  const opportunityId = $derived($page.params.id as string | undefined);
  let opportunity = $state<Opportunity | undefined>(undefined);
  let activeTab = $state('summary');
  let isEditing = $state(false);

  // Load or initialize opportunity data
  $effect(() => {
    if (opportunityId === 'new') {
      opportunity = {
        id: crypto.randomUUID(),
        topic: '',
        accountId: undefined,
        accountName: undefined,
        contactId: undefined,
        contactName: undefined,
        estimatedRevenue: 0,
        estimatedCloseDate: new Date(),
        probability: 0,
        pipelinePhase: 'Qualify',
        salesStage: 'Prospecting',
        opportunityRating: 'Warm',
        currentSituation: '',
        customerNeed: '',
        proposedSolution: '',
        decisionMaker: '',
        budgetAmount: 0,
        purchaseTimeframe: '',
        createdOn: new Date(),
        modifiedOn: new Date(),
        createdBy: 'Current User',
        modifiedBy: 'Current User',
        ownerId: 'user-001',
        ownerName: 'Current User',
        status: 'Open',
      };
      isEditing = true;
    } else if (opportunityId) {
      opportunity = opportunitiesStore.getById(opportunityId);
    } else {
      opportunity = undefined;
    }
  });

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'details', label: 'Details' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'stakeholders', label: 'Stakeholders' },
  ];

  // Business Process Flow stages (now dynamic based on opportunity state)
  type BpfStageItem = {
    id: string;
    label: string;
    completed: boolean;
    active: boolean;
  };

  let bpfStages = $derived<BpfStageItem[]>(
    (() => {
      if (!opportunity) return [];
      const currentOpportunity = opportunity as Opportunity; // Null assertion (can be opportunity! instead)

      const currentPhaseIndex = pipelinePhases.findIndex(
        (p) => p.value === currentOpportunity.pipelinePhase
      );

      return pipelinePhases.map((phase, index) => ({
        id: phase.value,
        label: phase.label,
        completed: index < currentPhaseIndex,
        active: index === currentPhaseIndex,
      }));
    })()
  );

  function handleBack() {
    goto('/sales/opportunities');
  }

  function handleEdit() {
    isEditing = true;
  }

  function handleSave() {
    if (!opportunity || !opportunityId) return;

    if (opportunityId === 'new') {
      const newOpportunity = opportunitiesStore.create(opportunity);
      goto(`/sales/opportunities/${newOpportunity.id}`);
    } else {
      opportunitiesStore.update(opportunity.id, opportunity);
      isEditing = false;
    }
  }

  function handleSaveAndClose() {
    handleSave();
    setTimeout(() => handleBack(), 100);
  }

  function handleCancel() {
    if (opportunityId === 'new') {
      handleBack();
    } else if (opportunityId) {
      opportunity = opportunitiesStore.getById(opportunityId); // Reload original data
      isEditing = false;
    }
  }

  function handleDelete() {
    // TODO: Implement delete functionality
    console.log('Delete opportunity:', opportunity);
  }
</script>

{#if opportunity === undefined}
  <div class="flex items-center justify-center h-full">
    <div class="text-center">
      <h2 class="text-xl font-semibold text-text-primary mb-2">Opportunity Not Found</h2>
      <p class="text-text-secondary mb-4">The opportunity you're looking for doesn't exist.</p>
      <a href="/sales/opportunities" class="text-primary hover:underline">
        Back to Opportunities
      </a>
    </div>
  </div>
{:else}
  <div class="flex flex-col h-full">
    <!-- Business Process Flow -->
    <div class="bg-primary text-white px-6 py-3">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">Opportunity Sales Process</span>
        </div>
        {#if isEditing}
          <button class="text-sm hover:bg-primary-hover px-3 py-1 rounded transition-colors">
            Switch Process
          </button>
        {/if}
      </div>
      <div class="flex items-center gap-0">
        {#each bpfStages as stage, index}
          <div class="flex items-center flex-1">
            <div
              class={cn(
                "flex items-center gap-3 px-4 py-2 bg-white/10 relative",
                stage.active ? "bg-white/20" : "",
                stage.completed ? "opacity-70" : ""
              )}
              style="clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%);"
            >
              <div
                class={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  stage.completed ? "bg-success" : "",
                  stage.active ? "bg-white text-primary" : "bg-white/30"
                )}
              >
                {#if stage.completed}
                  <CheckSquare class="w-4 h-4" />
                {:else}
                  <span class="text-xs font-semibold">{index + 1}</span>
                {/if}
              </div>
              <span class="text-sm font-medium">{stage.label}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Header -->
    <div class="bg-surface border-b border-border px-6 py-4">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 text-sm text-text-secondary mb-2">
            <a href="/sales/opportunities" class="hover:text-text-primary">Opportunities</a>
            <ChevronRight class="w-4 h-4" />
            <span class="text-text-primary">{opportunity.topic}</span>
          </div>
          <h1 class="text-2xl font-semibold text-text-primary mb-2">{opportunity.topic}</h1>
          <div class="flex items-center gap-4 text-sm text-text-secondary">
            <span>Owner: {opportunity.ownerName}</span>
            <span>•</span>
            <span>Modified: {formatDate(opportunity.modifiedOn)}</span>
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
              "px-4 py-2 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-primary"
                : "text-text-secondary hover:text-text-primary"
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
                <h2 class="text-lg font-semibold text-text-primary mb-4">Opportunity Information</h2>
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <label for="topic" class="block text-sm font-medium text-text-primary mb-1">
                      Topic <span class="text-error">*</span>
                    </label>
                    <input
                      id="topic"
                      type="text"
                      bind:value={opportunity.topic}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="accountName" class="block text-sm font-medium text-text-primary mb-1">
                      Account <span class="text-error">*</span>
                    </label>
                    <input
                      id="accountName"
                      type="text"
                      bind:value={opportunity.accountName}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="estimatedRevenue" class="block text-sm font-medium text-text-primary mb-1">
                      Est. Revenue
                    </label>
                    <input
                      id="estimatedRevenue"
                      type="number"
                      bind:value={opportunity.estimatedRevenue}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="estimatedCloseDate" class="block text-sm font-medium text-text-primary mb-1">
                      Est. Close Date
                    </label>
                    <input
                      id="estimatedCloseDate"
                      type="date"
                      bind:value={opportunity.estimatedCloseDate}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="probability" class="block text-sm font-medium text-text-primary mb-1">
                      Probability
                    </label>
                    <input
                      id="probability"
                      type="number"
                      bind:value={opportunity.probability}
                      disabled={!isEditing}
                      min="0"
                      max="100"
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    />
                  </div>
                  <div>
                    <label for="pipelinePhase" class="block text-sm font-medium text-text-primary mb-1">
                      Pipeline Phase
                    </label>
                    <select
                      id="pipelinePhase"
                      bind:value={opportunity.pipelinePhase}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    >
                      {#each pipelinePhases as phase}
                        <option value={phase.value}>{phase.label}</option>
                      {/each}
                    </select>
                  </div>
                  <div>
                    <label for="salesStage" class="block text-sm font-medium text-text-primary mb-1">
                      Sales Stage
                    </label>
                    <select
                      id="salesStage"
                      bind:value={opportunity.salesStage}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    >
                      {#each salesStages as stage}
                        <option value={stage.value}>{stage.label}</option>
                      {/each}
                    </select>
                  </div>
                  <div>
                    <label for="opportunityRating" class="block text-sm font-medium text-text-primary mb-1">
                      Rating
                    </label>
                    <select
                      id="opportunityRating"
                      bind:value={opportunity.opportunityRating}
                      disabled={!isEditing}
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                    >
                      <option value="">--Select--</option>
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="bg-surface border border-border rounded-lg p-6">
                <h2 class="text-lg font-semibold text-text-primary mb-4">Description</h2>
                <textarea
                  id="description"
                  bind:value={opportunity.description}
                  disabled={!isEditing}
                  rows="4"
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-100 disabled:text-text-secondary"
                ></textarea>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Key Metrics -->
              <div class="bg-surface border border-border rounded-lg p-6">
                <h3 class="text-sm font-semibold text-text-primary mb-4 uppercase">Key Metrics</h3>
                <div class="space-y-4">
                  <div>
                    <label for="estimatedRevenueDisplay" class="text-xs text-text-secondary mb-1">Est. Revenue</label>
                    <input
                      id="estimatedRevenueDisplay"
                      type="text"
                      value={formatCurrency(opportunity.estimatedRevenue)}
                      disabled={true}
                      class="text-xl font-bold text-primary bg-transparent focus:outline-none w-full disabled:text-text-primary"
                    />
                  </div>
                  <div>
                    <label for="probabilityDisplay" class="text-xs text-text-secondary mb-1">Probability</label>
                    <input
                      id="probabilityDisplay"
                      type="text"
                      value={formatPercentage(opportunity.probability)}
                      disabled={true}
                      class="text-xl font-bold text-text-primary bg-transparent focus:outline-none w-full disabled:text-text-primary"
                    />
                  </div>
                  <div>
                    <label for="weightedRevenueDisplay" class="text-xs text-text-secondary mb-1">Weighted Revenue</label>
                    <input
                      id="weightedRevenueDisplay"
                      type="text"
                      value={formatCurrency(opportunity.estimatedRevenue * (opportunity.probability / 100))}
                      disabled={true}
                      class="text-xl font-bold text-success bg-transparent focus:outline-none w-full disabled:text-text-primary"
                    />
                  </div>
                  <div>
                    <label for="daysToCloseDisplay" class="text-xs text-text-secondary mb-1">Days to Close</label>
                    <input
                      id="daysToCloseDisplay"
                      type="text"
                      value={
                        opportunity.estimatedCloseDate && !isNaN(new Date(opportunity.estimatedCloseDate).getTime())
                          ? Math.ceil(
                              (new Date(opportunity.estimatedCloseDate).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            ).toString()
                          : 'N/A'
                      }
                      disabled={true}
                      class="text-xl font-bold text-text-primary bg-transparent focus:outline-none w-full disabled:text-text-primary"
                    />
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-surface border border-border rounded-lg p-6">
                <h3 class="text-sm font-semibold text-text-primary mb-4 uppercase">Quick Actions</h3>
                <div class="space-y-2">
                  <button
                    class="w-full px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover rounded-md transition-colors flex items-center gap-2 border border-border"
                  >
                    <FileText class="w-4 h-4" />
                    Create Quote
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
                    Add Task
                  </button>
                </div>
              </div>

              <!-- Timeline Preview -->
              <div class="bg-surface border border-border rounded-lg p-6">
                <h3 class="text-sm font-semibold text-text-primary mb-4 uppercase">
                  Recent Activity
                </h3>
                <div class="space-y-3 text-sm">
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText class="w-4 h-4 text-primary" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-text-primary font-medium">Proposal sent</div>
                      <div class="text-text-secondary text-xs">2 days ago</div>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Phone class="w-4 h-4 text-success" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-text-primary font-medium">Phone call completed</div>
                      <div class="text-text-secondary text-xs">5 days ago</div>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center flex-shrink-0">
                      <Mail class="w-4 h-4 text-info" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-text-primary font-medium">Email sent to contact</div>
                      <div class="text-text-secondary text-xs">1 week ago</div>
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
                <label for="currentSituation" class="block text-sm font-medium text-text-primary mb-1">
                  Current Situation
                </label>
                <textarea
                  id="currentSituation"
                  bind:value={opportunity.currentSituation}
                  disabled={!isEditing}
                  rows="3"
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-100 disabled:text-text-secondary"
                ></textarea>
              </div>
              <div>
                <label for="customerNeed" class="block text-sm font-medium text-text-primary mb-1">
                  Customer Need
                </label>
                <textarea
                  id="customerNeed"
                  bind:value={opportunity.customerNeed}
                  disabled={!isEditing}
                  rows="3"
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-100 disabled:text-text-secondary"
                ></textarea>
              </div>
              <div>
                <label for="proposedSolution" class="block text-sm font-medium text-text-primary mb-1">
                  Proposed Solution
                </label>
                <textarea
                  id="proposedSolution"
                  bind:value={opportunity.proposedSolution}
                  disabled={!isEditing}
                  rows="3"
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-100 disabled:text-text-secondary"
                ></textarea>
              </div>
              <div>
                <label for="decisionMaker" class="block text-sm font-medium text-text-primary mb-1">
                  Decision Maker
                </label>
                <input
                  id="decisionMaker"
                  type="text"
                  bind:value={opportunity.decisionMaker}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="budgetAmount" class="block text-sm font-medium text-text-primary mb-1">
                  Budget Amount
                </label>
                <input
                  id="budgetAmount"
                  type="number"
                  bind:value={opportunity.budgetAmount}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                />
              </div>
              <div>
                <label for="purchaseTimeframe" class="block text-sm font-medium text-text-primary mb-1">
                  Purchase Timeframe
                </label>
                <input
                  id="purchaseTimeframe"
                  type="text"
                  bind:value={opportunity.purchaseTimeframe}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                />
              </div>
            </div>
          </div>
        {:else}
          <div class="bg-surface border border-border rounded-lg p-12 text-center">
            <FileText class="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-text-primary mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
            <p class="text-text-secondary">This section is under development</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
