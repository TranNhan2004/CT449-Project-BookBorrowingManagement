<template>
  <div class="book-card d-flex border rounded p-3 mb-3 shadow align-items-center position-relative">
    <div class="me-3">
      <img  
        :src="book.imageBase64" 
        alt="Book Image" 
        class="img-fluid rounded"
        style="max-height: 120px; width: auto;"
      />
    </div>

    <div class="flex-grow-1">
      <h5 class="text-primary mb-2">{{ book.title }}</h5>
      <p class="text-muted mb-1"><strong>Tác giả: </strong><i>{{ getAuthors }}</i></p>
      <p class="text-muted mb-1"><strong>Chủ đề: </strong><i>{{ getTopics }}</i></p>
      <p class="text-muted mb-1"><strong>Nhà xuất bản: </strong><i>{{ book.publisher?.name }}</i></p>
    </div>

    <div class="position-absolute bottom-0 end-0 p-3">
      <button class="btn btn-info text-white" @click="goToDetail">
        <i class="fas fa-info-circle"></i> &nbsp; <i><b>Xem Chi Tiết</b></i>
      </button>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'book-card',
})

const props = defineProps(['book']);

const router = useRouter();

const getAuthors = computed(() => props.book.authors?.map(author => author.name).join(', ') || 'Không rõ');
const getTopics = computed(() => props.book.topics?.map(topic => topic.name).join(', ') || 'Không rõ');

const goToDetail = () => {
  router.push({ name: 'book-detail', params: { bookId: props.book._id } });
};
</script>


<style scoped>
.book-card img {
  max-height: 120px;
  object-fit: cover;
}

.book-card .btn-info {
  background-color: #17a2b8; 
  border-color: #17a2b8;
}

.book-card .btn-info:hover {
  background-color: #138496; 
  border-color: #138496;
}

.position-absolute {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
