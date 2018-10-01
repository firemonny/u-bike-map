<template>
    <div class="u-bike-map-view">
        <h1 align="center">YouBike 及時地圖</h1>
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
      map: null,
      ubikesLayer: null,
      docksLayer: null,
      mapPopout: false
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
        this.drawGeoJson(this.ubikesInfo, this.ubikesLayer);
      }
    },
    docksInfo() {
      if (this.docksInfo != null) {
        // console.log(this.docksInfo);
      }
    }
  },
  methods: {
    ...mapActions(["initUbikesInfo", "initDocksInfo"]),
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.0552145, lng: 121.5132907 },
        zoom: 13
      });
      this.map.data.addListener("click", e => {
        if (this.mapPopout) {
          this.mapPopout.close();
        }
        let result = e.feature.getProperty("result");
        let time = e.feature.getProperty("time");
        let name = e.feature.getProperty("ar");
        let html = `<p>站點:${name}<br>更新時間:${time}<br>可租車輛:${result}</p>`;
        let infowindow = new google.maps.InfoWindow();
        infowindow.setContent(html); // show the html variable in the infowindow
        infowindow.setPosition(e.feature.getGeometry().get()); // anchor the infowindow at the marker
        infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) }); // move the infowindow up slightly to the top of the marker icon
        this.mapPopout = infowindow;
        infowindow.open(this.map);
      });
    },
    drawGeoJson(geoJsonData, layer) {
      layer = this.map.data.addGeoJson(geoJsonData);
      layer.forEach(feature => {
        this.map.data.setStyle(this.setPointStyle);
      });
    },
    setPointStyle(feature) {
      let result = feature.getProperty("result");
      let pointColor = this.geoJsonColor(result);
      return {
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: pointColor,
          fillOpacity: 0.6,
          strokeWeight: 0
        }
      };
    },
    geoJsonColor(num) {
      if (num <= 0) return "#00000";
      else if (num >= 1 && num <= 5) return "#ff3300";
      else if (num >= 6 && num <= 10) return "#ffcc00";
      else if (num >= 11 && num <= 20) return "#ffff66";
      else if (num >= 21 && num <= 40) return "#66ff66";
      else return "#33ccff";
    }
  }
};
</script>
<style>
#map {
  height: 800px;
  width: 100%;
}
</style>

