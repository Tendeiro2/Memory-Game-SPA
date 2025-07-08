import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const storeAuth = useAuthStore()
  const { toast } = useToast()
  const storeError = useErrorStore()

  const users = ref([])
  const userDetails = ref(null)

  const totalUsers = computed(() => {
    return users.value.length
  })

  const fetchUsers = async (page, itemsPerPage, filterType = '', filterBlocked = '', searchQuery = '') => {
    storeError.resetMessages();
    try {
      const response = await axios.get('users', {
        params: {
          page,
          itemsPerPage,
          blocked: filterBlocked,
          type: filterType,
          search: searchQuery,
        },
      });
      users.value = response.data.users;
      return response.data;
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching users!'
      );
    }
  };
  

  const createUser = async (createData) => {
    storeError.resetMessages();
    try {
      const response = await axios.post(`/users`, createData);
      const createdUser = response.data;
      toast({
        title: 'Success!',
        description: createdUser.data.nickname + ' : created successfully.',
      });
      router.push({ name: 'login' });
      return createdUser;
    } catch (e) {
      if(e.response?.status === 422){
        storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status, 'Error creating user!');
      }else{
        toast({ title: 'Email or Nickname already exists, please change it', variant: 'destructive' });
      }
        return null;
    }
  };

  const createAdmin = async (createData) => {
    try {
      const response = await axios.post(`/users/admin`, createData);
      const createdAdmin = response.data;
      toast({
        title: 'Success!',
        description: createdAdmin.data.nickname + ' : created successfully.',
      });
      router.push({ name: 'users' });
      return createdAdmin;
    } catch (e) {
      if(e.response?.status === 422){
        storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status, 'Error creating user!');
      }else{
        toast({ title: 'Email or Nickname already exists, please change it', variant: 'destructive' });
      }
        return null;
    }
  };

  const updateUserAll = async (userId, updatedData) => {
    try {
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key] === '' || updatedData[key] === null || 
          updatedData[key] === undefined) {
            delete updatedData[key];
        }
      });
      const response = await axios.patch(`/users/${userId}`, updatedData);
      const updatedUser = response.data;
      toast({
        title: 'Success!',
        description: updatedUser.data.nickname + ' : updated successfully.',
      });
      storeAuth.user = updatedUser.data
      router.push({ name: 'home' })
      return updatedUser;
    } catch (e) {
        storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status, 'Error updating user!');
        return null;
    }
  };

  const updateUser = async (userId, updatedData) => {
    try {
      updatedData.blocked = updatedData.blocked === true || updatedData.blocked === 'true'; 
      const response = await axios.put(`/users/${userId}`, updatedData);
      const updatedUser = response.data;
      toast({
        title: 'Success!',
        description: updatedUser.data.nickname + ' : updated successfully.',
      });
      return updatedUser;
    } catch (e) {
        storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status, 'Error updating user!');
        return null;
    }
  };
  
  const fetchUser = async (userId) => {
    storeError.resetMessages()
    try {
      const response = await axios.get(`/users/${userId}`)
      const userIndex = users.value.findIndex(user => user.id === userId);
      users[userIndex].value = response.data
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching user!'
      )
      return null
    }
  }

  const fetchUserGames = async (userId, page = 1, itemsPerPage = 10, type = '', status = '') => {
    storeError.resetMessages();
    try {
        const response = await axios.get(`/users/${userId}/games`, {
            params: { page, itemsPerPage, type, status },
        });
        return response.data;
    } catch (e) {
        storeError.setErrorMessages(
            e.response?.data?.message,
            e.response?.data?.errors,
            e.response?.status,
            'Error fetching user games!'
        );
        return { games: [], total: 0 };
    }
};

  const fetchUserSingleplayerGames = async (userId) => {
    storeError.resetMessages()
    try {
      const response = await axios.get(`/users/${userId}/singleplayerGames`)
      return response.data 
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching singleplayer games!'
      )
      return []
    }
  }

  const fetchUserMultiplayerGames = async (userId) => {
    storeError.resetMessages()
    try {
      const response = await axios.get(`/users/${userId}/multiplayerGames`)
      return response.data 
    } catch (e) {
      storeError.setErrorMessages(
        e.response?.data?.message,
        e.response?.data?.errors,
        e.response?.status,
        'Error fetching multiplayer games!'
      )
      return []
    }
  }
  const toggleBlockStatus = async (user) => {
    try {
      const updatedData = {
        name: user.name, 
        email: user.email, 
        nickname: user.nickname,
        blocked: !user.blocked, 
      };
      const updatedUser = await updateUser(user.id, updatedData);
      const userIndex = users.value.findIndex((u) => u.id === user.id);
      if (userIndex >= 0) {
        users.value[userIndex] = { ...users.value[userIndex], ...updatedUser.data };
      }
      toast({
        title: 'Success!',
        description: 'User: ' + users.value[userIndex].nickname + ' field blocked updated successfully.',
      });
    
    } catch (e) {
      storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status,"Error updating user's blocked field!");
    }
  }

  const checkBeforeDelete = async (userId, updatedData) => {
    storeError.resetMessages(); 
    try {
      const response = await axios.post(`/users/${userId}/delete`, updatedData);
      const message = response.status
      if (message === 200 || 204){
        toast({
          title: 'Success!',
          description: 'Conta apagada com sucesso.',
          status: 'sucess'
        });
      }
      router.push({ name: 'home' })
      return true
    } catch (e) {
      const statusCode = e.response?.status;
      if (statusCode === 403) {
        toast({
          title: 'Erro!',
          description: 'Senha incorreta! Tente novamente.',
          status: 'error',
          variant: 'destructive',
        });
      } else{
        toast({
          title: 'Erro!',
          description: e.response?.data?.message || 'Erro ao apagar a conta. Tente novamente mais tarde.',
          status: 'error',
          variant: 'destructive',
        });
      }
      return false;
    }
  };

  const deleteUser = async (userId) => {
    storeError.resetMessages(); 
    try {
      const response = await axios.delete(`/users/${userId}`);
      const userIndex = users.value.findIndex((user) => user.id === userId);
      if (userIndex >= 0) {
        users.value.splice(userIndex, 1);
      }
  
      const message = response.status === 204 
        ? 'User permanently deleted successfully.' 
        : 'User has transactions or games, soft deleted.';
        
      toast({
        title: 'Success!',
        description: message,
      });
  
      return true;
    } catch (e) {
      storeError.setErrorMessages(e.response?.data?.message, e.response?.data?.errors, e.response?.status,"Error updating user's blocked field!");
      return false;
    }
  };

  const fetchPersonalScoreboard = async () => {
    try {
      const response = await axios.get('/scoreboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching personal scoreboard:', error);
      return {
        single_player: [],
        multiplayer: { total_victories: 0, total_losses: 0 },
      };
    }
  };

  const fetchAuthenticatedGameHistory = async (params) => {
    const { page, itemsPerPage, type, board } = params;
    const response = await axios.get('/games-history', {
      params: { page, itemsPerPage, type, board },
    });
    return response.data;
  };
  
  return {
    users,
    userDetails,
    totalUsers,
    fetchUsers,
    fetchUser,
    fetchUserSingleplayerGames,
    fetchUserMultiplayerGames,
    createUser,
    createAdmin,
    updateUserAll,
    updateUser,
    toggleBlockStatus,
    fetchPersonalScoreboard,
    fetchAuthenticatedGameHistory,
    checkBeforeDelete,
    deleteUser,
    fetchUserGames,
  }
})