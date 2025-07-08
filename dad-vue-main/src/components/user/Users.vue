<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useTransactionStore } from '@/stores/transactions';
import UserTable from '@/components/user/UserTable.vue';
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import UserGames from '@/components/user/UserGames.vue';

const userStore = useUserStore();
const userTransaction = useTransactionStore();
const selectedUser = ref(null);
const activeModal = ref(''); 
const total = ref(0);      
const page = ref(1);        
const itemsPerPage = ref(8);
const filterType = ref('All');
const filterBlocked = ref('All');
const searchQueryValue = ref('');


const fetchUsers = async (pageNumber, itemsPerPageCount, type, blocked, searchQuery = '') => {
  const response = await userStore.fetchUsers(pageNumber, itemsPerPageCount, type, blocked, searchQuery);

  if (response && Array.isArray(response.users)) {     
    total.value = response.total;      
    page.value = pageNumber;        
    itemsPerPage.value = itemsPerPageCount; 
    filterType.value = type;
    filterBlocked.value = blocked;
    searchQueryValue.value = searchQuery; 
    } else {
    console.error("Invalid data format:", response);
  }
};



const fetchUserTransactions = async (params) => {
  const { userId, page, itemsPerPage, type } = params;
  try {
    const response = await userTransaction.fetchUserTransactions({ userId, page, itemsPerPage, type });
    return response;
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    return { transactions: [], total: 0 };
  }
};


onMounted(() => {
  fetchUsers(1,8,filterType.value,filterBlocked.value);
});

const handleViewTransactions = (user) => {
  selectedUser.value = user;
  activeModal.value = 'transactions';
};

const handleViewGames = (user) => {
  selectedUser.value = user;
  activeModal.value = 'games';
};


const closeModal = () => {
  selectedUser.value = null;
  activeModal.value = '';
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen fade-in">
    <UserTable 
      :users="userStore.users" 
      :total="total" 
      :currentPage="page" 
      :itemsPerPage="itemsPerPage"
      :filterType="filterType"
      :filterBlocked="filterBlocked"
      @fetchUsers="fetchUsers" 
      @viewTransactions="handleViewTransactions" 
      @viewGames="handleViewGames" 
    />

    <!-- Modal para transações -->
    <div 
      v-if="activeModal === 'transactions'" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in"
    >
      <div 
        class="bg-white p-6 rounded-lg w-3/4 max-w-4xl shadow-lg overflow-hidden" 
        style="max-height: 90vh; overflow-y: auto;"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Transactions for {{ selectedUser?.nickname }}
          </h3>
          <button @click="closeModal" class="text-red-500">
            Close
          </button>
        </div>
        <UserTransactions 
          v-if="selectedUser" 
          :userId="selectedUser.id" 
          :fetchFn="fetchUserTransactions"
        />
      </div>
    </div>

    <div 
      v-if="activeModal === 'games'" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in"
    >
      <div 
        class="bg-white p-6 rounded-lg w-3/4 max-w-4xl shadow-lg overflow-hidden" 
        style="max-height: 90vh; overflow-y: auto;"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Games for {{ selectedUser?.nickname }}
          </h3>
          <button @click="closeModal" class="text-red-500">
            Close
          </button>
        </div>
        <UserGames v-if="selectedUser" :id="selectedUser.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in:nth-child(1) {
  animation-delay: 0.2s;
}
.fade-in:nth-child(2) {
  animation-delay: 0.4s;
}
</style>

