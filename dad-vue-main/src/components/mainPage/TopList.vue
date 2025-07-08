<script setup>
import { ref, onMounted } from 'vue';
import { useGameStore } from '@/stores/games';
import axios from 'axios';

const gameStore = useGameStore();
const selectedBoardSP = ref(null);
const selectedBoardMP = ref(null);
const boards = ref([]);
const singlePlayerGames = ref([]);
const multiplayerGames = ref([]);
const minTurns = ref(null);
const sortBy = ref('total_time');


const fetchBoards = async () => {
  await gameStore.fetchBoards();
  boards.value = gameStore.boards;
  selectedBoardSP.value = boards.value.find((board) => board.label === '3x4');
  selectedBoardMP.value = boards.value.find((board) => board.label === '3x4');
};

const fetchGamesSP = async () => {
  if (selectedBoardSP.value) {
    try {
      const response = await axios.get('/games/topSinglePlayer', {
        params: {
          board_id: selectedBoardSP.value.id || null,
          sort_by: sortBy.value,
        },
      });

      singlePlayerGames.value = response.data.top_games.map((game) => ({
        nickname: game.user.nickname,
        value: sortBy.value === 'total_time' ? `${game.total_time}s` : game.total_turns_winner,
        board: `${game.board.board_cols}x${game.board.board_rows}`,
      }));

      minTurns.value = response.data.min_turns;
    } catch (error) {
      console.error('Erro ao buscar top Single Player:', error);
    }
  }
};

const fetchGamesMP = async () => {
  if (selectedBoardMP.value) {
    await gameStore.fetchTopMultiplayerGames(selectedBoardMP.value.id || null);
    multiplayerGames.value = gameStore.games;
  }
};

onMounted(async () => {
  await fetchBoards();
  await fetchGamesSP();
  await fetchGamesMP();
});

const handleBoardChangeSP = async () => {
  await fetchGamesSP();
};

const handleSortChangeSP = async () => {
  await fetchGamesSP();
};

const handleBoardChangeMP = async () => {
  await fetchGamesMP();
};
</script>

<template>
  <div class="p-8 text-white rounded-lg mx-auto w-full max-w-screen-2xl space-y-10 overflow-x-auto">
    <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Top Single-Player</h2>
        <div class="flex items-center space-x-4">
          <select
            v-model="sortBy"
            @change="handleSortChangeSP"
            class="px-3 py-2 bg-gray-600 text-white rounded text-sm"
          >
            <option value="total_time">Time</option>
            <option value="total_turns_winner">Turns</option>
          </select>
          <select
            v-model="selectedBoardSP"
            @change="handleBoardChangeSP"
            class="px-3 py-2 bg-gray-600 text-white rounded text-sm"
          >
            <option
              v-for="board in boards"
              :key="board.id"
              :value="board"
            >
              {{ board.label }}
            </option>
          </select>

          
        </div>
      </div>

      <div class="overflow-x-auto mx-auto w-full">
        <table class="w-full text-left border-collapse rounded-lg table-fixed text-sm">
          <thead>
            <tr class="bg-gray-600 text-white uppercase">
              <th class="px-3 py-2 w-1/3">Nickname</th>
              <th class="px-3 py-2 w-1/3">{{ sortBy === 'total_time' ? 'Time' : 'Turns' }}</th>
              <th class="px-3 py-2 w-1/3">Board</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(game, index) in singlePlayerGames"
              :key="game.nickname"
              :class="index === 0 ? 'bg-yellow-500 text-black font-bold' : 
                       index === 1 ? 'bg-gray-400 text-black font-bold' : 
                       index === 2 ? 'bg-orange-400 text-black font-bold' : 
                       'odd:bg-gray-600 even:bg-gray-500'"
            >
              <td class="px-3 py-2 w-1/3 flex items-center">
                <span v-if="index === 0">🏆</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span class="ml-1">{{ game.nickname }}</span>
              </td>
              <td class="px-3 py-2 w-1/3">{{ game.value }}</td>
              <td class="px-3 py-2 w-1/3">{{ game.board }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Top Multiplayer</h2>
        <select
          v-model="selectedBoardMP"
          @change="handleBoardChangeMP"
          class="px-3 py-2 bg-gray-600 text-white rounded text-sm"
        >
          <option
            v-for="board in boards"
            :key="board.id"
            :value="board"
          >
            {{ board.label }}
          </option>
        </select>
      </div>

      <div class="overflow-x-auto mx-auto w-full">
        <table class="w-full text-left border-collapse rounded-lg table-fixed text-sm">
          <thead>
            <tr class="bg-gray-600 text-white uppercase">
              <th class="px-3 py-2 w-1/3">Nickname</th>
              <th class="px-3 py-2 w-1/3">Wins</th>
              <th class="px-3 py-2 w-1/3">Board</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(game, index) in multiplayerGames"
              :key="game.nickname"
              :class="index === 0 ? 'bg-yellow-500 text-black font-bold' : 
                       index === 1 ? 'bg-gray-400 text-black font-bold' : 
                       index === 2 ? 'bg-orange-400 text-black font-bold' : 
                       'odd:bg-gray-600 even:bg-gray-500'"
            >
              <td class="px-3 py-2 w-1/3 flex items-center">
                <span v-if="index === 0">🏆</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span class="ml-1">{{ game.nickname }}</span>
              </td>
              <td class="px-3 py-2 w-1/3">{{ game.wins }}</td>
              <td class="px-3 py-2 w-1/3">{{ game.board }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
