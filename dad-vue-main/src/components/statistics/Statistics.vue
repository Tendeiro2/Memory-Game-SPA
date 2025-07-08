<script setup>
import { onMounted, ref } from 'vue';
import { useStatisticsStore } from '@/stores/statistics';
import { Chart, registerables } from 'chart.js';
import { useAuthStore } from '@/stores/auth';

Chart.register(...registerables);

const statisticsStore = useStatisticsStore();
const storeAuth = useAuthStore();

const gamesDisplayType = ref('month');
const purchasesDisplayType = ref('month');

const nickname = ref('');
const playerPurchases = ref(null);

let gamesChartInstance = null;
let purchasesChartInstance = null;

let paymentChartInstance = null;

let spendingChartInstance = null;
let gamesMonthChartInstance = null;
let gamesWeekChartInstance = null;

onMounted(async () => {
  await statisticsStore.fetchStatistics();
  await statisticsStore.fetchGamesPerMonth();
  await statisticsStore.fetchPurchasesPerMonth();
  await statisticsStore.fetchGamesPerWeek();
  await statisticsStore.fetchPurchasesPerWeek();
  if (storeAuth.user?.type === 'A') {
    await statisticsStore.fetchPaymentTypes();
    await statisticsStore.fetchPaymentValues();
    renderPaymentChart();
    renderGamesChart();
    renderPurchasesChart();
    renderSpendingChart(); 
  }else {
    renderGamesMonthChart();
    renderGamesWeekChart();
  }
});

const searchPlayerPurchases = async () => {
  if (!nickname.value.trim()) {
    playerPurchases.value = null;
    return;
  }
  await statisticsStore.fetchPurchasesByPlayer(nickname.value);
  playerPurchases.value = statisticsStore.playerPurchases;
};


const renderGamesChart = () => {
  const ctx = document.getElementById('gamesChart').getContext('2d');

  const labels =
    gamesDisplayType.value === 'month'
      ? statisticsStore.gamesPerMonthData.map((item) => `${item.year}-${item.month.toString().padStart(2, '0')}`)
      : statisticsStore.gamesPerWeekData.map((item) => `${item.week} of ${item.year}`);

  const data =
    gamesDisplayType.value === 'month'
      ? statisticsStore.gamesPerMonthData.map((item) => item.total_games)
      : statisticsStore.gamesPerWeekData.map((item) => item.total_games);

  if (gamesChartInstance) gamesChartInstance.destroy();

  gamesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: `Games Played by ${gamesDisplayType.value === 'month' ? 'Month' : 'Week'}`,
          data,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Games Played',
        },
        legend: {
          display: false,
        },
      },
    },
  });
};

const renderGamesMonthChart = () => {
  const ctx = document.getElementById('gamesMonthChart').getContext('2d');

  const labels = statisticsStore.gamesPerMonthData.map((item) => `${item.year}-${item.month.toString().padStart(2, '0')}`);
  const data = statisticsStore.gamesPerMonthData.map((item) => item.total_games);

  if (gamesMonthChartInstance) gamesMonthChartInstance.destroy();

  gamesMonthChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Games Played Per Month',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Games Played Per Month',
        },
        legend: {
          display: false,
        },
      },
    },
  });
};

const renderGamesWeekChart = () => {
  const ctx = document.getElementById('gamesWeekChart').getContext('2d');

  const labels = statisticsStore.gamesPerWeekData.map((item) => `${item.week} of ${item.year}`);
  const data = statisticsStore.gamesPerWeekData.map((item) => item.total_games);

  if (gamesWeekChartInstance) gamesWeekChartInstance.destroy();

  gamesWeekChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Games Played Per Week',
          data,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderWidth: 2,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Games Played Per Week',
        },
        legend: {
          display: false,
        },
      },
    },
  });
};

  const renderPurchasesChart = () => {
    const ctx = document.getElementById('purchasesChart').getContext('2d');

    const labels =
      purchasesDisplayType.value === 'month'
        ? statisticsStore.purchasesPerMonthData.map((item) => `${item.year}-${item.month.toString().padStart(2, '0')}`)
        : statisticsStore.purchasesPerWeekData.map((item) => `${item.week} of ${item.year}`);

    const data =
      purchasesDisplayType.value === 'month'
        ? statisticsStore.purchasesPerMonthData.map((item) => item.total_purchases)
        : statisticsStore.purchasesPerWeekData.map((item) => item.total_purchases);

    if (purchasesChartInstance) purchasesChartInstance.destroy();

    purchasesChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Purchase by ${purchasesDisplayType.value === 'month' ? 'Month' : 'Week'}`,
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Purchases',
          },
          legend: {
            display: false,
          },
        },
      },
    });
  };

  const renderPaymentChart = () => {
    const ctx = document.getElementById('paymentChart').getContext('2d');

    const labels = statisticsStore.paymentTypeData.map((item) => item.payment_type);
    const data = statisticsStore.paymentTypeData.map((item) => item.total);

    if (paymentChartInstance) paymentChartInstance.destroy(); 

    paymentChartInstance = new Chart(ctx, { 
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Most Used Payment Method',
          },
          legend: {
            position: 'top',
          },
        },
      },
    });
  };


const renderSpendingChart = () => {
  const ctx = document.getElementById('spendingChart').getContext('2d');

  const labels = statisticsStore.paymentValuesData.map(
    (item) => `${item.year}-${item.month.toString().padStart(2, '0')}`
  );
  const data = statisticsStore.paymentValuesData.map((item) => item.total);

  if (spendingChartInstance) spendingChartInstance.destroy();

  spendingChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Gain (€)',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Total Gain by Month',
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value €',
          },
          beginAtZero: true,
        },
      },
    },
  });
};

</script>
<template>
<div class="p-6 bg-gray-800 text-white rounded-lg mx-auto max-w-6xl mt-12 fade-in">
    <h2 class="text-2xl mb-6 text-center font-bold">Statistics</h2>
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
      <div class="bg-gray-300 text-black rounded-lg p-6 flex flex-col justify-center items-center shadow-md">
        <h3 class="text-lg font-bold text-center">Total Number of Players Registered</h3>
        <p class="text-2xl font-semibold text-center mt-2">{{ statisticsStore.totalUsers }}</p>
      </div>
      <div class="bg-gray-300 text-black rounded-lg p-6 flex flex-col justify-center items-center shadow-md">
        <h3 class="text-lg font-bold text-center">Total Games Played</h3>
        <p class="text-2xl font-semibold text-center mt-2">{{ statisticsStore.totalGames }}</p>
      </div>
      <div class="bg-gray-300 text-black rounded-lg p-6 flex flex-col justify-center items-center shadow-md">
        <h3 class="text-lg font-bold text-center">Most Played Board</h3>
        <p class="text-2xl font-semibold text-center mt-2">{{ statisticsStore.mostPlayedBoard }}</p>
      </div>
      <div
        v-if="storeAuth.user?.type === 'A'"
        class="bg-gray-300 text-black rounded-lg p-6 flex flex-col justify-center items-center shadow-md"
      >
        <h3 class="text-lg font-bold text-center">Total Purchases</h3>
        <p class="text-2xl font-semibold text-center mt-2">{{ statisticsStore.totalPurchases }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
      <div
        v-if="storeAuth.user?.type === 'A'"
        class="bg-gray-300 text-black rounded-lg p-6 shadow-md"
      >
        <div class="w-full h-80">
          <canvas id="paymentChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div
        v-if="storeAuth.user?.type === 'A'"
        class="bg-gray-300 text-black rounded-lg p-6 shadow-md"
      >
        <div class="w-full h-80">
          <canvas id="spendingChart" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>

    <div v-if="storeAuth.user?.type === 'A'" class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">

      <div class="bg-gray-300 text-black rounded-lg p-4 shadow-md">
        <div class="text-center mb-4">
          <button
            @click="gamesDisplayType = 'month'; renderGamesChart()"
            :class="{
              'bg-blue-600 text-white border-blue-600': gamesDisplayType === 'month',
              'bg-gray-300 text-black border-gray-500 hover:bg-gray-400': gamesDisplayType !== 'month'
            }"
            class="px-4 py-2 mx-2 rounded border-2 transition-colors"
          >
            Month
          </button>
          <button
            @click="gamesDisplayType = 'week'; renderGamesChart()"
            :class="{
              'bg-blue-600 text-white border-blue-600': gamesDisplayType === 'week',
              'bg-gray-300 text-black border-gray-500 hover:bg-gray-400': gamesDisplayType !== 'week'
            }"
            class="px-4 py-2 mx-2 rounded border-2 transition-colors"
          >
            Week
          </button>
        </div>
        <canvas id="gamesChart" width="400" height="200"></canvas>
      </div>

      <div class="bg-gray-300 text-black rounded-lg p-4 shadow-md">
        <div class="text-center mb-4">
          <button
            @click="purchasesDisplayType = 'month'; renderPurchasesChart()"
            :class="{
              'bg-blue-600 text-white border-blue-600': purchasesDisplayType === 'month',
              'bg-gray-300 text-black border-gray-500 hover:bg-gray-400': purchasesDisplayType !== 'month'
            }"
            class="px-4 py-2 mx-2 rounded border-2 transition-colors"
          >
            Month
          </button>
          <button
            @click="purchasesDisplayType = 'week'; renderPurchasesChart()"
            :class="{
              'bg-blue-600 text-white border-blue-600': purchasesDisplayType === 'week',
              'bg-gray-300 text-black border-gray-500 hover:bg-gray-400': purchasesDisplayType !== 'week'
            }"
            class="px-4 py-2 mx-2 rounded border-2 transition-colors"
          >
          Week
          </button>
        </div>
        <canvas id="purchasesChart" width="400" height="200"></canvas>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <div class="bg-gray-300 text-black rounded-lg p-6 shadow-md -mt-8">
        <canvas id="gamesMonthChart" width="400" height="200"></canvas>
      </div>
      <div class="bg-gray-300 text-black rounded-lg p-6 shadow-md -mt-8">
        <canvas id="gamesWeekChart" width="400" height="200"></canvas>
      </div>
    </div>

    <div v-if="storeAuth.user?.type === 'A'" class="bg-gray-300 text-black rounded-lg p-6 shadow-md">
      <h3 class="text-lg font-bold text-center mb-4">Search Purchases by Player</h3>
      <div class="flex items-center space-x-4">
        <input
          v-model="nickname"
          @input="searchPlayerPurchases"
          type="text"
          placeholder="Write nickname"
          class="px-4 py-2 border border-gray-400 rounded-lg w-full"
        />
      </div>
      <div v-if="playerPurchases !== null" class="mt-4 text-center">
        <p class="text-xl font-bold">
          Total Purchases "{{ nickname }}":
          <span class="text-green-600">{{ playerPurchases }} €</span>
        </p>
      </div>
      <div v-else class="mt-4 text-center text-gray-500">Enter a valid nickname to search.</div>
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
