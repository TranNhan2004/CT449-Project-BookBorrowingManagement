import { defineStore } from "pinia";
import { showSwal } from "@/utils/swal.util";
import authService from "@/services/book.accounts/auth.service";


const isLoggedInKey = 'bbm-client-isLoggedIn';

export const useReaderStore = defineStore('reader', {
  state: () => ({
    reader: null,
  }),
  actions: {
    isAuth() {
      return this.reader !== null;
    },

    async initializeAuth() {
      const isLoggedIn = localStorage.getItem(isLoggedInKey) === 'true';
      if (isLoggedIn) {
        try {
          const response = await authService.validate();
          if (response.data.role !== 'reader') {
            throw new Error('Unauthorized');
          }

          this.reader = response.data;
        } catch (err) {
          console.log(err);

          await showSwal({
            icon: 'error',
            title: 'Đã hết phiên đăng nhập! Vui lòng đăng nhập lại!',
            showConfirmButton: true,
            confirmButtonText: 'OK',
          });
        }
      }
    },

    async login(data) {
      try {
        const response = await authService.login(data);

        if (response.success && response.data.role === 'reader') {
          this.reader = response.data;
          localStorage.setItem(isLoggedInKey, 'true'); 

          await showSwal({
            icon: 'success',
            title: 'Đăng nhập thành công',
            useTimer: true,
          });
        } else {
          throw new Error('Thông tin đăng nhập không hợp lệ!');
        }
      } catch (error) {
        this.reader = null;
        localStorage.setItem(isLoggedInKey, 'false');

        if (error.response?.status === 403) {
          await showSwal({
            icon: 'error',
            title: 'Tài khoản đã bị vô hiệu! Không thể đăng nhập!',
            useTimer: true,
          });

        } else {
          await showSwal({
            icon: 'error',
            title: 'Thông tin đăng nhập không hợp lệ!',
            useTimer: true,
          });
        }
      }
    },

    async logout(useSuccessSwal = true) {
      try {
        await authService.logout();
        this.reader = null;
        localStorage.setItem(isLoggedInKey, 'false'); 
        if (useSuccessSwal) {
          await showSwal({
            icon: 'success',
            title: 'Đăng xuất thành công',
            useTimer: true,
          });
        }
      } catch (error) {
        await showSwal({
          icon: 'error',
          title: error.response.message || 'Đã có lỗi xảy ra!',
          useTimer: true,
        });
      }
    }
  }
});
