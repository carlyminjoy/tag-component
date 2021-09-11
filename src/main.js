import Vue from "vue";
import App from "./App.vue";

// Install bootstrap-vue
import {
  BootstrapVue,
  BIcon,
  BIconX,
  BIconPlus,
} from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.component("BIcon", BIcon);
Vue.component("BIconX", BIconX);
Vue.component("BIconPlus", BIconPlus);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
