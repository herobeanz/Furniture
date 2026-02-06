<template>
  <footer class="site-footer">
    <div class="footer-cols">
      <div class="container footer-cols-inner">
        <div v-for="node in categoryTree" :key="node.id" class="footer-col">
          <h4>
            <RouterLink :to="'/' + node.slug">{{ node.name }}</RouterLink>
          </h4>
          <ul>
            <template v-for="child in node.children" :key="child.id">
              <li>
                <RouterLink :to="'/' + node.slug + '/' + child.slug">{{ child.name }}</RouterLink>
              </li>
            </template>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Thông tin</h4>
          <ul>
            <li><RouterLink to="/page/lien-he">Liên hệ</RouterLink></li>
            <li><RouterLink to="/page/about">Về chúng tôi</RouterLink></li>
            <li><a href="#">Giao hàng</a></li>
            <li><a href="#">Đổi trả</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-mid">
      <div class="container footer-mid-inner">
        <RouterLink to="/" class="footer-logo">FURNITURE STORE</RouterLink>
        <div class="footer-contact">
          <p class="footer-phone">(024) 1234 5678</p>
          <p class="footer-hours">Thứ 2 - Thứ 6: 8:00 - 21:00 / Thứ 7: 9:00 - 18:00</p>
        </div>
        <div class="footer-payments">
          <span class="payment-label">Thanh toán:</span>
          <span class="payment-icons">Visa · Mastercard · COD</span>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>© Furniture Store. Bảo lưu mọi quyền.</p>
        <div class="footer-legal">
          <a href="#">Điều khoản</a>
          <a href="#">Bảo mật</a>
          <RouterLink to="/page/lien-he">Liên hệ</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { categoryService, type CategoryTreeNode } from '@/services/category.service'

const categoryTree = ref<CategoryTreeNode[]>([])

onMounted(async () => {
  try {
    categoryTree.value = await categoryService.getCategoryTree()
  } catch {
    categoryTree.value = []
  }
})
</script>

<style scoped>
/* Footer */
.site-footer {
  background: #1a1a1a;
  color: #ccc;
  margin-top: auto;
}
.footer-cols {
  padding: 2.5rem 0 1.5rem;
}
.footer-cols-inner {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 2rem;
}
.footer-col h4 {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-weight: 600;
}
.footer-col h4 a {
  color: #fff;
  text-decoration: none;
}
.footer-col h4 a:hover {
  color: var(--color-primary);
}
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-col li {
  margin-bottom: 0.4rem;
}
.footer-col a {
  color: #aaa;
  font-size: 0.85rem;
  text-decoration: none;
}
.footer-col a:hover {
  color: #fff;
}
.footer-mid {
  border-top: 1px solid #333;
  padding: 1.25rem 0;
}
.footer-mid-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.footer-logo {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  color: #fff;
  text-decoration: none;
}
.footer-contact {
  text-align: center;
}
.footer-phone {
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.2rem 0;
}
.footer-hours {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
}
.footer-payments {
  font-size: 0.85rem;
  color: #888;
}
.payment-label {
  margin-right: 0.5rem;
}
.footer-bottom {
  border-top: 1px solid #333;
  padding: 0.75rem 0;
}
.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.footer-bottom-inner p {
  margin: 0;
  font-size: 0.8rem;
  color: #888;
}
.footer-legal {
  display: flex;
  gap: 1rem;
}
.footer-legal a {
  font-size: 0.8rem;
  color: #888;
  text-decoration: none;
}
.footer-legal a:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .footer-cols-inner {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-mid-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
