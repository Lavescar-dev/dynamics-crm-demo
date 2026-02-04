<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { casesStore } from '$lib/stores'; // Only casesStore needed
  import {
    AlertCircle,
    Calendar,
    Clock,
    Save,
    X,
    User,
    Building2,
    FileText,
    Flag,
    Activity,
    Edit,
    Trash2,
  } from 'lucide-svelte';
  import type { Case } from '$lib/types/entities';

  const caseId = $derived($page.params.id as string | undefined);
  let caseData = $state<Case | undefined>(undefined);
  let isEditing = $state(false);

  // Load or initialize case data
  $effect(() => {
    if (caseId === 'new') {
      caseData = {
        id: crypto.randomUUID(),
        caseNumber: 'NEWCASE', // Placeholder for a new case number
        caseTitle: '',
        customerId: '',
        caseStatus: 'Active',
        caseType: 'Question',
        origin: 'Web',
        priority: 'Normal',
        subject: '',
        description: '',
        resolution: '',
        assignedTo: 'Current User',
        escalated: false,
        customerName: 'New Customer', // Placeholder
        customerType: 'Account', // Placeholder
        accountId: undefined,
        contactId: undefined,
        contactName: undefined,
        firstResponseBy: undefined,
        resolveBy: undefined,
        resolvedOn: undefined,
        satisfactionRating: undefined,
        createdOn: new Date(),
        modifiedOn: new Date(),
        createdBy: 'Current User',
        modifiedBy: 'Current User',
        ownerId: 'user-001',
        ownerName: 'Current User',
        status: 'Active', // BaseEntity status
      };
      isEditing = true;
    } else if (caseId) {
      caseData = casesStore.getById(caseId);
    } else {
      caseData = undefined; // Ensure caseData is undefined for "not found" case
    }
  });

  function handleBack() {
    goto('/service/cases');
  }

  function handleEdit() {
    isEditing = true;
  }

  function handleSave() {
    if (!caseData || !caseId) return;

    if (caseId === 'new') {
      const newCase = casesStore.create(caseData);
      goto(`/service/cases/${newCase.id}`);
    } else {
      casesStore.update(caseData.id, caseData);
      isEditing = false;
    }
  }

  function handleSaveAndClose() {
    handleSave();
    setTimeout(() => handleBack(), 100);
  }

  function handleCancel() {
    if (caseId === 'new') {
      handleBack();
    } else if (caseId) {
      caseData = casesStore.getById(caseId); // Reload original data
      isEditing = false;
    }
  }

  function handleDelete() {
    // TODO: Implement delete functionality
    console.log('Delete case:', caseData);
  }

  function formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High':
        return 'text-error bg-error/10 border-error';
      case 'Normal':
        return 'text-warning bg-warning/10 border-warning';
      case 'Low':
        return 'text-success bg-success/10 border-success';
      default:
        return 'text-text-secondary bg-surface-hover border-border';
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'text-primary bg-primary/10 border-primary';
      case 'Resolved':
        return 'text-success bg-success/10 border-success';
      case 'Cancelled':
        return 'text-text-secondary bg-surface-hover border-border';
      case 'On Hold':
        return 'text-warning bg-warning/10 border-warning';
      default:
        return 'text-text-secondary bg-surface-hover border-border';
    }
  }
</script>

{#if caseData === undefined}
  <div class="flex items-center justify-center h-full">
    <div class="text-center">
      <AlertCircle class="w-16 h-16 text-error mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-text-primary mb-2">Case Not Found</h2>
      <p class="text-text-secondary mb-6">The case you're looking for doesn't exist.</p>
      <a
        href="/service/cases"
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Back to Cases
      </a>
    </div>
  </div>
{:else}
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-4">
          <a
            href="/service/cases"
            class="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X class="w-6 h-6" />
          </a>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-3xl font-semibold text-text-primary">{caseData.caseNumber}</h1>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border {getStatusColor(
                  caseData.caseStatus
                )}"
              >
                {caseData.caseStatus}
              </span>
              <span
                class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border {getPriorityColor(
                  caseData.priority
                )}"
              >
                <Flag class="w-3 h-3" />
                {caseData.priority} Priority
              </span>
            </div>
            <p class="text-text-secondary">{caseData.caseTitle}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          {#if isEditing}
            <button
              onclick={handleCancel}
              class="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
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
              class="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
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
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- General Information -->
          <div class="bg-surface rounded-lg border border-border p-6">
            <h2 class="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FileText class="w-5 h-5" />
              General Information
            </h2>
            <div class="space-y-4">
              <div>
                <label for="caseTitle" class="block text-sm font-medium text-text-primary mb-1">
                  Case Title <span class="text-error">*</span>
                </label>
                <input
                  id="caseTitle"
                  type="text"
                  bind:value={caseData.caseTitle}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                />
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-text-primary mb-1">
                  Subject <span class="text-error">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  bind:value={caseData.subject}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="priority" class="block text-sm font-medium text-text-primary mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    bind:value={caseData.priority}
                    disabled={!isEditing}
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                  >
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label for="caseStatus" class="block text-sm font-medium text-text-primary mb-1">
                    Status
                  </label>
                  <select
                    id="caseStatus"
                    bind:value={caseData.caseStatus}
                    disabled={!isEditing}
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                  >
                    <option value="Active">Active</option>
                    <option value="Resolved">Resolved</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="caseType" class="block text-sm font-medium text-text-primary mb-1">
                    Case Type
                  </label>
                  <select
                    id="caseType"
                    bind:value={caseData.caseType}
                    disabled={!isEditing}
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                  >
                    <option value="Question">Question</option>
                    <option value="Problem">Problem</option>
                    <option value="Request">Request</option>
                  </select>
                </div>

                <div>
                  <label for="origin" class="block text-sm font-medium text-text-primary mb-1">
                    Origin
                  </label>
                  <input
                    id="origin"
                    type="text"
                    bind:value={caseData.origin}
                    disabled={!isEditing}
                    class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                  />
                </div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-text-primary mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  bind:value={caseData.description}
                  disabled={!isEditing}
                  rows="4"
                  class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-100 disabled:text-text-secondary"
                ></textarea>
              </div>

              <div>
                <label for="resolution" class="block text-sm font-medium text-text-primary mb-1">
                  Resolution
                </label>
                <textarea
                  id="resolution"
                  bind:value={caseData.resolution}
                  disabled={!isEditing}
                  rows="4"
                  class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-100 disabled:text-text-secondary"
                  placeholder="Enter resolution details..."
                ></textarea>
              </div>

              <div>
                <label for="assignedTo" class="block text-sm font-medium text-text-primary mb-1">
                  Assigned To
                </label>
                <input
                  id="assignedTo"
                  type="text"
                  bind:value={caseData.assignedTo}
                  disabled={!isEditing}
                  class="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-text-secondary"
                />
              </div>

              <div class="flex items-center gap-2">
                <input
                  id="escalated"
                  type="checkbox"
                  bind:checked={caseData.escalated}
                  disabled={!isEditing}
                  class="w-4 h-4 text-primary border-border rounded focus:ring-primary disabled:opacity-50"
                />
                <label for="escalated" class="text-sm font-medium text-text-primary">
                  Escalated
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Customer Information -->
          <div class="bg-surface rounded-lg border border-border p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Building2 class="w-5 h-5" />
              Customer
            </h3>
            <div class="space-y-3">
              <div>
                <div class="text-sm text-text-secondary mb-1">Customer Name</div>
                <div class="font-medium text-text-primary">{caseData.customerName}</div>
              </div>
              <div>
                <div class="text-sm text-text-secondary mb-1">Customer Type</div>
                <div class="font-medium text-text-primary">{caseData.customerType}</div>
              </div>
              {#if caseData.contactName}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Contact</div>
                  <div class="font-medium text-text-primary">{caseData.contactName}</div>
                </div>
              {/if}
            </div>
          </div>

          <!-- Case Details -->
          <div class="bg-surface rounded-lg border border-border p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Activity class="w-5 h-5" />
              Details
            </h3>
            <div class="space-y-3">
              <div>
                <div class="text-sm text-text-secondary mb-1">Case Number</div>
                <div class="font-medium text-text-primary">{caseData.caseNumber}</div>
              </div>
              {#if caseData.severity}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Severity</div>
                  <div class="font-medium text-text-primary">{caseData.severity}</div>
                </div>
              {/if}
              <div>
                <div class="text-sm text-text-secondary mb-1">Owner</div>
                <div class="font-medium text-text-primary">{caseData.ownerName}</div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-surface rounded-lg border border-border p-6">
            <h3 class="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Clock class="w-5 h-5" />
              Timeline
            </h3>
            <div class="space-y-3">
              <div>
                <div class="text-sm text-text-secondary mb-1">Created On</div>
                <div class="text-sm font-medium text-text-primary">
                  {formatDate(caseData.createdOn)}
                </div>
              </div>
              <div>
                <div class="text-sm text-text-secondary mb-1">Modified On</div>
                <div class="text-sm font-medium text-text-primary">
                  {formatDate(caseData.modifiedOn)}
                </div>
              </div>
              {#if caseData.firstResponseBy}
                <div>
                  <div class="text-sm text-text-secondary mb-1">First Response By</div>
                  <div class="text-sm font-medium text-text-primary">
                    {formatDate(caseData.firstResponseBy)}
                  </div>
                </div>
              {/if}
              {#if caseData.resolveBy}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Resolve By</div>
                  <div class="text-sm font-medium text-text-primary">
                    {formatDate(caseData.resolveBy)}
                  </div>
                </div>
              {/if}
              {#if caseData.resolvedOn}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Resolved On</div>
                  <div class="text-sm font-medium text-text-primary">
                    {formatDate(caseData.resolvedOn)}
                  </div>
                </div>
              {/if}
              {#if caseData.satisfactionRating}
                <div>
                  <div class="text-sm text-text-secondary mb-1">Satisfaction Rating</div>
                  <div class="text-sm font-medium text-text-primary">
                    {caseData.satisfactionRating} / 5
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
