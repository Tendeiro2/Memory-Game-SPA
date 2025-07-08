import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useErrorStore } from '@/stores/error'
import { useLobbyStore } from '@/stores/lobby'

export const useChatStore = defineStore('chat', () => {
    const storeError = useErrorStore()
    const storeLobby = useLobbyStore()

    const socket = inject('socket')

    const messages = ref([])
    const lobbyMessages = ref([])

    const totalMessages = computed(() => messages.value.length)

    const totalLobbyMessages = computed(() => lobbyMessages.value.length)

    const addMessageToArray = (messageObj) => {
        if (totalMessages.value >= 10) {
            messages.value.shift();
        }
        messages.value.push(messageObj)
    }

    const addMessageToLobbyArray = (messageObj) => {
        if (totalLobbyMessages.value >= 10) {
            lobbyMessages.value.shift();
        }
        lobbyMessages.value.push(messageObj)
    }

    const sendMessageToChat = (message) => {
        storeError.resetMessages()
        socket.emit('chatMessage', message)
    }

    const sendMessageToLobbyChat = (message) => {
        storeError.resetMessages()
        socket.emit('lobbyChat', storeLobby.lobbyID ,message)
    }

    socket.on('chatMessage', (messageObj) => {
        addMessageToArray(messageObj)
    })

    socket.on('lobbyChat', (messageObj) => {
        addMessageToLobbyArray(messageObj)
    })

    const webSocketServerResponseHasError = (response) => {
        if (response.errorCode) {
            storeError.setErrorMessages(response.errorMessage, [], response.errorCode)
            return true
        }
        return false
    }

    const sendPrivateMessageToUser = (destinationUser, message) => {
        storeError.resetMessages()
        socket.emit(
            'privateMessage',
            {
                destinationUser: destinationUser,
                message: message
            },
            (response) => webSocketServerResponseHasError(response)
        )
    }

    return {
        messages, totalMessages, lobbyMessages, totalLobbyMessages, sendMessageToChat, sendMessageToLobbyChat, sendPrivateMessageToUser
    }
})