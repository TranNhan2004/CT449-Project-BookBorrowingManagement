<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="@/assets/images/logo.png" alt="Logo" class="d-inline-block align-text-top" height="40">
        <span class="ms-2">QUẢN LÝ MƯỢN SÁCH</span>
      </router-link>


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
          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="navbarDropdown" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              {{ staff.position === 'admin' ? 'Quản Lý Dữ Liệu' : 'Tra Cứu Dữ Liệu' }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link to="/data/books" class="dropdown-item">Dữ Liệu Sách</router-link>
              </li>
              <li>
                <router-link to="/data/authors" class="dropdown-item">Dữ Liệu Tác Giả</router-link>
              </li>
              <li>
                <router-link to="/data/publishers" class="dropdown-item">Dữ Liệu Nhà Xuất Bản</router-link>
              </li>
              <li>
                <router-link to="/data/topics" class="dropdown-item">Dữ Liệu Chủ Đề Sách</router-link>
              </li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" id="navbarDropdown" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false">
                Quản Lý Dịch Vụ
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link 
                  to="/services/book-borrowings" 
                  class="dropdown-item">
                    Dịch Vụ Mượn Trả Sách
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/services/reservations" 
                  class="dropdown-item">
                    Dịch Vụ Đặt Trước Sách
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

          <li class="nav-item dropdown">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="navbarDropdown" 
              role="button" 
              data-bs-toggle="dropdown" aria-expanded="false">
                Quản Lý Người Dùng
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <router-link to="/accounts/readers" class="dropdown-item">Quản Lý Độc Giả</router-link>
              </li>
              <li v-if="staff.position === 'admin'">
                <router-link to="/accounts/staffs" class="dropdown-item">Quản Lý Nhân Viên</router-link>
              </li>
              <li>
                <router-link to="/profile" class="dropdown-item">Tài Khoản Cá Nhân</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="d-flex align-items-center" v-if="isAuth">
        <span class="text-dark me-2">{{ staff.fullname }}</span> 
        <router-link to="/profile">
          <i class="fas fa-user-circle me-2" style="font-size: 24px;"></i> 
        </router-link>
        <button @click="logout" class="btn btn-outline-info d-flex align-items-center">
          <i class="fas fa-sign-out-alt"></i> 
        </button>
      </div>
    </div>
  </nav>

  <div class="banner-container">
    <img src="@/assets/images/banner.png" alt="Banner" class="banner-image">
  </div>
</template>


<script setup>
import { useStaffStore } from '@/stores/staff.store';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

defineOptions({
  name: 'app-header'
})

const store = useStaffStore();
const router = useRouter();

const logout = async () => {
  await store.logout();
  router.push('/login');
}

const isAuth = computed(() => store.isAuth());

const staff = computed(() => store.staff);

</script>

<style scoped>

.navbar {
  position: relative;
  z-index: 2; 
  border-bottom: 2px solid #d9d9d9; 
}


.navbar-light {
  background-color: #d8e1ea !important; 
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
  color: #a0c4ff !important; 
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