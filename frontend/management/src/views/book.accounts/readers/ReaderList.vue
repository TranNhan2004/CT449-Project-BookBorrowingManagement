<template>
  <div class="container mt-4">
    <div class="mb-4">
      <ReaderSearch @search="handleSearch" />
    </div>

    <div v-if="readersToDisplay.length === 0" class="text-center mt-4">
      <p class="text-muted"><i>Không tìm thấy dữ liệu phù hợp.</i></p>
    </div>
    <div v-else>
      <div v-for="reader in readersToDisplay" :key="reader._id" class="mb-3">
        <ReaderCard :reader="reader" v-on:delete="handleDelete" v-on:changeValidation="handleChangeValidation"/>
      </div>

      <nav>
        <ul class="pagination justify-content-center">
          <li 
            class="page-item" 
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            <a class="page-link" href="#">
              <i class="fas fa-chevron-left"></i> Trước
            </a>
          </li>

          <li 
            v-for="page in visiblePages" 
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage, disabled: page === '...' }"
            @click="changePage(page)"
          >
            <a class="page-link" href="#">{{ page }}</a>
          </li>

          <li 
            class="page-item" 
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            <a class="page-link" href="#">
              Tiếp <i class="fas fa-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="text-center mt-4">
      <button class="btn btn-success" @click="goToReaderAdd">
        <i class="fas fa-plus"></i> Thêm độc giả
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import readerService from '@/services/book.accounts/reader.service';
import ReaderCard from '@/components/book.accounts/readers/ReaderCard.vue';
import ReaderSearch from '@/components/book.accounts/readers/ReaderSearch.vue';
import { executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'reader-list',
});

const router = useRouter();

const readers = ref([]);
const filteredReaders = ref([]);
const currentPage = ref(1);
const pageSize = 10; 

const totalPages = computed(() => Math.ceil(filteredReaders.value.length / pageSize));

const readersToDisplay = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredReaders.value.slice(startIndex, endIndex);
});

const visiblePages = computed(() => {
  const maxVisible = 6; 
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= maxVisible - 1) {
      for (let i = 1; i <= Math.min(total, maxVisible - 1); i++) {
        pages.push(i);
      }
      if (total > maxVisible) pages.push('...', total);
    } else {
      if (current + maxVisible - 2 >= total) {
        for (let i = total - maxVisible + 2; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, '...');
        for (let i = current - 1; i <= Math.min(current + maxVisible - 3, total - 1); i++) {
          pages.push(i);
        }
        if (current + maxVisible - 2 < total) pages.push('...', total);
      }
    }
  }

  return pages;
});

const changePage = (page) => {
  if (page === '...' || page <= 0 || page > totalPages.value) return;
  currentPage.value = page;
};

const fetchReaders = async () => {
  await executeWithSwal(async () => {
    const projection = {
      reader: '',
      user: '-_id surname name phone email isValid',
      rank: '-_id title'
    }
    const response = await readerService.getAll({
      projection: JSON.stringify(projection)
    });

    readers.value = response.data.map(data => {
      const { user, ...rest } = data; 
      return { ...user, ...rest };
    });

    filteredReaders.value = readers.value;
    return response;
  }, false, false);
};

const goToReaderAdd = () => {
  router.push({ name: 'reader-add' });
};

const handleSearch = ({ searchValue, rankFilter, statusFilter }) => {
  filteredReaders.value = readers.value.filter((reader) => {
    const matchesName = searchValue
      ? `${reader.user?.surname} ${reader.user?.name}`.toLowerCase().includes(searchValue.toLowerCase())
      : true;

    const matchesRank =
      rankFilter === 'all' || reader.rank?.title === rankFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'valid' && reader.user?.isValid) ||
      (statusFilter === 'invalid' && !reader.user?.isValid);

    return matchesName && matchesRank && matchesStatus;
  });

  currentPage.value = 1;
};

const handleDelete = async (readerId) => {
  await executeWithSwal(async () => {
    const response = await readerService.delete(readerId);
    const index = readers.value.findIndex((reader) => reader._id === readerId);
    readers.value.splice(index, 1);
    return response;
  }, true, true);
}

const handleChangeValidation = async ({ readerId, newStatus }) => {
  await executeWithSwal(async () => {
    const response = await readerService.updateValidation(readerId, { isValid: newStatus });
    const reader = readers.value.find((reader) => reader._id === readerId);
    reader.isValid = newStatus;
    console.log(response);
    return response;
  }, true, true);
}

onMounted(async () => await fetchReaders());
</script>
