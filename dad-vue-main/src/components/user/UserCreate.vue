<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useErrorStore } from '@/stores/error'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
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
const storeUser = useUserStore()

const credentials = ref({})

const cancel = () => {
  router.push('/home')
}

const create = async () => {
  const jsonToSend = credentials.value
  await storeUser.createUser(jsonToSend)
}

const imagePreview = ref(null)
const fileInput = ref(null)

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    createPreview(file)
  }
}

const onDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    createPreview(file)
  }
}

const createPreview = (file) => {
  const reader = new FileReader()
  reader.onload = () => {
    credentials.value.photo = reader.result 
    imagePreview.value = reader.result 
  }
  reader.readAsDataURL(file)
}

const triggerFileInput = () => {
  fileInput.value.click()
}
const disabled = ref(true);

onMounted(() => {
  setTimeout(() => {
    disabled.value = false; 
  }, 500); 
})
</script>

<template>
  <Card
    v-show="!storeAuth.user"
    class="w-[450px] mx-auto my-8 p-4 px-8 bg-gray-800 text-white rounded-md shadow-md border-0 fade-in"
  >
    <CardHeader>
      <CardTitle>Create Account</CardTitle>
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
              :disabled="disabled"
              class="bg-gray-700 text-white border-0"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="nickname">Nickname</Label>
            <Input
              id="nickname"
              type="nickname"
              placeholder="Nickname"
              v-model="credentials.nickname"
              :disabled="disabled"
              class="bg-gray-700 text-white border-0"
            />
            <ErrorMessage
              :errorMessage="storeError.fieldMessage('nickname')"
            ></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Name</Label>
            <Input
              id="name"
              type="name"
              placeholder="Name"
              v-model="credentials.name"
              :disabled="disabled"
              class="bg-gray-700 text-white border-0"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('name')"></ErrorMessage>
          </div>

          <Label for="photo">Photo</Label>
          <div
            class="drag-and-drop flex flex-col space-y-1.5 bg-gray-700 text-white rounded-md border-0"
            @dragover.prevent
            @dragleave.prevent
            @drop.prevent="onDrop"
          >
            <p>Drag-and-drop an image here</p>
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              ref="fileInput"
              style="display: none;"
              :disabled="disabled"
            />
            <img
              v-if="imagePreview"
              :src="imagePreview"
              alt="Preview da imagem"
            />
            <button
              type="button"
              @click="triggerFileInput"
              class="bg-gray-900 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700"
            >
              Select image
            </button>
          </div>

          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              v-model="credentials.password"
              :disabled="disabled"
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
        @click="create"
        class="bg-gray-900 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700"
      >
        Register
      </Button>
    </CardFooter>
  </Card>
</template>

<style>
.drag-and-drop {
  border: 2px dashed #555;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.drag-and-drop img {
  max-width: 100%;
  margin-top: 10px;
}
</style>

<style scoped>
/* Animação fade-in para o conteúdo */
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

/* Ajustes de delay para a animação de fade-in */
.fade-in:nth-child(1) {
  animation-delay: 0.2s;
}
.fade-in:nth-child(2) {
  animation-delay: 0.4s;
}
</style>
