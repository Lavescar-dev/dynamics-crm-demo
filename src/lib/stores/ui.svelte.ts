// UI state management
class UIStore {
  // Global loading state
  isLoading = $state(false);

  // Modal states
  modals = $state<Record<string, boolean>>({});

  // Toast/notification system
  toasts = $state<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>>([]);

  // Command bar states
  commandBarStates = $state<Record<string, boolean>>({});

  // Loading state methods
  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  startLoading(): void {
    this.isLoading = true;
  }

  stopLoading(): void {
    this.isLoading = false;
  }

  // Modal methods
  openModal(modalId: string): void {
    this.modals[modalId] = true;
  }

  closeModal(modalId: string): void {
    this.modals[modalId] = false;
  }

  isModalOpen(modalId: string): boolean {
    return this.modals[modalId] || false;
  }

  toggleModal(modalId: string): void {
    this.modals[modalId] = !this.modals[modalId];
  }

  // Toast methods
  showToast(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration: number = 5000
  ): string {
    const id = `toast-${Date.now()}-${Math.random()}`;

    this.toasts = [
      ...this.toasts,
      {
        id,
        type,
        message,
        duration
      }
    ];

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => this.removeToast(id), duration);
    }

    return id;
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  clearToasts(): void {
    this.toasts = [];
  }

  // Convenience toast methods
  success(message: string, duration?: number): void {
    this.showToast('success', message, duration);
  }

  error(message: string, duration?: number): void {
    this.showToast('error', message, duration);
  }

  warning(message: string, duration?: number): void {
    this.showToast('warning', message, duration);
  }

  info(message: string, duration?: number): void {
    this.showToast('info', message, duration);
  }

  // Command bar state methods
  setCommandBarState(commandId: string, enabled: boolean): void {
    this.commandBarStates[commandId] = enabled;
  }

  isCommandEnabled(commandId: string): boolean {
    return this.commandBarStates[commandId] !== false;
  }
}

export const uiStore = new UIStore();

// Notification helper
export function notify(
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  duration?: number
): void {
  uiStore.showToast(type, message, duration);
}
