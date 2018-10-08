import axios from "axios";

const state = {
  bikeStationsInfo: null
};

const getters = {
  bikeStationsInfo() {
    return state.bikeStationsInfo;
  }
};

const mutations = {
  SET_BIKE_STATIONS_INFO: (state, payload) => {
    state.bikeStationsInfo = payload;
  }
};

const actions = {
  initbikesStationsInfo: ({ commit }) => {
    return axios.get("currentData.json").then(res => {
      commit("SET_BIKE_STATIONS_INFO", res.data);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
