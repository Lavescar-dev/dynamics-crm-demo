import { browser } from '$app/environment';
import type {
  Lead,
  Account,
  Contact,
  Opportunity,
  Case,
  Activity,
  BaseEntity
} from '$lib/types/entities';
import {
  mockLeads,
  mockAccounts,
  mockContacts,
  mockOpportunities,
  mockCases,
  mockActivities
} from '$lib/data';

// Local storage helper
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (!browser) return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (!browser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

// Entity Store Class
class EntityStore<T extends { id: string; createdOn: Date; modifiedOn: Date }> {
  private storageKey: string;
  entities = $state<T[]>([]);

  constructor(storageKey: string, defaultData: T[]) {
    this.storageKey = storageKey;
    this.entities = loadFromStorage(storageKey, defaultData);
  }

  getAll(): T[] {
    return this.entities;
  }

  getById(id: string): T | undefined {
    return this.entities.find((e) => e.id === id);
  }

  getByIds(ids: string[]): T[] {
    return this.entities.filter((e) => ids.includes(e.id));
  }

  create(entity: Omit<T, 'id' | 'createdOn' | 'modifiedOn'>): T {
    const newEntity = {
      ...entity,
      id: this.generateId(),
      createdOn: new Date(),
      modifiedOn: new Date()
    } as T;

    this.entities = [...this.entities, newEntity];
    this.save();
    return newEntity;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const index = this.entities.findIndex((e) => e.id === id);
    if (index === -1) return undefined;

    this.entities[index] = {
      ...this.entities[index],
      ...updates,
      modifiedOn: new Date()
    };
    this.save();
    return this.entities[index];
  }

  delete(id: string): boolean {
    const initialLength = this.entities.length;
    this.entities = this.entities.filter((e) => e.id !== id);
    if (this.entities.length !== initialLength) {
      this.save();
      return true;
    }
    return false;
  }

  deleteMany(ids: string[]): number {
    const initialLength = this.entities.length;
    this.entities = this.entities.filter((e) => !ids.includes(e.id));
    const deletedCount = initialLength - this.entities.length;
    if (deletedCount > 0) {
      this.save();
    }
    return deletedCount;
  }

  search(query: string, fields: (keyof T)[]): T[] {
    if (!query) return this.entities;

    const lowerQuery = query.toLowerCase();
    return this.entities.filter((entity) =>
      fields.some((field) => {
        const value = entity[field];
        return value && String(value).toLowerCase().includes(lowerQuery);
      })
    );
  }

  filter(predicate: (entity: T) => boolean): T[] {
    return this.entities.filter(predicate);
  }

  sort(field: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...this.entities].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  reset(): void {
    this.entities = loadFromStorage(this.storageKey, []);
    this.save();
  }

  private save(): void {
    saveToStorage(this.storageKey, this.entities);
  }

  private generateId(): string {
    const prefix = this.storageKey.split('-')[0];
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${random}`;
  }
}

// Create store instances
export const leadsStore = new EntityStore<Lead>('crm-leads', mockLeads);
export const accountsStore = new EntityStore<Account>('crm-accounts', mockAccounts);
export const contactsStore = new EntityStore<Contact>('crm-contacts', mockContacts);
export const opportunitiesStore = new EntityStore<Opportunity>('crm-opportunities', mockOpportunities);
export const casesStore = new EntityStore<Case>('crm-cases', mockCases);
export const activitiesStore = new EntityStore<Activity>('crm-activities', mockActivities);

// Relationship helpers
export function getContactsByAccount(accountId: string): Contact[] {
  return contactsStore.filter((c) => c.accountId === accountId);
}

export function getOpportunitiesByAccount(accountId: string): Opportunity[] {
  return opportunitiesStore.filter((o) => o.accountId === accountId);
}

export function getCasesByCustomer(customerId: string): Case[] {
  return casesStore.filter((c) => c.customerId === customerId);
}

export function getActivitiesByRegarding(regardingId: string): Activity[] {
  return activitiesStore.filter((a) => a.regardingId === regardingId);
}

export function getActivitiesByType(regardingId: string, activityType: string): Activity[] {
  return activitiesStore.filter(
    (a) => a.regardingId === regardingId && a.activityType === activityType
  );
}

// Reset all data
export function resetAllData(): void {
  leadsStore.entities = mockLeads;
  accountsStore.entities = mockAccounts;
  contactsStore.entities = mockContacts;
  opportunitiesStore.entities = mockOpportunities;
  casesStore.entities = mockCases;
  activitiesStore.entities = mockActivities;

  saveToStorage('crm-leads', mockLeads);
  saveToStorage('crm-accounts', mockAccounts);
  saveToStorage('crm-contacts', mockContacts);
  saveToStorage('crm-opportunities', mockOpportunities);
  saveToStorage('crm-cases', mockCases);
  saveToStorage('crm-activities', mockActivities);
}

// Export all stores
export const entityStores = {
  leads: leadsStore,
  accounts: accountsStore,
  contacts: contactsStore,
  opportunities: opportunitiesStore,
  cases: casesStore,
  activities: activitiesStore
};
