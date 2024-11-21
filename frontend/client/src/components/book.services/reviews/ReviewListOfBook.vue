<template>
  <div class="review-list container mt-4">
    <!-- Bộ lọc và tìm kiếm -->
    <div class="row align-items-center mb-3">
      <!-- Tìm kiếm theo tên độc giả -->
      <div class="col-md-6">
        <div class="input-group">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm theo tên độc giả..."
            class="form-control"
            @keyup.enter="applyFilters" 
          />
          <button class="btn btn-primary" @click="applyFilters">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- Bộ lọc theo số sao -->
      <div class="col-md-3 d-flex align-items-center">
        <label for="starFilter" class="fw-bold me-2 mb-0">Số sao:</label>
        <select id="starFilter" v-model="starFilter" class="form-select" @change="applyFilters">
          <option value="">Tất cả</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>
    </div>

    <div class="mt-4">
      <h5>Gửi Bình luận</h5>
      <div>
        <label for="rating" class="form-label">Đánh giá:</label>
        <select
          v-model="newReview.rating"
          id="rating"
          class="form-select mb-2"
          required
        >
          <option value="" disabled>Chọn số sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>

        <label for="comment" class="form-label">Nội dung:</label>
        <textarea
          v-model="newReview.comment"
          id="comment"
          rows="4"
          class="form-control mb-3"
          placeholder="Viết bình luận của bạn..."
          required
        ></textarea>

        <button 
          @click="submitReview" 
          class="btn btn-success" 
          :disabled="isSubmitting || !newReview.comment || !newReview.rating"
        >
          Gửi Bình luận
        </button>
      </div>
    </div>

    <hr />

    <!-- Hiển thị danh sách các đánh giá -->
    <div v-if="filteredReviews.length > 0">
      <ReviewCard
        v-for="(review, index) in filteredReviews"
        :key="review._id || index"
        :review="review"
        v-on:update="updateReview"
        v-on:delete="deleteReview"
      />
    </div>
    <p v-else class="text-muted">Chưa có đánh giá nào cho sách này.</p>

    
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ReviewCard from './ReviewCard.vue'; 
import reviewService from '@/services/book.services/review.service'; 
import readerService from '@/services/book.accounts/reader.service';
import { executeWithSwal } from '@/utils/swal.util';
import { useReaderStore } from '@/stores/reader.store';

const props = defineProps({
  bookId: {
    type: String, 
    required: true,
  },
});

const store = useReaderStore();

const reviews = ref([]); // Dữ liệu gốc
const searchQuery = ref('');
const starFilter = ref('');
const newReview = ref({
  rating: '',
  comment: '',
});
const isSubmitting = ref(false);

// Lọc reviews theo tên và sao
const filteredReviews = computed(() => {
  return reviews.value.filter((review) => {
    const fullName = `${review.reader.surname} ${review.reader.name}`.toLowerCase();
    const matchesName = fullName.includes(searchQuery.value.toLowerCase());
    const matchesStar = starFilter.value
      ? review.rating === Number(starFilter.value)
      : true;
    return matchesName && matchesStar;
  });
});

const getFullDetail = async (review) => {
  const { reader, ...rest } = review;
  const readerProjection = { reader: '_id user', user: '-_id surname name' };
  const readerResponse = await readerService.get(reader, { projection: JSON.stringify(readerProjection) });
  console.log(readerResponse);
  return { 
    reader: { _id: reader, ...readerResponse.data.user },
    ...rest,
  };
}

const fetchReviews = async () => {
  await executeWithSwal(async () => {
    const filter = { book: props.bookId };
    const response = await reviewService.getAll({ filter: JSON.stringify(filter) });
    reviews.value = await Promise.all(response.data.map(async (review) => await getFullDetail(review)));
  }, false, false);
};

// Xóa một review
const deleteReview = async (reviewId) => {
  await executeWithSwal(async () => {
    await reviewService.delete(reviewId);
    reviews.value = reviews.value.filter((review) => review._id !== reviewId);
  }, true, true);
};


// Gửi bình luận mới
const submitReview = async () => {
  if (!newReview.value.comment || !newReview.value.rating) return;

  isSubmitting.value = true;
  const reviewData = {
    book: props.bookId,
    rating: Number(newReview.value.rating),
    comment: newReview.value.comment,
    reader: store.reader._id
  };

  await executeWithSwal(async () => {
    const response = await reviewService.create(reviewData);
    reviews.value.push(await getFullDetail(response.data));
    newReview.value.comment = ''; 
    newReview.value.rating = '';  
  }, false, true);
};

const updateReview = async ({ reviewId, comment, rating }) => {
  await executeWithSwal(async () => {
    await reviewService.update(reviewId, { newComment: comment, newRating: rating });
    const updatedReview = reviews.value.find(review => review._id === reviewId);
    if (updatedReview) {
      updatedReview.comment = comment;
      updatedReview.rating = rating;
    }
  }, true, false);
};

// Fetch dữ liệu ban đầu
onMounted(async () => {
  await fetchReviews();
});
</script>



<style scoped>
.review-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.input-group .form-control {
  border-radius: 0.25rem 0 0 0.25rem;
}

.input-group .btn {
  border-radius: 0 0.25rem 0.25rem 0;
}

.d-flex .form-select {
  max-width: 200px;
}
</style>
