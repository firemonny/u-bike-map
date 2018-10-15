<template>
    <div>
        <vue-slider ref="heatmapSlider" v-model="value" v-bind="options" @callback="onSlideChange"></vue-slider>
    </div>
</template>

<script>
import vueSlider from "vue-slider-component";
import { eventBus } from "../eventBus/eventBus.js";
import moment from "moment-timezone";

const TAIPEI_TIMEZONE = "Asia/Taipei";
const timeFormat = "YYYYMMDDHHmmss";
export default {
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    heatmapStart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: this.options.data[0],
      heatmapSliderEvent: null
    };
  },
  components: {
    vueSlider
  },
  watch: {
    heatmapStart() {
      if (this.heatmapStart) {
        this.heatmapSliderEvent = setInterval(() => {
          let currentIndex = this.$refs.heatmapSlider.getIndex();
          let nextIndex = currentIndex + 1;
          if (nextIndex == this.options.data.length) {
            nextIndex = 0;
          }
          this.$refs.heatmapSlider.setIndex(nextIndex);
        }, 200);
      } else {
        clearInterval(this.heatmapSliderEvent);
      }
    }
  },
  methods: {
    onSlideChange() {
      let datetime = moment(this.value, "LLL", TAIPEI_TIMEZONE).format(
        timeFormat
      );
      let payload = `ubike_${datetime}.json`;
      eventBus.$emit("heatmap-slider-change", payload);
    }
  }
};
</script>
