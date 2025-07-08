<script setup>
import { computed } from 'vue'
const props = defineProps({
    cell: Object,
    matched: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['card'])

const clicked = () => {
    if(!props.matched && !props.cell.isRevealed){
        emit('card', props.cell)
    }
}

const srcImg = computed(() => {
    if (props.cell.isRevealed){
        return `/img/${props.cell.value}.png`
    }else{
        return `/img/semFace.png`
    }
})
</script>

<template>
    <div class="grow" :class="{'opacity-40': cell.isMatched}">
        <img :src="srcImg" alt="Tictactoe piece" @click="clicked" class="w-32"> 
    </div>
</template>