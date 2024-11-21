<template>
  <div class="form-container">
    <h1 class="form-title">ĐỔI MẬT KHẨU</h1>
    <VForm ref="vformRef" @submit="submitChangePassword" :validation-schema="passwordFormSchema" class="vform">
      <!-- Mật khẩu cũ -->
      <div class="form-group">
        <label for="oldPassword">Mật khẩu cũ: <span class="required">*</span></label>
        <Field name="oldPassword" type="password" class="form-control" v-model="formData.oldPassword" />
        <ErrorMessage name="oldPassword" class="error-feedback" />
      </div>

      <!-- Mật khẩu mới -->
      <div class="form-group">
        <label for="newPassword">Mật khẩu mới: <span class="required">*</span></label>
        <Field name="newPassword" type="password" class="form-control" v-model="formData.newPassword" />
        <ErrorMessage name="newPassword" class="error-feedback" />
      </div>

      <!-- Nhập lại mật khẩu mới -->
      <div class="form-group">
        <label for="confirmedNewPassword">Nhập lại mật khẩu mới: <span class="required">*</span></label>
        <Field name="confirmedNewPassword" type="password" class="form-control" v-model="formData.confirmedNewPassword" />
        <ErrorMessage name="confirmedNewPassword" class="error-feedback" />
      </div>

      <!-- Nút -->
      <div class="form-group ok-container">
        <button type="submit" class="btn btn-primary ok-btn"> OK </button>
      </div>
    </VForm>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { Form as VForm, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { executeWithSwal } from '@/utils/swal.util'; 
import readerService from '@/services/book.accounts/reader.service';
import { useReaderStore } from '@/stores/reader.store';
import { useRouter } from 'vue-router';


defineOptions({
  name: 'password-change'
})

const store = useReaderStore();
const router = useRouter();

const formData = ref({
  oldPassword: '',
  newPassword: '',
  confirmedNewPassword: ''
});

const passwordFormSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .required('Mật khẩu cũ là bắt buộc.')
    .min(8, 'Mật khẩu cũ phải có ít nhất 8 ký tự.')
    .max(20, 'Mật khẩu cũ phải có ít nhất 20 ký tự.'),
  newPassword: yup
    .string()
    .required('Mật khẩu mới là bắt buộc.')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.')
    .notOneOf([yup.ref('oldPassword'), null], 'Mật khẩu mới không thể giống mật khẩu cũ.'),
  confirmedNewPassword: yup
    .string()
    .required('Nhập lại mật khẩu mới là bắt buộc.')
    .oneOf([yup.ref('newPassword'), null], 'Mật khẩu nhập lại không khớp.')
});

const vformRef = ref(null);

const submitChangePassword = async () => {
  const isValid = await vformRef.value.validate();
  if (!isValid) return;

  // Call API to change password here
  await executeWithSwal(async () => {
    const response = await readerService.changeMyPassword({ ...formData.value });
    await store.logout(false);
    return response;
  }, false, true, router, 'login-page');
};
</script>

<style scope>
.ok-btn {
  margin-top: 30px;
  height: 45px;
  width: 45%;
}

.ok-container {
  text-align: center;
  margin-bottom: 20px;
}
</style>