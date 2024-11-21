<template>
  <div class="d-flex justify-content-between mb-3">
    <div class="d-flex input-group w-50">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm nhà xuất bản..."
        class="form-control"
        @keyup.enter="searchPublishers"
      />
      <button @click="searchPublishers" class="btn btn-primary">
        <i class="fas fa-search"></i>
      </button>
    </div>
    <button @click="createPublisherRow" class="btn btn-success">
      <i class="fas fa-plus"></i> <b>Thêm</b>
    </button>
  </div>

  <table class="table table-bordered">
    <thead>
      <tr>
        <th>ID</th>
        <th>Tên nhà xuất bản</th>
        <th>Mô tả</th>
        <th>Chỉnh sửa/Lưu</th>
        <th>Xóa/Thoát</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="publisher in filteredPublishers" :key="publisher._id">
        <td>{{ publisher._id || 'Mới' }}</td> 
        <td>
          <input
            v-model="publisher.name"
            type="text"
            :readonly="!publisher.isEditing"
            class="form-control"
          />
        </td>
        <td>
          <textarea
            v-model="publisher.description"
            :readonly="!publisher.isEditing"
            class="form-control"
          ></textarea>
        </td>
        <td class="text-center action-cell">
          <button v-if="!publisher.isEditing" @click="toggleEditMode(publisher)" class="btn btn-warning"> 
            <i class="fas fa-edit"></i> 
          </button>
          <button v-else @click="updateOrCreatePublisher(publisher)" class="btn btn-info">
            <i class="fas fa-save"></i> 
          </button>
        </td>
        <td class="text-center action-cell">
          <button v-if="!publisher.isEditing" @click="deletePublisher(publisher)" class="btn btn-danger">
            <i class="fas fa-trash"></i> 
          </button>
          <button v-else @click="handleExitEditMode(publisher)" class="btn btn-secondary"> 
            <i class="fas fa-times"></i> 
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script setup>
import { ref, onMounted, computed, defineOptions } from 'vue';
import publisherService from '@/services/book.data/publisher.service';
import { showSwal, executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'publisher-table',
})

const publishers = ref([]);
const searchQuery = ref('');

const fetchPublishers = async () => {
  await executeWithSwal(async () => {
    const response = await publisherService.getAll();
    publishers.value = response.data.map((publisher) => ({
      ...publisher,
      isEditing: false,
    }));
    return response;
  }, false, false);
};

const searchPublishers = () => {
  const query = searchQuery.value.trim().toLowerCase();
  return publishers.value.filter((publisher) =>
    [publisher.publicId, publisher.name, publisher.description]
      .map((field) => field?.toLowerCase().includes(query))
      .some((match) => match)
  );
};

const filteredPublishers = computed(searchPublishers);

const toggleEditMode = (publisher) => {
  publisher.isEditing = true;
};


const updateOrCreatePublisher = async (publisher) => {
  await executeWithSwal(async () => {
    let response = null;
    if (publisher._id) {
      response = await publisherService.update(publisher._id, publisher);
      const index = publishers.value.findIndex((p) => p._id === publisher._id);
      if (index !== -1) {
        publishers.value[index] = { ...response.data, isEditing: false };
      }

    } else {
      response = await publisherService.create(publisher);
      publishers.value = publishers.value.filter((p) => p._id !== null);
      publishers.value.unshift({ ...response.data, isEditing: false });
    }

    return response;
  }, false, true);
};

const deletePublisher = async (publisher) => {
  await executeWithSwal(async () => {
    const response = await publisherService.delete(publisher._id);
    publishers.value = publishers.value.filter((p) => p._id !== publisher._id);
    return response;
  }, true, true);
};

const createPublisherRow = () => {
  const newPublisher = {
    _id: null,
    name: '',
    description: '',
    isEditing: true,
  };
  publishers.value.unshift(newPublisher);
};

const handleExitEditMode = async (publisher) => {
  if (publisher.isEditing) {
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
      if (publisher._id === null) {
        publishers.value.shift(); 
      }
      publisher.isEditing = false;
    }
  }
};

onMounted(async () => await fetchPublishers());
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


