<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const storeAuth = useAuthStore()
const storeError = useErrorStore()

const credentials = ref({
    email: '',
    password: ''
})

const cancel = () => {
    router.back()
}

const login = () => {
    storeAuth.login(credentials.value)
}

</script>
<template>
  <Card
    class="w-[450px] mx-auto my-8 p-4 px-8 bg-gray-800 text-white rounded-md shadow-md border-0 fade-in"
  >
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription class="text-gray-400">
        Enter your credentials to access your account.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="User Email"
              v-model="credentials.email"
              class="bg-gray-700 text-white border-0"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              v-model="credentials.password"
              class="bg-gray-700 text-white border-0"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button
        @click="cancel"
        class="bg-gray-900 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700"
      >
        Cancel
      </Button>
      <Button
        @click="login"
        class="bg-gray-900 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700"
      >
        Login
      </Button>
    </CardFooter>
  </Card>
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

.fade-in:nth-child(1) {
  animation-delay: 0.2s;
}
.fade-in:nth-child(2) {
  animation-delay: 0.4s;
}
</style>

