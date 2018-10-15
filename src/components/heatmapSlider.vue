<template>
    <div>
        <vue-slider ref="heatmapSlider" v-model="value" v-bind="options"></vue-slider>
    </div>
</template>

<script>
import vueSlider from "vue-slider-component";

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
        }, 500);
      } else {
        console.log(this.$refs.heatmapSlider);
        clearInterval(this.heatmapSliderEvent);
      }
    }
  }
};
</script>
