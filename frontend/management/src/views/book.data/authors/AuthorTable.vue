<template>
  <div class="d-flex justify-content-between mb-3">
    <div class="d-flex input-group w-50">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm tác giả..."
        class="form-control"
        @keyup.enter="searchAuthors"
      />
      <button @click="searchAuthors" class="btn btn-primary">
        <i class="fas fa-search"></i>
      </button>
    </div>
    <button @click="createAuthorRow" class="btn btn-success">
      <i class="fas fa-plus"></i> <b>Thêm</b>
    </button>
  </div>

  <table class="table table-bordered">
    <thead>
      <tr>
        <th>ID</th>
        <th>Tên tác giả</th>
        <th>Mô tả</th>
        <th>Chỉnh sửa/Lưu</th>
        <th>Xóa/Thoát</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="author in filteredAuthors" :key="author._id">
        <td>{{ author._id || 'Mới' }}</td>
        <td>
          <input
            v-model="author.name"
            type="text"
            :readonly="!author.isEditing"
            class="form-control"
          />
        </td>
        <td>
          <textarea
            v-model="author.description"
            :readonly="!author.isEditing"
            class="form-control"
          ></textarea>
        </td>
        <td class="text-center action-cell">
          <button v-if="!author.isEditing" @click="toggleEditMode(author)" class="btn btn-warning"> 
            <i class="fas fa-edit"></i> 
          </button>
          <button v-else @click="updateOrCreateAuthor(author)" class="btn btn-info">
            <i class="fas fa-save"></i> 
          </button>
        </td>
        <td class="text-center action-cell">
          <button v-if="!author.isEditing" @click="deleteAuthor(author)" class="btn btn-danger">
            <i class="fas fa-trash"></i> 
          </button>
          <button v-else @click="handleExitEditMode(author)" class="btn btn-secondary"> 
            <i class="fas fa-times"></i> 
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script setup>
import { ref, onMounted, computed, defineOptions } from 'vue';
import authorService from '@/services/book.data/author.service';
import { showSwal, executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'author-table',
})

const authors = ref([]);
const searchQuery = ref('');

const fetchAuthors = async () => {
  await executeWithSwal(async () => {
    const response = await authorService.getAll();
    authors.value = response.data.map((author) => ({
      ...author,
      isEditing: false,
    }));
    return response;
  }, false, false);
};

const searchAuthors = () => {
  const query = searchQuery.value.trim().toLowerCase();
  return authors.value.filter((author) =>
    [author.publicId, author.name, author.description]
      .map((field) => field?.toLowerCase().includes(query))
      .some((match) => match)
  );
};

const filteredAuthors = computed(searchAuthors);

const toggleEditMode = (author) => {
  author.isEditing = true;
};


const updateOrCreateAuthor = async (author) => {
  await executeWithSwal(async () => {
    let response = null;
    if (author._id) {
      response = await authorService.update(author._id, author);
      const index = authors.value.findIndex((p) => p._id === author._id);
      if (index !== -1) {
        authors.value[index] = { ...response.data, isEditing: false };
      }

    } else {
      response = await authorService.create(author);
      authors.value = authors.value.filter((p) => p._id !== null);
      authors.value.unshift({ ...response.data, isEditing: false });
    }

    return response;
  }, false, true);
};

const deleteAuthor = async (author) => {
  await executeWithSwal(async () => {
    const response = await authorService.delete(author._id);
    authors.value = authors.value.filter((p) => p._id !== author._id);
    return response;
  }, true, true);
};

const createAuthorRow = () => {
  const newAuthor = {
    _id: null,
    name: '',
    description: '',
    isEditing: true,
  };
  authors.value.unshift(newAuthor);
};

const handleExitEditMode = async (author) => {
  if (author.isEditing) {
    const confirmation = await showSwal({
      title: 'Bạn chắc chắn muốn thoát?',
      text: 'Dữ liệu chưa được lưu sẽ bị mất!',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Có, tôi chắc chắn',
      cancelButtonText: 'Không, quay lại',
    });

    if (confirmation.isConfirmed) {
      if (author._id === null) {
        authors.value.shift(); 
      }
      author.isEditing = false;
    }
  }
};

onMounted(async () => await fetchAuthors());
</script>

<style scoped>
thead {
  text-align: center;
}

.action-cell {
  text-align: center;
  vertical-align: middle;
}
</style>


