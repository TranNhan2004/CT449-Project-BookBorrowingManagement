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
            <p><strong>Mã sách:</strong> {{ book.publicId }}</p>
            <p><strong>Tiêu đề:</strong> {{ book.title }}</p>
            <p><strong>Tác giả:</strong> {{ getAuthors() }}</p>
            <p><strong>Chủ đề:</strong> {{ getTopics() }}</p>
            <p><strong>Nhà xuất bản:</strong> {{ book.publisher?.name }}</p>
            <p><strong>Năm xuất bản:</strong> {{ book.publishedYear }}</p>
            <p><strong>Giá tiền:</strong> {{ getVNDCurrency() }}</p>
            <p><strong>Số lượng bản sao:</strong> {{ book.itemNumber }}</p>
            <p class="d-flex align-items-center">
              <strong>Đánh giá:</strong>
              <span class="ms-2 d-flex">
                <i v-for="star in renderStars()" :key="star.id" :class="star.icon" class="text-warning me-1"></i>
              </span>
            </p>
    
            <button 
              class="btn favorite-btn" 
              :class="{'btn-secondary': isBookFavorited, 'btn-danger': !isBookFavorited}"
              @click="isBookFavorited ? null : addToFavorite()"
              :disabled="isBookFavorited"
            >
              <i class="fas fa-heart me-2"></i> 
              {{ isBookFavorited ? 'Đã yêu thích' : 'Thêm vào mục yêu thích' }}
            </button>
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
    <section v-if="book._id">
      <hr class="section-divider" />
      <h4 class="fw-bold">CÁC BẢN SAO CỦA SÁCH</h4>
      <BookItemTable :bookId="book._id" />
    </section>

    <!-- Phần 3: Các bản đánh giá của sách -->
    <section v-if="book._id">
      <hr class="section-divider" />
      <h4 class="fw-bold">CÁC ĐÁNH GIÁ VỀ SÁCH</h4>
      <ReviewListOfBook :bookId="book._id" />
    </section>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import bookService from '@/services/book.data/book.service';
import { executeWithSwal } from '@/utils/swal.util';
import BookItemTable from '@/components/book.data/bookItems/BookItemTable.vue';
import ReviewListOfBook from '@/components/book.services/reviews/ReviewListOfBook.vue';
import favoriteService from '@/services/book.services/favorite.service';
import { useReaderStore } from '@/stores/reader.store';

defineOptions({
  name: 'book-detail'
});

const store = useReaderStore();

const props = defineProps(['bookId']);
const book = ref({});
const router = useRouter();
const isBookFavorited = ref(false);

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

    // Kiểm tra sách đã được yêu thích chưa
    checkIfBookIsFavorited();
    return response; 
  }, false, false, router, null, 'not-found', false);
};

// Kiểm tra xem sách đã được yêu thích chưa
const checkIfBookIsFavorited = async () => {
  const response = await favoriteService.getAll({
    filter: JSON.stringify({ book: book.value._id, reader: store.reader._id }),
  });

  if (response.data.length > 0) {
    isBookFavorited.value = true;
  } else {
    isBookFavorited.value = false;
  }
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

// Thêm vào yêu thích
const addToFavorite = async () => {
  const data = {
    book: book.value._id,
    reader: store.reader._id,
  };

  await executeWithSwal(async () => {
    const response = await favoriteService.create(data);
    if (response.success) {
      isBookFavorited.value = true;
    }
    return response;
  }, false, true);
};

onMounted(async () => await getBookDetail());
</script>


<style scoped>
.book-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.favorite-btn {
  margin-top: 15px;
}
</style>


