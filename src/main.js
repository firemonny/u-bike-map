import Vue from "vue";
import App from "./App.vue";
// vuex import
import store from "./vuex/store";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store
}).$mount("#app");
