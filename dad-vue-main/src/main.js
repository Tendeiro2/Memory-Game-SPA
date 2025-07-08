import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

import ErrorMessage from './components/common/ErrorMessage.vue'

import { io } from "socket.io-client"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('socket', io("http://localhost:8081"))

axios.defaults.baseURL = 'http://dadapi.test.iuri/api'
//axios.defaults.baseURL = 'http://dad-laravel.test:8080/api'

app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
