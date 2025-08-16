import { type Component, type Ref, h, ref } from 'vue';

import type { DynamicDialogInstance, DynamicDialogOptions } from 'primevue/dynamicdialogoptions';
import { useDialog } from 'primevue/usedialog';

// Singleton reference to the currently opened dialog instance.
// NOTE: Only one dynamic dialog can be tracked at a time using this service.
//       If you open multiple dialogs simultaneously, only the last one will be tracked.
const dialogInstance: Ref<DynamicDialogInstance | null> = ref(null);

// Extracted types for better type safety and reuse.
type DialogData = NonNullable<DynamicDialogOptions['data']>;
type DialogProps = NonNullable<DynamicDialogOptions['props']>;
type DialogTemplates = NonNullable<DynamicDialogOptions['templates']>;

/**
 * A composable service for opening and managing PrimeVue DynamicDialogs.
 * Tracks a single dialog instance at a time.
 *
 * NOTE: Has to be used in setup, not inside an internal function.
 *
 * Common usage:
 * const { openDialog, closeDialog, getDialog } = useDialogService();
 */
export const useDialogService = () => {
  const dialog = useDialog();

  /**
   * Opens a new PrimeVue DynamicDialog with provided options.
   *
   * @param component - The Vue component to render inside the dialog.
   * @param header - Optional dialog header. Defaults to 'Modal'.
   * @param data - Data passed to the dialog component via `props.data`.
   * @param props - Additional props for the dialog component.
   * @param templates - Optional named slots for the dialog component.
   * @param emits - Optional emits for the dialog component.
   *
   * WARNING: Only one dialog instance is tracked. Opening a second dialog
   * will overwrite the `dialogInstance`, and only the most recent one can be programmatically closed.
   */
  const openDialog = (
    component: Component,
    header?: string,
    data?: DialogData,
    props?: DialogProps,
    templates?: DialogTemplates,
    emits?: Record<string, (data: unknown) => unknown>
  ) => {
    if (!dialog) {
      throw new Error('DialogService is not properly initialized');
    }

    dialogInstance.value = dialog.open(component, {
      data: {
        ...data,
      },
      props: {
        header: header,
        modal: true,
        closable: true,
        closeOnEscape: true,
        draggable: false,
        style: { width: '70vw' },
        breakpoints: {
          '1280px': '70vw',
          '960px': '80vw',
          '800px': '90vw',
        },
        ...props,
      },
      templates: {
        header: () => h('p', { class: 'header font-bold mb-0' }, header),
        ...templates,
      },
      emits: {
        ...emits,
      },
    });
  };

  // const footerTemplate = ref<(() => VNode) | null>(null);

  const openCustomHeaderDialog = (
    component: Component,
    header: string = 'Header',
    subheader: string | null = 'Subheader',
    data?: DialogData,
    props?: DialogProps,
    templates?: DialogTemplates,
    emits?: Record<string, (data: unknown) => unknown>
  ) => {
    openDialog(
      component,
      undefined,
      data,
      props,
      {
        ...templates,
        header: () =>
          h('div', [
            h('p', { class: 'header font-bold mb-0' }, header),
            subheader ? h('p', { class: 'subheader text-gray-500 ms-3' }, subheader) : '',
          ]),
        // footer: () => (footerTemplate.value ? footerTemplate.value() : null),
      },
      {
        ...emits,
        // 'update:footerTemplate': (templateFn: () => VNode) => {
        //   console.log('Footer template emit caught', templateFn);
        //   footerTemplate.value = templateFn;
        // },
      }
    );
  };

  const openCreateDialog = (
    component: Component,
    subheader: string | null = 'Type Being Created',
    data?: DialogData,
    props?: DialogProps,
    templates?: DialogTemplates,
    emits?: Record<string, (data: unknown) => unknown>
  ) => {
    openCustomHeaderDialog(component, 'Create', subheader, data, props, templates, emits);
  };

  const openUpdateDialog = (
    component: Component,
    subheader: string | null = 'Type Being Updated',
    data?: DialogData,
    props?: DialogProps,
    templates?: DialogTemplates,
    emits?: Record<string, (data: unknown) => unknown>
  ) => {
    openCustomHeaderDialog(component, 'Update', subheader, data, props, templates, emits);
  };

  /**
   * Closes the currently opened dialog if it exists.
   *
   * NOTE: If the dialog was closed manually or untracked by this service,
   * this function will log an error and do nothing.
   */
  const closeDialog = () => {
    if (dialogInstance.value) {
      dialogInstance.value.close();
      dialogInstance.value = null;
    } else {
      console.error('Dialog instance not found');
    }
  };

  /**
   * Gets the currently opened dialog. Used to get data and other information from the defined dialog
   * from within the dynamic dialog.
   *
   * @returns DynamicDialogInstance | null
   */
  const getDialog = () => {
    return dialogInstance.value;
  };

  return {
    openDialog,
    closeDialog,
    getDialog,
    openCustomHeaderDialog,
    openCreateDialog,
    openUpdateDialog,
  };
};
