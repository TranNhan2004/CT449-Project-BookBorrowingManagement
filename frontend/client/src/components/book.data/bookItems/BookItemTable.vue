<template>
  <div>
    <!-- Thanh tìm kiếm và bộ lọc -->
    <div class="d-flex justify-content-between mb-3 align-items-center">
      <div class="input-group input-search">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo mã trên kệ..."
          class="form-control"
          @keyup.enter="searchBookItems"
        />
        <button @click="searchBookItems" class="btn btn-primary">
          <i class="fas fa-search"></i>
        </button>
      </div>

      <!-- Bộ lọc trạng thái -->
      <div class="d-flex align-items-center mb-3 filter">
        <label for="statusFilter" class="fw-bold me-2">Trạng thái:</label>
        <select 
          id="statusFilter" 
          v-model="statusFilter" 
          class="form-select" 
          style="width: auto;"
        >
          <option value="">Tất cả</option>
          <option value="available">Có sẵn</option>
          <option value="read-only">Chỉ đọc tại chỗ</option>
          <option value="reserved">Đã được đặt trước</option>
          <option value="borrowed">Đã được mượn</option>
        </select>
      </div>
    </div>

    <!-- Bảng hiển thị các BookItem -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Mã trên kệ</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bookItem, index) in filteredBookItems" :key="bookItem._id || index">
          <td>
            <span>{{ bookItem.publicId }}</span>
          </td>
          <td>
            <span>{{ getStatusLabel(bookItem.status) }}</span>
          </td>
          <td class="text-center action-cell">
            <button 
              v-if="canReserved(bookItem)" 
              @click="createReservation(bookItem)" 
              :class="['btn', 'btn-info', 'btn-circle', { 'btn-disabled': isAlreadyReserved(bookItem) }]"
              :disabled="isAlreadyReserved(bookItem)"
            >
              Đặt trước
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, defineProps } from 'vue';
import bookItemService from '@/services/book.data/bookItem.service';
import reservationService from '@/services/book.services/reservation.service';
import { executeWithSwal } from '@/utils/swal.util';
import { useReaderStore } from '@/stores/reader.store';

defineOptions({
  name: 'book-item-table',
});


const props = defineProps({
  bookId: {
    type: String, 
    required: true,
  },
});

const bookItems = ref([]);
const searchQuery = ref('');
const statusFilter = ref(''); 
const store = useReaderStore();

const canReserved = (bookItem) => bookItem.status === 'available';

const getStatusLabel = (status) => {
  switch (status) {
    case 'available': return 'Có sẵn';
    case 'read-only': return 'Chỉ đọc tại chỗ';
    case 'reserved': return 'Đã được đặt trước';
    case 'borrowed': return 'Đã được mượn';
    default: return 'Không xác định';
  }
};

const isAlreadyReserved = (bookItem) => {
  return bookItems.value.some((item) => item.book === bookItem.book && item.status === 'reserved');
};

const fetchBookItems = async () => {
  await executeWithSwal(async () => {
    const filter = { book: props.bookId };
    const response = await bookItemService.getAll({ filter: JSON.stringify(filter) });
    bookItems.value = response.data.map((bookItem) => ({ ...bookItem }));
    return response;
  }, false, false);
};


const searchBookItems = () => {
  const query = searchQuery.value.trim().toLowerCase();
  return bookItems.value.filter((bookItem) =>
    bookItem.publicId?.toLowerCase().includes(query)
  );
};

const filteredBookItems = computed(() => {
  const queryFiltered = searchBookItems();

  if (statusFilter.value) {
    return queryFiltered.filter((bookItem) => bookItem.status === statusFilter.value);
  }

  return queryFiltered;
});

const createReservation = async (bookItem) => {
  const data = {
    bookItem: bookItem._id,
    reservedBy: store.reader._id,
  };

  await executeWithSwal(async () => {
    const response = await reservationService.create(data);
    bookItem.status = 'reserved';
    return response;
  }, false, true);
}

onMounted(async () => await fetchBookItems());
</script>


<style scoped>
thead {
  text-align: center;
}

.input-search {
  max-width: 40%;
}

.filter {
  margin-bottom: -5px !important;
}

.action-cell {
  text-align: center;
  vertical-align: middle;
}

.d-flex {
  align-items: center;
}

.form-select {
  max-width: 200px;
}

.btn-disabled {
  background-color: #d3d3d3 !important;  
  border-color: #d3d3d3 !important;    
  color: #808080 !important;            
  cursor: not-allowed !important;       
  pointer-events: none;                 
}
</style>
