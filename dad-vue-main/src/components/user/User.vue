<script setup>
import axios from 'axios';
import avatarNoneAssetURL from '@/assets/avatar-none.png';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
const storeAuth = useAuthStore()
const userStore = useUserStore();
const props = defineProps({
  user: Object,
});

const emit = defineEmits(['blockStatusChanged', 'viewTransactions', 'userDeleted','viewGames']);

const userPhotoUrl = (user) => {
  const photoFile = user?.photo_filename ?? '';
  const regex = /api$/gi;
  if (photoFile) {
    return axios.defaults.baseURL.replaceAll(regex, 'storage/photos/' + photoFile);
  }
  return avatarNoneAssetURL;
};

const toggleBlockStatus = () => {
  if (props.user) {
    userStore.toggleBlockStatus(props.user);
  }
};

const showTransactions = () => {
  emit('viewTransactions', props.user);
};

const deleteUser = async () => {
  const confirmDelete = confirm(`Are you sure you want to delete user ${props.user.nickname}?`);
  if (!confirmDelete) return;
  userStore.deleteUser(props.user.id);
  
};
const game =()=>{
  emit('viewGames', props.user)}
</script>

<template>
  <tr :key="user.nickname" class="odd:bg-gray-100 even:bg-gray-50">
    <td class="border border-gray-300 px-4 py-2">{{ user.type }}</td>
    <td class="border border-gray-300 px-4 py-2">{{ user.nickname }}</td>
    <td class="border border-gray-300 px-4 py-2">{{ user.blocked ? 'Yes' : 'No' }}</td>
    <td class="border border-gray-300 px-4 py-2">
      <img :src="userPhotoUrl(user)" class="w-10 h-10 rounded-full" alt="User Avatar" />
    </td>
    <td class="border border-gray-300 px-4 py-2">{{ user.brain_coins_balance }}</td>
    <td class="border border-gray-300 px-4 py-2 flex items-center gap-2">
      <button v-if="storeAuth.user.id != user.id"
        :class="{
          'px-2 py-1 rounded text-white w-24': true, 
          'bg-green-600 hover:bg-green-700': !user.blocked,
          'bg-red-600 hover:bg-red-700': user.blocked,
        }" 
        @click="toggleBlockStatus">
        {{ user.blocked ? 'Unblock' : 'Block' }}
      </button>
      <button v-if="user.type !== 'A'" class="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" @click="showTransactions">
        View Transactions
      </button>
      <button v-if="user.type !== 'A'" class="px-2 py-1 bg-blue-900 text-white rounded hover:bg-blue-800" @click="game">
        Games
      </button>
      <button class="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" @click="deleteUser" v-if="storeAuth.user.id != user.id">
        Delete
      </button>
    </td>
  </tr>
</template>
