<script setup>
import { useMemoryGame } from '@/composable/memoryGame.js'
import Cell from './Cell.vue'
import { computed, ref } from 'vue';
import { useGameStore } from '@/stores/games';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const gameStore = useGameStore();
const authStore = useAuthStore();
const router = useRouter()
gameStore.fetchBoards();

const selectedBoard = ref(gameStore.boards[0]);

const gridClass = computed(() => {
  return {
    'grid-cols-3 grid-cols-[100px_100px_100px]': numCols.value == 3,
    'grid-cols-4 grid-cols-[120px_120px_120px_120px]': numCols.value == 4,
    'grid-cols-6 grid-cols-[84px_84px_84px_84px_84px_84px]': numCols.value == 6,
  };
});

const {
  status,
  board,
  matched,
  gameTimer,
  gameTime,
  numCols,
  numRows,
  boardId,
  start,
  move,
} = useMemoryGame();



const updateBoard = () => {
  if (selectedBoard.value.id > 1 && authStore.brain_coins_balance < 1) {
    authStore.brainCoinsBalanceError(1)
    return;
  }

  numCols.value = selectedBoard.value.numCols;
  numRows.value = selectedBoard.value.numRows;
  boardId.value = selectedBoard.value.id;
  start();
};

const restart = () => {
  updateBoard();
};

start();

</script>

<template>
  <div class="p-4 mx-auto max-w-3xl min-w-96">
    <div class="my-4 p-3 flex items-center bg-gray-700 rounded-xl justify-between">
      <p class="text-center text-white text-xl px-2" v-show="authStore.user && !status">
        Select Board:
      </p>
      <select v-model="selectedBoard" @change="updateBoard" class="px-4 py-2 rounded bg-gray-800 text-white "
        v-show="!status && authStore.user">
        <option v-for="option in gameStore.boards" :key="option.label" :value="option">
          {{ option.label }}
        </option>
      </select>
      <div class="grow flex-col">
        <p class="text-center text-white text-xl font-bold" v-show="status">
          Game Time: {{ gameTimer || gameTime }}
        </p>
        <p class="text-center text-white text-lg" v-show="!status">
          Click on a card to start playing
        </p>
        <p class="text-center text-white text-lg" v-show="status == 1">
          You win!
        </p>
      </div>
      <button @click="restart"
        class="ml-4 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md" v-show="status == 1">
        Restart
      </button>
    </div>
  </div>
  <div class="grid  justify-center" :class="gridClass">
    <Cell v-for="cell in board" :key="cell.id" :matched="matched" :cell="cell" @card="move">
    </Cell>
  </div>
</template>
