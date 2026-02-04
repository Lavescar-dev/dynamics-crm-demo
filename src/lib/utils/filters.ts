import type { FilterGroup, FilterCondition, FilterOperator } from '$lib/types/grids';

// Helper function to apply a single filter condition
function applyFilterCondition<T>(entity: T, condition: FilterCondition): boolean {
  const value = entity[condition.field as keyof T];
  const filterValue = condition.value;

  switch (condition.operator) {
    case 'equals':
      return value === filterValue;
    case 'notEquals':
      return value !== filterValue;
    case 'contains':
      return typeof value === 'string' && typeof filterValue === 'string' && value.toLowerCase().includes(filterValue.toLowerCase());
    case 'notContains':
      return typeof value === 'string' && typeof filterValue === 'string' && !value.toLowerCase().includes(filterValue.toLowerCase());
    case 'startsWith':
      return typeof value === 'string' && typeof filterValue === 'string' && value.toLowerCase().startsWith(filterValue.toLowerCase());
    case 'endsWith':
      return typeof value === 'string' && typeof filterValue === 'string' && value.toLowerCase().endsWith(filterValue.toLowerCase());
    case 'greaterThan':
      return value > filterValue;
    case 'greaterThanOrEqual':
      return value >= filterValue;
    case 'lessThan':
      return value < filterValue;
    case 'lessThanOrEqual':
      return value <= filterValue;
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(value);
    case 'notIn':
      return Array.isArray(filterValue) && !filterValue.includes(value);
    case 'between':
      return value >= filterValue && value <= condition.value2;
    case 'isNull':
      return value === null || value === undefined || value === '';
    case 'isNotNull':
      return value !== null && value !== undefined && value !== '';
    default:
      console.warn(`Unknown filter operator: ${condition.operator}`);
      return true;
  }
}

// Function to apply a filter group (recursive for nested groups)
export function applyFilterGroup<T>(entities: T[], filterGroup: FilterGroup | null): T[] {
  if (!filterGroup || !filterGroup.conditions || filterGroup.conditions.length === 0) {
    return entities;
  }

  return entities.filter(entity => {
    if (filterGroup.operator === 'and') {
      return filterGroup.conditions.every(condition => {
        if ('operator' in condition && 'field' in condition) { // It's a FilterCondition
          return applyFilterCondition(entity, condition as FilterCondition);
        } else { // It's a nested FilterGroup
          return applyFilterGroup([entity], condition as FilterGroup).length > 0;
        }
      });
    } else if (filterGroup.operator === 'or') {
      return filterGroup.conditions.some(condition => {
        if ('operator' in condition && 'field' in condition) { // It's a FilterCondition
          return applyFilterCondition(entity, condition as FilterCondition);
        } else { // It's a nested FilterGroup
          return applyFilterGroup([entity], condition as FilterGroup).length > 0;
        }
      });
    }
    return true;
  });
}
