import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useErrorStore } from '@/stores/error'
import { useRouter } from 'vue-router'
import avatarNoneAssetURL from '@/assets/avatar-none.png'
import { toast } from '@/components/ui/toast'

const regex = /api$/gi;

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const storeError = useErrorStore()
    const socket = inject('socket')
    const user = ref(null)
    const token = ref('')
    const id = computed(() => {
        return user.value ? user.value.id : ''
    })

    const userName = computed(() => {
        return user.value ? user.value.name : ''
    })

    const userFirstLastName = computed(() => {
        const names = userName.value.trim().split(' ')
        const firstName = names[0] ?? ''
        const lastName = names.length > 1 ? names[names.length -1 ] : ''
        return (firstName + ' ' + lastName).trim()
    })

    const userEmail = computed(() => {
        return user.value ? user.value.email : ''
    })

    const userType = computed(() => {
        return user.value ? user.value.type : ''
    })

    const userGender = computed(() => {
        return user.value ? user.value.gender : ''
    })
    const brain_coins_balance = computed(() => {
        return user.value ? user.value.brain_coins_balance : ''
    })
    const userBlocked = computed(() => {
        return user.value ? user.value.blocked : ''
    })

    const userNick = computed(() => {
        return user.value ? user.value.nickname : ''
    })

    const userPhotoUrl = computed(() => {
        const photoFile = user.value ? user.value.photo_filename ?? '' : ''
        if (photoFile) {
            return axios.defaults.baseURL.replaceAll(regex, 'storage/photos/' + photoFile);
        }
        return avatarNoneAssetURL
    })

    const getUserPhotoUrl = (photoFile) => {
        return axios.defaults.baseURL.replaceAll(regex, 'storage/photos/' + photoFile);
    }

    const brainCoinsBalanceError = (value) => {
        storeError.resetMessages()
        storeError.setErrorMessages(`You don't have enough Brain Coins to play this game! You need ${value} Brain Coins`, [], 400, 'Error joining game!');
    }


    const getFirstLastName = (fullName) => {
        const names = fullName.trim().split(' ')
        const firstName = names[0] ?? ''
        const lastName = names.length > 1 ? names[names.length -1 ] : ''
        return (firstName + ' ' + lastName).trim()
    }

    const clearUser = () => {
        resetIntervalToRefreshToken()
        if (user.value) {
            socket.emit('logout', user.value)
        }
        user.value = null
        token.value = ''
        localStorage.removeItem('token')
        axios.defaults.headers.common.Authorization = ''
    }

    const login = async (credentials) => {
        storeError.resetMessages()
        try {
            const responseLogin = await axios.post('auth/login', credentials)
            token.value = responseLogin.data.token
            localStorage.setItem('token', token.value)
            axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
            user.value = responseLogin.data.user
            socket.emit('login', user.value)

            if(user.value.blocked == 1){
                toast({
                    title: 'User Blocked',
                    description: 'You are blocked, contact the administrator',
                    variant: 'destructive'  
                })
                clearUser()
            }
            repeatRefreshToken()
            router.push({ name:'home' })
            return user.value
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
            toast({
                title: 'Not Authorized',
                description: 'Access denied, check your credentials',
                variant: 'destructive'  
            })
            return false
        }
    }

    const logout = async () => {
        storeError.resetMessages()
        try {
            await axios.post('auth/logout')
            clearUser()
            router.push({ name:'home' })
            return true
        } catch (e) {
            clearUser()
            storeError.setErrorMessages(e.response.data.message, [], e.response.status, 'Authentication Error!')
            return false
        }
    }

    let intervalToRefreshToken = null

    const resetIntervalToRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken)
        }
        intervalToRefreshToken = null
    }

    const repeatRefreshToken = () => {
        if (intervalToRefreshToken) {
            clearInterval(intervalToRefreshToken)
        }
        intervalToRefreshToken = setInterval(async () => {
            try {
                const response = await axios.post('auth/refreshtoken')
                token.value = response.data.token
                localStorage.setItem('token', token.value)
                axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
                return true
            } catch (e) {
                clearUser()
                storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Authentication Error!')
                return false
            }
        }, 1000 * 60 * 110) 
        return intervalToRefreshToken
    }

    const restoreToken = async function () {
        let storedToken = localStorage.getItem('token')
            if (storedToken) {
                try {
                    token.value = storedToken
                    axios.defaults.headers.common.Authorization = 'Bearer ' + token.value
                    const responseUser = await axios.get('users/me')
                    user.value = responseUser.data.data
                    socket.emit('login', user.value)
                    repeatRefreshToken()
                    return true
                } catch {
                    clearUser()
                    return false
                }
        }
        return false
    }

    const canUpdateDeleteProject = (project) => {
        return project && user.value && (userType.value === 'A' || user.value.id === project.created_by_id)
    }

    return {
        userBlocked, brain_coins_balance, id, user, userName, userFirstLastName, userEmail, userType, userGender, userPhotoUrl, userNick,
        getFirstLastName, login, logout, restoreToken, canUpdateDeleteProject, clearUser, brainCoinsBalanceError, getUserPhotoUrl
    }
})
