<template>
  <div class="price-range-slider">
    <div class="price-range-label">
      Giá từ {{ formatPrice(minValue) }} đến {{ formatPrice(maxValue) }}
    </div>
    <div class="slider-container" ref="sliderRef">
      <div class="slider-track" :style="trackStyle"></div>
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="minValue"
        class="slider-input slider-min"
        @input="updateMinValue"
      />
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="maxValue"
        class="slider-input slider-max"
        @input="updateMaxValue"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { formatPrice } from '@/utils/format'

interface Props {
  min?: number
  max?: number
  step?: number
  modelValue?: { min: number; max: number }
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 50000000,
  step: 100000,
  modelValue: () => ({ min: 0, max: 50000000 }),
})

const emit = defineEmits<{
  'update:modelValue': [value: { min: number; max: number }]
}>()

const sliderRef = ref<HTMLElement | null>(null)
const minValue = ref(props.modelValue.min)
const maxValue = ref(props.modelValue.max)

watch(
  () => props.modelValue,
  (newVal) => {
    minValue.value = newVal.min
    maxValue.value = newVal.max
  },
  { immediate: true }
)

const trackStyle = computed(() => {
  const minPercent = ((minValue.value - props.min) / (props.max - props.min)) * 100
  const maxPercent = ((maxValue.value - props.min) / (props.max - props.min)) * 100
  return {
    left: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`,
  }
})

function updateMinValue(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (value <= maxValue.value) {
    minValue.value = value
    emit('update:modelValue', { min: minValue.value, max: maxValue.value })
  }
}

function updateMaxValue(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  if (value >= minValue.value) {
    maxValue.value = value
    emit('update:modelValue', { min: minValue.value, max: maxValue.value })
  }
}
</script>

<style scoped>
.price-range-slider {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-range-label {
  font-size: 0.9rem;
  color: var(--color-text);
}

.slider-container {
  position: relative;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
}

.slider-track {
  position: absolute;
  height: 100%;
  background: #d4a574;
  border-radius: 3px;
  pointer-events: none;
}

.slider-input {
  position: absolute;
  width: 100%;
  height: 6px;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
  outline: none;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #d4a574;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #d4a574;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-input::-ms-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #d4a574;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-min {
  z-index: 1;
}

.slider-max {
  z-index: 2;
}

@media (max-width: 768px) {
  .price-range-label {
    font-size: 0.85rem;
  }

  .slider-input::-webkit-slider-thumb,
  .slider-input::-moz-range-thumb,
  .slider-input::-ms-thumb {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .price-range-label {
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .slider-container {
    height: 8px;
  }

  .slider-input {
    height: 8px;
  }

  .slider-input::-webkit-slider-thumb,
  .slider-input::-moz-range-thumb,
  .slider-input::-ms-thumb {
    width: 22px;
    height: 22px;
  }
}
</style>
