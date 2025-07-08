<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import PaymentForm from '@/components/shop/PaymentForm.vue';

const storeAuth = useAuthStore();

const items = ref([
  {
    id: 1,
    name: 'Small Pack of BrainCoins',
    description: 'Get 50 BrainCoins.',
    price: 5, 
    amount: 50,
  },
  {
    id: 2,
    name: 'Medium Pack of BrainCoins',
    description: 'Get 150 BrainCoins.',
    price: 10,
    amount: 150,
  },
  {
    id: 3,
    name: 'Large Pack of BrainCoins',
    description: 'Get 300 BrainCoins.',
    price: 15,
    amount: 300,
  },
  {
    id: 4,
    name: 'Christmas Special Pack of BrainCoins',
    description: 'Get 400 BrainCoins with a festive touch! 🎄',
    price: 12,
    amount: 400,
  },
]);

const selectedItem = ref(null);
const showPaymentForm = ref(false);

const buyItem = (item) => {
  selectedItem.value = item;
  showPaymentForm.value = true;
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-semibold text-white text-center mb-8 fade-in">Welcome to the Coin Shop</h1>

    <div class="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="fade-in"
        :class="{
          'bg-gray-300': item.id !== 4,
          'bg-red-500 text-white': item.id === 4,
          'rounded-lg shadow-md p-4 hover:shadow-lg transition-all': true
        }">
        <h2 class="text-xl font-semibold mb-2">{{ item.name }}</h2>
        <p class="text-black mb-4">{{ item.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold">{{ item.price }} $</span>
          <button v-if="storeAuth.user ? storeAuth.user.type == 'P' : false"
            @click="buyItem(item)" 
            class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Buy
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPaymentForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-3/4 max-w-4xl shadow-lg overflow-hidden fade-in" style="max-height: 90vh; overflow-y: auto;">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Transactions for {{ selectedItem.description }}
          </h3>
          <button @click="showPaymentForm = false" class="text-red-500">
            Close
          </button>
        </div>
        <PaymentForm v-if="selectedItem" :selectedItem="selectedItem"/>
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
</style>
