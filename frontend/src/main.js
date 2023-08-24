import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import Router from "./router/index";
import naive from "naive-ui";
import "vfonts/Lato.css";
import contextmenu from "v-contextmenu";
import "v-contextmenu/dist/themes/dark.css";

const app = createApp(App);
app.config.productionTip = false;

app.use(naive);
app.use(contextmenu);

app.use(Router);
app.mount("#app");
