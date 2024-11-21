<template>
  <div class="d-flex justify-content-between mb-3">
    <div class="d-flex input-group w-50">
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
    <button @click="createTopicRow" class="btn btn-success">
      <i class="fas fa-plus"></i> <b>Thêm</b>
    </button>
  </div>

  <table class="table table-bordered">
    <thead>
      <tr>
        <th>ID</th>
        <th>ID công khai</th>
        <th>Tên chủ đề</th>
        <th>Lưu</th>
        <th>Xóa/Thoát</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="topic in filteredTopics" :key="topic._id">
        <td>{{ topic._id || 'Mới' }}</td>
        <td>
          <input
            v-model="topic.publicId"
            type="text"
            :readonly="!topic.isEditing"
            class="form-control"
          />
        </td>
        <td>
          <input
            v-model="topic.name"
            type="text"
            :readonly="!topic.isEditing"
            class="form-control"
          />
        </td>
        <td class="text-center action-cell">
          <button v-if="topic.isEditing"  @click="createTopic(topic)" class="btn btn-info">
            <i class="fas fa-save"></i> 
          </button>
        </td>
        <td class="text-center action-cell">
          <button v-if="!topic.isEditing" @click="deleteTopic(topic)" class="btn btn-danger">
            <i class="fas fa-trash"></i> 
          </button>
          <button v-else @click="handleExitEditMode(topic)" class="btn btn-secondary"> 
            <i class="fas fa-times"></i> 
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>


<script setup>
import { ref, onMounted, computed, defineOptions } from 'vue';
import topicService from '@/services/book.data/topic.service';
import { showSwal, executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'topic-table',
})

const topics = ref([]);
const searchQuery = ref('');

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

const searchTopics = () => {
  const query = searchQuery.value.trim().toLowerCase();
  return topics.value.filter((topic) =>
    [topic.publicId, topic.name, topic.description]
      .map((field) => field?.toLowerCase().includes(query))
      .some((match) => match)
  );
};

const filteredTopics = computed(searchTopics);


const createTopic = async (topic) => {
  await executeWithSwal(async () => {
    let response = null;
    if (topic._id) {
      response = await topicService.update(topic._id, topic);
      const index = topics.value.findIndex((p) => p._id === topic._id);
      if (index !== -1) {
        topics.value[index] = { ...response.data, isEditing: false };
      }

    } else {
      response = await topicService.create(topic);
      topics.value = topics.value.filter((p) => p._id !== null);
      topics.value.unshift({ ...response.data, isEditing: false });
    }

    return response;
  }, false, true);
};

const deleteTopic = async (topic) => {
  await executeWithSwal(async () => {
    const response = await topicService.delete(topic._id);
    topics.value = topics.value.filter((p) => p._id !== topic._id);
    return response;
  }, true, true);
};

const createTopicRow = () => {
  const newTopic = {
    _id: null,
    publicId: null,
    name: '',
    isEditing: true,
  };
  topics.value.unshift(newTopic);
};

const handleExitEditMode = async (topic) => {
  if (topic.isEditing) {
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
      if (topic._id === null) {
        topics.value.shift(); 
      }
      topic.isEditing = false;
    }
  }
};

onMounted(async () => await fetchTopics());
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


