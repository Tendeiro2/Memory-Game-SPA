<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePaymentStore } from '@/stores/payment.js'; 
import { useErrorStore } from '@/stores/error';

const storeError = useErrorStore();
onMounted(() => {
  storeError.resetMessages();
});

const props = defineProps({
  selectedItem: Object,
});
const usePayment = usePaymentStore();

const paymentInfo = ref({
  type: '',
  reference: '',
  value: 0,
});


paymentInfo.value.value = props.selectedItem.price;


const paymentMethods = ref([
  { type: 'MBWAY', label: 'MBWAY', limit: 5 },
  { type: 'PAYPAL', label: 'PayPal', limit: 10 },
  { type: 'IBAN', label: 'IBAN', limit: 50 },
  { type: 'MB', label: 'MB', limit: 20 },
  { type: 'VISA', label: 'VISA', limit: 30 },
]);


const filteredPaymentMethods = computed(() => {
  return paymentMethods.value.filter(
    (method) => props.selectedItem.price <= method.limit
  );
});

const handlePayment = async () => {
  await usePayment.processPayment(paymentInfo, props.selectedItem.amount, 'P');
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-semibold text-center mb-8">Complete your Payment</h1>

    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <div v-if="props.selectedItem">
          <div class="mt-8 text-center">
            <label for="paymentType" class="block text-lg font-medium mb-2">Payment Type</label>
            <select v-model="paymentInfo.type" id="paymentType" class="p-2 border rounded mb-4">
              <option 
                v-for="(method, key) in filteredPaymentMethods" 
                :key="key" 
                :value="method.type">
                {{ method.label }}
              </option>
            </select>

            <label for="reference" class="block text-lg font-medium mb-2">Reference</label>
            <input 
              v-model="paymentInfo.reference" 
              id="reference" 
              type="text" 
              class="p-2 border rounded mb-4" 
              placeholder="Enter your reference" 
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage(paymentInfo.type)" />

            <label for="value" class="block text-lg font-medium mb-2">Value</label>
            <input 
              v-model="paymentInfo.value" 
              id="value" 
              type="number" 
              class="p-2 border rounded mb-4" 
              placeholder="Enter the amount to pay" 
              min="1" 
              max="99" 
              readonly 
            />

            <div class="mt-4">
              <button 
                @click="handlePayment" 
                class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-100 border p-4 rounded shadow-lg">
        <h2 class="text-lg font-semibold mb-2">Payment Limits</h2>
        <ul class="list-disc pl-4 text-sm">
          <li><strong>MBWAY:</strong> MbWay account funds are limited to 5€.</li>
          <li><strong>PAYPAL:</strong> PayPal account funds are limited to 10€.</li>
          <li><strong>IBAN:</strong> IBAN account funds are limited to 50€.</li>
          <li><strong>MB:</strong> MB account funds are limited to 20€.</li>
          <li><strong>VISA:</strong> Visa account funds are limited to 30€.</li>
        </ul>
      </div>
    </div>
  </div>
</template>
