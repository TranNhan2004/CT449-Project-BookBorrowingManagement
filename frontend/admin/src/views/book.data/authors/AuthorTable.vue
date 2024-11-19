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
    <div class="d-flex gap-2">
      <button @click="createAuthorRow" class="btn btn-success">
        <i class="fas fa-plus"></i> Thêm
      </button>
      <button @click="deleteAllAuthors" class="btn btn-danger">
        <i class="fas fa-trash"></i> Xóa Tất Cả
      </button>
    </div>
  </div>

  <!-- Bảng tác giả -->
  <table class="table table-bordered">
    <thead>
      <tr>
        <th>ID</th>
        <th>Tên Tác Giả</th>
        <th>Mô Tả</th>
        <th>Chỉnh Sửa</th>
        <th>Xóa</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(author, index) in filteredAuthors" :key="author._id">
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
          <button
            @click="toggleEditMode(author, index)"
            :class="['btn', author.isEditing ? 'btn-info' : 'btn-warning']"
          >
            <i class="fas" :class="author.isEditing ? 'fa-save' : 'fa-edit'"></i>
            {{ author.isEditing ? 'Lưu' : '' }}
          </button>
        </td>
        <td class="text-center action-cell">
          <button
            @click="handleExitEditMode(author)"
            class="btn"
            :class="author.isEditing ? 'btn-secondary' : 'btn-danger' "
          >
            <i class="fas" :class="author.isEditing ? 'fa-times' : 'fa-trash'"></i>
            {{ author.isEditing ? 'Thoát' : '' }}
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

onMounted(async () => {
  await fetchAuthors();
});

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

const toggleEditMode = async (author) => {
  if (author.isEditing) {
    await updateOrCreateAuthor(author);
  } else {
    author.isEditing = true;
  }
};

const updateOrCreateAuthor = async (author) => {
  await executeWithSwal(async () => {
    let response = null;
    if (author._id) {
      response = await authorService.update(author._id, author);
    } else {
      response = await authorService.create(author);
    }
    author.isEditing = false;
    await fetchAuthors();
    return response;
  }, false, true);
};

const deleteAuthor = async (author) => {
  await executeWithSwal(async () => {
    await authorService.delete(author._id);
    await fetchAuthors();
  }, true, true);
};

const deleteAllAuthors = async () => {
  await executeWithSwal(async () => {
    await authorService.deleteAll();
    await fetchAuthors();
  }, true, true);
}

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

  } else {
    return await deleteAuthor(author);
  }
};
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


