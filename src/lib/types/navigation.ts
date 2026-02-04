// Navigation Area
export interface NavigationArea {
  id: string;
  title: string;
  icon?: string;
  groups: NavigationGroup[];
}

// Navigation Group
export interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
}

// Navigation Item (SubArea)
export interface NavigationItem {
  id: string;
  title: string;
  icon?: string;
  url: string;
  badge?: string | number;
  isNew?: boolean;
  description?: string;
  entityType?: string; // Add this property
}

// Site Map Configuration
export interface SiteMapConfiguration {
  areas: NavigationArea[];
  defaultArea: string;
}

// Breadcrumb Item
export interface BreadcrumbItem {
  label: string;
  url?: string;
}

// Navigation State
export interface NavigationState {
  currentArea: string;
  currentGroup?: string;
  currentItem?: string;
  breadcrumbs: BreadcrumbItem[];
  isSidebarCollapsed: boolean;
  isSidebarVisible: boolean;
}
