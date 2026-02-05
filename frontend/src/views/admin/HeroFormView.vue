<template>
  <div class="hero-form">
    <h1>{{ isEdit ? 'Sửa ô Hero' : 'Thêm ô Hero' }}</h1>
    <div v-if="loading">Đang tải...</div>
    <form v-else @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="title">Tiêu đề *</label>
        <input id="title" v-model="form.title" required placeholder="VD: Phòng khách" />
      </div>
      <div class="form-group">
        <label for="link">Link *</label>
        <input id="link" v-model="form.link" required placeholder="VD: /phong-khach" />
        <span class="hint">Đường dẫn khi click vào ô, ví dụ: /phong-khach (room slug)</span>
      </div>
      <div class="form-group">
        <label for="imageUrl">URL ảnh nền</label>
        <input id="imageUrl" v-model="form.imageUrl" placeholder="https://..." />
        <div v-if="form.imageUrl" class="preview">
          <img :src="form.imageUrl" alt="Preview" @error="imgError = true" />
          <p v-if="imgError" class="preview-error">Không tải được ảnh.</p>
        </div>
      </div>
      <div class="form-group">
        <label for="orderIndex">Thứ tự</label>
        <input id="orderIndex" v-model.number="form.orderIndex" type="number" min="0" />
        <span class="hint">Số nhỏ hiển thị trước (0, 1, 2, 3 cho 4 ô)</span>
      </div>
      <div class="form-group">
        <label>
          <input v-model="form.isActive" type="checkbox" />
          Hiển thị trên trang chủ
        </label>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
        <RouterLink to="/admin/hero" class="btn btn-outline">Hủy</RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { heroService } from '@/services/hero.service'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const isEdit = id && id !== 'new'

const form = reactive({
  title: '',
  link: '',
  imageUrl: '',
  orderIndex: 0,
  isActive: true,
})

const loading = ref(!!isEdit)
const saving = ref(false)
const error = ref('')
const imgError = ref(false)

onMounted(async () => {
  if (!isEdit) {
    loading.value = false
    return
  }
  try {
    const h = await heroService.getById(id)
    form.title = h.title
    form.link = h.link
    form.imageUrl = h.imageUrl ?? ''
    form.orderIndex = h.orderIndex ?? 0
    form.isActive = h.isActive ?? true
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function onSubmit() {
  saving.value = true
  error.value = ''
  imgError.value = false
  try {
    if (isEdit) {
      await heroService.update(id, {
        title: form.title,
        link: form.link,
        imageUrl: form.imageUrl || undefined,
        orderIndex: form.orderIndex,
        isActive: form.isActive,
      })
    } else {
      await heroService.create({
        title: form.title,
        link: form.link,
        imageUrl: form.imageUrl || undefined,
        orderIndex: form.orderIndex,
        isActive: form.isActive,
      })
    }
    router.push('/admin/hero')
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.message || 'Lưu thất bại.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.hero-form h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
}
.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  max-width: 600px;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
}
.hint {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}
.preview {
  margin-top: 0.5rem;
  max-width: 200px;
}
.preview img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #eee;
}
.preview-error {
  font-size: 0.8rem;
  color: #c00;
  margin-top: 0.25rem;
}
.error {
  color: var(--color-primary);
  margin-bottom: 1rem;
}
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
