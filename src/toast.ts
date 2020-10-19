import { App } from "vue";
import { createToastInterface, EventBus, PluginOptions, toastInjectionKey } from "vue-toastification";

// This will be the global event bus
const globalEventBus = new EventBus();

// Call this function once to create and mount a global toast container
export function createGlobalToast(options?: PluginOptions) {
    return createToastInterface({ ...options, eventBus: globalEventBus });
}

// Returns an interface to the global toast container
export function useToast() {
    return createToastInterface(globalEventBus);
}

// Use this as a plugin to register instance and injected toasts
export function provideAppToast(app: App, options?: PluginOptions) {
    // Create the global container
    const toast = createGlobalToast(options);

    // Provide using Vue dependency injection
    app.provide(toastInjectionKey, toast);

    // Bind to the global object so it can be called with this.$toast
    app.config.globalProperties.$toast = toast;
}
