import axios from "axios";
import moment from "moment-timezone";
const ROOT_URL = "https://taipei-ubike.dev-s5.sensorup.com/v1.0/";

const TAIPEI_TIMEZONE = "Asia/Taipei";

const ubike_query =
  "Things?$count=false&$expand=Locations($select=description,name,location),Datastreams($filter=substringof('ubikes',description)),Datastreams/Observations($orderby=phenomenonTime desc;$top=1;$select=result,phenomenonTime)&$top=400";

const dock_query =
  "Things?$count=false&$expand=Locations($select=description,name,location),Datastreams($filter=substringof('dock',description)),Datastreams/Observations($orderby=phenomenonTime desc;$top=1;$select=result,phenomenonTime)&$top=400";

const state = {
  ubikesInfo: null,
  docksInfo: null
};

function convertSTAToGeoJson(payload) {
  return payload.data.value.map(data => {
    let properties = data.properties;
    let phenomenonTime = data.Datastreams[0].Observations[0].phenomenonTime;
    let result = data.Datastreams[0].Observations[0].result;
    properties.time = moment(phenomenonTime)
      .tz(TAIPEI_TIMEZONE)
      .format("llll");
    properties.result = result;
    let geometry = data.Locations[0].location;
    geometry.coordinates = [
      parseFloat(geometry.coordinates[0]),
      parseFloat(geometry.coordinates[1])
    ];
    return {
      type: "Feature",
      properties: properties,
      geometry: data.Locations[0].location
    };
  });
}
const getters = {
  ubikesInfo() {
    return state.ubikesInfo;
  },
  docksInfo() {
    return state.docksInfo;
  }
};

const mutations = {
  SET_UBIKES_INFO: (state, payload) => {
    state.ubikesInfo = payload;
  },
  SET_DOCKS_INFO: (state, payload) => {
    state.docksInfo = payload;
  }
};

const actions = {
  initUbikesInfo: ({ commit }) => {
    axios
      .get(`${ROOT_URL}${ubike_query}`)
      .then(payload => {
        let features = convertSTAToGeoJson(payload);
        return {
          type: "FeatureCollection",
          features: features
        };
      })
      .then(payload => {
        commit("SET_UBIKES_INFO", payload);
      });
  },
  initDocksInfo: ({ commit }) => {
    axios
      .get(`${ROOT_URL}${dock_query}`)
      .then(payload => {
        let features = convertSTAToGeoJson(payload);
        return {
          type: "FeatureCollection",
          features: features
        };
      })
      .then(payload => {
        commit("SET_DOCKS_INFO", payload);
      });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
