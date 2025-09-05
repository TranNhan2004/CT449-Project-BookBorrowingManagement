<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <!-- Navbar -->
  <nav class="relative z-20 border-b-2 border-gray-300 bg-[#d8e1ea]">
    <div class="container mx-auto flex items-center px-4 py-2">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-x-2 font-bold text-[20px] text-[#1e3050]">
        <img src="/images/logo.png" alt="Logo" class="h-10 opacity-60 mix-blend-multiply" />
        <span>QUẢN LÝ MƯỢN SÁCH</span>
      </RouterLink>

      <!-- Menu -->
      <ul class="flex items-center ml-auto space-x-6">
        <!-- Dropdown: Quản lý dữ liệu -->
        <li class="relative group">
          <span class="cursor-pointer font-bold text-[16px] text-[#2b4c7e] hover:text-[#a0c4ff]">
            Quản lý dữ liệu
          </span>
          <ul class="absolute left-0 mt-2 hidden w-48 space-y-1 rounded-md border border-gray-300 bg-gray-50 p-2 group-hover:block">
            <li>
              <RouterLink to="/data/books" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Dữ Liệu Sách</RouterLink>
            </li>
            <li>
              <RouterLink to="/data/authors" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Dữ Liệu Tác Giả</RouterLink>
            </li>
            <li>
              <RouterLink to="/data/publishers" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Dữ Liệu Nhà Xuất Bản</RouterLink>
            </li>
            <li>
              <RouterLink to="/data/topics" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Dữ Liệu Chủ Đề Sách</RouterLink>
            </li>
          </ul>
        </li>

        <!-- Dropdown: Quản lý dịch vụ -->
        <li class="relative group">
          <span class="cursor-pointer font-bold text-[16px] text-[#2b4c7e] hover:text-[#a0c4ff]">
            Quản lý dịch vụ
          </span>
          <ul class="absolute left-0 mt-2 hidden w-56 space-y-1 rounded-md border border-gray-300 bg-gray-50 p-2 group-hover:block">
            <li>
              <RouterLink to="/services/book-borrowings" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Dịch Vụ Mượn Trả Sách</RouterLink>
            </li>
            <li>
              <RouterLink to="/services/reservations" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Dịch Vụ Đặt Trước Sách</RouterLink>
            </li>
            <li>
              <RouterLink to="/services/favorites" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Danh Mục Yêu Thích Sách</RouterLink>
            </li>
          </ul>
        </li>

        <!-- Dropdown: Quản lý người dùng -->
        <li class="relative group">
          <span class="cursor-pointer font-bold text-[16px] text-[#2b4c7e] hover:text-[#a0c4ff]">
            Quản lý người dùng
          </span>
          <ul class="absolute left-0 mt-2 hidden w-56 space-y-1 rounded-md border border-gray-300 bg-gray-50 p-2 group-hover:block">
            <li>
              <RouterLink to="/accounts/readers" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Quản Lý Độc Giả</RouterLink>
            </li>
            <li>
              <RouterLink to="/accounts/staffs" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Quản Lý Nhân Viên</RouterLink>
            </li>
            <li>
              <RouterLink to="/profile" class="block rounded p-2 font-bold text-[#004d40] hover:bg-green-100">Tài Khoản Cá Nhân</RouterLink>
            </li>
          </ul>
        </li>
      </ul>

      <!-- User section -->
      <div class="flex items-center space-x-3 ml-6">
        <span class="text-gray-800">...</span>
        <RouterLink to="/profile">
          <i class="fas fa-user-circle text-2xl text-gray-800"></i>
        </RouterLink>
        <button class="flex items-center rounded border border-sky-500 px-3 py-1 text-sky-600 hover:bg-sky-500 hover:text-white">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Banner -->
  <div class="relative z-10 overflow-hidden mt-0">
    <img src="/images/banner.png" alt="Banner" class="h-[300px] w-full object-cover opacity-50" />
  </div>
</template>

