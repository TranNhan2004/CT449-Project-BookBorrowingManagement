<template>
  <div class="input-search mb-4">
    <form @submit.prevent="handleSearch">
      <div class="row g-3 align-items-center">
        <!-- Dropdown cấp bậc -->
        <div class="col-md-4">
          <label for="rankFilter" class="form-label">Cấp bậc</label>
          <select
            id="rankFilter"
            v-model="rankFilter"
            class="form-select"
          >
            <option value="all">Tất cả</option>
            <option value="basic">Cơ bản</option>
            <option value="bronze">Đồng</option>
            <option value="silver">Bạc</option>
            <option value="gold">Vàng</option>
            <option value="platinum">Bạch Kim</option>
            <option value="diamond">Kim Cương</option>
          </select>
        </div>

        <!-- Dropdown trạng thái -->
        <div class="col-md-4">
          <label for="statusFilter" class="form-label">Trạng thái</label>
          <select
            id="statusFilter"
            v-model="statusFilter"
            class="form-select"
          >
            <option value="all">Tất cả</option>
            <option value="valid">Còn hiệu lực</option>
            <option value="invalid">Bị vô hiệu</option>
          </select>
        </div>

        <!-- Thanh tìm kiếm -->
        <div class="col-md-4">
          <label for="searchInput" class="form-label">Tìm kiếm theo tên</label>
          <div class="input-group">
            <input
              id="searchInput"
              type="text"
              v-model="searchValue"
              class="form-control"
              placeholder="Nhập tên để tìm kiếm"
              @keydown.enter.prevent="handleSearch"
            />
            <button class="btn btn-primary" type="submit">
              <i class="fas fa-search"></i> <!-- Icon tìm kiếm -->
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search']);

const searchValue = ref('');
const rankFilter = ref('all');
const statusFilter = ref('all');

const handleSearch = () => {
  const filters = {
    searchValue: searchValue.value.trim(),
    rankFilter: rankFilter.value,
    statusFilter: statusFilter.value,
  };
  emit('search', filters);
};
</script>

<style scoped>
.input-search {
  max-width: 900px;
  margin: 0 auto;
}
</style>
