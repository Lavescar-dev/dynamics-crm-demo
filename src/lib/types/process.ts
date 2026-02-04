// Business Process Flow Types

// Process Stage
export interface ProcessStage {
  id: string;
  name: string;
  entityType: string;
  order: number;
  fields: ProcessField[];
  isActive: boolean;
  isCompleted: boolean;
}

// Process Field
export interface ProcessField {
  name: string;
  displayName: string;
  type: string;
  required: boolean;
  value?: any;
  isCompleted: boolean;
}

// Business Process Flow
export interface BusinessProcessFlow {
  id: string;
  name: string;
  description?: string;
  entityType: string;
  stages: ProcessStage[];
  currentStageId: string;
  isActive: boolean;
}

// Process Instance
export interface ProcessInstance {
  id: string;
  processId: string;
  processName: string;
  regardingId: string;
  regardingType: string;
  currentStageId: string;
  currentStageOrder: number;
  startedOn: Date;
  completedOn?: Date;
  status: 'Active' | 'Finished' | 'Aborted';
  duration?: number; // in days
}

// Stage Navigation Result
export interface StageNavigationResult {
  success: boolean;
  errors?: string[];
  newStageId: string;
}
