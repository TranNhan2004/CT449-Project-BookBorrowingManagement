<template>
  <div class="container mt-4">
    
    <div class="row align-items-center gx-3 mb-3">
      <div class="col-md-8 d-flex align-items-center gap-3">
        <div class="input-group flex-grow-1" style="max-width: 50%;">
          <select id="searchFilter" v-model="searchFilter" class="form-select search-filter">
            <option value="">Tất cả</option>
            <option value="book">Theo sách</option>
            <option value="book">Theo chủ đề</option>
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
      </div>
    </div>


    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>STT</th>
          <th>Sách</th>
          <th>Chủ đề</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(favorite, index) in filteredFavorites" :key="favorite._id || index">
          <td>{{ index + 1 }}</td>
          
          <td>
            <div class="d-flex align-items-center gap-2">
              <img
                v-if="favorite.book.imageBase64"
                :src="favorite.book.imageBase64"
                alt="Book Image"
                class="img-fluid"
                style="width: 60px; height: 100px; object-fit: cover;"
              />
              <div>
                <p class="mb-0 fw-bold"><b>Mã sách: </b> {{ favorite.book.publicId }}</p>
                <p class="text-muted mb-0"><b>Tiêu đề: </b> {{ favorite.book.title }}</p>
              </div>
            </div>
          </td>

          <td>
            {{ formatTopics(favorite.book.topics) }}
          </td>
      
          <td>
            <button
              class="btn btn-primary btn-sm"
              @click="goToSpecificBookDetail(favorite.book)"
            >
              <i class="fas fa-info"></i> &nbsp; Chi tiết
            </button>
            <button 
              class="btn btn-danger btn-sm" 
              @click="deleteFavorite(favorite)"
            >
              <i class="fas fa-trash"></i> &nbsp; Xóa
            </button>

          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import favoriteService from '@/services/book.services/favorite.service';
import bookService from '@/services/book.data/book.service';
import { executeWithSwal } from '@/utils/swal.util';
import { useReaderStore } from '@/stores/reader.store';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'favorite-table'
});


const store = useReaderStore();
const router = useRouter();

const favorites = ref([]);
const searchQuery = ref(''); 
const searchFilter = ref(''); 


const getFullDetail = async (favorite) => {
  console.log(favorite);
  const { book, ...rest } = favorite;

  const bookProjection = { book: '_id publicId title image topics', topics: '-_id name' };
  const bookResponse = await bookService.get(book, { projection: JSON.stringify(bookProjection) });
  
  console.log(bookResponse);
  
  return { 
    book: { ...bookResponse.data },
    ...rest
  }

}

const fetchFavorites = async () => {
  await executeWithSwal(async () => {
    const filter = { reader: store.reader._id };
    const projection = {
      favorite: '',
      bookItem: '_id publicId book',
      reader: '_id'
    }
    const response = await favoriteService.getAll({ 
      filter: JSON.stringify(filter),
      projection: JSON.stringify(projection) 
    });
    
    favorites.value = await Promise.all(response.data.map(async (favorite) => 
                                                await getFullDetail(favorite)));
    console.log(favorites.value);

    return response;
  }, false, false);
};

// Bộ lọc và tìm kiếm
const filteredFavorites = computed(() => {
  const query = searchQuery.value.trim().toLowerCase().replace(' ', '');
  return favorites.value.filter((favorite) => {
    const matchesSearch =
      (searchFilter.value === 'book' && favorite.bookItem?.book?.title?.toLowerCase().includes(query)) ||
      searchFilter.value === '' ||
      (searchFilter.value === 'topic' && 
        (favorite.book?.topics?.map(topic => topic.name).join('')
          .toLowerCase()
          .includes(query))) ||
      searchFilter.value === '';

    return matchesSearch;
  });
});


const formatTopics = (topics) => topics.map(topic => topic.name).join(', ');

const deleteFavorite = async (favorite) => {
  await executeWithSwal(async () => {
    const response = await favoriteService.delete(favorite._id);
    const index = favorites.value.indexOf(favorite);
    favorites.value.splice(index, 1);
    return response;
  }, true, true);
}

const goToSpecificBookDetail = (book) => {
  router.push({ name: 'book-detail', params: { bookId: book._id } });
}

onMounted(async () => await fetchFavorites());
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
