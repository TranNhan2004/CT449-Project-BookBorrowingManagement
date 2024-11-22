<template>
  <div class="staff-card d-flex border rounded p-3 mb-3 shadow align-items-center position-relative">
    <div class="me-3">
      <i class="fas fa-user-circle fa-3x text-muted"></i>
    </div>


    <div class="flex-grow-1">
      <p class="text-muted mb-1"><strong>ID: </strong>{{ staff._id }}</p>
      <p class="text-muted mb-1"><strong>Họ và tên: </strong><i>{{ fullname }}</i></p>
      <p class="text-muted mb-1"><strong>Email: </strong><i>{{ staff.email }}</i></p>
      <p class="text-muted mb-1"><strong>Số điện thoại: </strong><i>{{ staff.phone }}</i></p>
      <p class="text-muted mb-1"><strong>Chức vụ: </strong><i>{{ position }}</i></p>
      <p class="text-muted mb-1"><strong>Trạng thái: </strong>
        <span :class="statusClass" class="fw-bold">
          <i :class="statusIcon"></i> {{ statusText }}
        </span>
      </p>
    </div>

    <div class="position-absolute bottom-0 end-0 p-3 d-flex gap-2" v-if="staff.position !== 'admin'">
      <button class="btn btn-warning text-dark" @click="editStaff">
        <i class="fas fa-edit"></i> <b>Hiệu chỉnh</b>
      </button>
      <button
        :class="toggleButtonClass"
        @click="changeValidation"
      >
        <i :class="toggleButtonIcon"></i> <b>{{ toggleButtonText }}</b>
      </button>
      <button class="btn btn-danger text-white" @click="deleteStaff">
        <i class="fas fa-trash"></i> <b>Xóa</b>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'staff-card',
});

const router = useRouter();

const props = defineProps(['staff']);

const emits = defineEmits(['delete', 'changeValidation'])

const fullname = computed(() => `${props.staff?.surname || ''} ${props.staff?.name || ''}`.trim());
const position = computed(() => {
  switch (props.staff?.position) {
    case 'admin':
      return 'Quản trị viên';
    case 'librarian':
      return 'Thủ thư';
    default:
      return 'Không xác định';
  }
});

// Trạng thái nhân viên
const statusClass = computed(() => props.staff?.isValid ? 'text-success' : 'text-danger');
const statusIcon = computed(() => props.staff?.isValid ? 'fas fa-check-circle' : 'fas fa-times-circle');
const statusText = computed(() => props.staff?.isValid ? 'Còn hiệu lực' : 'Bị vô hiệu');

// Nút Kích hoạt/Vô hiệu
const toggleButtonClass = computed(() =>
  props.staff?.isValid ? 'btn btn-info' : 'btn btn-success'
);
const toggleButtonText = computed(() =>
  props.staff?.isValid ? 'Vô hiệu' : 'Kích hoạt'
);
const toggleButtonIcon = computed(() =>
  props.staff?.isValid ? 'fas fa-times-circle' : 'fas fa-check-circle'
);

const editStaff = () => {
  router.push({ name: 'staff-edit', params: { staffId: props.staff?._id } });
};

const changeValidation = () => emits('changeValidation', { staffId: props.staff._id, newStatus: !props.staff.isValid });

const deleteStaff = () => emits('delete', props.staff._id);
</script>

<style scoped>
</style>
