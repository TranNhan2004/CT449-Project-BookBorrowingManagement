<template>
  <div>
    <div class="d-flex justify-content-between mb-3 align-items-center">
    
      <div class="input-group input-search">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo ID Công Khai..."
          class="form-control"
          @keyup.enter="searchBookItems"
        />
        <button @click="searchBookItems" class="btn btn-primary">
          <i class="fas fa-search"></i>
        </button>
      </div>


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

      <button @click="createBookItemRow" class="btn btn-success">
        <i class="fas fa-plus"></i> <b>Thêm</b>
      </button>
    </div>


    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>ID Công Khai (Mã trên kệ)</th>
          <th>Được thêm bởi</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bookItem, index) in filteredBookItems" :key="bookItem._id || index">
          <td>{{ bookItem._id || 'Mới' }}</td>
          <td>
            <span>{{ bookItem.publicId || 'Sẽ được tạo tự động' }}</span>
          </td>
          <td>{{ bookItem.addedBy || store.staff?._id || 'Không xác định' }}</td>
          <td>
            <template v-if="bookItem._id === null">
              <select v-model="bookItem.status" class="form-select">
                <option value="available">Có sẵn</option>
                <option value="read-only">Chỉ đọc tại chỗ</option>
              </select>
            </template>
            <template v-else>
              <span>{{ getStatusLabel(bookItem.status) }}</span>
            </template>
          </td>
          <td class="text-center action-cell">
            <template v-if="bookItem._id === null">
              <div class="d-flex justify-content-center align-items-center gap-2">
                <button @click="saveNewBookItem(bookItem)" class="btn btn-info btn-circle">
                  <i class="fas fa-save"></i>
                </button>
                <button @click="cancelNewBookItem(bookItem)" class="btn btn-secondary btn-circle">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </template>
            <template v-else>
              <button @click="deleteBookItem(bookItem)" class="btn btn-danger">
                <i class="fas fa-trash"></i>
              </button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, defineProps } from 'vue';
import bookItemService from '@/services/book.data/bookItem.service';
import { executeWithSwal, showSwal } from '@/utils/swal.util';
import { useStaffStore } from '@/stores/staff.store';

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
const store = useStaffStore();


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


const getStatusLabel = (status) => {
  switch (status) {
    case 'available': return 'Có sẵn';
    case 'read-only': return 'Chỉ đọc tại chỗ';
    case 'reserved': return 'Đã được đặt trước';
    case 'borrowed': return 'Đã được mượn';
    default: return 'Không xác định';
  }
};


const createBookItemRow = () => {
  const newBookItem = {
    _id: null,
    book: props.bookId,
    publicId: 'Hệ thống tự tạo',
    addedBy: store.staff?._id || 'Không xác định',
    status: 'available',
  };
  bookItems.value.unshift(newBookItem);
};


const saveNewBookItem = async (bookItem) => {
  if (!bookItem.status) {
    await executeWithSwal(async () => {
      throw new Error('Trạng thái là bắt buộc!');
    }, true, false);
    return;
  }

  await executeWithSwal(async () => {
    const response = await bookItemService.create(bookItem);
    bookItems.value = bookItems.value.filter((b) => b._id !== null);
    bookItems.value.unshift(response.data);
  }, false, true);
};


const deleteBookItem = async (bookItem) => {
  if (bookItem._id === null) {
    bookItems.value = bookItems.value.filter((b) => b !== bookItem);
    return;
  }

  await executeWithSwal(async () => {
    await bookItemService.delete(bookItem._id);
    bookItems.value = bookItems.value.filter((b) => b._id !== bookItem._id);
  }, true, true);
};


const cancelNewBookItem = async (bookItem) => {
  const confirmation = await showSwal({
    title: 'Bạn chắc chắn muốn thoát?',
    text: 'Dữ liệu chưa được lưu sẽ bị mất!',
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Thoát',
    cancelButtonText: 'Hủy',
  });

  if (confirmation.isConfirmed) {
    bookItems.value = bookItems.value.filter((b) => b !== bookItem);
  }
};

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
</style>
