<template>
  <div class="form-container">
    <h1 class="form-title">CHỈNH SỬA NHÂN VIÊN</h1>
    <VForm ref="vformRef" @submit="submitEditStaff" :validation-schema="staffFormSchema" class="vform">
      <!-- Email -->
      <div class="form-group">
        <label for="email">Email: <span class="required">*</span></label>
        <Field name="email" type="email" class="form-control" v-model="staff.email" />
        <ErrorMessage name="email" class="error-feedback" />
      </div>

      <!-- Số điện thoại -->
      <div class="form-group">
        <label for="phone">Số điện thoại: <span class="required">*</span></label>
        <Field name="phone" type="text" class="form-control" v-model="staff.phone" />
        <ErrorMessage name="phone" class="error-feedback" />
      </div>

      <!-- Họ lót -->
      <div class="form-group">
        <label for="surname">Họ lót: <span class="required">*</span></label>
        <Field name="surname" type="text" class="form-control" v-model="staff.surname" />
        <ErrorMessage name="surname" class="error-feedback" />
      </div>

      <!-- Tên -->
      <div class="form-group">
        <label for="name">Tên: <span class="required">*</span></label>
        <Field name="name" type="text" class="form-control" v-model="staff.name" />
        <ErrorMessage name="name" class="error-feedback" />
      </div>

      <!-- Ngày sinh -->
      <div class="form-group">
        <label for="birth">Ngày sinh: <span class="required">*</span></label>
        <Field name="birth" type="date" class="form-control" v-model="staff.birth" :max="maxBirthDate" :min="minBirthDate" />
        <ErrorMessage name="birth" class="error-feedback" />
      </div>

      <!-- Giới tính -->
      <div class="form-group">
        <label>Giới tính: <span class="required">*</span></label>
        <div class="d-flex align-items-center gap-3 mt-2">
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="male" v-model="staff.gender" />
            <label class="form-check-label">Nam</label>
          </div>
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="female" v-model="staff.gender" />
            <label class="form-check-label">Nữ</label>
          </div>
          <div class="form-check">
            <Field name="gender" type="radio" class="form-check-input" value="other" v-model="staff.gender" />
            <label class="form-check-label">Khác</label>
          </div>
        </div>
        <ErrorMessage name="gender" class="error-feedback" />
      </div>

      <!-- Địa chỉ -->
      <div class="form-group">
        <label for="address">Địa chỉ: <span class="required">*</span></label>
        <Field name="address" as="textarea" class="form-control" v-model="staff.address" />
        <ErrorMessage name="address" class="error-feedback" />
      </div>

      <!-- Vị trí -->
      <div class="form-group">
        <label for="position">Vị trí:</label>
        <Field name="position" type="text" class="form-control" v-model="staff.position" disabled />
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
import staffService from '@/services/book.accounts/staff.service';
import { executeWithSwal, showSwal } from '@/utils/swal.util';

defineOptions({
  name: 'staff-edit'
})

const router = useRouter();

const props = defineProps(['staffId']);

const staff = ref({
  email: '',
  phone: '',
  surname: '',
  name: '',
  birth: '',
  gender: '',
  address: '',
  position: 'librarian',
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

const staffFormSchema = yup.object().shape({
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

const vformRef = ref(null);

const loadStaffDetails = async () => {
  await executeWithSwal(async () => {
    const projection = {
      user: '-_id -password -role'
    };
    const response = await staffService.get(props.staffId, {
      projection: JSON.stringify(projection)
    });

    const { user, ...rest } = response.data;
    staff.value = { ...user, ...rest };
    staff.value.birth = getDate(staff.value.birth);
    return response;
  }, false, false);
};

const submitEditStaff = async () => {
  const isValid = await vformRef.value.validate();
  if (!isValid) return;

  await executeWithSwal(async () => {
    return await staffService.update(props.staffId, staff.value);
  }, false, true, router, 'staff-list');
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
    router.push({ name: 'staff-list' });
  }
};

onMounted(async () => {
  await loadStaffDetails();
});
</script>
