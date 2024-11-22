<template>
  <div class="container text-center mt-4">
    <h1>Chào mừng bạn đến với hệ thống My Library</h1>
    <div class="mt-5">
      <h2>Quy định mượn sách</h2>
      <table class="table table-bordered table-striped mt-3">
        <thead class="table-light">
          <tr>
            <th>Quy định</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Số bản sao sách mượn tối đa</td>
            <td>5 quyển</td>
          </tr>
          <tr>
            <td>Số bản sao sách đặt trước tối đa</td>
            <td>5 quyển</td>
          </tr>
          <tr>
            <td>Số ngày mượn tiêu chuẩn</td>
            <td>14 ngày</td>
          </tr>
          <tr>
            <td>Số ngày đặt trước tiêu chuẩn</td>
            <td>5 ngày</td>
          </tr>
          <tr>
            <td>Điểm tích lũy</td>
            <td>
              Mỗi ngày trả trễ sẽ bị trừ 5 điểm. <br />
              Trả đúng hẹn sẽ được cộng 5 điểm.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-5">
      <h2>Quy định về xếp hạng độc giả</h2>
      <table class="table table-bordered table-striped mt-3">
        <thead class="table-light">
          <tr>
            <th>Hạng</th>
            <th>Điểm tích lũy</th>
            <th>Số ngày gia hạn tối đa</th>
            <th>Số ngày đặt trước tối đa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rank in rankEnum" :key="rank.title">
            <td :class="rankClass(rank)"><i :class="rankIcon(rank)"></i> {{ rankTitle(rank) }}</td>
            <td>{{ rank.minPoints }} - {{ rank.maxPoints }}</td>
            <td>{{ rank.maxExtensionDays }} ngày</td>
            <td>{{ rank.maxReservationDays }} ngày</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="small-text-container mt-5">
      <p class="small-text">Để làm việc, hãy chọn các chức năng của hệ thống ở menu bên trên.</p>
    </div>
  </div>
</template>

<script setup>
const rankEnum = [
  { title: 'basic', minPoints: 1, maxPoints: 20, maxExtensionDays: 5, maxReservationDays: 5 },
  { title: 'bronze', minPoints: 21, maxPoints: 100, maxExtensionDays: 6, maxReservationDays: 5 },
  { title: 'silver', minPoints: 101, maxPoints: 250, maxExtensionDays: 7, maxReservationDays: 6 },
  { title: 'gold', minPoints: 251, maxPoints: 600, maxExtensionDays: 8, maxReservationDays: 6 },
  { title: 'platinum', minPoints: 601, maxPoints: 1500, maxExtensionDays: 9, maxReservationDays: 7 },
  { title: 'diamond', minPoints: 1501, maxPoints: 9999, maxExtensionDays: 10, maxReservationDays: 7 }
];

const rankTitle = (rank) => {
  switch (rank.title) {
    case 'basic': return 'Cơ bản';
    case 'bronze': return 'Đồng';
    case 'silver': return 'Bạc';
    case 'gold': return 'Vàng';
    case 'platinum': return 'Bạch Kim';
    case 'diamond': return 'Kim Cương';
    default: return 'Không xác định';
  }
};

const rankClass = (rank) => {
  switch (rank.title) {
    case 'basic': return 'text-secondary'; 
    case 'bronze': return 'text-warning'; 
    case 'silver': return 'text-muted'; 
    case 'gold': return 'text-warning'; 
    case 'platinum': return 'text-info'; 
    case 'diamond': return 'text-primary'; 
    default: return 'text-dark';
  }
};

const rankIcon = (rank) => {
  switch (rank.title) {
    case 'basic': return 'fas fa-star';
    case 'bronze': return 'fas fa-medal';
    case 'silver': return 'fas fa-trophy';
    case 'gold': return 'fas fa-crown';
    case 'platinum': return 'fas fa-trophy';
    case 'diamond': return 'fas fa-gem';
    default: return 'fas fa-question-circle';
  }
};
</script>

<style scoped>
.small-text {
  font-size: 1.5rem;
  color: #555;
}

.small-text-container {
  margin-left: 100px;
  margin-right: 100px;
}
</style>
