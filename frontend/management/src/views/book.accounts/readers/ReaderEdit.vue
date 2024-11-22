<template>
  <div class="form-container">
    <h1 class="form-title">CHỈNH SỬA ĐỘC GIẢ</h1>
    <VForm ref="vformRef" @submit="submitEditReader" :validation-schema="readerFormSchema" class="vform">
      <!-- Email -->
      <div class="form-group">
        <label for="email">Email: <span class="required">*</span></label>
        <Field name="email" type="email" class="form-control" v-model="reader.email" />
        <ErrorMessage name="email" class="error-feedback" />
      </div>

      <!-- Số điện thoại -->
      <div class="form-group">
        <label for="phone">Số điện thoại: <span class="required">*</span></label>
        <Field name="phone" type="text" class="form-control" v-model="reader.phone" />
        <ErrorMessage name="phone" class="error-feedback" />
      </div>

      <!-- Họ lót -->
      <div class="form-group">
        <label for="surname">Họ lót: <span class="required">*</span></label>
        <Field name="surname" type="text" class="form-control" v-model="reader.surname" />
        <ErrorMessage name="surname" class="error-feedback" />
      </div>

      <!-- Tên -->
      <div class="form-group">
        <label for="name">Tên: <span class="required">*</span></label>
        <Field name="name" type="text" class="form-control" v-model="reader.name" />
        <ErrorMessage name="name" class="error-feedback" />
      </div>

      <!-- Ngày sinh -->
      <div class="form-group">
        <label for="birth">Ngày sinh: <span class="required">*</span></label>
        <Field name="birth" type="date" class="form-control" v-model="reader.birth" :max="maxBirthDate" :min="minBirthDate" />
        <ErrorMessage name="birth" class="error-feedback" />
      </div>

      <!-- Giới tính -->
      <div class="form-group">
        <label>Giới tính: <span class="required">*</span></label>
        <div class="d-flex align-items-center gap-3 mt-2">
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="male" v-model="reader.gender" />
            <label class="form-check-label">Nam</label>
          </div>
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="female" v-model="reader.gender" />
            <label class="form-check-label">Nữ</label>
          </div>
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="other" v-model="reader.gender" />
            <label class="form-check-label">Khác</label>
          </div>
        </div>
        <ErrorMessage name="gender" class="error-feedback" />
      </div>

      <!-- Địa chỉ -->
      <div class="form-group">
        <label for="address">Địa chỉ: <span class="required">*</span></label>
        <Field name="address" as="textarea" class="form-control" v-model="reader.address" />
        <ErrorMessage name="address" class="error-feedback" />
      </div>

      <div class="form-group">
        <label for="points">Số điểm hiện tại: </label>
        <Field name="points" type="text" class="form-control" v-model="reader.points" disabled />
      </div>

      <div class="form-group">
        <label for="rank-title">Cấp bậc: </label>
        <Field name="rank-title" type="text" class="form-control" v-model="rankTitle" disabled />
      </div>

      <div class="form-group">
        <label for="rank-max-ex-d">Số ngày gia hạn tối đa: </label>
        <Field name="rank-max-ex-d" type="text" class="form-control" v-model="reader.rank.maxExtensionDays" disabled />
      </div>

      <div class="form-group">
        <label for="rank-max-rev-d">Số ngày đặt trước tối đa: </label>
        <Field name="rank-max-rev-d" type="text" class="form-control" v-model="reader.rank.maxReservationDays" disabled />
      </div>

      <div class="form-group">
        <label for="rank-min-points">Số điểm nhỏ nhất của cấp bậc: </label>
        <Field name="rank-min-points" type="text" class="form-control" v-model="reader.rank.minPoints" disabled />
      </div>

      <div class="form-group">
        <label for="rank-max-points">Số điểm lớn nhất của cấp bậc: </label>
        <Field name="rank-max-points" type="text" class="form-control" v-model="reader.rank.maxPoints" disabled />
      </div>

      <div class="form-group">
        <label for="curr-rev-qty">Số sách đang đặt trước hiện tại: </label>
        <Field name="curr-rev-qty" type="text" class="form-control" v-model="reader.currentReservationQuantity" disabled />
      </div>
      
      <div class="form-group">
        <label for="curr-borrow-qty">Số sách đang mượn hiện tại: </label>
        <Field name="curr-borrow-qty" type="text" class="form-control" v-model="reader.currentBorrowingQuantity" disabled />
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
import { ref, computed, onMounted, defineProps } from 'vue';
import { Form as VForm, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import readerService from '@/services/book.accounts/reader.service';
import { executeWithSwal, showSwal } from '@/utils/swal.util';

defineOptions({
  name: 'reader-edit'
})

const router = useRouter();

const props = defineProps(['readerId']);

const reader = ref({
  email: '',
  phone: '',
  surname: '',
  name: '',
  birth: '',
  gender: '',
  address: '',
  rank: {
    title: '',
    maxExtensionDays: 0,
    maxReservationDays: 0,
    minPoints: 0,
    maxPoints: 0,
  },
  currentReservationQuantity: 0,
  currentBorrowingQuantity: 0,
});

const getDate = (date) => new Date(date).toISOString().split('T')[0];

const maxBirthDate = computed(() => {
  const currentYear = new Date().getFullYear();
  const maxDate = new Date(currentYear - 15, 11, 31);
  return getDate(maxDate);
});

const minBirthDate = computed(() => {
  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear - 100, 0, 1);
  return getDate(minDate);
});

const readerFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Định dạng email không hợp lệ.')
    .max(100, 'Email không được vượt quá 100 ký tự.')
    .required('Email là bắt buộc.'),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số.')
    .min(10, 'Số điện thoại phải có ít nhất 10 số.')
    .required('Số điện thoại là bắt buộc.'),
  surname: yup.string().required('Họ lót là bắt buộc.'),
  name: yup.string().required('Tên là bắt buộc.'),
  birth: yup
    .date()
    .required('Ngày sinh là bắt buộc.')
    .max(maxBirthDate.value, 'Ngày sinh không hợp lệ.')
    .min(minBirthDate.value, 'Ngày sinh không hợp lệ.'),
  gender: yup.string().required('Giới tính là bắt buộc.'),
  address: yup
    .string()
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự.')
    .required('Địa chỉ là bắt buộc.'),
});

const rankTitle = computed(() => {
  switch (reader.value.rank.title) {
    case 'basic': return 'Cơ bản';
    case 'bronze': return 'Đồng';
    case 'silver': return 'Bạc';
    case 'gold': return 'Vàng';
    case 'platinum': return 'Bạch Kim';
    case 'diamond': return 'Kim Cương';
    default: return 'Không xác định';
  }
});


const vformRef = ref(null);

const loadReaderDetails = async () => {
  await executeWithSwal(async () => {
    const projection = {
      user: '-_id -password -role'
    };
    const response = await readerService.get(props.readerId, {
      projection: JSON.stringify(projection)
    });

    const { user, ...rest } = response.data;

    reader.value = { ...user, ...rest };
    reader.value.birth = getDate(reader.value.birth);
    
    return response;
  }, false, false);
};

const submitEditReader = async () => {
  const isValid = await vformRef.value.validate();
  if (!isValid) return;

  await executeWithSwal(async () => {
    return await readerService.update(props.readerId, reader.value);
  }, false, true, router, 'reader-list');
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
    router.push({ name: 'reader-list' });
  }
};

onMounted(async () => await loadReaderDetails());
</script>
