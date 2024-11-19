<template>
  <div class="input-search mb-4">
    <form @submit.prevent="handleSearch">
      <div class="input-group">
        <!-- Dropdown bộ lọc -->
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

        <!-- Thanh tìm kiếm -->
        <input
          type="text"
          v-model="searchValue"
          class="form-control"
          :placeholder="`Tìm kiếm theo ${filterPlaceholder}`"
          @keydown.enter="handleSearch"
        />
        <button class="btn btn-primary" type="submit">
          <i class="fas fa-search"></i> <!-- Icon tìm kiếm -->
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'book-search',
  data() {
    return {
      searchValue: '', 
      filterKey: 'all', 
    };
  },
  computed: {
    filterPlaceholder() {
      switch (this.filterKey) {
        case 'admin':
          return 'quản trị viên';
        case 'librarian':
          return 'thủ thư';
        default:
          return 'tất cả';
      }
    },
  },
  methods: {
    handleSearch() {
      this.$emit("search", {
        filterKey: this.filterKey,
        searchValue: this.searchValue,
      });
    },
  },
};
</script>

<style scoped>
.input-search {
  max-width: 900px;
  margin: 0 auto;
}
</style>
