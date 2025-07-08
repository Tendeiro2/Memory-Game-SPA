import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/mainPage/Home.vue'   
import SinglePlayer from '@/components/singlePlayer/SinglePlayer.vue'
import Login from '@/components/auth/Login.vue'
import Statistics from '@/components/statistics/Statistics.vue'
import Scoreboard from '@/components/scoreboard/Scoreboard.vue'
import GameHistory from '@/components/game/GameHistory.vue'
import Shop from '@/components/shop/shop.vue'
import Transactions from '@/components/transaction/Transactions.vue'
import Users from '@/components/user/Users.vue'
import UserUpdate from '@/components/user/UserUpdate.vue'
import { useAuthStore } from '@/stores/auth'
import MultiPlayer from '@/components/multiplayer/MultiPlayer.vue'
import LobbyRoom from '@/components/multiplayer/LobbyRoom.vue'
import Game from '@/components/multiplayer/Game.vue'
import UserCreate from '@/components/user/UserCreate.vue'
import UserCreateAdmin from '@/components/user/UserCreateAdmin.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      redirect:{name:'home'}
    },
    {
      path: '/singleplayer',
      name: 'SinglePlayer',
      component: SinglePlayer
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
      {
      path: '/statistics',
      name: 'Statistics',
      component: Statistics,
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions 
    },
    {
      path: '/users',
      name: 'users',
      component: Users 
    },
    { path: '/scoreboard', 
      name: 'Scoreboard', 
      component: Scoreboard 
    },
    {
      path: '/gamehistory',
      name: 'GameHistory',
      component: GameHistory
    },
    {
      path: '/shop',
      name: 'shop',
      component: Shop 
    },
    {
      path: '/update',
      name: 'update',
      component: UserUpdate,
    },
    {
      path: '/multiplayer',
      name: 'MultiPlayer',
      component: MultiPlayer,
    },
    {
      path: '/lobby',
      name: 'Lobby',
      component: LobbyRoom,
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
    },
    {
      path: '/register',
      name: 'register',
      component: UserCreate,
    },
    {
      path: '/registerAdmin',
      name: 'registerAdmin',
      component: UserCreateAdmin,
    },

  ]
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
  const storeAuth = useAuthStore()
  if (handlingFirstRoute) {
      handlingFirstRoute = false
      await storeAuth.restoreToken()
  }
  
  const requiresAuth = ['users', 'Transactions', 'Scoreboard', 'GameHistory', 'MultiPlayer','update', 'registerAdmin'];
  const admin = ['users', 'registerAdmin'];
  const player = ['Scoreboard','Transactions','GameHistory']; 
  const notAccessible = ['Game']
  const adminRestricted = ['SinglePlayer', 'MultiPlayer', 'register'];
  const user = ['register'];
  
  if(notAccessible.includes(to.name) && from.name != 'Lobby'){
    next({ name: 'home' });
    return;
  }

  if(to.name == "Lobby" && from.name != "MultiPlayer"){
    next({ name: 'MultiPlayer' });
    return;
  }


  if (requiresAuth.includes(to.name) && !storeAuth.user) {
      next({ name: 'login' });
      return;
  }

  if (admin.includes(to.name) && storeAuth.user.type !== 'A') {
      next({ name: 'home' });
      return;
  }

  if (player.includes(to.name) && storeAuth.user.type === 'A') {
      next({ name: 'home' });
      return;
  }

  if (adminRestricted.includes(to.name) && storeAuth.user && storeAuth.user.type === 'A') {
    next({ name: 'home' });
    return;
  }
  
  if (user.includes(to.name) && storeAuth.user) {
    next({ name: 'home' });
    return;
  }

  next();
});

export default router
