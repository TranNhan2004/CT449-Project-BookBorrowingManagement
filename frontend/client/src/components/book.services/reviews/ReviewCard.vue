<template>
  <div class="review-card d-flex border rounded p-3 mb-3 shadow">
    <!-- Icon người dùng và tên -->
    <div class="user-info text-center me-3">
      <i class="fas fa-user-circle fa-3x text-primary"></i>
      <p class="mt-2 fw-bold mb-0">{{ fullname || 'Người dùng ẩn danh' }}</p>
      <p class="mt-2 mb-0">{{ formatDate }}</p>
    </div>

    <!-- Nội dung đánh giá -->
    <div class="flex-grow-1">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <!-- Sửa số sao -->
        <div v-if="isEditing">
          <span v-for="star in 5" :key="star" class="me-1">
            <i
              :class="star <= editedRating ? 'fas fa-star text-warning' : 'far fa-star text-muted'"
              @click="setRating(star)"
            ></i>
          </span>
        </div>
        <div v-else>
          <span v-for="star in 5" :key="star" class="me-1">
            <i
              :class="star <= props.review.rating ? 'fas fa-star text-warning' : 'far fa-star text-muted'"
            ></i>
          </span>
        </div>

        <!-- Menu hành động -->
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
            <li v-if="canEditAndDelete">
              <button class="dropdown-item text-primary" @click="startEditing">
                <i class="fas fa-edit"></i> Sửa bình luận
              </button>
              <button class="dropdown-item text-danger" @click="deleteReview">
                <i class="fas fa-trash"></i> Xóa bình luận
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Form chỉnh sửa bình luận khi đang ở chế độ chỉnh sửa -->
      <div v-if="isEditing" class="bg-light p-3 border rounded">
        <textarea v-model="editedComment" rows="4" class="form-control mb-2" required></textarea>
        <button class="btn btn-success" @click="saveEdit">Lưu thay đổi</button>
        <button class="btn btn-secondary ms-2" @click="cancelEdit">Hủy</button>
      </div>

      <!-- Nội dung bình luận khi không chỉnh sửa -->
      <div v-else class="bg-light p-3 border rounded">
        <p class="mb-0">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useReaderStore } from '@/stores/reader.store';
import { showSwal } from '@/utils/swal.util';

const emits = defineEmits(['update', 'delete']);

const store = useReaderStore();

const props = defineProps(['review']);

const canEditAndDelete = computed(() => store.reader._id.toString() === props.review.reader._id.toString());

const fullname = computed(() => props.review.reader.surname + ' ' + props.review.reader.name);

const formatDate = computed(() => new Date(props.review.createdAt).toLocaleDateString('vi-VN')); 

const isEditing = ref(false);
const editedComment = ref(props.review.comment);
const editedRating = ref(props.review.rating);  


const startEditing = () => {
  isEditing.value = true;
  editedComment.value = props.review.comment;  
  editedRating.value = props.review.rating;  
};

const cancelEdit = async () => {
  const confirmation = await showSwal({
    title: 'Hủy chỉnh sửa?',
    text: 'Bạn có chắc muốn hủy chỉnh sửa bình luận này?',
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Chắc chắn',
    cancelButtonText: 'Trở lại',
  });

  if (confirmation.isConfirmed) {
    isEditing.value = false;
    editedComment.value = props.review.comment;  
    editedRating.value = props.review.rating; 
  }
};


const saveEdit = () => {
  emits('update', { reviewId: props.review._id, comment: editedComment.value, rating: editedRating.value });
  isEditing.value = false; 
};


const setRating = (rating) => {
  editedRating.value = rating;
};


const deleteReview = () => emits('delete', props.review._id);
</script>