<template>
  <div class="container mt-4">
    <!-- Input Search -->
    <div class="mb-4">
      <InputSearch @search="handleSearch" />
    </div>

    <!-- Hiển thị danh sách sách -->
    <div v-if="booksToDisplay.length === 0" class="text-center mt-4">
      <p class="text-muted"><i>Không tìm thấy dữ liệu phù hợp.</i></p>
    </div>
    <div v-else>
      <div v-for="book in booksToDisplay" :key="book._id" class="mb-3">
        <BookCard :book="book" />
      </div>

      <!-- Phân trang -->
      <nav>
        <ul class="pagination justify-content-center">
          <!-- Nút Trước -->
          <li 
            class="page-item" 
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            <a class="page-link" href="#">
              <i class="fas fa-chevron-left"></i> Trước
            </a>
          </li>

          <!-- Các trang -->
          <li 
            v-for="page in visiblePages" 
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage, disabled: page === '...' }"
            @click="changePage(page)"
          >
            <a class="page-link" href="#">{{ page }}</a>
          </li>

          <!-- Nút Tiếp -->
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

    <!-- Nút Thêm Sách -->
    <div class="text-center mt-4">
      <button class="btn btn-success" @click="goToAddBook">
        <i class="fas fa-plus"></i> Thêm sách
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import bookService from '@/services/book.data/book.service';
import BookCard from '@/components/book.data/books/BookCard.vue';
import InputSearch from '@/components/book.data/books/BookSearch.vue';

defineOptions({
  name: 'book-list'
})

const router = useRouter();

const books = ref([]);
const filteredBooks = ref([]);
const currentPage = ref(1);
const pageSize = 10; 

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / pageSize));

const booksToDisplay = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredBooks.value.slice(startIndex, endIndex);
});


const visiblePages = computed(() => {
  const maxVisible = 6; 
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (current <= maxVisible - 1) {
    for (let i = 1; i <= Math.min(total, maxVisible); i++) {
      pages.push(i);
    }
    if (total > maxVisible) pages.push('...', total);
  } else {
    if (current + maxVisible - 1 >= total) {
      for (let i = total - maxVisible + 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      for (let i = current; i <= Math.min(current + maxVisible - 2, total - 1); i++) {
        pages.push(i);
      }
      if (current + maxVisible - 1 < total) pages.push('...', total);
    }
  }

  if (!pages.includes(total)) pages.push(total);

  return pages;
});


const changePage = (page) => {
  if (page === '...' || page <= 0 || page > totalPages.value) return;
  currentPage.value = page;
};


const fetchBooks = async () => {
  try {
    const filter = {};
    const projection = {
      book: '_id title authors topics publisher image',
      authors: '-_id name',
      topics: '-_id name',
      publisher: '-_id name',
    };
    const response = await bookService.getAll({
      filter: JSON.stringify(filter),
      projection: JSON.stringify(projection),
    });

    books.value = response.data;
    filteredBooks.value = books.value;
  } catch (error) {
    console.error(error);
  }
};


const goToAddBook = () => {
  router.push({ name: 'book-add' });
};


const handleSearch = ({ filterKey, searchValue }) => {
  if (!filterKey || filterKey === 'all' || !searchValue) {
    filteredBooks.value = books.value;
    return;
  }

  filteredBooks.value = books.value.filter((book) => {
    let field;

    switch (filterKey) {
      case 'title':
        field = book.title.toLowerCase();
        break;
      case 'topic':
        field = book.topics.map((topic) => topic.name.toLowerCase()).join(', ');
        break;
      case 'author':
        field = book.authors.map((author) => author.name.toLowerCase()).join(', ');
        break;
      case 'publisher':
        field = book.publisher.name.toLowerCase();
        break;
      default:
        field = '';
    }

    return field.includes(searchValue.toLowerCase());
  });

  currentPage.value = 1;
};


onMounted(async() => await fetchBooks());
</script>
