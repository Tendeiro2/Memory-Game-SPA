<script setup>
import { computed, onBeforeUnmount, inject } from 'vue';
import { useLobbyStore } from '@/stores/lobby';
import Chat from '../chat/Chat.vue';
import { useGameStore } from '@/stores/games';
import Cell from '../singlePlayer/Cell.vue';
import {
    Card,
    CardContent,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth';
import { onBeforeRouteLeave } from 'vue-router';

const lobbyStore = useLobbyStore()
const authStore = useAuthStore()

const statusMessageColor = computed(() => {
    switch (lobbyStore.gameStatus) {
        case null:
        case 0:
        case 1:
            let player = lobbyStore.game.players.find(player => player.id == lobbyStore.game.currentPlayer)
            return player.player.id == authStore.id ? 'text-green-900' : 'text-red-900' 
        case 2:
            return lobbyStore.game.playerWin == authStore.id ? 'text-green-400' : 'text-slate-400'
        case 3:
            return 'text-blue-900'
        default:
            return 'text-slate-800'
    }
})

const statusGameMessage = computed(() => {
    switch (lobbyStore.gameStatus) {
        case null:
        case 0:
        case 1:
            let player = lobbyStore.game.players.find(player => player.id == lobbyStore.game.currentPlayer)
            return player.player.id == authStore.id ? 'Your turn - Time left ' + lobbyStore.time + ' seconds' : 'Opponent turn - ' + player.player.nickname
        case 2:
            return lobbyStore.game.playerWin == authStore.id ? 'You won' : 'You lost'
        case 3:
            return 'Draw'
        default:
            return 'Not started!'
    }
})

const gridClass = computed(() => {
    return {
        'grid-cols-3 grid-cols-[120px_120px_120px]': lobbyStore.boardId == 1,
        'grid-cols-4 grid-cols-[120px_120px_120px_120px]': lobbyStore.boardId == 2,
        'grid-cols-6 grid-cols-[84px_84px_84px_84px_84px_84px]': lobbyStore.boardId == 3,
    };

});

const move = (cell) => {
    lobbyStore.move(cell.id);
}

onBeforeRouteLeave((to, from) => {
    if (lobbyStore.gameStatus != 2) {
        const answer = window.confirm(
            'Do you really want to leave? you have unsaved changes!'
        )
        if(answer){
            lobbyStore.quit()
        }else{
            return false
        }
    }
})

</script>

<template>
    <div class="flex flex-wrap justify-start space-x-4">
        <Chat class="w-96" :lobby="true"></Chat>
        <div class="flex-1 min-w-96">
            <Card class="my-8 py-2 px-1">
                <CardContent class="py-4 px-8">
                    <h3 class="pt-0 text-2xl font-bold py-2" :class="statusMessageColor">
                        {{ statusGameMessage }} 
                    </h3>
                    <div class="grid  justify-center" :class="gridClass">
                        <Cell v-for="cell in lobbyStore.game.board" :key="cell.id" :cell="cell" :matched="lobbyStore.matched" @card="move">
                        </Cell>
                    </div>
                </CardContent>
            </Card>

        </div>
    </div>
</template>