<template>
  <div class="reader-card d-flex border rounded p-3 mb-3 shadow align-items-center position-relative">
    <div class="me-3">
      <i class="fas fa-user-circle fa-3x text-muted"></i>
    </div>

    <div class="flex-grow-1">
      <p class="text-muted mb-1"><strong>ID: </strong>{{ reader._id }}</p>
      <p class="text-muted mb-1"><strong>Họ và tên: </strong><i>{{ fullname }}</i></p>
      <p class="text-muted mb-1"><strong>Email: </strong><i>{{ reader.email }}</i></p>
      <p class="text-muted mb-1"><strong>Số điện thoại: </strong><i>{{ reader.phone }}</i></p>
      <p class="text-muted mb-1"><strong>Cấp bậc: </strong>
        <span :class="rankClass" class="fw-bold">
          <i :class="rankIcon"></i> {{ rankTitle }}
        </span>
      </p>
      <p class="text-muted mb-1"><strong>Số sách đang đặt trước: </strong><i>{{ reader.currentReservationQuantity || 0 }}</i></p>
      <p class="text-muted mb-1"><strong>Số sách đang mượn: </strong><i>{{ reader.currentBorrowingQuantity || 0 }}</i></p>
      <p class="text-muted mb-1"><strong>Trạng thái: </strong>
        <span :class="statusClass" class="fw-bold">
          <i :class="statusIcon"></i> {{ statusText }}
        </span>
      </p>
    </div>

    <div class="position-absolute bottom-0 end-0 p-3 d-flex gap-2">
      <button class="btn btn-warning text-dark" @click="editReader">
        <i class="fas fa-edit"></i> <b>Hiệu chỉnh</b>
      </button>
      <button
        :class="toggleButtonClass"
        @click="toggleAccountStatus"
      >
        <i :class="toggleButtonIcon"></i> <b>{{ toggleButtonText }}</b>
      </button>
      <button class="btn btn-danger text-white" @click="deleteReader">
        <i class="fas fa-trash"></i> <b>Xóa</b>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'reader-card',
});

const router = useRouter();

const props = defineProps(['reader']);
const emits = defineEmits(['delete', 'changeValidation'])

const fullname = computed(() => `${props.reader?.surname || ''} ${props.reader?.name || ''}`.trim());

const rankTitle = computed(() => {
  switch (props.reader?.rank?.title) {
    case 'basic': return 'Cơ bản';
    case 'bronze': return 'Đồng';
    case 'silver': return 'Bạc';
    case 'gold': return 'Vàng';
    case 'platinum': return 'Bạch Kim';
    case 'diamond': return 'Kim Cương';
    default: return 'Không xác định';
  }
});

const rankClass = computed(() => {
  switch (props.reader?.rank?.title) {
    case 'basic': return 'text-secondary'; 
    case 'bronze': return 'text-warning'; 
    case 'silver': return 'text-muted'; 
    case 'gold': return 'text-warning'; 
    case 'platinum': return 'text-info'; 
    case 'diamond': return 'text-primary'; 
    default: return 'text-dark';
  }
});

const rankIcon = computed(() => {
  switch (props.reader?.rank?.title) {
    case 'basic': return 'fas fa-star';
    case 'bronze': return 'fas fa-medal';
    case 'silver': return 'fas fa-trophy';
    case 'gold': return 'fas fa-crown';
    case 'platinum': return 'fas fa-gem';
    case 'diamond': return 'fas fa-diamond';
    default: return 'fas fa-question-circle';
  }
});


const statusClass = computed(() => props.reader?.isValid ? 'text-success' : 'text-danger');
const statusIcon = computed(() => props.reader?.isValid ? 'fas fa-check-circle' : 'fas fa-times-circle');
const statusText = computed(() => props.reader?.isValid ? 'Còn hiệu lực' : 'Bị vô hiệu');

const toggleButtonClass = computed(() =>
  props.reader?.isValid ? 'btn btn-info' : 'btn btn-success'
);
const toggleButtonText = computed(() =>
  props.reader?.isValid ? 'Vô hiệu' : 'Kích hoạt'
);
const toggleButtonIcon = computed(() =>
  props.reader?.isValid ? 'fas fa-times-circle' : 'fas fa-check-circle'
);

const toggleAccountStatus = () => emits('changeValidation', { readerId: props.reader._id, newStatus: !props.reader.isValid });

const editReader = () => {
  router.push({ name: 'reader-edit', params: { readerId: props.reader._id } });
};

const deleteReader = () => emits('delete', props.reader._id);

</script>


