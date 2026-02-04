import type { BaseEntity, LookupValue } from './entities';

// Field Types
export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'optionset'
  | 'lookup'
  | 'multiline'
  | 'url';

// Field Metadata
export interface FieldMetadata {
  name: string;
  displayName: string;
  type: FieldType;
  required: boolean;
  readonly?: boolean;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  options?: OptionSetOption[];
  lookupEntity?: string;
  defaultValue?: any;
  placeholder?: string;
  helpText?: string;
}

// Option Set Option
export interface OptionSetOption {
  value: string | number;
  label: string;
  color?: string;
}

// Form Section
export interface FormSection {
  name: string;
  label: string;
  columns: number;
  fields: FieldMetadata[];
  visible: boolean;
  expanded?: boolean;
}

// Form Tab
export interface FormTab {
  name: string;
  label: string;
  visible: boolean;
  sections: FormSection[];
}

// Form Configuration
export interface FormConfiguration {
  entityType: string;
  formType: 'main' | 'quickCreate' | 'quickView';
  tabs?: FormTab[];
  sections?: FormSection[]; // For quick forms without tabs
  headerFields?: string[];
}

// Form State
export interface FormState<T extends BaseEntity = BaseEntity> {
  entity: Partial<T>;
  originalEntity?: T;
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  isLoading: boolean;
  isSaving: boolean;
}

// Form Command
export interface FormCommand {
  name: string;
  label: string;
  icon?: string;
  enabled: boolean;
  visible: boolean;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'danger';
}

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Form Event
export type FormEventType = 'onLoad' | 'onSave' | 'onChange' | 'onLookupChange';

export interface FormEvent<T = any> {
  type: FormEventType;
  field?: string;
  value?: T;
  entity?: Partial<BaseEntity>;
}
