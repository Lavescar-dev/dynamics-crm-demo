import type { ChartConfig } from './charts';
import type { ViewDefinition } from './grids';
import type { Activity } from './entities';

// Dashboard Widget Type
export type WidgetType = 'tile' | 'chart' | 'grid' | 'stream' | 'iframe';

// Base Widget
export interface BaseWidget {
  id: string;
  type: WidgetType;
  title: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  refreshInterval?: number; // in seconds
}

// Tile Widget (KPI)
export interface TileWidget extends BaseWidget {
  type: 'tile';
  value: number | string;
  icon?: string;
  iconColor?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    isPositive: boolean;
  };
  comparisonText?: string;
  onClick?: () => void;
}

// Chart Widget
export interface ChartWidget extends BaseWidget {
  type: 'chart';
  chartConfig: ChartConfig;
  dataSource?: string; // Entity type or custom query
}

// Grid Widget
export interface GridWidget extends BaseWidget {
  type: 'grid';
  viewDefinition: ViewDefinition;
  maxRows?: number;
  showHeader?: boolean;
  showPagination?: boolean;
}

// Stream Widget (Activity Feed)
export interface StreamWidget extends BaseWidget {
  type: 'stream';
  activities: Activity[];
  filterByType?: string[];
  maxItems?: number;
}

// IFrame Widget
export interface IFrameWidget extends BaseWidget {
  type: 'iframe';
  url: string;
  allowFullscreen?: boolean;
}

// Dashboard Widget Union Type
export type DashboardWidget = TileWidget | ChartWidget | GridWidget | StreamWidget | IFrameWidget;

// Dashboard Layout
export interface DashboardLayout {
  columns: number;
  rowHeight: number;
  gap: number;
}

// Dashboard Configuration
export interface DashboardConfiguration {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  isDefault: boolean;
  isPersonal: boolean;
}

// Dashboard State
export interface DashboardState {
  currentDashboard?: DashboardConfiguration;
  availableDashboards: DashboardConfiguration[];
  isEditing: boolean;
  isLoading: boolean;
}
