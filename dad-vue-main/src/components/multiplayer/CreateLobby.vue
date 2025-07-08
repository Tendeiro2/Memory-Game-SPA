<script setup>
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'


import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useGameStore } from '@/stores/games'
import { ref } from 'vue'

const emit = defineEmits(['createLobby'])
const boardId = ref(1);
const playerNumbers = ref(2);

const create = () => {
    emit('createLobby', {"boardId": boardId.value, "numberPlayers": playerNumbers.value})
}

const gameStore = useGameStore();

gameStore.fetchBoards();

</script>

<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button>
                Create Lobby
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Lobby</DialogTitle>
                <DialogDescription>
                    Lobby Definition
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="username" class="text-right">
                        Board Size
                    </Label>
                    <Select v-model="boardId">
                        <SelectTrigger class="col-span-3">
                            <SelectValue placeholder="Board Size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Board Size</SelectLabel>
                                <SelectItem v-for="option in gameStore.boards" :value="option.id">
                                    {{ option.label }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="username" class="text-right">
                        Nº of Players
                    </Label>
                    <Select v-model="playerNumbers">
                        <SelectTrigger class="col-span-3">
                            <SelectValue placeholder="Nº of Players" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Nº of Players</SelectLabel>
                                <SelectItem :value="2">
                                    2
                                </SelectItem>
                                <SelectItem :value="3">
                                    3
                                </SelectItem>
                                <SelectItem :value="4">
                                    4
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button @click="create" type="submit">
                    Create Lobby
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>