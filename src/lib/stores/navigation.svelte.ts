import type { NavigationState, BreadcrumbItem } from '$lib/types/navigation';
import { browser } from '$app/environment';

// Navigation store using Svelte 5 runes
class NavigationStore {
  state = $state<NavigationState>({
    currentArea: 'sales',
    currentGroup: undefined,
    currentItem: undefined,
    breadcrumbs: [],
    isSidebarCollapsed: false,
    isSidebarVisible: true
  });

  constructor() {
    // Load sidebar state from localStorage
    if (browser) {
      const collapsed = localStorage.getItem('crm-sidebar-collapsed');
      if (collapsed !== null) {
        this.state.isSidebarCollapsed = collapsed === 'true';
      }
    }
  }

  setCurrentArea(area: string): void {
    this.state.currentArea = area;
  }

  setCurrentGroup(group: string | undefined): void {
    this.state.currentGroup = group;
  }

  setCurrentItem(item: string | undefined): void {
    this.state.currentItem = item;
  }

  setBreadcrumbs(breadcrumbs: BreadcrumbItem[]): void {
    this.state.breadcrumbs = breadcrumbs;
  }

  toggleSidebar(): void {
    this.state.isSidebarCollapsed = !this.state.isSidebarCollapsed;
    if (browser) {
      localStorage.setItem('crm-sidebar-collapsed', String(this.state.isSidebarCollapsed));
    }
  }

  setSidebarVisible(visible: boolean): void {
    this.state.isSidebarVisible = visible;
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.state.isSidebarCollapsed = collapsed;
    if (browser) {
      localStorage.setItem('crm-sidebar-collapsed', String(collapsed));
    }
  }

  // Helper to navigate to a specific area/group/item
  navigateTo(area: string, group?: string, item?: string): void {
    this.state.currentArea = area;
    this.state.currentGroup = group;
    this.state.currentItem = item;
  }
}

export const navigationStore = new NavigationStore();
