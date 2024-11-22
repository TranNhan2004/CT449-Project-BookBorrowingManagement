<template>
  <div class="review-list container mt-4">
    <div class="row align-items-center mb-3">
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

      <div class="col-md-3 text-end">
        <button
          class="btn btn-danger"
          @click="deleteAllReviews"
          :disabled="reviews.length === 0"
        >
          <i class="fas fa-trash"></i> <b>Xóa Tất Cả</b>
        </button>
      </div>
    </div>

    <hr />

    <div v-if="filteredReviews.length > 0">
      <ReviewCard
        v-for="(review, index) in filteredReviews"
        :key="review._id || index"
        :review="review"
        v-on:delete="deleteReview"
      />
    </div>
    <p v-else class="text-muted">Chưa có đánh giá nào cho sách này.</p>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import ReviewCard from './ReviewCard.vue'; 
import reviewService from '@/services/book.services/review.service'; 
import readerService from '@/services/book.accounts/reader.service';
import { executeWithSwal } from '@/utils/swal.util';

const props = defineProps(['bookId']);

const reviews = ref([]); 
const searchQuery = ref('');
const starFilter = ref('');


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
  return {
    reader: { _id: reader, ...readerResponse.data.user },
    ...rest,
  };
};


const fetchReviews = async () => {
  await executeWithSwal(async () => {
    const filter = { book: props.bookId };
    const response = await reviewService.getAll({ filter: JSON.stringify(filter) });
    reviews.value = await Promise.all(response.data.map(async (review) => await getFullDetail(review)));
  }, false, false);
};


const deleteReview = async (reviewId) => {
  await executeWithSwal(async () => {
    await reviewService.delete(reviewId);
    reviews.value = reviews.value.filter((review) => review._id !== reviewId);
  }, true, true);
};


const deleteAllReviews = async () => {
  await executeWithSwal(async () => {
    await reviewService.deleteAll({ book: props.bookId });
    reviews.value = [];
  }, true, true);
};


onMounted(async () => await fetchReviews());
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
