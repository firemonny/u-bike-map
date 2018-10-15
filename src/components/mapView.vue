<template>
    <div class="u-bike-map-view">
        <h1 align="center">Taipei YouBike Real Time Map</h1>
        <app-heatmap-button @generate-heatmap="generateHeatmap"></app-heatmap-button>
        <div id="map"></div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment-timezone";
import axios from "axios";
import heatmapButton from "./heatmapButton";
import { eventBus } from "../eventBus/eventBus.js";
const timeFormat = "YYYYMMDDHHmmss";
const zerobaseFormat = "YYYYMMDD000000";
const TAIPEI_TIMEZONE = "Asia/Taipei";
const currentTimeZone = "America/Edmonton";

export default {
  name: "map-view",
  data() {
    return {
      map: null,
      ubikesLayer: null,
      docksLayer: null,
      mapPopout: false,
      heatmap: null,
      heatmapIntervalId: null,
      heatmapDate: null,
      dataIndex: 0
    };
  },
  created() {
    eventBus.$on("heatmap-slider-change", payload => {
      this.heatmapDate = payload;
    });
  },
  mounted() {
    this.initMap();
    this.initbikesStationsInfo();
  },
  computed: {
    ...mapGetters(["bikeStationsInfo"])
  },
  components: {
    "app-heatmap-button": heatmapButton
  },
  watch: {
    bikeStationsInfo() {
      if (this.bikeStationsInfo != null) {
        this.drawGeoJson(this.bikeStationsInfo);
      }
    },
    heatmapDate() {
      if (this.heatmapDate) {
        this.getGeoJsonFromFile(this.heatmapDate).then(res => {
          if (!this.heatmap) {
            this.drawHeatmap(res);
          } else {
            let heatmapData = this.generateHeatMapData(res);
            this.heatmap.setData(heatmapData);
          }
        });
      }
    }
  },
  methods: {
    ...mapActions(["initbikesStationsInfo"]),
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.0552145, lng: 121.5132907 },
        zoom: 13
      });
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function(position) {
      //     let pos = {
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude
      //     };
      //     console.log(pos);
      //   });
      // }
      let bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(this.map);
      this.map.data.addListener("click", e => {
        if (this.mapPopout) {
          this.mapPopout.close();
        }
        let youbikeNum = e.feature.getProperty("youbikeNum");
        let rawtime = e.feature.getProperty("time");
        let time = moment(rawtime)
          .tz(TAIPEI_TIMEZONE)
          .format("llll");
        let name = e.feature.getProperty("ar");
        let html = `<p>站點:${name}<br>更新時間:${time}<br>可租車輛:${youbikeNum}</p>`;
        let infowindow = new google.maps.InfoWindow();
        infowindow.setContent(html); // show the html variable in the infowindow
        infowindow.setPosition(e.feature.getGeometry().get()); // anchor the infowindow at the marker
        infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) }); // move the infowindow up slightly to the top of the marker icon
        this.mapPopout = infowindow;
        infowindow.open(this.map);
      });
    },
    drawGeoJson(geoJsonData) {
      this.ubikesLayer = this.map.data.addGeoJson(geoJsonData);
      this.ubikesLayer.forEach(feature => {
        this.map.data.setStyle(this.setPointStyle);
      });
    },
    setPointStyle(feature) {
      let youbikeNum = feature.getProperty("youbikeNum");
      let pointColor = this.geoJsonColor(youbikeNum);
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
    },
    generateHeatMapData(geoJsonData) {
      let max = geoJsonData.reduce((acc, current) => {
        if (acc < parseInt(current.properties.youbikeDockNum)) {
          return parseInt(current.properties.youbikeDockNum);
        } else return acc;
      }, 0);
      return geoJsonData.map(geoJsonPoint => {
        let youbikeDockNum = parseInt(geoJsonPoint.properties.youbikeDockNum);
        let weight = null;
        if (youbikeDockNum === 0) {
          weight = 0.0001;
        } else {
          weight = parseFloat(((youbikeDockNum / max) * 13).toFixed(1));
        }
        let lat = geoJsonPoint.geometry.coordinates[1];
        let lng = geoJsonPoint.geometry.coordinates[0];
        let location = new google.maps.LatLng(lat, lng);
        return {
          location: location,
          weight: weight
        };
      });
    },
    drawHeatmap(geoJsonData) {
      let heatmapData = this.generateHeatMapData(geoJsonData);
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: this.map
      });
      this.heatmap.set("radius", 20);
    },
    getGeoJsonFromFile(filename) {
      return axios.get(`history-data/${filename}`).then(res => {
        return res.data.features;
      });
    },
    removeGeoJsonPoint() {
      this.ubikesLayer.forEach(feature => {
        this.map.data.remove(feature);
      });
    },
    generateHeatmap(enable) {
      //if true generate the heatmap
      if (enable) {
        this.removeGeoJsonPoint();
      } else {
        this.drawGeoJson(this.bikeStationsInfo);
        this.heatmap.setData([]);
      }
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

