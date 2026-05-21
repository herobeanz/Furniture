<template>
  <div class="chart-wrap">
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  labels: string[]
  data: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Yêu cầu',
      data: props.data,
      borderColor: '#8c6242',
      backgroundColor: 'rgba(140, 98, 66, 0.05)',
      fill: true,
      tension: 0.3,
      borderWidth: 2,
      pointBackgroundColor: '#5c3c24',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      grid: { color: '#f3f4f6' },
      ticks: { font: { size: 9 } },
      beginAtZero: true,
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 9 } },
    },
  },
}
</script>

<style scoped>
.chart-wrap {
  height: 14rem;
  position: relative;
}
</style>
