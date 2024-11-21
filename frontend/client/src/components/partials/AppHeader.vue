<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <!-- Logo và tên ứng dụng -->
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="@/assets/images/logo.png" alt="Logo" class="d-inline-block align-text-top" height="40">
        <span class="ms-2">MY-LIBRARY</span>
      </router-link>

      <!-- Menu điều hướng -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav" v-if="isAuth">
        <ul class="navbar-nav ms-auto">
  
          <li class="nav-item">
            <router-link to="/info/books" class="nav-link">
              Thông Tin Sách
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/profile" class="nav-link">
              Tài Khoản Cá Nhân
            </router-link>
          </li>


          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" id="navbarDropdown" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false">
                Thông Tin Dịch Vụ
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link 
                  to="/services/book-borrowings" 
                  class="dropdown-item">
                    Thông Tin Mượn Trả Sách
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/services/reservations" 
                  class="dropdown-item">
                    Thông Tin Đặt Trước Sách
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/services/favorites" 
                  class="dropdown-item">
                    Danh Mục Yêu Thích Sách
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

  
      <div class="d-flex align-items-center" v-if="isAuth">
        <span class="text-dark me-2">{{ reader.fullname }}</span> 
        <router-link to="/profile">
          <i class="fas fa-user-circle me-2" style="font-size: 24px;"></i> 
        </router-link>
        <button @click="logout" class="btn btn-outline-info d-flex align-items-center">
          <i class="fas fa-sign-out-alt"></i> 
        </button>
      </div>
    </div>
  </nav>
  <!-- Hình ảnh ngang -->
  <div class="banner-container">
    <img src="@/assets/images/banner.png" alt="Banner" class="banner-image">
  </div>
</template>


<script setup>
import { useReaderStore } from '@/stores/reader.store';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

defineOptions({
  name: 'app-header'
})

const store = useReaderStore();
const router = useRouter();

const logout = async () => {
  await store.logout();
  router.push('/login');
}

const isAuth = computed(() => store.isAuth());

const reader = computed(() => store.reader);

</script>

<style scoped>

.navbar {
  position: relative;
  z-index: 2; 
  border-bottom: 2px solid #d9d9d9; 
}


.navbar-light {
  background-color: #8bd3e7 !important; 
}

.navbar-brand {
  font-size: 20px;
  font-weight: bold;
  color: #1e3050 !important; 
}

.navbar-brand img {
  background-color: transparent; 
  mix-blend-mode: multiply; 
  opacity: 0.6 
}

.nav-link {
  font-size: 16px;
  margin-right: 15px;
  font-weight: bold;
  color: #2b4c7e !important; 
}

.nav-link:hover {
  color: #698adc !important; 
}

.nav-item .dropdown-menu {
  background-color: #f7f8f9;
  border: 1px solid #ccc;
}

.nav-item .dropdown-item {
  color: #004d40; 
  font-weight: bold;
}

.nav-item .dropdown-item:hover {
  background-color: #e1f7d5; 
}

.btn-outline-info {
  color: #0275d8; 
  border-color: #0275d8;
}

.btn-outline-info:hover {
  background-color: #0275d8;
  color: #fff;
}

.btn-outline-info i,
.btn-outline-primary i {
  font-size: 18px; 
}


.banner-container {
  position: relative;
  top: -50px; 
  z-index: 1; 
  overflow: hidden; 
}


.banner-image {
  width: 100%; 
  height: 300px; 
  object-fit: cover; 
  opacity: 0.5; 
}

</style>