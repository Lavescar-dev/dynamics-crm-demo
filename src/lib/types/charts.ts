// Chart Types
export type ChartType = 'bar' | 'line' | 'pie' | 'donut' | 'funnel' | 'area';

// Chart Data Point
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

// Chart Series
export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
  type?: ChartType;
}

// Chart Configuration
export interface ChartConfiguration {
  type: ChartType;
  title?: string;
  subtitle?: string;
  showLegend: boolean;
  showLabels: boolean;
  showTooltip: boolean;
  height?: number;
  colors?: string[];
  responsive: boolean;
}

// Bar Chart Config
export interface BarChartConfig extends ChartConfiguration {
  type: 'bar';
  orientation: 'vertical' | 'horizontal';
  stacked?: boolean;
  categories: string[];
  series: ChartSeries[];
}

// Line Chart Config
export interface LineChartConfig extends ChartConfiguration {
  type: 'line';
  categories: string[];
  series: ChartSeries[];
  smooth?: boolean;
  showPoints?: boolean;
}

// Pie/Donut Chart Config
export interface PieChartConfig extends ChartConfiguration {
  type: 'pie' | 'donut';
  data: ChartDataPoint[];
  showPercentage?: boolean;
  innerRadius?: number; // For donut
}

// Funnel Chart Config
export interface FunnelChartConfig extends ChartConfiguration {
  type: 'funnel';
  data: ChartDataPoint[];
  showValues?: boolean;
  showConversionRate?: boolean;
}

// Chart Data
export type ChartConfig = BarChartConfig | LineChartConfig | PieChartConfig | FunnelChartConfig;
