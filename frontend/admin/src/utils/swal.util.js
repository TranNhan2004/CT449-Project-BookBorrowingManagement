import Swal from 'sweetalert2';

async function showSwal({ 
  title, 
  text, 
  icon = 'info', 
  showConfirmButton = false, 
  showCancelButton = false, 
  confirmButtonText = '', 
  cancelButtonText = '',
  useTimer = false, 
}) {
  return await Swal.fire({
    title,
    text,
    icon,
    showConfirmButton,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    timer: useTimer ? 1500 : null,
  });
};

async function executeWithSwal(callback, useConfirmSwal = false, useSuccessSwal = true, router = null) {
  try {
    if (useConfirmSwal) {
      const confirm = await showSwal({
        title: 'Xác nhận',
        text: 'Bạn chắc chắn muốn thực hiện hành động này?',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy',
      });

      if (!confirm.isConfirmed) {
        return;
      }
    }

    const response = await callback();

    if (useSuccessSwal) {
      await showSwal({
        icon: 'success',
        title: 'Thành công',
        text: response?.message,
        useTimer: true,
      })
    }
  } catch (err) {
    await showSwal({
      icon: 'error',
      title: 'Thất bại',
      text: err.response?.data?.message || err,
      useTimer: true,
    }) 

    if (router) {
      router.push({ name: 'home-page' });
    }
  }
};

export {
  showSwal,
  executeWithSwal,
};