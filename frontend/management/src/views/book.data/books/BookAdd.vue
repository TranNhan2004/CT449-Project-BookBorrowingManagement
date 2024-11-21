<template>
  <div class="form-container">
    <h1 class="form-title">THÊM SÁCH MỚI</h1>
    <VForm ref="vformRef" @submit="submitAddBook" :validation-schema="bookFormSchema" class="vform">
      <!-- Tiêu đề -->
      <div class="form-group">
        <label for="title">Tiêu đề: <span class="required">*</span></label>
        <Field name="title" type="text" class="form-control" v-model="book.title" />
        <ErrorMessage name="title" class="error-feedback" />
      </div>

      <!-- Tác giả -->
      <div class="form-group">
        <label for="authors">Tác giả: <span class="required">*</span></label>
        <div v-for="(author, index) in book.authors" :key="index" class="list-container">
          <select v-model="book.authors[index]" class="form-control form-select">
            <option value="" disabled>Chọn tác giả</option>
            <option v-for="authorOption in filteredAuthors(index)" :key="authorOption._id" :value="authorOption._id">
              {{ transformData(authorOption) }}
            </option>
          </select>
          <button type="button" class="btn btn-danger" @click="removeAuthor(index)" v-if="index > 0">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <button type="button" class="btn btn-primary mt-2" @click="addAuthor" :disabled="book.authors.length >= authors.length">
          + Thêm Tác Giả
        </button>
        <ErrorMessage name="authors" class="error-feedback" />
      </div>

      <!-- Chủ đề -->
      <div class="form-group">
        <label for="topics">Chủ đề: <span class="required">*</span></label>
        <div v-for="(topic, index) in book.topics" :key="index" class="list-container">
          <select v-model="book.topics[index]" class="form-control form-select">
            <option value="" disabled>Chọn chủ đề</option>
            <option v-for="topicOption in filteredTopics(index)" :key="topicOption._id" :value="topicOption._id">
              {{ transformData(topicOption) }}
            </option>
          </select>
          <button type="button" class="btn btn-danger" @click="removeTopic(index)" v-if="index > 0">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <button type="button" class="btn btn-primary mt-2" @click="addTopic" 
            :disabled="book.topics.length >= 5 || book.topics.length >= topics.length">
          + Thêm Chủ Đề
        </button>
        <ErrorMessage name="topics" class="error-feedback" />
      </div>

      <!-- Nhà xuất bản -->
      <div class="form-group">
        <label for="publisher">Nhà xuất bản: <span class="required">*</span></label>
        <Field name="publisher" as="select" class="form-control form-select" v-model="book.publisher">
          <option value="" disabled>Chọn nhà xuất bản</option>
          <option v-for="publisherOption in publishers" :key="publisherOption._id" :value="publisherOption._id">
            {{ transformData(publisherOption) }}
          </option>
        </Field>
        <ErrorMessage name="publisher" class="error-feedback" />
      </div>

      <!-- Năm xuất bản -->
      <div class="form-group">
        <label for="publishedYear">Năm xuất bản: <span class="required">*</span></label>
        <Field name="publishedYear" as="select" class="form-control form-select" v-model="book.publishedYear">
          <option value="" disabled>Chọn năm xuất bản</option>
          <option v-for="year in publicationYears" :key="year" :value="year">
            {{ year }}
          </option>
        </Field>
        <ErrorMessage name="publishedYear" class="error-feedback" />
      </div>

      <!-- Giá tiền -->
      <div class="form-group">
        <label for="price">Giá tiền: <span class="required">*</span></label>
        <Field name="price" type="number" class="form-control" v-model="book.price" />
        <ErrorMessage name="price" class="error-feedback" />
      </div>

      <!-- Mô tả -->
      <div class="form-group">
        <label for="description">Mô tả:</label>
        <Field name="description" as="textarea" class="form-control description" v-model="book.description" />
        <ErrorMessage name="description" class="error-feedback" />
      </div>

      <!-- Ảnh -->
      <div class="form-group">
        <label for="image">Hình ảnh:</label>
        <input type="file" class="form-control" @change="handleImageUpload" />
        <ErrorMessage name="image" class="error-feedback" />
      </div>

      <!-- Nút -->
      <div class="form-group">
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu</button>
        <button type="button" class="btn btn-secondary ml-2" @click="cancel">Thoát</button>
      </div>
    </VForm>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { Form as VForm, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import authorService from '@/services/book.data/author.service';
import topicService from '@/services/book.data/topic.service';
import publisherService from '@/services/book.data/publisher.service';
import bookService from '@/services/book.data/book.service';
import { showSwal, executeWithSwal } from '@/utils/swal.util';

const router = useRouter();

const authors = ref([]);
const topics = ref([]);
const publishers = ref([]);
const book = ref({
  title: '',
  description: '',
  authors: [''],
  topics: [''],
  publisher: '',
  publishedYear: new Date().getFullYear(),
  price: 0,
  image: null,
});

const bookFormSchema = yup.object().shape({
  title: yup.string().required('Tiêu đề là bắt buộc.'),
  authors: yup.array().of(yup.string().required()).min(1, 'Cần ít nhất 1 tác giả.'),
  topics: yup.array().of(yup.string().required()).min(1, 'Cần ít nhất 1 chủ đề.').max(5, 'Tối đa 5 chủ đề.'),
  publisher: yup.string().required('Nhà xuất bản là bắt buộc.'),
  publishedYear: yup
    .number()
    .required('Năm xuất bản là bắt buộc.')
    .min(new Date().getFullYear() - 200, 'Năm không hợp lệ.')
    .max(new Date().getFullYear(), 'Năm không hợp lệ.'),
  price: yup.number().required('Giá tiền là bắt buộc.').min(0, 'Giá tiền phải lớn hơn hoặc bằng 0.'),
  image: yup.mixed(),
});

const vformRef = ref(null);

const publicationYears = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 201 }, (_, i) => currentYear - i);
});

const fetchAuthors = async () => {
  const response = await authorService.getAll();
  authors.value = response.data;
};

const fetchTopics = async () => {
  const response = await topicService.getAll();
  topics.value = response.data;
};

const fetchPublishers = async () => {
  const response = await publisherService.getAll();
  publishers.value = response.data;
};

const handleImageUpload = (event) => {
  book.value.image = event.target.files[0];
};

const addAuthor = () => {
  book.value.authors.push('');
};

const removeAuthor = (index) => {
  book.value.authors.splice(index, 1);
};

const addTopic = () => {
  book.value.topics.push('');
};

const removeTopic = (index) => {
  book.value.topics.splice(index, 1);
};

const filteredAuthors = (index) => {
  return authors.value.filter((author) => !book.value.authors.some((a, i) => a === author._id && i !== index));
};

const filteredTopics = (index) => {
  return topics.value.filter((topic) => !book.value.topics.some((t, i) => t === topic._id && i !== index));
};

const submitAddBook = async () => {
  const isValid = await vformRef.value.validate();
  if (!isValid) return;
  
  await executeWithSwal(async () => {
    return await bookService.create(book.value);
  }, false, true, router, 'book-list');
};

const cancel = async () => {
  const result = await showSwal({
    title: 'Thoát',
    text: 'Thông tin hiện tại chưa được lưu! Bạn có muốn thoát?',
    icon: 'info',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Thoát',
    cancelButtonText: 'Hủy',
  });

  if (result.isConfirmed) {
    router.push({ name: 'book-list' });
  } 
};

onMounted(() => {
  fetchAuthors();
  fetchTopics();
  fetchPublishers();
});

const transformData = (item) => `${item._id.slice(-5)} - ${item.name}`;
</script>

<style scope>
@import "../../../assets/css/form.css";

.description {
  height: 150px;
}

</style>