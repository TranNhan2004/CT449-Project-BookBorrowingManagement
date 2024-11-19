<template>
  <div>
    <!-- Thanh tìm kiếm và nút thêm -->
    <div class="d-flex justify-content-between mb-3">
      <div class="input-group w-50">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm chủ đề..."
          class="form-control"
          @keyup.enter="searchTopics"
        />
        <button @click="searchTopics" class="btn btn-primary">
          <i class="fas fa-search"></i>
        </button>
      </div>
      <div class="d-flex gap-2">
        <button @click="createTopicRow" class="btn btn-success">
          <i class="fas fa-plus"></i> Thêm
        </button>
        <button @click="deleteAllTopics" class="btn btn-danger">
          <i class="fas fa-trash"></i> Xóa Tất Cả
        </button>
      </div>
    </div>

    <!-- Bảng hiển thị dữ liệu -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>ID Công Khai</th>
          <th>Tên Chủ Đề</th>
          <th>Mô Tả</th>
          <th>Lưu</th>
          <th>Xóa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="topic in filteredTopics" :key="topic._id">
          <td>{{ topic._id || 'Mới' }}</td>
          <td>
            <input
              v-model="topic.publicId"
              type="text"
              :readonly="!!topic._id"
              class="form-control"
            />
          </td>
          <td>
            <input
              v-model="topic.name"
              type="text"
              :readonly="!!topic._id"
              class="form-control"
            />
          </td>
          <td>
            <textarea
              v-model="topic.description"
              :readonly="!!topic._id"
              class="form-control"
            ></textarea>
          </td>
          <td class="text-center action-cell">
            <button
              v-if="!topic._id"
              @click="saveTopic(topic)"
              class="btn btn-info"
            >
              <i class="fas fa-save"></i> Lưu
            </button>
          </td>
          <td class="text-center action-cell">
            <button
              @click="deleteTopic(topic)"
              class="btn btn-danger"
            >
              <i class="fas fa-trash"></i> Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, defineOptions } from 'vue';
import topicService from '@/services/book.data/topic.service';
import { executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'topic-table',
});

const topics = ref([]);
const searchQuery = ref('');

onMounted(async () => {
  await fetchTopics();
});

// Lấy danh sách chủ đề
const fetchTopics = async () => {
  await executeWithSwal(async () => {
    const response = await topicService.getAll();
    topics.value = response.data.map((topic) => ({
      ...topic,
      isEditing: false,
    }));
    return response;
  }, false, false);
};

// Lọc danh sách theo từ khóa tìm kiếm
const searchTopics = () => {
  const query = searchQuery.value.trim().toLowerCase();
  return topics.value.filter((topic) =>
    [topic.name, topic.description]
      .map((field) => field?.toLowerCase().includes(query))
      .some((match) => match)
  );
};

const filteredTopics = computed(searchTopics);

// Lưu thông tin chủ đề
const saveTopic = async (topic) => {
  await executeWithSwal(async () => {
    let response = null;
    if (!topic._id) {
      response = await topicService.create(topic); // Tạo mới
    } else {
      response = await topicService.update(topic._id, topic); // Cập nhật
    }
    return response;
  }, false, true);

  await fetchTopics();
};

// Xóa một chủ đề
const deleteTopic = async (topic) => {
  await executeWithSwal(async () => {
    if (topic._id) {
      await topicService.delete(topic._id);
    } else {
      topics.value.shift(); // Xóa hàng chưa lưu
    }
  }, true, true);

  await fetchTopics();
};

// Xóa tất cả chủ đề
const deleteAllTopics = async () => {
  await executeWithSwal(async () => {
    return await topicService.deleteAll();
  }, true, true);

  await fetchTopics();
};

const createTopicRow = () => {
  const newTopic = {
    _id: null,
    publicId: '',
    name: '',
    description: '',
  };
  topics.value.unshift(newTopic); 
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


