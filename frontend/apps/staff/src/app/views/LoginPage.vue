<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = () => {
  if (email.value === 'admin@example.com' && password.value === '123456') {
    router.push('/');
  } else {
    errorMessage.value = 'Email hoặc mật khẩu không đúng!';
  }
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
    <div class="bg-white rounded-xl shadow-xl w-96 p-8 ring-1 ring-gray-300">
      <h2 class="text-2xl font-bold text-center text-[#1e3050] mb-6">Đăng Nhập</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold text-gray-700" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Nhập email"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700" for="password">Mật khẩu</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Nhập mật khẩu"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Đăng Nhập
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

