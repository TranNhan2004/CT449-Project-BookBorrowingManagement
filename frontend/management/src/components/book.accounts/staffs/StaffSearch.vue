<template>
  <div class="input-search mb-4">
    <form @submit.prevent="handleSearch">
      <div class="row g-3 align-items-center">

        <div class="col-md-4">
          <label for="positionFilter" class="form-label">Vị trí</label>
          <select
            id="positionFilter"
            v-model="positionFilter"
            class="form-select"
          >
            <option value="all">Tất cả</option>
            <option value="librarian">Thủ thư</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>


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
const positionFilter = ref('all');
const statusFilter = ref('all');

const handleSearch = () => {
  const filters = {
    searchValue: searchValue.value.trim(),
    positionFilter: positionFilter.value,
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
