<template>
  <div class="home-page">
    <h1>Chào mừng bạn đến với hệ thống My Library</h1>
    <div class="small-text-container">
      <p class="small-text">Để làm việc, hãy chọn các chức năng của hệ thống ở menu bên trên.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home-page',
};
</script>

<style scoped>
.home-page {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 200px;
}

h1 {
  font-size: 2.5rem;
  color: #1e3050;
}

.small-text {
  font-size: 1.5rem;
  color: #555;
}

.small-text-container {
  margin-left: 100px;
  margin-right: 100px;
}
</style>
