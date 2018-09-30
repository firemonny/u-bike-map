import Vue from "vue";
import Vuex from "vuex";
import mapView from "./module/mapView";

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    mapView
  }
});
