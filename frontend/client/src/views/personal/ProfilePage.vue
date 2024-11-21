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
        <p class="profile-label">Địa chỉ: </p>
        <p class="profile-label">Số sách đang mượn hiện tại: </p>
        <p class="profile-label">Số sách đang đặt trước hiện tại: </p>
        <p class="profile-label">Số điểm hiện tại: </p>
        <p class="profile-label">Cấp bậc: </p>
        <p class="profile-label">Số điểm tối thiểu của cấp bậc: </p>
        <p class="profile-label">Số điểm tối đa của cấp bậc: </p>
        <p class="profile-label">Số ngày gia hạn tối đa hiện tại: </p>
        <p class="profile-label">Số ngày đặt trước tối đa hiện tại: </p>
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
        <p class="profile-label">{{ me.currentReservationQuantity }}</p>
        <p class="profile-label">{{ me.currentBorrowingQuantity }}</p>
        <p class="profile-label">{{ me.points }}</p>
        <p class="profile-content">
          <span :class="formattedRankClass(me.rank?.title)" class="fw-bold">
            <i :class="formattedRankIcon(me.rank?.title)"></i> {{ formattedRankTitle(me.rank?.title) }}
          </span>
        </p>
        <p class="profile-label">{{ me.rank.minPoints }}</p>
        <p class="profile-label">{{ me.rank.maxPoints }}</p>
        <p class="profile-label">{{ me.rank.maxExtensionDays }}</p>
        <p class="profile-label">{{ me.rank.maxExtensionDays }}</p>
        

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
import readerService from '@/services/book.accounts/reader.service';
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
  currentBorrowingQuantity: 0,
  currentReservationQuantity: 0,
  points: '',
  rank: {
    title: '',
    minPoints: 0,
    maxPoints: 0,
    maxExtensionDays: 0,
    maxReservationDays: 0
  }
});


const loadMyDetails = async () => {
  await executeWithSwal(async () => {
    const projection = {
      user: '-_id -password -role'
    };
    const response = await readerService.getMe({ projection: JSON.stringify(projection) });
    console.log(response);

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

const formatBirth = birth => new Date(birth).toLocaleDateString('vi-VN');


const router = useRouter();

const editProfile = () => router.push({ name: 'profile-edit' }); 

const changePassword = () => router.push({ name: 'password-change' }); 

const formattedRankTitle = (rankTitle) => {
  switch (rankTitle) {
    case 'basic': return 'Cơ bản';
    case 'bronze': return 'Đồng';
    case 'silver': return 'Bạc';
    case 'gold': return 'Vàng';
    case 'platinum': return 'Bạch Kim';
    case 'diamond': return 'Kim Cương';
    default: return 'Không xác định';
  }
};

const formattedRankClass = (rankTitle) => {
  switch (rankTitle) {
    case 'basic': return 'text-secondary'; // Màu xám
    case 'bronze': return 'text-warning'; // Màu đồng
    case 'silver': return 'text-muted'; // Màu bạc
    case 'gold': return 'text-warning'; // Màu vàng
    case 'platinum': return 'text-info'; // Màu bạch kim
    case 'diamond': return 'text-primary'; // Màu xanh dương
    default: return 'text-dark';
  }
};

const formattedRankIcon = (rankTitle) => {
  switch (rankTitle) {
    case 'basic': return 'fas fa-star';
    case 'bronze': return 'fas fa-medal';
    case 'silver': return 'fas fa-trophy';
    case 'gold': return 'fas fa-crown';
    case 'platinum': return 'fas fa-gem';
    case 'diamond': return 'fas fa-diamond';
    default: return 'fas fa-question-circle';
  }
};

onMounted(async () => await loadMyDetails());
</script>

<style>
.profile-label {
  font-weight: bold;
}
</style>