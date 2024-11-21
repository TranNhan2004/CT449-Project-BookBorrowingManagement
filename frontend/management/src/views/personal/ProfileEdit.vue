<template>
  <div class="form-container">
    <h1 class="form-title">CHỈNH SỬA THÔNG TIN CÁ NHÂN</h1>
    <VForm ref="myVFormRef" @submit="submitEditMe" :validation-schema="myFormSchema" class="vform">
      <!-- Email -->
      <div class="form-group">
        <label for="email">Email: <span class="required">*</span></label>
        <Field name="email" type="email" class="form-control" v-model="me.email" />
        <ErrorMessage name="email" class="error-feedback" />
      </div>

      <!-- Số điện thoại -->
      <div class="form-group">
        <label for="phone">Số điện thoại: <span class="required">*</span></label>
        <Field name="phone" type="text" class="form-control" v-model="me.phone" />
        <ErrorMessage name="phone" class="error-feedback" />
      </div>

      <!-- Họ lót -->
      <div class="form-group">
        <label for="surname">Họ lót: <span class="required">*</span></label>
        <Field name="surname" type="text" class="form-control" v-model="me.surname" />
        <ErrorMessage name="surname" class="error-feedback" />
      </div>

      <!-- Tên -->
      <div class="form-group">
        <label for="name">Tên: <span class="required">*</span></label>
        <Field name="name" type="text" class="form-control" v-model="me.name" />
        <ErrorMessage name="name" class="error-feedback" />
      </div>

      <!-- Ngày sinh -->
      <div class="form-group">
        <label for="birth">Ngày sinh: <span class="required">*</span></label>
        <Field name="birth" type="date" class="form-control" v-model="me.birth" :max="maxBirthDate" :min="minBirthDate" />
        <ErrorMessage name="birth" class="error-feedback" />
      </div>

      <!-- Giới tính -->
      <div class="form-group">
        <label>Giới tính: <span class="required">*</span></label>
        <div class="d-flex align-items-center gap-3 mt-2">
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="male" v-model="me.gender" />
            <label class="form-check-label">Nam</label>
          </div>
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="female" v-model="me.gender" />
            <label class="form-check-label">Nữ</label>
          </div>
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="other" v-model="me.gender" />
            <label class="form-check-label">Khác</label>
          </div>
        </div>
        <ErrorMessage name="gender" class="error-feedback" />
      </div>

      <!-- Địa chỉ -->
      <div class="form-group">
        <label for="address">Địa chỉ: <span class="required">*</span></label>
        <Field name="address" as="textarea" class="form-control" v-model="me.address" />
        <ErrorMessage name="address" class="error-feedback" />
      </div>

      <!-- Vị trí -->
      <div class="form-group">
        <label for="position">Vị trí:</label>
        <Field name="position" type="text" class="form-control" v-model="me.position" disabled />
      </div>

      <!-- Nút -->
      <div class="form-group">
        <button type="submit" class="btn btn-primary" @click="submitEditMe"><i class="fas fa-save"></i> Lưu</button>
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
import staffService from '@/services/book.accounts/staff.service';
import { executeWithSwal, showSwal } from '@/utils/swal.util';

defineOptions({
  name: 'profile-edit'
});

const router = useRouter();

const me = ref({
  email: '',
  phone: '',
  surname: '',
  name: '',
  birth: '',
  gender: '',
  address: '',
  position: 'admin',
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

const myFormSchema = yup.object().shape({
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

const myVFormRef = ref(null);

const loadMyDetails = async () => {
  await executeWithSwal(async () => {
    const projection = {
      user: '-_id -password -role'
    };
    const response = await staffService.getMe({ projection: JSON.stringify(projection) });

    const { user, ...rest } = response.data;
    me.value = { ...user, ...rest };
    me.value.birth = getDate(me.value.birth);
    return response;
  }, false, false);
};

// const submitForm = async () => {
//   console.log(true);
// }

const submitEditMe = async () => {
  const isValid = await myVFormRef.value.validate();
  if (!isValid) {
    return;
  }
  await executeWithSwal(async () => {
    const birth = new Date(me.value.birth);
    me.value.birth = birth;
    return await staffService.updateMe(me.value);
  }, false, true, router, 'profile-page');
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
    router.push({ name: 'profile-page' });
  }
};

onMounted(async () => { await loadMyDetails() });
</script>
