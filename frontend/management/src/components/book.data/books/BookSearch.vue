<template>
  <div class="input-search mb-4">
    <form @submit.prevent="handleSearch">
      <div class="input-group">
      
        <select
          v-model="filterKey"
          class="form-select"
          style="max-width: 200px;"
        >
          <option value="all">Tất cả</option>
          <option value="title">Tiêu đề</option>
          <option value="topic">Chủ đề</option>
          <option value="author">Tác giả</option>
          <option value="publisher">Nhà xuất bản</option>
        </select>

        <input
          type="text"
          v-model="searchValue"
          class="form-control"
          :placeholder="`Tìm kiếm theo ${filterPlaceholder}`"
          @keyup.enter="handleSearch"
        />
        <button class="btn btn-primary" type="submit">
          <i class="fas fa-search"></i> 
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

defineOptions({
  name: 'book-search'
});

const emits = defineEmits(['search']);

const searchValue = ref('');
const filterKey = ref('all');

const filterPlaceholder = computed(() => {
  switch (filterKey.value) {
    case 'title': return 'tiêu đề';
    case 'topic': return 'chủ đề';
    case 'author': return 'tác giả';
    case 'publisher': return 'nhà xuất bản';
    default: return '...';
  }
});

const handleSearch = () => emits('search', { filterKey: filterKey.value, searchValue: searchValue.value });

</script>

<style scoped>
.input-search {
  max-width: 900px;
  margin: 0 auto;
}
</style>
