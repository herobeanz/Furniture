<template>
  <div class="rich-text-editor">
    <Editor
      license-key="gpl"
      :model-value="editorHtml"
      :init="editorInit"
      @update:model-value="onEditorChange"
    />
  </div>
</template>

<script setup lang="ts">
import '@/lib/tinymce-setup'
import { computed } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import { uploadsApi } from '@/services/api/uploads'
import { resolveMediaUrl } from '@/utils/mediaUrl'
import { fromEditorHtml, toEditorHtml } from '@/utils/richText'

const props = withDefaults(
  defineProps<{
    modelValue: string
    height?: number
    placeholder?: string
  }>(),
  {
    height: 420,
    placeholder: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorHtml = computed(() => toEditorHtml(props.modelValue))

const editorInit = computed(() => ({
  height: props.height,
  menubar: false,
  branding: false,
  promotion: false,
  statusbar: true,
  resize: true,
  placeholder: props.placeholder,
  plugins: [
    'advlist',
    'autolink',
    'lists',
    'link',
    'image',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'code',
    'fullscreen',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount',
  ],
  toolbar:
    'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image table | removeformat code',
  content_style:
    'body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1f2937; }',
  automatic_uploads: true,
  images_upload_handler: uploadEditorImage,
  convert_urls: false,
  relative_urls: false,
}))

function onEditorChange(value: string) {
  emit('update:modelValue', fromEditorHtml(value))
}

function uploadEditorImage(
  blobInfo: { blob: () => Blob; filename: () => string },
): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = blobInfo.blob()
    const name = blobInfo.filename() || 'image.jpg'
    const file = new File([blob], name, {
      type: blob.type || 'image/jpeg',
    })

    uploadsApi
      .uploadImage(file)
      .then((url) => resolve(resolveMediaUrl(url)))
      .catch(() => reject(new Error('Tải ảnh lên thất bại')))
  })
}
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  overflow: hidden;
}

.rich-text-editor :deep(.tox-tinymce) {
  border: none;
  border-radius: 0.25rem;
}

.rich-text-editor :deep(.tox-statusbar) {
  border-top: 1px solid var(--color-border);
}
</style>
