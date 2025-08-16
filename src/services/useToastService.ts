import type { ToastServiceMethods } from 'primevue/toastservice';
import { useToast } from 'primevue/usetoast';

let toastInstance: ToastServiceMethods | null = null;

/**
 * Initialize the toast service with the Vue app context.
 * Should be called in a component that exists at app mount (e.g., App.vue or main.ts).
 */
export const initToastService = () => {
  toastInstance = useToast();
};

/**
 * Get the toast instance (after initialization).
 */
const getToast = (): ToastServiceMethods => {
  if (!toastInstance) {
    throw new Error('Toast service not initialized. Call initToastService() first.');
  }

  return toastInstance;
};

/**
 * Shortcut functions for common toast calls
 */
export const toastService = {
  info(summary: string, detail?: string, life = 3000) {
    getToast().add({ severity: 'info', summary, detail, life, group: '' });
  },
  success(summary: string, detail?: string, life = 3000) {
    getToast().add({ severity: 'success', summary, detail, life, group: '' });
  },
  warn(summary: string, detail?: string, life = 3000) {
    getToast().add({ severity: 'warn', summary, detail, life, group: '' });
  },
  error(summary: string, detail?: string, life = 3000) {
    getToast().add({ severity: 'error', summary, detail, life, group: '' });
  },
  custom(options: Parameters<ToastServiceMethods['add']>[0]) {
    getToast().add(options);
  },
  clear() {
    getToast().removeGroup('');
  },
};
