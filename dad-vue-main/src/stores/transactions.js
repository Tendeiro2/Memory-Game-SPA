import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'

export const useTransactionStore = defineStore('transaction', () => {
    const storeError = useErrorStore()
    const transactions = ref([])

    const totalTransactions = computed(() => {
        return transactions.value.length
    })

    const fetchTransactions = async () => {
        storeError.resetMessages();
        try {
          const response = await axios.get('transactions');
      
          if (Array.isArray(response.data)) {
            transactions.value = response.data; 
          } else {
            console.error('Invalid data format:', response.data);
            transactions.value = []; 
          }
        } catch (e) {
          storeError.setErrorMessages(e.response?.data?.message,e.response?.data?.errors,e.response?.status,'Error fetching transactions!');
        }
      };
      
      const fetchTransaction = async (params) => {
        const { page, itemsPerPage, type } = params;
        try {
          const response = await axios.get('/transactions', {
            params: { page, itemsPerPage, type },
          });
          if (response.data.transactions && Array.isArray(response.data.transactions)) {
            return response.data;
          } else {
            console.warn('Resposta da API não é válida');
            return { transactions: [], total: 0 };
          }
        } catch (e) {
          console.error('Erro ao buscar transações:', e);
          return { transactions: [], total: 0 };
        }
      };

      const fetchUserTransactions = async (params) => {
        const { page, itemsPerPage, type, userId } = params;
        try {
            const response = await axios.get(`/users/${userId}/transactions`, {
                params: { page, itemsPerPage, type, userId },
            });
            if (response.status === 200) {
                return response.data;
            } else {
                console.warn('Erro inesperado na resposta da API');
                return [];
            }
        } catch (error) {
            console.error('Erro ao buscar transações do usuário:', error);
            throw error;
        }
      };
      
      const insertTransaction = async (transaction) => {
        storeError.resetMessages();
        try {
            const response = await axios.post('/transactions', transaction);
            transactions.value.push(response.data.data);
            return response.data.data;
        } catch (e) {
            storeError.setErrorMessages(
                e.response?.data?.message || 'An unexpected error occurred.',
                e.response?.data?.errors || null,
                e.response?.status || 500,
                'Error creating transaction!'
            );
            return false;
        }
    };
    return {
        transactions, totalTransactions,
        fetchTransactions, fetchTransaction,
        insertTransaction,fetchUserTransactions,
    }
})
