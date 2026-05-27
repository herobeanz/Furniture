<template>
  <div
    v-if="variant === 'hero'"
    class="hero-upload"
  >
    <input
      ref="fileInputRef"
      type="file"
      class="file-input"
      accept="image/jpeg,image/png,image/webp,image/gif"
      @change="onFileChange"
    />
    <div class="hero-preview">
      <img
        v-if="modelValue"
        :src="previewSrc"
        alt="Ảnh đại diện"
        class="hero-preview-img"
      />
      <div v-else class="hero-preview-empty">
        <i class="fa-regular fa-image" />
        <span>Chưa có ảnh</span>
      </div>
    </div>
    <button
      type="button"
      class="hero-change-btn"
      :disabled="uploading"
      @click="openPicker"
    >
      <template v-if="uploading">
        <i class="fa-solid fa-spinner fa-spin" />
        Đang tải...
      </template>
      <template v-else>
        {{ modelValue ? 'Thay đổi ảnh' : 'Chọn ảnh' }}
      </template>
    </button>
    <p v-if="error" class="upload-error">{{ error }}</p>
  </div>

  <div
    v-else
    class="image-upload"
    :class="{ 'image-upload--split': showPreview }"
  >
    <div class="image-upload-main">
      <input
        ref="fileInputRef"
        type="file"
        class="file-input"
        accept="image/jpeg,image/png,image/webp,image/gif"
        @change="onFileChange"
      />

      <div
        class="upload-zone"
        :class="{ 'upload-zone--drag': dragOver, 'upload-zone--disabled': uploading }"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
        @click="openPicker"
      >
        <template v-if="uploading">
          <i class="fa-solid fa-spinner fa-spin upload-icon" />
          <span class="upload-title">Đang tải ảnh lên...</span>
        </template>
        <template v-else>
          <i class="fa-solid fa-cloud-arrow-up upload-icon" />
          <span class="upload-title">Kéo thả ảnh vào đây hoặc</span>
          <button type="button" class="upload-btn" @click.stop="openPicker">
            Chọn ảnh
          </button>
          <p class="upload-hint">{{ hint }}</p>
        </template>
      </div>

      <p v-if="error" class="upload-error">{{ error }}</p>

      <div v-if="modelValue && !showPreview && showInlinePreview" class="thumb-inline">
        <img :src="previewSrc" alt="Xem trước" />
        <button type="button" class="remove-btn" title="Xóa ảnh" @click="clearImage">
          <i class="fa-solid fa-xmark" />
        </button>
      </div>
    </div>

    <div v-if="showPreview" class="field">
      <label v-if="previewLabel" class="field-label">{{ previewLabel }}</label>
      <div class="thumb-preview">
        <img v-if="modelValue" :src="previewSrc" alt="Xem trước" />
        <div v-else class="thumb-preview-empty">
          <i class="fa-regular fa-image" />
          <span>Chưa có ảnh</span>
        </div>
        <button
          v-if="modelValue"
          type="button"
          class="remove-btn remove-btn--overlay"
          title="Xóa ảnh"
          @click="clearImage"
        >
          <i class="fa-solid fa-xmark" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { uploadsApi } from '@/services/api/uploads'
import { resolveMediaUrl } from '@/utils/mediaUrl'

const props = withDefaults(
  defineProps<{
    modelValue: string
    hint?: string
    showPreview?: boolean
    /** When false, hides the small preview under the upload zone (use external preview UI). */
    showInlinePreview?: boolean
    previewLabel?: string
    maxSizeMb?: number
    variant?: 'default' | 'hero'
  }>(),
  {
    hint: 'Định dạng: JPG, PNG, WEBP, GIF. Tối đa 5MB',
    showPreview: true,
    showInlinePreview: true,
    previewLabel: 'Xem trước',
    maxSizeMb: 5,
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
const uploading = ref(false)
const error = ref('')

const previewSrc = computed(() => resolveMediaUrl(props.modelValue))

function openPicker() {
  if (uploading.value) return
  fileInputRef.value?.click()
}

function clearImage() {
  emit('update:modelValue', '')
  error.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function validateFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Chỉ chấp nhận file ảnh'
  }
  const maxBytes = props.maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    return `Ảnh tối đa ${props.maxSizeMb}MB`
  }
  return null
}

async function processFiles(files: FileList | File[]) {
  const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
  if (!list.length) return
  const file = list[0]
  if (!file) return
  const validationError = validateFile(file)
  if (validationError) {
    error.value = validationError
    return
  }

  uploading.value = true
  error.value = ''
  try {
    const url = await uploadsApi.uploadImage(file)
    emit('update:modelValue', url)
  } catch {
    error.value = 'Tải ảnh lên thất bại. Vui lòng thử lại.'
  } finally {
    uploading.value = false
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

function onDrop(e: DragEvent) {
  dragOver.value = false
  if (uploading.value) return
  const files = e.dataTransfer?.files
  if (files?.length) {
    void processFiles(files)
  }
}
</script>

<style scoped>
.image-upload--split {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .image-upload--split {
    grid-template-columns: 1fr 1fr;
  }
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.image-upload-main {
  position: relative;
}

.upload-zone {
  border: 2px dashed var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 10rem;
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
  margin-bottom: 0.5rem;
}

.upload-title {
  font-weight: 700;
  color: #374151;
  font-size: 0.75rem;
}

.upload-btn {
  margin-top: 0.5rem;
  background: #fff;
  border: 1px solid var(--color-border);
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  color: #374151;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.upload-btn:hover {
  background: #f9fafb;
}

.upload-hint {
  margin-top: 0.5rem;
  font-size: 0.625rem;
  color: #9ca3af;
}

.upload-error {
  margin-top: 0.5rem;
  font-size: 0.6875rem;
  color: #dc2626;
  font-weight: 600;
}

.field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.375rem;
}

.thumb-preview {
  position: relative;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  height: 10rem;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.thumb-preview img,
.thumb-inline img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.thumb-preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  color: #9ca3af;
  font-size: 0.6875rem;
  font-weight: 600;
}

.thumb-preview-empty i {
  font-size: 1.5rem;
}

.thumb-inline {
  position: relative;
  margin-top: 0.75rem;
  height: 8rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn {
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 9999px;
  background: rgba(17, 24, 39, 0.65);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
}

.remove-btn:hover {
  background: rgba(17, 24, 39, 0.85);
}

.hero-upload {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
}

.hero-preview {
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  overflow: hidden;
  height: 13rem;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}

.hero-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  color: #9ca3af;
  font-size: 0.6875rem;
  font-weight: 600;
}

.hero-preview-empty i {
  font-size: 1.5rem;
}

.hero-change-btn {
  width: 100%;
  border: 1px solid var(--color-border);
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background: #fff;
  color: #374151;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: background 0.15s;
}

.hero-change-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.hero-change-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}
</style>
