import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/index.css";
import Router from "./use/router";
import { store } from "./use/store/store";

const app = createApp(App);
app.use(Router);
app.use(store);
app.mount("#app");
