<script setup>
import TopList from '@/components/mainPage/TopList.vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';


const storeAuth = useAuthStore();
</script>

<template>
  <div class="relative flex flex-col lg:flex-row items-center justify-center mt-1 space-y-5 lg:space-y-0 lg:space-x-10 fade-in">
    <div class="w-full lg:max-w-2xl lg:mr-10">
      <TopList />
    </div>

    <div class="flex flex-col space-y-5 w-full lg:w-1/4">
      <div 
        v-if="!storeAuth.user || storeAuth.user.type !== 'A'" 
        class="bg-blue-600 text-white p-6 rounded hover:bg-blue-500 transition-all w-full transform hover:scale-105 button-animate">
        <RouterLink to="/singleplayer" class="block text-center">
          <div class="flex items-center justify-center space-x-2">
            <p class="text-2xl lg:text-3xl font-bold">Single-Player</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6 lg:w-8 lg:h-8">
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.31 0-10 1.67-10 5v2h20v-2c0-3.33-6.69-5-10-5z" />
            </svg>
          </div>
          <p class="text-sm lg:text-lg mt-2">Play now and challenge your memory!</p>
        </RouterLink>
      </div>

      <RouterLink to="/multiplayer" class="block text-center">
        <div 
          v-if="storeAuth.user && storeAuth.user.type !== 'A'"
          class="bg-gray-600 text-white p-6 rounded w-full cursor-pointer transform hover:scale-105 button-animate">
          <div class="flex items-center justify-center space-x-2">
            <p class="text-2xl lg:text-3xl font-bold">Multiplayer</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6 lg:w-8 lg:h-8">
              <path
                d="M16.5 12c2.485 0 4.5-2.015 4.5-4.5S18.985 3 16.5 3 12 5.015 12 7.5 14.015 12 16.5 12zM7.5 12c2.485 0 4.5-2.015 4.5-4.5S9.985 3 7.5 3 3 5.015 3 7.5 5.015 12 7.5 12zM7.5 14C4.467 14 0 15.285 0 18v3h15v-3c0-2.715-4.467-4-7.5-4zM16.5 14c-.251 0-.525.015-.815.04.972.754 1.815 1.747 1.815 2.96v3h6v-3c0-2.715-4.467-4-7.5-4z"
              />
            </svg>
          </div>
        </div>
      </RouterLink>

      <div
        v-if="!storeAuth.user"
        class="bg-gray-600 text-white p-6 rounded w-full text-center cursor-not-allowed"
      >
        <div class="flex items-center justify-center space-x-2">
          <p class="text-2xl lg:text-3xl font-bold text-center">Multiplayer</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6 lg:w-8 lg:h-8">
            <path
              d="M16.5 12c2.485 0 4.5-2.015 4.5-4.5S18.985 3 16.5 3 12 5.015 12 7.5 14.015 12 16.5 12zM7.5 12c2.485 0 4.5-2.015 4.5-4.5S9.985 3 7.5 3 3 5.015 3 7.5 5.015 12 7.5 12zM7.5 14C4.467 14 0 15.285 0 18v3h15v-3c0-3.33-6.69-5-10-5zM16.5 14c-.251 0-.525.015-.815.04.972.754 1.815 1.747 1.815 2.96v3h6v-3c0-3.33-6.69-5-10-5z"
            />
          </svg>
        </div>
        <p class="text-sm lg:text-lg text-center mt-2">Log in to unlock this game mode!!</p>
      </div>

      <div class="bg-emerald-700 text-white p-4 rounded hover:bg-emerald-600 transition-all w-full transform hover:scale-105 button-animate">
        <RouterLink to="/statistics" class="block text-center">
          <p class="text-2xl lg:text-3xl font-bold">Statistics 📊</p>
        </RouterLink>
      </div>

      <div class="bg-yellow-600 text-white p-4 rounded hover:bg-yellow-500 transition-all w-full transform hover:scale-105 button-animate">
        <RouterLink to="/shop" class="block text-center">
          <p class="text-2xl lg:text-3xl font-bold">Shop 💰</p>
        </RouterLink>
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

.button-animate {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.button-animate:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>
