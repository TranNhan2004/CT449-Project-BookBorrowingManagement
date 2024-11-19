import { defineStore } from "pinia";
import authService from "@/services/book.accounts/auth.service";
import { showSwal } from "@/utils/swal.util";

const isLoggedInKey = 'bbm-isLoggedIn';

export const useStaffStore = defineStore('staff', {
  state: () => ({
    staff: null,
  }),
  actions: {
    isAuth() {
      return this.staff !== null;
    },

    async initializeAuth() {
      const isLoggedIn = localStorage.getItem(isLoggedInKey) === 'true';
      if (isLoggedIn) {
        try {
          const response = await authService.validate();
          this.staff = response.data;
        } catch (err) {
          console.log(err);

          await showSwal({
            icon: 'error',
            title: 'Đã hết phiên đăng nhập! Vui lòng đăng nhập lại!',
            useTimer: true,
          });
        }
      }
    },

    async login(data) {
      try {
        const response = await authService.login(data);

        if (response.success && response.data.role === 'staff') {
          this.staff = response.data;
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
        this.staff = null;
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

    async logout() {
      try {
        await authService.logout();
        this.staff = null;
        localStorage.setItem(isLoggedInKey, 'false'); 
        await showSwal({
          icon: 'success',
          title: 'Đăng xuất thành công',
          useTimer: true,
        });
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
