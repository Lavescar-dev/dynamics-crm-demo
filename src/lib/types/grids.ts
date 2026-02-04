import type { BaseEntity } from './entities';

// Column Definition
export interface ColumnDefinition {
  field: string;
  header: string;
  width?: number;
  minWidth?: number;
  sortable: boolean;
  filterable: boolean;
  resizable: boolean;
  visible: boolean;
  type?: 'text' | 'number' | 'currency' | 'date' | 'boolean' | 'lookup' | 'optionset';
  format?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => string;
}

// Sort Configuration
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Filter Operator
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn'
  | 'between'
  | 'isNull'
  | 'isNotNull';

// Filter Condition
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For between operator
}

// Filter Group
export interface FilterGroup {
  operator: 'and' | 'or';
  conditions: (FilterCondition | FilterGroup)[];
}

// View Definition
export interface ViewDefinition {
  id: string;
  name: string;
  entityType?: string; // Optional, might be used for generic views
  type: 'system' | 'personal'; // Add this property
  isDefault: boolean;
  isPersonal: boolean;
  columns: ColumnDefinition[];
  sortConfig?: SortConfig[];
  filters?: FilterGroup | null;
}

// Grid State
export interface GridState<T extends BaseEntity = BaseEntity> {
  data: T[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  selectedRows: string[];
  sortConfig: SortConfig[];
  filters: FilterGroup | null;
  searchQuery: string;
  isLoading: boolean;
  currentView?: ViewDefinition;
}

// Grid Command
export interface GridCommand {
  name: string;
  label: string;
  icon?: string;
  enabled: boolean;
  visible: boolean;
  requiresSelection?: boolean;
  onClick: (selectedIds: string[]) => void | Promise<void>;
}

// Pagination Config
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  showPageSizeSelector: boolean;
  pageSizeOptions: number[];
}

// Grid Selection Mode
export type SelectionMode = 'none' | 'single' | 'multiple';

// Grid Configuration
export interface GridConfiguration {
  entityType: string;
  selectionMode: SelectionMode;
  enablePagination: boolean;
  defaultPageSize: number;
  enableColumnResize: boolean;
  enableColumnReorder: boolean;
  enableInlineEdit: boolean;
  enableJumpBar: boolean;
  views: ViewDefinition[];
  commands: GridCommand[];
}
