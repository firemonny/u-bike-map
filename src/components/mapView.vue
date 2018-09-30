<template>
    <div class="u-bike-map-view">
        <div id="map"></div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "map-view",
  data() {
    return {
      text: "Hello",
      map: null
    };
  },
  mounted() {
    this.initMap();
    this.initUbikesInfo();
    this.initDocksInfo();
  },
  computed: {
    ...mapGetters(["ubikesInfo", "docksInfo"])
  },
  watch: {
    ubikesInfo() {
      if (this.ubikesInfo != null) {
        this.drawGeoJson(this.ubikesInfo);
      }
    },
    docksInfo() {
      if (this.docksInfo != null) {
        console.log(this.docksInfo);
      }
    }
  },
  methods: {
    ...mapActions(["initUbikesInfo", "initDocksInfo"]),
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.0552145, lng: 121.5132907 },
        zoom: 12,
        mapTypeId: "terrain"
      });
    },
    drawGeoJson(geoJsonData) {
      this.map.data.addGeoJson(geoJsonData);
    }
  }
};
</script>
<style>
#map {
  height: 500px;
  width: 100%;
}
</style>

