<template>
  <div class="profile-page container mt-5">
    <h1 class="text-center mb-4">THÔNG TIN CÁ NHÂN</h1>
    
    <div class="row">
      <!-- Cột trái: Tiêu đề -->
      <div class="col-md-5 text-end border-end">
        <p class="profile-label">Email: </p>
        <p class="profile-label">Số điện thoại: </p>
        <p class="profile-label">Họ lót: </p>
        <p class="profile-label">Tên: </p>
        <p class="profile-label">Ngày sinh: </p>
        <p class="profile-label">Giới tính: </p>
        <p class="profile-label">Địa chỉ:</p>
        <p class="profile-label">Chức vụ:</p>
      </div>

      <!-- Cột phải: Nội dung -->
      <div class="col-md-7">
        <p class="profile-content">{{ me.email }}</p>
        <p class="profile-content">{{ me.phone }}</p>
        <p class="profile-content">{{ me.surname }}</p>
        <p class="profile-content">{{ me.name }}</p>
        <p class="profile-content">{{ formatBirth(me.birth) }}</p>
        <p class="profile-content">{{ formatGender(me.gender) }}</p>
        <p class="profile-content">{{ me.address }}</p>
        <p class="profile-content">{{ formatPosition(me.position) }}</p>
        

        <!-- Nút thao tác -->
        <div class="d-flex justify-content-end mt-4">
          <button 
            class="btn btn-primary me-3" 
            @click="editProfile">
            Chỉnh sửa thông tin
          </button>
          <button 
            class="btn btn-secondary" 
            @click="changePassword">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import staffService from '@/services/book.accounts/staff.service';
import { executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'profile-page'
})

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


const loadMyDetails = async () => {
  await executeWithSwal(async () => {
    const projection = {
      user: '-_id -password -role'
    };
    const response = await staffService.getMe({ projection: JSON.stringify(projection) });

    const { user, ...rest } = response.data;
    me.value = { ...user, ...rest };

    return response;
  }, false, false);
};

const formatGender = (gender) => {
  switch (gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    default:
      return 'Khác';
  }
}


const formatBirth = (birth) => {
  return new Date(birth).toLocaleDateString('vi-VN');
}


const formatPosition = (position) => position === 'admin' ? 'Quản trị viên' : 'Thủ thư';

const router = useRouter();

const editProfile = () => router.push('/profile/edit'); 

const changePassword = () => router.push('/profile/change-password'); 

onMounted(async () => await loadMyDetails());
</script>

<style>
.profile-label {
  font-weight: bold;
}
</style>