import { createApp } from "vue";
import App from "./App.vue";
import Router from "./use/router";
import { store } from "./use/store/store";
import "./assets/styles/index.css";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);
app.use(Router);
app.use(store);
app.use(Toast, {
    maxToasts: 5,
    position: POSITION.BOTTOM_RIGHT,
    timeout: 3000,
});
app.mount("#app");
