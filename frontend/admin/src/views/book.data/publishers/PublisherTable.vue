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
    <div class="d-flex gap-2">
      <button @click="createPublisherRow" class="btn btn-success">
        <i class="fas fa-plus"></i> Thêm
      </button>
      <button @click="deleteAllPublishers" class="btn btn-danger">
        <i class="fas fa-trash"></i> Xóa Tất Cả
      </button>
    </div>
  </div>

  <table class="table table-bordered">
    <thead>
      <tr>
        <th>ID</th>
        <th>Tên Nhà Xuất Bản</th>
        <th>Mô Tả</th>
        <th>Chỉnh Sửa</th>
        <th>Xóa</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(publisher, index) in filteredPublishers" :key="publisher._id">
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
          <button
            @click="toggleEditMode(publisher, index)"
            :class="['btn', publisher.isEditing ? 'btn-info' : 'btn-warning']"
          >
            <i class="fas" :class="publisher.isEditing ? 'fa-save' : 'fa-edit'"></i>
            {{ publisher.isEditing ? 'Lưu' : '' }}
          </button>
        </td>
        <td class="text-center action-cell">
          <button
            @click="handleExitEditMode(publisher)"
            class="btn"
            :class="publisher.isEditing ? 'btn-secondary' : 'btn-danger' "
          >
            <i class="fas" :class="publisher.isEditing ? 'fa-times' : 'fa-trash'"></i>
            {{ publisher.isEditing ? 'Thoát' : '' }}
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

onMounted(async () => {
  await fetchPublishers();
});

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

const toggleEditMode = async (publisher) => {
  if (publisher.isEditing) {
    await updateOrCreatePublisher(publisher);
  } else {
    publisher.isEditing = true;
  }
};

const updateOrCreatePublisher = async (publisher) => {
  await executeWithSwal(async () => {
    let response = null;
    if (publisher._id) {
      response = await publisherService.update(publisher._id, publisher);
    } else {
      response = await publisherService.create(publisher);
    }
    publisher.isEditing = false;
    return response;
  }, false, true);

  await fetchPublishers();
};

const deletePublisher = async (publisher) => {
  await executeWithSwal(async () => {
    return await publisherService.delete(publisher._id);
  }, true, true);

  await fetchPublishers();
};

const deleteAllPublishers = async () => {
  await executeWithSwal(async () => {
    return await publisherService.deleteAll();
  }, true, true);

  await fetchPublishers();
}

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

  } else {
    return await deletePublisher(publisher);
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


