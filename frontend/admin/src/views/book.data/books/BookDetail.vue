<template>
  <div class="book-list container mt-4">
    <!-- Phần 1: Thông tin chi tiết của sách -->
    <section class="book-detail-section d-flex">
      <div class="container mt-4">
        <div class="row">
          <!-- Phần hình ảnh sách -->
          <div class="col-md-4">
            <img 
              :src="book.imageBase64" 
              alt="Book Image" 
              class="img-fluid rounded shadow"
            />
          </div>

          <!-- Phần thông tin chi tiết -->
          <div class="col-md-5">
            <h4 class="fw-bold">THÔNG TIN CHI TIẾT CỦA SÁCH</h4>
            <hr />
            <p><strong>Tiêu đề:</strong> {{ book.title }}</p>
            <p><strong>Mã sách:</strong> {{ book.publicId }}</p>
            <p><strong>Tác giả:</strong> {{ getAuthors() }}</p>
            <p><strong>Chủ đề:</strong> {{ getTopics() }}</p>
            <p><strong>Nhà xuất bản:</strong> {{ book.publisher?.name }}</p>
            <p><strong>Năm xuất bản:</strong> {{ book.publishedYear }}</p>
            <p><strong>Giá tiền:</strong> {{ getVNDCurrency() }}</p>
            <p><strong>Số lượng bản sao:</strong> {{ book.itemNumber }}</p>
            <p><strong>Được thêm bởi:</strong> {{ getStaff() }}</p>
            <p class="d-flex align-items-center">
              <strong>Đánh giá:</strong>
              <span class="ms-2 d-flex">
                <i v-for="star in renderStars()" :key="star.id" :class="star.icon" class="text-warning me-1"></i>
              </span>
            </p>
    
            <div class="mt-4">
              <button 
                class="btn btn-warning me-2"
                @click="goToBookEdit"
              >
                <i class="fas fa-edit me-2"></i> Hiệu chỉnh
              </button>
              <button 
                class="btn btn-danger"
                @click="deleteBook"
              >
                <i class="fas fa-trash-alt me-2"></i> Xóa
              </button>
            </div>
          </div>

          <!-- Phần mô tả sách -->
          <div class="col-md-3">
            <h4 class="fw-bold">MÔ TẢ SÁCH</h4>
            <hr />
            <div v-html="book.description || 'Không có mô tả cho sách này.'"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Phần 2: Các bản sao của sách -->
    <!-- <section>
      <h5 class="section-title">Các bản sao của sách</h5>
      <hr class="section-divider" />
      <BookItemTable :bookId="book._id" />
    </section> -->

    <!-- Phần 3: Các bản đánh giá của sách -->
    <!-- <section>
      <h5 class="section-title">Các bản đánh giá của sách</h5>
      <hr class="section-divider" />
      <div class="reviews">
        <div v-for="review in book.reviews" :key="review.id" class="review-item">
          <p><strong>{{ review.reviewer }}</strong>: {{ review.content }}</p>
        </div>
        <p v-if="book.reviews.length === 0" class="text-muted">Chưa có đánh giá nào.</p>
      </div>
    </section> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import bookService from '@/services/book.data/book.service';
import { executeWithSwal } from '@/utils/swal.util';

const props = defineProps(['bookId']);
const book = ref({});
const router = useRouter();

// Lấy thông tin chi tiết sách
const getBookDetail = async () => {
  await executeWithSwal(async () => {
    const bookId = props?.bookId;
    const response = await bookService.get(bookId, {
      projection: JSON.stringify({
        book: '',
        authors: '-_id name',
        topics: '-_id name',
        publisher: '-_id name',
      }),
    });
    book.value = response.data;
    return response; 
  }, false, false, router);
};

// Hiển thị đánh giá
const renderStars = () => {
  const stars = [];
  const rating = book.value.averageRating || 0;
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push({ id: i, icon: 'fas fa-star' }); 
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push({ id: i, icon: 'fas fa-star-half-alt' }); 
    } else {
      stars.push({ id: i, icon: 'far fa-star' }); 
    }
  }
  return stars;
};


const getAuthors = () => book.value.authors?.map((author) => author.name).join(', ');
const getTopics = () => book.value.topics?.map((topic) => topic.name).join(', ');
const getVNDCurrency = () => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                                      .format(Number(book.value.price));
const getStaff = () => '...' + book.value.addedBy?._id.slice(-5) + ' - ' +
                        book.value.addedBy?.user?.surname + ' ' + book.value.addedBy?.user?.name;


const goToBookEdit = () => {
  router.push({ name: 'book-edit', params: { book: JSON.stringify(book.value) } });
};

const deleteBook = async () => {
  await executeWithSwal(async () => {
    const bookId = props?.bookId;
    return await bookService.delete(bookId);
  }, true, true);

  router.push({ name: 'book-list' });
}


onMounted(async () => {
  await getBookDetail();
});
</script>


<style scoped>
.book-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

