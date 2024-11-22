<template>
  <div class="container mt-4">
    <div class="row align-items-center gx-3 mb-3">
      <div class="col-md-8 d-flex align-items-center gap-3">
        <div class="input-group flex-grow-1" style="max-width: 50%;">
          <select id="searchFilter" v-model="searchFilter" class="form-select search-filter">
            <option value="">Tất cả</option>
            <option value="book">Theo sách</option>
          </select>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Nhập thông tin tìm kiếm"
            class="form-control search-input"
            @keyup.enter="applyFilters"
          />
          <button class="btn btn-primary search-button" @click="applyFilters">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <div class="filter-status">
          <label for="statusFilter" class="fw-bold mb-0 me-2">Trạng thái:</label>
          <select id="statusFilter" v-model="statusFilter" class="form-select filter-select">
            <option value="">Tất cả</option>
            <option value="returned">Đã trả</option>
            <option value="borrowing">Đang mượn</option>
            <option value="overdue">Quá hạn</option>
          </select>
        </div>
      </div>
    </div>

    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>STT</th>
          <th>Sách</th>
          <th>Chi Tiết</th>
          <th>Trạng Thái</th>
          <th>Gia hạn</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bookBorrowing, index) in filteredBookBorrowings" :key="bookBorrowing._id || index">
          <td>{{ index + 1 }}</td>
          
          <td>
            <div v-if="bookBorrowing.isEditing">
              <input
                type="text"
                v-model="bookBorrowing.bookItem"
                class="form-control"
                placeholder="Nhập ID bản sao..."
              />
            </div>
            <div v-else>
              <div class="d-flex align-items-center gap-2">
                <img
                  v-if="bookBorrowing.bookItem.book.imageBase64"
                  :src="bookBorrowing.bookItem.book.imageBase64"
                  alt="Book Image"
                  class="img-fluid"
                  style="width: 60px; height: 100px; object-fit: cover;"
                />
                <div>
                  <p class="mb-0 fw-bold"><b>Mã trên kệ: </b> {{ bookBorrowing.bookItem?.publicId }}</p>
                  <p class="text-muted mb-0"><b>Tiêu đề: </b> {{ bookBorrowing.bookItem?.book?.title }}</p>
                </div>
              </div>
            </div>
          </td>

          <td>
            <span><b>Ngày mượn: </b> {{ formatDate(bookBorrowing.borrowedDate) }}</span><br>
            <span><b>Ngày hết hạn: </b> {{ formatDate(bookBorrowing.dueDate) }}</span><br> 
            <span><b>Ngày trả: </b> {{ bookBorrowing.returnedDate 
                                      ? formatDate(bookBorrowing.returnedDate) : null }}</span>
          </td>

          <td>
            <span :class="getStatusClass(bookBorrowing)">
              <b>{{ getStatusLabel(bookBorrowing) }}</b>
            </span>
          </td>

          <td>
            <button
              v-if="canExtendDueDate(bookBorrowing)"
              class="btn btn-success btn-sm"
              @click="extendDueDate(bookBorrowing)"
            >
              <i class="fas fa-clock"></i> &nbsp; Gia hạn
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import bookBorrowingService from '@/services/book.services/bookBorrowing.service';
import bookService from '@/services/book.data/book.service';
import { executeWithSwal } from '@/utils/swal.util';
import { useReaderStore } from '@/stores/reader.store';

defineOptions({
  name: 'book-borrowing-table-of-reader'
});

const store = useReaderStore();

const bookBorrowings = ref([]);
const searchQuery = ref(''); 
const searchFilter = ref(''); 
const statusFilter = ref(''); 


const getFullDetail = async (bookBorrowing) => {
  const { bookItem, ...rest } = bookBorrowing;
  const bookProjection = { book: '-_id title image' };

  const bookResponse = await bookService.get(bookItem.book, { projection: JSON.stringify(bookProjection) });
  
  console.log(bookResponse);
  
  return { 
    bookItem: {
      publicId: bookItem.publicId,
      book: { ...bookResponse.data },
    },
    ...rest
  }

}

const canExtendDueDate = (bookBorrowing) => 
    !bookBorrowing.returnedDate && new Date(bookBorrowing.dueDate) > new Date()
    && new Date(bookBorrowing.dueDate) - new Date(bookBorrowing.borrowedDate) === 14 * 24 * 60 * 60 * 1000;

const fetchBookBorrowings = async () => {
  await executeWithSwal(async () => {
    const filter = { borrowedBy: store.reader._id };
    const projection = {
      bookBorrowing: '-addedBy -borrowedBy',
      bookItem: '_id publicId book',
    };

    const response = await bookBorrowingService.getAll({ 
      filter: JSON.stringify(filter),
      projection: JSON.stringify(projection) 
    });

    bookBorrowings.value = await Promise.all(response.data.map(async (bookBorrowing) => 
                                                await getFullDetail(bookBorrowing)));
    console.log(bookBorrowings.value);

    return response;
  }, false, false);
};

// Bộ lọc và tìm kiếm
const filteredBookBorrowings = computed(() => {
  const query = searchQuery.value.trim().toLowerCase().replace(' ', '');
  return bookBorrowings.value.filter((bookBorrowing) => {
    const matchesSearch =
      (searchFilter.value === 'book' && bookBorrowing.bookItem?.book?.title?.toLowerCase().includes(query)) ||
      searchFilter.value === '';

    const matchesStatus =
      (statusFilter.value === 'returned' && bookBorrowing.returnedDate) ||
      (statusFilter.value === 'overdue' && isOverdue(bookBorrowing)) ||
      (statusFilter.value === 'borrowing' && !bookBorrowing.returnedDate && !isOverdue(bookBorrowing)) ||
      statusFilter.value === '';

    return matchesSearch && matchesStatus;
  });
});


const formatDate = date => new Date(date).toLocaleDateString('vi-VN');  


const isOverdue = (bookBorrowing) => new Date() > new Date(bookBorrowing.dueDate) && !bookBorrowing.returnedDate;
const getStatusLabel = (bookBorrowing) =>
  bookBorrowing.returnedDate
    ? 'Đã trả'
    : isOverdue(bookBorrowing)
    ? 'Quá hạn'
    : 'Đang mượn';

const getStatusClass = (bookBorrowing) =>
  bookBorrowing.returnedDate ? 'text-success' : isOverdue(bookBorrowing) ? 'text-danger' : 'text-primary';


const extendDueDate = async (bookBorrowing) => {
  await executeWithSwal(async () => {
    return await bookBorrowingService.extendDueDate(bookBorrowing._id);
  });

  await fetchBookBorrowings();
}


onMounted(async () => await fetchBookBorrowings());
</script>

<style scoped>
.search-filter,
.search-input,
.search-button,
.filter-select,
.reader-input,
.add-button {
  height: calc(2.5rem + 2px);
}

.search-filter {
  max-width: 150px;
}

.filter-status {
  display: flex;
  align-items: center;
}

.filter-select {
  max-width: 120px;
}

.reader-input {
  max-width: 200px;
}

.gap-3 {
  gap: 1rem;
}

.gx-3 {
  --bs-gutter-x: 1rem;
}
</style>
