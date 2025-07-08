<script setup>
import UserTransactions from '@/components/transaction/UserTransactions.vue';
import { useTransactionStore } from '@/stores/transactions';

const useTrans = useTransactionStore();

const fetchTransaction = async (params) => {
  const { page, itemsPerPage, type } = params;
  try {
    const response = await useTrans.fetchTransaction({ page, itemsPerPage, type });
    return response;
  } catch (error) {
    console.error('Erro ao carregar transações:', error);
    return { transactions: [], total: 0 };
  }
};
</script>

<template>
  <h2 class="text-2xl font-bold text-white mb-4 p-4 fade-in">Your Transactions</h2>
  <UserTransactions :fetchFn="fetchTransaction" class="fade-in" />
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
</style>


