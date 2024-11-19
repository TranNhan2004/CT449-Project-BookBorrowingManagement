<template>
  <div class="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
    <h1 class="display-1 fw-bold text-danger">403</h1>
    <p class="lead text-muted">Bạn không có quyền truy cập vào trang này!</p>
    <router-link to="/" class="btn btn-primary btn-lg">
      <i class="fas fa-home"></i> Quay lại trang chủ
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'forbidden-page',
};
</script>

