<template>
  <Suspense>
    <template #default>
      <PowerPriceChart />
    </template>
    <template #fallback>
      <!-- Loading indicator or fallback component -->
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
<script lang="ts">
import { defineComponent, Suspense } from 'vue';
import PowerPriceChart from './PowerPriceChart.vue';

export default defineComponent({
  components: {
    PowerPriceChart,
  },
});
</script>