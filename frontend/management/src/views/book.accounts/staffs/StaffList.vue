<template>
  <div class="container mt-4">
    <div class="mb-4">
      <StaffSearch @search="handleSearch" />
    </div>


    <div v-if="staffsToDisplay.length === 0" class="text-center mt-4">
      <p class="text-muted"><i>Không tìm thấy dữ liệu phù hợp.</i></p>
    </div>
    <div v-else>
      <div v-for="staff in staffsToDisplay" :key="staff._id" class="mb-3">
        <StaffCard :staff="staff" v-on:delete="handleDelete" v-on:changeValidation="handleChangeValidation"/>
      </div>


      <nav>
        <ul class="pagination justify-content-center">
          <li 
            class="page-item" 
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            <a class="page-link" href="#">
              <i class="fas fa-chevron-left"></i> Trước
            </a>
          </li>


          <li 
            v-for="page in visiblePages" 
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage, disabled: page === '...' }"
            @click="changePage(page)"
          >
            <a class="page-link" href="#">{{ page }}</a>
          </li>


          <li 
            class="page-item" 
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            <a class="page-link" href="#">
              Tiếp <i class="fas fa-chevron-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>

  
    <div class="text-center mt-4">
      <button class="btn btn-success" @click="goToStaffAdd">
        <i class="fas fa-plus"></i> Thêm nhân viên
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import staffService from '@/services/book.accounts/staff.service';
import StaffCard from '@/components/book.accounts/staffs/StaffCard.vue';
import StaffSearch from '@/components/book.accounts/staffs/StaffSearch.vue';
import { executeWithSwal } from '@/utils/swal.util';

defineOptions({
  name: 'staff-list',
});

const router = useRouter();

const staffs = ref([]);
const filteredStaffs = ref([]);
const currentPage = ref(1);
const pageSize = 10; 

const totalPages = computed(() => Math.ceil(filteredStaffs.value.length / pageSize));

const staffsToDisplay = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredStaffs.value.slice(startIndex, endIndex);
});

const visiblePages = computed(() => {
  const maxVisible = 6; 
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= maxVisible - 1) {
      for (let i = 1; i <= Math.min(total, maxVisible - 1); i++) {
        pages.push(i);
      }
      if (total > maxVisible) pages.push('...', total);
    } else {
      if (current + maxVisible - 2 >= total) {
        for (let i = total - maxVisible + 2; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, '...');
        for (let i = current - 1; i <= Math.min(current + maxVisible - 3, total - 1); i++) {
          pages.push(i);
        }
        if (current + maxVisible - 2 < total) pages.push('...', total);
      }
    }
  }

  return pages;
});

const changePage = (page) => {
  if (page === '...' || page <= 0 || page > totalPages.value) return;
  currentPage.value = page;
};

const fetchStaffs = async () => {
  await executeWithSwal(async () => {
    const projection = {
      staff: '',
      user: '-_id surname name phone email isValid'
    }
    const response = await staffService.getAll({
      projection: JSON.stringify(projection)
    });
    staffs.value = response.data.map(data => {
      const { user, ...rest } = data; 
      return { ...user, ...rest };
    });
    
    filteredStaffs.value = staffs.value;

    return response;
  }, false, false);
};

const goToStaffAdd = () => {
  router.push({ name: 'staff-add' });
};

const handleSearch = ({ searchValue, positionFilter, statusFilter }) => {
  filteredStaffs.value = staffs.value.filter((staff) => {
    const matchesName = searchValue
      ? `${staff.surname} ${staff.name}`.toLowerCase().includes(searchValue.toLowerCase())
      : true;

    const matchesPosition =
      positionFilter === 'all' || staff.position === positionFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'valid' && staff.isValid) ||
      (statusFilter === 'invalid' && !staff.isValid);

    return matchesName && matchesPosition && matchesStatus;
  });

  currentPage.value = 1;
};

const handleDelete = async (staffId) => {
  await executeWithSwal(async () => {
    const response = await staffService.delete(staffId);
    const index = staffs.value.findIndex((staff) => staff._id === staffId);
    staffs.value.splice(index, 1);
    return response;
  }, true, true);
}

const handleChangeValidation = async ({ staffId, newStatus }) => {
  await executeWithSwal(async () => {
    const response = await staffService.updateValidation(staffId, { isValid: newStatus });
    const staff = staffs.value.find((staff) => staff._id === staffId);
    staff.isValid = newStatus;
    return response;
  }, true, true);
}

onMounted(async () => await fetchStaffs());
</script>
