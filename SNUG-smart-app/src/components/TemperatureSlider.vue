<template>
    <slider v-model="myNumber" orientation="circular" circleOffset="225" circleGap="200" tooltip="true" tooltipText="%v°" :min="15" :max="30" width="60%" height="10"  color="#36c777" track-color="#d1d1d1" />
    <div id="number" > {{ myNumber }}</div>
</template>
  
  <script lang="ts">
  import { temperature } from '@/utils/globalUtils';
  import slider from "vue3-slider"
  export default {
  data() {
    return {
      myNumber: temperature,
    };
  },
  name: "TemperatureSlider",
  components: {
    slider,
  },
  mounted() {
    // document.querySelector(".tooltip").style.display = "flex";
  },
};
</script>
<style>
#number {
  position: absolute;
  font-size: 8vh;
}
</style>
  