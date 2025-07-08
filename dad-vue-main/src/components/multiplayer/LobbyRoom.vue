<script setup>
import { useLobbyStore } from '@/stores/lobby';
import Chat from '../chat/Chat.vue';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useGameStore } from '@/stores/games';
import Button from '../ui/button/Button.vue';
import { onBeforeRouteLeave } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/stores/chat';

const lobbyStore = useLobbyStore()
const gameStore = useGameStore()
const authStore = useAuthStore()
const chatStore = useChatStore()
const readyStatus = ref(false)

const startGame = async () => {
    await lobbyStore.startGame()
}

const readyGame = async () => {
    await lobbyStore.readyGame()
    if (readyStatus.value) {
        readyStatus.value = false
    } else {
        readyStatus.value = true
    }
}


onBeforeRouteLeave((to, from) => {
    lobbyStore.leaveGame()
})
onMounted(() => {
    chatStore.lobbyMessages = []
})
</script>

<template>
    <div class="flex flex-wrap justify-start px-2 space-x-4">
        <Chat class="w-96" :lobby="true"></Chat>
        <div class="flex-1 min-w-96">
            <Card class="my-8 py-2 px-1">
                <CardHeader class="pb-0">
                    <CardTitle>Lobby Number #{{ lobbyStore.lobbyID }}</CardTitle>
                </CardHeader>
                <CardContent class="p-4">
                    <div class="divide-y divide-solid divide-gray-200">
                        <div class="flex ps-2 pe-1">
                            <div class="flex flex-col grow">
                                <div class="text-base pe-4 grow leading-10 flex space-x-2">
                                    <span class="pl-1">Board Size: {{
                                        gameStore.getBoardById(lobbyStore.boardId).label }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="divide-y divide-solid divide-gray-200">
                        <div class="flex ps-2 pe-1">
                            <div class="flex flex-col grow">
                                <div class="text-base pe-4 grow leading-10 flex space-x-2">
                                    <span class="pl-1">Number of Players: {{ lobbyStore.game.numberCurrentPlayers }} /
                                        {{
                                            lobbyStore.numberPlayers }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="my-4">
                        <h3 class="text-lg font-bold mb-2">Players in the Lobby:</h3>
                        <ul class="divide-y divide-solid divide-gray-200">
                            <li v-for="user in lobbyStore.game.players" :key="user.id"
                                class="flex items-center py-2 space-x-4">
                                <!-- Foto do user -->
                                <img v-if="user.player.photo_filename" :src="authStore.getUserPhotoUrl(user.player.photo_filename)" alt="Avatar"
                                    class="w-10 h-10 rounded-full" />
                                <span class="text-base">{{ user.player.nickname }}</span>
                                <span v-show="user.ready == null" class="text-sm text-gray-500">Host</span>
                                <span v-show="user.ready != null" class="text-sm"  :class="user.ready ? 'text-green-500' : 'text-red-500'" >{{ user.ready ? "Ready" : "Not Ready" }}</span>
                            </li>
                        </ul>
                    </div>
                    <Button @click="startGame" v-show="lobbyStore.canStartGame">Start Game</Button>
                    <Button @click="readyGame" v-show="!lobbyStore.canStartGame"
                        :class="readyStatus ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600 text-white'">
                        {{ readyStatus ? "Ready" : "Unready" }}
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
</template>