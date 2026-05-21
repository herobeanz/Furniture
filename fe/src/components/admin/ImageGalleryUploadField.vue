<template>
  <div class="gallery-upload" :class="{ 'gallery-upload--product': layout === 'product' }">
    <input
      ref="fileInputRef"
      type="file"
      class="file-input"
      accept="image/jpeg,image/png,image/webp,image/gif"
      multiple
      @change="onFileChange"
    />

    <template v-if="layout !== 'product'">
      <div
        class="upload-zone"
        :class="{ 'upload-zone--drag': dragOver, 'upload-zone--disabled': uploading || atMax }"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
        @click="openPicker"
      >
        <template v-if="uploading">
          <i class="fa-solid fa-spinner fa-spin upload-icon" />
          <span class="upload-title">Đang tải {{ uploadingCount }} ảnh...</span>
        </template>
        <template v-else>
          <i class="fa-solid fa-cloud-arrow-up upload-icon" />
          <span class="upload-title">Kéo thả nhiều ảnh hoặc</span>
          <button type="button" class="upload-btn" @click.stop="openPicker">Chọn ảnh</button>
          <p class="upload-hint">{{ hint }}</p>
        </template>
      </div>
    </template>

    <p v-if="notice" class="upload-notice">{{ notice }}</p>
    <p v-if="error" class="upload-error">{{ error }}</p>

    <div v-if="modelValue.length" class="gallery-grid">
      <div v-for="(url, index) in modelValue" :key="url + index" class="gallery-item">
        <img :src="resolveMediaUrl(url)" :alt="`Ảnh ${index + 1}`" />
        <button
          type="button"
          class="remove-btn"
          title="Xóa ảnh"
          @click="removeAt(index)"
        >
          <i class="fa-solid fa-xmark" />
        </button>
        <span v-if="layout !== 'product' && index === 0" class="primary-badge">Ảnh chính</span>
      </div>
    </div>

    <div
      v-if="layout === 'product' && !atMax"
      class="upload-zone upload-zone--compact"
      :class="{ 'upload-zone--drag': dragOver, 'upload-zone--disabled': uploading }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="openPicker"
    >
      <template v-if="uploading">
        <i class="fa-solid fa-spinner fa-spin upload-icon" />
        <span class="upload-title">Đang tải {{ uploadingCount }} ảnh...</span>
      </template>
      <template v-else>
        <i class="fa-solid fa-plus upload-icon" />
        <span class="upload-title">Thêm ảnh</span>
        <span class="upload-subtitle">Chọn nhiều file hoặc kéo thả cùng lúc</span>
      </template>
    </div>

    <p v-if="layout === 'product'" class="upload-hint upload-hint--below">
      {{ productHint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { uploadsApi } from '@/services/api/uploads'
import { resolveMediaUrl } from '@/utils/mediaUrl'

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    hint?: string
    maxSizeMb?: number
    maxImages?: number
    layout?: 'default' | 'product'
  }>(),
  {
    hint: 'Định dạng: JPG, PNG, WEBP, GIF. Tối đa 5MB mỗi ảnh. Ảnh đầu tiên là ảnh chính.',
    maxSizeMb: 5,
    maxImages: undefined,
    layout: 'default',
  },
)

const atMax = computed(
  () => props.maxImages != null && props.modelValue.length >= props.maxImages,
)

const remainingSlots = computed(() => {
  if (props.maxImages == null) return null
  return Math.max(0, props.maxImages - props.modelValue.length)
})

const productHint = computed(() => {
  if (props.layout !== 'product') return props.hint
  const base = props.hint
  if (remainingSlots.value != null && remainingSlots.value > 0) {
    return `${base} Còn thêm được ${remainingSlots.value} ảnh.`
  }
  return base
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadingCount = ref(0)
const error = ref('')
const notice = ref('')

function openPicker() {
  if (uploading.value || atMax.value) return
  notice.value = ''
  fileInputRef.value?.click()
}

function removeAt(index: number) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function validateFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Chỉ chấp nhận file ảnh'
  }
  const maxBytes = props.maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    return `Mỗi ảnh tối đa ${props.maxSizeMb}MB`
  }
  return null
}

async function processFiles(files: FileList | File[]) {
  const filesArray = Array.from(files)
  let list = filesArray.filter((f) => f.type.startsWith('image/'))
  if (!list.length) {
    error.value = 'Không có file ảnh hợp lệ'
    return
  }

  let truncationWarning = ''
  if (props.maxImages != null) {
    const remaining = props.maxImages - props.modelValue.length
    if (remaining <= 0) {
      error.value = `Tối đa ${props.maxImages} ảnh`
      return
    }
    if (list.length > remaining) {
      const picked = filesArray.length
      list = list.slice(0, remaining)
      truncationWarning = `Đã chọn ${picked} ảnh; chỉ thêm ${remaining} ảnh (tối đa ${props.maxImages}).`
    }
  }

  const validFiles: File[] = []
  for (const file of list) {
    const err = validateFile(file)
    if (err) {
      error.value = err
      return
    }
    validFiles.push(file)
  }

  if (!validFiles.length) return

  uploading.value = true
  uploadingCount.value = validFiles.length
  error.value = ''
  notice.value = ''
  try {
    const urls = await uploadsApi.uploadImages(validFiles)
    emit('update:modelValue', [...props.modelValue, ...urls])
    notice.value = truncationWarning
  } catch {
    error.value = 'Tải ảnh lên thất bại. Vui lòng thử lại.'
  } finally {
    uploading.value = false
    uploadingCount.value = 0
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    void processFiles(input.files)
  }
}

function onDragOver() {
  if (!uploading.value && !atMax.value) dragOver.value = true
}

function onDragLeave() {
  dragOver.value = false
}

function onDrop(e: DragEvent) {
  dragOver.value = false
  if (uploading.value || atMax.value) return
  const files = e.dataTransfer?.files
  if (files?.length) {
    void processFiles(files)
  }
}
</script>

<style scoped>
.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.upload-zone {
  border: 2px dashed var(--color-border);
  border-radius: 0.5rem;
  padding: 1.25rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.75rem;
}

.upload-zone--disabled {
  pointer-events: none;
  opacity: 0.85;
}

.upload-zone:hover,
.upload-zone--drag {
  background: rgba(249, 250, 251, 0.8);
  border-color: #d1d5db;
}

.upload-icon {
  font-size: 1.25rem;
  color: #9ca3af;
  margin-bottom: 0.375rem;
}

.upload-title {
  font-weight: 700;
  color: #374151;
  font-size: 0.75rem;
}

.upload-btn {
  margin-top: 0.375rem;
  background: #fff;
  border: 1px solid var(--color-border);
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.upload-hint {
  margin-top: 0.375rem;
  font-size: 0.625rem;
  color: #9ca3af;
}

.upload-notice {
  font-size: 0.6875rem;
  color: #b45309;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.upload-error {
  font-size: 0.6875rem;
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: 0.75rem;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: #f9fafb;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  border-radius: 9999px;
  background: rgba(17, 24, 39, 0.65);
  color: #fff;
  cursor: pointer;
  font-size: 0.5rem;
}

.primary-badge {
  position: absolute;
  left: 0.25rem;
  bottom: 0.25rem;
  font-size: 0.5625rem;
  font-weight: 700;
  background: var(--color-primary);
  color: #fff;
  padding: 0.0625rem 0.25rem;
  border-radius: 0.125rem;
}

.gallery-upload--product .gallery-grid {
  grid-template-columns: repeat(4, 1fr);
  gap: 0.625rem;
  margin-bottom: 0.625rem;
}

.gallery-upload--product .gallery-item {
  aspect-ratio: 16 / 9;
}

.gallery-upload--product .remove-btn {
  top: 0.25rem;
  right: 0.25rem;
  width: 1rem;
  height: 1rem;
  font-size: 0.5rem;
}

.upload-zone--compact {
  min-height: 5rem;
  padding: 1rem;
  margin-bottom: 0;
}

.upload-zone--compact .upload-icon {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.upload-subtitle {
  font-size: 0.625rem;
  font-weight: 500;
  color: #9ca3af;
  margin-top: 0.125rem;
}

.upload-hint--below {
  margin-top: 0.375rem;
  margin-bottom: 0;
  font-size: 0.625rem;
  color: #9ca3af;
  font-weight: 400;
}
</style>
