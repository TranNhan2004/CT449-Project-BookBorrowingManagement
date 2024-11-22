<template>
  <div class="container mt-4">
    <!-- Tìm kiếm, bộ lọc, thêm mới -->
    <div class="row align-items-center gx-3 mb-3">
      <!-- Tìm kiếm và bộ lọc trạng thái -->
      <div class="col-md-8 d-flex align-items-center gap-3">
        <!-- Nhóm tìm kiếm -->
        <div class="input-group flex-grow-1" style="max-width: 50%;">
          <select id="searchFilter" v-model="searchFilter" class="form-select search-filter">
            <option value="">Tất cả</option>
            <option value="reader">Theo độc giả</option>
            <option value="book">Theo sách</option>
            <option value="addedBy">Theo nhân viên thêm</option>
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

        <!-- Bộ lọc trạng thái -->
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

      <!-- Ô nhập độc giả và nút thêm -->
      <div class="col-md-4 d-flex justify-content-end align-items-center gap-2">
        <input
          type="text"
          v-model="readerIdInput"
          placeholder="Nhập ID độc giả..."
          class="form-control reader-input"
        />
        <button class="btn btn-success add-button" @click="createBookBorrowingRow">
          <i class="fas fa-plus"></i> <b>Thêm</b>
        </button>
      </div>
    </div>

    <!-- Bảng thông tin mượn sách -->
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Sách</th>
          <th>Độc Giả</th>
          <th>Chi Tiết</th>
          <th>Nhân Viên Thêm</th>
          <th>Trạng Thái</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bookBorrowing, index) in filteredBookBorrowings" :key="bookBorrowing._id || index">
          <td>{{ bookBorrowing._id || 'Mới' }}</td>
          
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
            <div v-if="bookBorrowing.isEditing">
              <input
                type="text"
                v-model="bookBorrowing.borrowedBy._id"
                class="form-control"
                placeholder="Nhập ID độc giả..."
              />
            </div>
            <div v-else>
              {{ formatBorrowedBy(bookBorrowing.borrowedBy) }}
            </div>
          </td>

          <td>
            <span><b>Ngày mượn: </b> {{ formatDate(bookBorrowing.borrowedDate) }}</span><br>
            <span><b>Ngày hết hạn: </b> {{ formatDate(bookBorrowing.dueDate) }}</span><br> 
            <span><b>Ngày trả: </b> {{ bookBorrowing.returnedDate 
                                      ? formatDate(bookBorrowing.returnedDate) : null }}</span>
          </td>
          <td>{{ formatAddedBy(bookBorrowing.addedBy) }}</td>
          <td>
            <span :class="getStatusClass(bookBorrowing)">
              <b>{{ getStatusLabel(bookBorrowing) }}</b>
            </span>
          </td>
          

          <td>
            <div class="d-flex justify-content-center gap-2">
              <template v-if="bookBorrowing.isEditing">
                <button class="btn btn-primary btn-sm" @click="createBookBorrowing(bookBorrowing)">
                  <i class="fas fa-save"></i>
                </button>

                <button class="btn btn-secondary btn-sm" @click="handleExitEditMode(bookBorrowing)">
                  <i class="fas fa-times"></i>
                </button>
              </template>
              <template v-else>
                <button 
                  v-if="!bookBorrowing.returnedDate"
                  class="btn btn-success btn-sm" 
                  @click="returnBook(bookBorrowing)"
                >
                  <i class="fas fa-book"></i> Trả sách
                </button>
                <button 
                  v-if="bookBorrowing.returnedDate"
                  class="btn btn-danger btn-sm" 
                  @click="deleteBookBorrowing(bookBorrowing)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </template>
            </div>
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
import staffService from '@/services/book.accounts/staff.service';
import readerService from '@/services/book.accounts/reader.service';
import { executeWithSwal, showSwal } from '@/utils/swal.util';
import { useStaffStore } from '@/stores/staff.store';

defineOptions({
  name: 'book-borrowing-table'
});

const store = useStaffStore();

const bookBorrowings = ref([]);
const searchQuery = ref(''); 
const searchFilter = ref(''); 
const statusFilter = ref(''); 
const readerIdInput = ref(''); 


const getFullDetail = async (bookBorrowing) => {
  console.log(bookBorrowing);
  const { bookItem, borrowedBy, addedBy, ...rest } = bookBorrowing;

  const bookProjection = { book: '-_id title image' };
  const readerProjection = { reader: '_id user', user: '-_id surname name' };
  const staffProjection = { staff: '_id user', user: '-_id surname name' };

  const [bookResponse, readerResponse, staffResponse] = await Promise.all([
    await bookService.get(bookItem.book, { projection: JSON.stringify(bookProjection) }),
    await readerService.get(borrowedBy._id, { projection: JSON.stringify(readerProjection) }),
    await staffService.get(addedBy._id, { projection: JSON.stringify(staffProjection) }),
  ]);

  console.log(bookResponse);
  
  return { 
    bookItem: {
      publicId: bookItem.publicId,
      book: { ...bookResponse.data },
    },
    borrowedBy: { _id: readerResponse.data._id, ...readerResponse.data.user },
    addedBy: { _id: staffResponse.data._id, ...staffResponse.data.user },
    ...rest
  }

}

const fetchBookBorrowings = async () => {
  await executeWithSwal(async () => {
    const projection = {
      bookBorrowing: '',
      bookItem: '_id publicId book',
      borrowedBy: '_id',
      addedBy: '_id'
    }
    const response = await bookBorrowingService.getAll({ projection: JSON.stringify(projection) });
    bookBorrowings.value = await Promise.all(response.data.map(async (bookBorrowing) => 
                                                await getFullDetail(bookBorrowing)));
    console.log(bookBorrowings.value);

    return response;
  }, false, false);
};

const filteredBookBorrowings = computed(() => {
  const query = searchQuery.value.trim().toLowerCase().replace(' ', '');
  return bookBorrowings.value.filter((bookBorrowing) => {
    const matchesSearch =
      (searchFilter.value === 'reader' && 
        (bookBorrowing.borrowedBy._id + bookBorrowing.addedBy?.surname + bookBorrowing.addedBy?.name)
          .toLowerCase()
          .includes(query)) ||
      (searchFilter.value === 'book' && bookBorrowing.bookItem?.book?.title?.toLowerCase().includes(query)) ||
      (searchFilter.value === 'addedBy' &&
        (bookBorrowing.addedBy?.surname + bookBorrowing.addedBy?.name)
          .toLowerCase()
          .includes(query)) ||
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


const createBookBorrowingRow = async () => {
  if (!readerIdInput.value.trim()) {
    const confirm = await showSwal({
      title: 'Vui lòng nhập ID độc giả trước khi thêm!',
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: 'OK',
    })

    if (confirm.isConfirmed) {
      return;
    }
  }

  bookBorrowings.value.unshift({
    _id: null,
    bookItem: null,
    borrowedBy: { _id: readerIdInput.value },
    borrowedDate: formatDate(),
    dueDate: formatDate(Date.now() + 14 * 24 * 60 * 60 * 1000),
    addedBy: { _id: store.staff._id, fullname: store.staff.fullname },
    isEditing: true,
  });
};


const isOverdue = (bookBorrowing) => new Date() > new Date(bookBorrowing.dueDate) && !bookBorrowing.returnedDate;
const getStatusLabel = (bookBorrowing) =>
  bookBorrowing.returnedDate
    ? 'Đã trả'
    : isOverdue(bookBorrowing)
    ? 'Quá hạn'
    : 'Đang mượn';

const getStatusClass = (bookBorrowing) =>
  bookBorrowing.returnedDate ? 'text-success' : isOverdue(bookBorrowing) ? 'text-danger' : 'text-primary';

const formatAddedBy = (addedBy) =>
  addedBy ? `...${addedBy._id?.slice(-5)} - ${(addedBy.fullname || 
                    addedBy.surname + ' ' + addedBy.name )}`  : 'Không xác định';

const formatBorrowedBy = (borrowedBy) => 
  borrowedBy ? `${borrowedBy._id} - ${(borrowedBy.fullname || 
                    borrowedBy.surname + ' ' + borrowedBy.name )}`  : 'Không xác định';

const deleteBookBorrowing = async (bookBorrowing) => {
  await executeWithSwal(async () => {
    const response = await bookBorrowingService.delete(bookBorrowing._id);
    const index = bookBorrowings.value.indexOf(bookBorrowing);
    bookBorrowings.value.splice(index, 1);
    return response;
  }, true, true);
}


const handleExitEditMode = async (bookBorrowing) => {
  if (bookBorrowing.isEditing) {
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
      if (bookBorrowing._id === null) {
        bookBorrowings.value.shift(); 
      }
      bookBorrowing.isEditing = false;
    }

  };
};

const createBookBorrowing = async (bookBorrowing) => {
  await executeWithSwal(async () => {
    const data = {
      bookItem: bookBorrowing.bookItem,
      borrowedBy: bookBorrowing.borrowedBy._id,
      addedBy: bookBorrowing.addedBy._id
    }
    const response = await bookBorrowingService.create(data);

    bookBorrowing.isEditing = false;
    return response;
  }, false, true);

  await fetchBookBorrowings();
};

const returnBook = async (bookBorrowing) => {
  await executeWithSwal(async () => {
    console.log(bookBorrowing);
    const response = await bookBorrowingService.returnBook(bookBorrowing._id);
    return response;
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
