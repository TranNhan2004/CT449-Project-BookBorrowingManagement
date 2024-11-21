<template>
  <div class="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
    <h1 class="display-1 fw-bold text-danger">404</h1>
    <p class="lead text-muted">Oops! Trang bạn đang tìm không tồn tại.</p>
    <router-link to="/" class="btn btn-primary btn-lg">
      <i class="fas fa-home"></i> Quay lại trang chủ
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'not-found',
};
</script>
