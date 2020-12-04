import { createApp } from "vue";
import { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import "./assets/styles/index.css";
import { provideAppToast } from "./toast";
import Router from "./use/router";
import { store } from "./use/store/store";

const app = createApp(App);
app.use(Router);
app.use(store);
app.use(provideAppToast, {
    maxToasts: 5,
    position: POSITION.BOTTOM_RIGHT,
    timeout: 4000,
});
app.mount("#app");
