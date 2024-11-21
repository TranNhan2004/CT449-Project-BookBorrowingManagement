<template>
  <div class="container mt-4">
    
    <div class="row align-items-center gx-3 mb-3">
      <div class="col-md-8 d-flex align-items-center gap-3">
        <div class="input-group flex-grow-1" style="max-width: 50%;">
          <select id="searchFilter" v-model="searchFilter" class="form-select search-filter">
            <option value="">Tất cả</option>
            <option value="reader">Theo độc giả</option>
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
            <option value="reserving">Đang đặt trước</option>
            <option value="overdue">Quá hạn</option>
          </select>
        </div>
      </div>
    </div>


    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Sách</th>
          <th>Độc Giả</th>
          <th>Chi Tiết</th>
          <th>Trạng Thái</th>
          <th>Xóa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reservation, index) in filteredReservations" :key="reservation._id || index">
          <td>{{ reservation._id || 'Mới' }}</td>
          
          <td>
            <div class="d-flex align-items-center gap-2">
              <img
                v-if="reservation.bookItem.book.imageBase64"
                :src="reservation.bookItem.book.imageBase64"
                alt="Book Image"
                class="img-fluid"
                style="width: 60px; height: 100px; object-fit: cover;"
              />
              <div>
                <p class="mb-0 fw-bold"><b>Mã trên kệ: </b> {{ reservation.bookItem?.publicId }}</p>
                <p class="text-muted mb-0"><b>Tiêu đề: </b> {{ reservation.bookItem?.book?.title }}</p>
              </div>
            </div>
          </td>

          <td>
            {{ formatReservedBy(reservation.reservedBy) }}
          </td>

          <td>
            <span><b>Ngày đặt trước: </b> {{ getDate(reservation.borrowedDate) }}</span><br>
            <span><b>Ngày hết hạn: </b> {{ getDate(reservation.dueDate) }}</span><br> 
          </td>
          <td>
            <span :class="getStatusClass(reservation)">
              <b>{{ getStatusLabel(reservation) }}</b>
            </span>
          </td>
          
          <td>
            <button 
              class="btn btn-danger btn-sm" 
              @click="deleteReservation(reservation)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import reservationService from '@/services/book.services/reservation.service';
import bookService from '@/services/book.data/book.service';
import readerService from '@/services/book.accounts/reader.service';
import { executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'reservation-table'
});


const reservations = ref([]);
const searchQuery = ref(''); 
const searchFilter = ref(''); 
const statusFilter = ref(''); 


const getFullDetail = async (reservation) => {
  console.log(reservation);
  const { bookItem, reservedBy, ...rest } = reservation;
  console.log(bookItem.book);

  const bookProjection = { book: '-_id title image' };
  const readerProjection = { reader: '_id user', user: '-_id surname name' };

  console.log(bookItem.book);

  const [bookResponse, readerResponse] = await Promise.all([
    await bookService.get(bookItem.book, { projection: JSON.stringify(bookProjection) }),
    await readerService.get(reservedBy._id, { projection: JSON.stringify(readerProjection) }),
  ]);

  console.log(bookResponse);
  
  return { 
    bookItem: {
      publicId: bookItem.publicId,
      book: { ...bookResponse.data },
    },
    reservedBy: { _id: readerResponse.data._id, ...readerResponse.data.user },
    ...rest
  }

}

const fetchReservations = async () => {
  await executeWithSwal(async () => {
    const projection = {
      reservation: '',
      bookItem: '_id publicId book',
      reservedBy: '_id'
    }
    const response = await reservationService.getAll({ projection: JSON.stringify(projection) });
    reservations.value = await Promise.all(response.data.map(async (reservation) => 
                                                await getFullDetail(reservation)));
    console.log(reservations.value);

    return response;
  }, false, false);
};

// Bộ lọc và tìm kiếm
const filteredReservations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase().replace(' ', '');
  return reservations.value.filter((reservation) => {
    const matchesSearch =
      (searchFilter.value === 'reader' && 
        (reservation.reservedBy._id + reservation.addedBy?.surname + reservation.addedBy?.name)
          .toLowerCase()
          .includes(query)) ||
      (searchFilter.value === 'book' && reservation.bookItem?.book?.title?.toLowerCase().includes(query)) ||
      searchFilter.value === '';

    const matchesStatus =
      (statusFilter.value === 'reserving' && !isOverdue(reservation)) ||
      (statusFilter.value === 'overdue' && isOverdue(reservation)) ||
      statusFilter.value === '';

    return matchesSearch && matchesStatus;
  });
});


const getDate = (timestamp) => timestamp 
                              ? new Date(timestamp).toISOString().split('T')[0] 
                              : new Date().toISOString().split('T')[0];


// Trạng thái
const isOverdue = (reservation) => new Date() > new Date(reservation.dueDate);
const getStatusLabel = (reservation) =>
    isOverdue(reservation)
    ? 'Quá hạn'
    : 'Đang đặt trước';

const getStatusClass = (reservation) =>
  reservation.returnedDate ? 'text-success' : isOverdue(reservation) ? 'text-danger' : 'text-primary';


const formatReservedBy = (reservedBy) => 
  reservedBy ? `${reservedBy._id} - ${(reservedBy.fullname || 
                    reservedBy.surname + ' ' + reservedBy.name )}`  : 'Không xác định';

const deleteReservation = async (reservation) => {
  await executeWithSwal(async () => {
    const response = await reservationService.delete(reservation._id);
    const index = reservations.value.indexOf(reservation);
    reservations.value.splice(index, 1);
    return response;
  }, true, true);
}


onMounted(async () => await fetchReservations());
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
