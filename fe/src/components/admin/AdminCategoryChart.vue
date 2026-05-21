<template>
  <div class="category-chart">
    <div class="chart-canvas">
      <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>
    <div class="chart-legend">
      <div v-for="(item, index) in items" :key="item.name" class="legend-row">
        <span class="legend-label">
          <span
            class="legend-dot"
            :style="{ backgroundColor: colors[index % colors.length] }"
          />
          {{ item.name }}
        </span>
        <span class="legend-value">{{ item.count }} ({{ item.percent }}%)</span>
      </div>
      <p v-if="items.length === 0" class="legend-empty">Chưa có dữ liệu.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { ADMIN_CATEGORY_CHART_COLORS } from '@/constants/admin-nav'

ChartJS.register(ArcElement, Tooltip)

export interface CategoryChartItem {
  name: string
  count: number
  percent: number
}

const props = defineProps<{
  items: CategoryChartItem[]
}>()

const colors = ADMIN_CATEGORY_CHART_COLORS

const chartData = computed(() => {
  if (props.items.length === 0) return null
  return {
    labels: props.items.map((i) => i.name),
    datasets: [
      {
        data: props.items.map((i) => i.count),
        backgroundColor: props.items.map(
          (_, index) => colors[index % colors.length],
        ),
        borderWidth: 1,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  cutout: '65%',
}
</script>

<style scoped>
.category-chart {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: center;
}

.chart-canvas {
  height: 8rem;
  position: relative;
}

.chart-legend {
  font-size: 0.625rem;
  font-weight: 600;
  color: #4b5563;
}

.legend-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.legend-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
}

.legend-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.legend-value {
  color: #111827;
  flex-shrink: 0;
}

.legend-empty {
  margin: 0;
  color: #9ca3af;
}
</style>
