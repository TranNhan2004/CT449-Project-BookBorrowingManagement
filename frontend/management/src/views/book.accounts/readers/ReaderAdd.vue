<template>
  <div class="form-container">
    <h1 class="form-title">THÊM ĐỘC GIẢ MỚI</h1>
    <VForm ref="vformRef" @submit="submitAddStaff" :validation-schema="readerFormSchema" class="vform">
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

      <!-- Mật khẩu -->
      <div class="form-group">
        <label for="password">Mật khẩu: <span class="required">*</span></label>
        <Field name="password" type="password" class="form-control" v-model="reader.password" />
        <ErrorMessage name="password" class="error-feedback" />
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
        <label for="gender">Giới tính: <span class="required">*</span></label>
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

      <!-- Nút -->
      <div class="form-group">
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu</button>
        <button type="button" class="btn btn-secondary ml-2" @click="cancel">Thoát</button>
      </div>
    </VForm>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Form as VForm, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import authService from '@/services/book.accounts/auth.service';
import { showSwal, executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'reader-add'
})

const router = useRouter();

const reader = ref({
  email: '',
  phone: '',
  password: '',
  surname: '',
  name: '',
  birth: '',
  gender: '',
  address: ''
});

const maxBirthDate = computed(() => {
  const currentYear = new Date().getFullYear();
  const maxDate = new Date(currentYear - 15, 11, 31);
  return maxDate.toISOString().split('T')[0];
});

const minBirthDate = computed(() => {
  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear - 100, 0, 1);
  return minDate.toISOString().split('T')[0];
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
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
      'Mật khẩu phải gồm ít nhất 1 ký tự thường (a-z), 1 ký tự hoa (A-Z), 1 ký tự đặc biệt (@$!%*?) và từ 8 - 20 ký tự.'
    )
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
    .max(20, 'Mật khẩu không được vượt quá 20 ký tự.')
    .required('Mật khẩu là bắt buộc.'),
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
    .required('Địa chỉ là bắt buộc.')
});

const vformRef = ref(null);

const submitAddStaff = async () => {
  const isValid = await vformRef.value.validate();
  if (!isValid) return;

  await executeWithSwal(async () => {
    console.log(reader.value);
    return await authService.signupForReader(reader.value);
  }, false, true);
  
  location.reload();
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
</script>

<style scoped>
@import '../../../assets/css/form.css';

.vform {
  max-width: 600px;
  margin: 0 auto;
}

.form-control {
  width: 100%
}

.error-feedback {
  color: red;
}

.required {
  color: red;
}
</style>
