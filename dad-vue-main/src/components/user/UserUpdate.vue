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

const showDeleteForm = ref(false);
const showDeleteForm_View = () =>{
  showDeleteForm.value = !showDeleteForm.value;
}

const credentials = ref({
  })
const credentials_delete = ref({
  })

const cancel = () => {
  router.push('/home')
}

const update = async () => {
  const jsonToSend = credentials.value
  await storeUser.updateUserAll(storeAuth.id, jsonToSend)
}

const deleteUser = async () => {
  const jsonToSend = credentials_delete.value
  await storeUser.checkBeforeDelete(storeAuth.id, jsonToSend)
  storeAuth.clearUser()
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
  <Card v-show="storeAuth.user" class="w-[450px] mx-auto my-8 p-4 px-8 bg-gray-800 text-white rounded-md shadow-md border-0 fade-in">
    <CardHeader class="fade-in">
      <CardTitle>Edit Profile</CardTitle>
    </CardHeader>
    <CardContent class="fade-in">

      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5 fade-in">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="User Email"
              v-model="credentials.email"
              :disabled="disabled"
              class="bg-gray-700 text-white border-0"
            />
            <ErrorMessage
              :errorMessage="storeError.fieldMessage('email')"
            ></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5 fade-in">
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
          <div class="flex flex-col space-y-1.5 fade-in">
            <Label for="name">Name</Label>
            <Input
              id="name"
              type="name"
              placeholder="Name"
              v-model="credentials.name"
              :disabled="disabled"
              class="bg-gray-700 text-white border-0"
            />
            <ErrorMessage
              :errorMessage="storeError.fieldMessage('name')"
            ></ErrorMessage>
          </div>
          <Label for="photo" class="fade-in">Photo</Label>
          <div class="drag-and-drop flex flex-col space-y-1.5 bg-gray-700 text-white rounded-md border-0 fade-in" @dragover.prevent @dragleave.prevent
            @drop.prevent="onDrop">

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

          <div class="flex flex-col space-y-1.5 fade-in">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              v-model="credentials.password"
              :disabled="disabled"
              class="bg-gray-700 text-white border-0"
            />
            <ErrorMessage
              :errorMessage="storeError.fieldMessage('password')"
            ></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>

    <CardFooter class=" flex justify-between px-6 pb-6 fade-in">
      <Button
      @click="cancel"
      class="bg-gray-900 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700">
        Cancel
      </Button>
      <Button
        @click="update"
        class="bg-gray-900 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700"
      >
        Update
      </Button>
    </CardFooter>

    <button v-show="storeAuth.user.type === 'P'" type="button" @click="showDeleteForm_View"
      class="bg-red-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none flex items-center gap-2 fade-in">
      🗑️ Delete account
    </button>

    <div v-if="showDeleteForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in"
      @click.self="showDeleteForm = false">
      <div class="bg-white p-6 rounded-lg w-3/4 max-w-4xl shadow-lg overflow-hidden" style="max-height: 90vh; overflow-y: auto;">
        <div class="flex justify-between items-center mb-4 fade-in">
          <h3 class="text-lg font-bold">
            Are you sure you want to continue? (This action is IRREVERSIBLE)!!!
          </h3>
          <button @click="showDeleteForm_View" class="text-red-500 font-bold">
            Close
          </button>
        </div>
        <div class="flex flex-col space-y-4 fade-in">
          <div>
            <Label for="password">Password</Label>
            <input
              id="password"
              type="password"
              placeholder="Write your password"
              v-model="credentials_delete.password"
              :disabled="disabled"
              autocomplete="new-password"
              class="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border-0 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
            <ErrorMessage
              :errorMessage="storeError.fieldMessage('password')"
            ></ErrorMessage>
          </div>
          <button
            @click="deleteUser"
            class="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 font-bold"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </Card>
</template>

<style>
.drag-and-drop {
  border: 2px dashed #ccc;
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
