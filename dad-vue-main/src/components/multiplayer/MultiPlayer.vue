<script setup>
import { useAuthStore } from '@/stores/auth';
import Chat from '../chat/Chat.vue';
import Lobby from './Lobby.vue';

const storeAuth = useAuthStore()
</script>

<template>
    <div class="flex flex-wrap justify-start px-4 space-x-4">
        <Chat class="w-96"></Chat>
        <Lobby v-if="storeAuth.user" class="flex-1 min-w-96"></Lobby>
    </div>
</template>