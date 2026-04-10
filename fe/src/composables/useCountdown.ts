import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable for countdown timer
 */
export function useCountdown() {
  const countdownText = ref('')
  let countdownTimer: ReturnType<typeof setInterval> | null = null

  function updateCountdown() {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const ms = end.getTime() - Date.now()
    if (ms <= 0) {
      countdownText.value = 'Hết hạn'
      return
    }
    const h = Math.floor(ms / 3600000)
    const m = Math.floor((ms % 3600000) / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    countdownText.value = `${h}h : ${m}m : ${s}s`
  }

  function start() {
    updateCountdown()
    countdownTimer = setInterval(updateCountdown, 1000)
  }

  function stop() {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })

  return {
    countdownText,
    start,
    stop,
  }
}
