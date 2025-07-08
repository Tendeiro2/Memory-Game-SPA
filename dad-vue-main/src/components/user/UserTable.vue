<script setup>
import { ref, computed, watch } from 'vue';
import User from '@/components/user/User.vue';

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
});


const filterType = ref('All');
const filterBlocked = ref('All');

const searchQuery = ref('');

const emit = defineEmits(['fetchUsers', 'viewTransactions', 'viewGames']);
const goToPageInput = ref(props.currentPage);


const updateFilters = () => {
  emit('fetchUsers',
    1,
    props.itemsPerPage,
    filterType.value,
    filterBlocked.value,
  );
};

const handleViewTransactions = (user) => {
  emit('viewTransactions', user);
};

const handleViewGame = (user) => {
  emit('viewGames', user);
};



const prevPage = () => {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1);
  }
};

const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    goToPage(props.currentPage + 1);
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.total / props.itemsPerPage);
});

const goToPage = (page) => {
  if (page !== props.currentPage) {
    emit('fetchUsers', page, props.itemsPerPage, filterType.value, filterBlocked.value);
  }
};

const goToPageDirectly = () => {
  const page = parseInt(goToPageInput.value);
  if (page >= 1 && page <= totalPages.value) {
    goToPage(page);
  }
};

watch(props.currentPage, (newPage) => {
  goToPageInput.value = newPage;
});


const searchByNickname = () => {
  emit('fetchUsers',1, props.itemsPerPage, filterType.value, filterBlocked.value, searchQuery.value);
};

</script>

<template>
  <div class="bg-gray-800 text-black p-4 rounded-lg w-full max-w-screen-lg shadow-lg">
    <div class="mb-2 flex justify-between items-center">
      <div>
        <label for="filterType" class="block text-white mb-1">User Type</label>
        <select id="filterType" v-model="filterType" @change="updateFilters" class="px-3 py-2 border rounded-lg">
          <option value="All">All</option>
          <option value="A">Administrator</option>
          <option value="P">Player</option>
        </select>
      </div>
      <h2 class="text-xl text-center font-semibold text-white">Users</h2>
      <div>
        <label for="filterBlocked" class="block text-white mb-1">Blocked</label>
        <select id="filterBlocked" v-model="filterBlocked" @change="updateFilters" class="px-3 py-2 border rounded-lg">
          <option value="All">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>


<div class="mb-4">
  <label for="searchNickname" class="block text-white mb-1">Search by Nickname</label>
  <input
  id="searchNickname"
  type="text"
  v-model="searchQuery"
  @input="searchByNickname"
  class="px-3 py-2 border rounded-lg w-full"
  placeholder="Type a nickname..."
/>
</div>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-gray-300 text-sm">
        <thead class="bg-gray-200">
          <tr>
            <th class="border border-gray-400 px-4 py-2 text-left">Type</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Nickname</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Blocked</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Photo</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Brain Coins</th>
            <th class="border border-gray-400 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <User v-for="user in props.users" :key="user.nickname" :user="user" @viewTransactions="handleViewTransactions"
            @viewGames="handleViewGame" />
          <tr v-if="props.users.length === 0">
            <td colspan="6" class="text-center text-gray-500 p-4">No users found.</td>
          </tr>
        </tbody>
      </table>


      <!-- navigate buttons -->
      <div class="flex justify-center mt-4 space-x-4">
        <button class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600" @click="goToPage(1)"
          :disabled="props.currentPage === 1">
          First
        </button>

        <button class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600" @click="prevPage"
          :disabled="props.currentPage === 1">
          Prev
        </button>

        <div class="flex items-center space-x-2">
          <span class="text-white">Page {{ props.currentPage }} of {{ totalPages }}</span>
          <input
            type="number"
            min="1"
            :max="totalPages"
            v-model="goToPageInput"
            class="w-16 p-2 rounded border border-gray-500 bg-gray-700 text-white text-center focus:outline-none focus:ring focus:ring-blue-500"
            @input="goToPageDirectly"
            placeholder="Go" />
        </div>


        <button class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600" @click="nextPage"
          :disabled="props.currentPage === totalPages">
          Next
        </button>

        <button class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600" @click="goToPage(totalPages)"
          :disabled="props.currentPage === totalPages">
          Last
        </button>
      </div>
    </div>
  </div>
</template>