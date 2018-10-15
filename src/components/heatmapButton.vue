<template>
    <div>
        <button class="btn btn-primary" 
        :class="{'btn-danger'
        :heatmapEnable,'btn-primary': !heatmapEnable}" 
        @click="onClickGenerateHeatmap">{{buttonText}}</button>
        <app-time-slider v-if="heatmapEnable" 
        :options="sliderOption"
        :heatmapStart="heatmapStart"></app-time-slider>
        <button v-if="heatmapEnable" 
        class="btn btn-primary" 
        :class="{'btn-danger'
        :heatmapStart,'btn-primary': !heatmapStart}" 
        @click="onClickStartHeatmap">{{startButtonText}}</button>
    </div>
</template>
<script>
import moment from "moment-timezone";
import heatmapSlider from "./heatmapSlider";

const timeFormat = "YYYYMMDDHHmmss";
const zerobaseFormat = "YYYYMMDD000000";
const TAIPEI_TIMEZONE = "Asia/Taipei";
const currentTimeZone = "America/Edmonton";

export default {
  name: "heatmap-button",
  data() {
    return {
      heatmapEnable: false,
      heatmapStart: false,
      buttonText: "Generate Heat Map Animation",
      startButtonText: "Start",
      sliderOption: this.generateSliderOptions()
    };
  },
  components: {
    "app-time-slider": heatmapSlider
  },
  methods: {
    onClickGenerateHeatmap() {
      this.heatmapEnable = !this.heatmapEnable;
      if (this.heatmapEnable) {
        this.$emit("generate-heatmap", true);
        this.buttonText = "Back to Real Time Bike Station";
      } else {
        this.$emit("generate-heatmap", false);
        this.buttonText = "Generate Heat Map Animation";
      }
    },
    onClickStartHeatmap() {
      this.heatmapStart = !this.heatmapStart;
      if (this.heatmapStart) {
        this.startButtonText = "STOP";
      } else {
        this.startButtonText = "START";
      }
    },
    generateSliderOptions() {
      return {
        data: this.generateDate(),
        lazy: true,
        reverse: true,
        width: "100%",
        "bg-style": { background: "#8dc9e6" },
        "process-style": { background: "#8dc9e6" },
        "disabled-style": { background: "#8dc9e6" }
      };
    },
    generateDate() {
      let test = moment().format(timeFormat);
      let nowOb = moment().tz(TAIPEI_TIMEZONE);
      let yesterdaty = moment()
        .tz(TAIPEI_TIMEZONE)
        .subtract(1, "days")
        .format(timeFormat);
      let startTime = moment(yesterdaty, timeFormat).format(zerobaseFormat);
      let startTimeOb = moment(startTime, timeFormat);
      let startYear = yesterdaty.slice(0, 4);
      let startMonth = yesterdaty.slice(4, 6);
      let startDate = yesterdaty.slice(6, 8);
      let startHour = yesterdaty.slice(8, 10);
      let fileNameArray = [];

      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 6; j++) {
          let hour = `00${i}`.slice(-2);
          let min = `${j}0`;
          let time = `${startYear}${startMonth}${startDate}${hour}${min}00`;
          fileNameArray.push(
            moment(time, timeFormat, TAIPEI_TIMEZONE).format("LLL")
          );
        }
      }
      let today = moment()
        .tz(TAIPEI_TIMEZONE)
        .format(timeFormat);
      startTime = moment(today, timeFormat).format(zerobaseFormat);
      startTimeOb = moment(startTime, timeFormat);
      startYear = today.slice(0, 4);
      startMonth = today.slice(4, 6);
      startDate = today.slice(6, 8);
      startHour = today.slice(8, 10);
      for (let i = 0; i < parseInt(startHour); i++) {
        for (let j = 0; j < 6; j++) {
          let hour = `00${i}`.slice(-2);
          let min = `${j}0`;
          let time = `${startYear}${startMonth}${startDate}${hour}${min}00`;
          fileNameArray.push(
            moment(time, timeFormat, TAIPEI_TIMEZONE).format("LLL")
          );
        }
      }
      return fileNameArray;
    }
  }
};
</script>
