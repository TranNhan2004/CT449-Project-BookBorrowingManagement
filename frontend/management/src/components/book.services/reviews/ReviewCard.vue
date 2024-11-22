<template>
  <div class="review-card d-flex border rounded p-3 mb-3 shadow">
    <div class="user-info text-center me-3">
      <i class="fas fa-user-circle fa-3x text-primary"></i>
      <p class="mt-2 fw-bold mb-0">{{ fullname || 'Người dùng ẩn danh' }}</p>
      <p class="mt-2 mb-0">{{ formatDate }}</p>
    </div>

    <div class="flex-grow-1">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <span v-for="star in 5" :key="star" class="me-1">
            <i
              :class="star <= props.review.rating ? 'fas fa-star text-warning' : 'far fa-star text-muted'"
            ></i>
          </span>
        </div>

        <div class="dropdown">
          <button
            class="btn btn-link p-0 text-dark"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li>
              <button class="dropdown-item text-danger" @click="deleteReview">
                <i class="fas fa-trash"></i> Xóa bình luận
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="bg-light p-3 border rounded">
        <p class="mb-0">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const emits = defineEmits(['delete']);

const props = defineProps(['review']);

const fullname = computed(() => props.review.reader.surname + ' ' + props.review.reader.name);

const formatDate = computed(() => new Date(props.review.createdAt).toLocaleDateString('vi-VN'));  

const deleteReview = () => emits('delete', props.review._id);
</script>

