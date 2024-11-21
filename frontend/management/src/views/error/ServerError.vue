<template>
  <div class="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
    <h1 class="display-1 fw-bold text-danger">500</h1>
    <p class="lead text-muted">Oops! Server đã gặp lỗi và không thể thực hiện yêu cầu của bạn! 
      Vui lòng thử lại trong ít phút!</p>
    <router-link to="/" class="btn btn-primary btn-lg">
      <i class="fas fa-home"></i> Quay lại trang chủ
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'server-error',
};
</script>

