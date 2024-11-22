<template>
  <div class="form-container">
    <h1 class="form-title">ĐĂNG NHẬP</h1>
    <!-- Vee-validate Form -->
    <VForm ref="form" @submit="submitLogin" :validation-schema="loginFormSchema" class="vform">
      <!-- Tên đăng nhập -->
      <div class="form-group">
        <label for="phoneOrEmail">Email hoặc số điện thoại: <span class="required">*</span></label>
        <Field 
          name="phoneOrEmail" 
          type="text" 
          class="form-control" 
          v-model="phoneOrEmail" 
          placeholder="Nhập email hoặc số điện thoại" />
        <ErrorMessage name="phoneOrEmail" class="error-feedback" />
      </div>

      <!-- Mật khẩu -->
      <div class="form-group">
        <label for="password">Mật khẩu: <span class="required">*</span></label>
        <Field name="password" type="password" class="form-control" v-model="password" placeholder="Nhập mật khẩu" />
        <ErrorMessage name="password" class="error-feedback" />
      </div>

      <!-- Nút đăng nhập -->
      <div class="form-group btn-container">
        <button class="btn btn-primary" type="submit">Đăng Nhập</button>
      </div>
    </VForm>
  </div>
</template>

<script setup>
import { Form as VForm, Field, ErrorMessage } from 'vee-validate'; 
import * as yup from 'yup'; 
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStaffStore } from '@/stores/staff.store';

defineOptions({
  name: 'login-page'
});

const router = useRouter();
const store = useStaffStore(); 

const phoneOrEmail = ref('');
const password = ref('');

const form = ref(null);

const loginFormSchema = yup.object().shape({
  phoneOrEmail: yup
    .string()
    .required('Email hoặc số điện thoại không được bỏ trống'),
  password: yup
    .string()
    .required('Mật khẩu không được bỏ trống')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});


const submitLogin = async () => {
  const isValid = await form.value.validate();
  if (!isValid) return;

  try {
    await store.login({
      phoneOrEmail: phoneOrEmail.value,
      password: password.value,
    })
    
    router.push({ name: 'home-page' });
  } catch (error) {
    console.error('Login failed:', error);
  }
}
</script>

<style scoped>
/* Tạo hiệu ứng đổ bóng và căn giữa form */
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.vform {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.form-title {
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 20px;
}


.btn-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.required {
  color: red;
  margin-left: 4px;
}

.form-control {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  box-sizing: border-box;
}

.error-feedback {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

button {
  width: 50%;
  padding: 10px;
  background-color: #0275d8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
