<template>
    <div>
        <button class="btn btn-primary" @click="onClickGenerateHeatmap">Click me</button>
    </div>
</template>
<script>
export default {
  name: "heatmap-button",
  methods: {
    onClickGenerateHeatmap() {
      this.$emit("generate-heatmap");
    }
  }
};
</script>
