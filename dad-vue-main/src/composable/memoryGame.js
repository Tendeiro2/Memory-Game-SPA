import { useGameStore } from '@/stores/games'
import { useAuthStore } from '@/stores/auth'
import { ref, toRaw } from 'vue'

export function useMemoryGame() {

    const gameStore = useGameStore()
    const authStore = useAuthStore()
    const status = ref(null)

    let board = ref([])

    let gameInformation = {}
    let moves = [];

    const boardId = ref(1)
    const numRows = ref(4)
    const numCols = ref(3)
    let numPars = 0;

    let startTime = 0
    const gameTimer = ref(0)
    const gameTime = ref(0)
    let game = ref({});

    let firstCard = null
    let matched = ref(false)

    const shuffle = (array) => {
        let currentIndex = array.length

        while (currentIndex != 0) {

            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]]
        }
    }
    var id = null;
    const timer = () => {
        startTime = Date.now();
        if (id) {
            clearInterval(id);
            startTime = 0;
            gameTimer.value = 0;
            id = null;
            return
        }
        id = setInterval(function () {
            status.value = 2
            var delta = Date.now() - startTime
            gameTimer.value = delta / 1000
        }, 100)
    }

    const start = () => {

        status.value = null
        gameTime.value = 0

        clearInterval(id);
        startTime = 0;
        gameTimer.value = 0;
        id = null;

        board.value = []

        let allCards = []
        let cards = []

        numPars = numRows.value * numCols.value / 2

        for (let i = 1; i <= 40; i++) {
            allCards.push(i)
        }

        shuffle(allCards)

        for (let i = 1; i <= numPars; i++) {
            cards.push(allCards[i])
            cards.push(allCards[i])
        }

        shuffle(cards)

        gameInformation.board = []

        for (let i = 0; i < numRows.value * numCols.value; i++) {
            board.value.push({
                value: cards[i],
                isRevealed: false,
                isMatched: false
            })

            gameInformation.board.push({
                value: cards[i],
                isRevealed: false,
                isMatched: false
            })
        }

        game.value = {}
        game.value.type = "S";
        game.value.status = "PL"
        game.value.board_id = boardId.value
    }

    const move = async (card) => {
        if (gameTimer.value == 0) {
            game.value.began_at = new Date(Date.now()).toISOString();
            timer()
            if (authStore.user) {
                await gameStore.insertGame(game.value)
            }

        }
        if (!firstCard) {
            firstCard = card
            card.isRevealed = true
            moves.push({ "user_id": 7, "first_card": toRaw(card) })
        } else {
            card.isRevealed = true
            matched.value = true


            if (firstCard.value === card.value) {
                setTimeout(() => {
                    numPars--;
                    firstCard.isMatched = true
                    card.isMatched = true

                    moves.pop()
                    moves.push({ "user_id": 7, "first_card": toRaw(firstCard), "second_card": toRaw(card) })

                    firstCard = null
                    matched.value = false
                    if (numPars == 0) {
                        status.value = 1
                        gameTime.value = (Date.now() - startTime) / 1000
                        timer()
                        if (authStore.user) {
                            game.value = gameStore.gamesPlaying[gameStore.gamesPlaying.length - 1];
                            game.value.status = "E"
                            game.value.ended_at = new Date(Date.now()).toISOString();
                            game.value.total_time = gameTime.value
                            gameInformation.moves = moves
                            game.value.total_turns_winner = moves.length;
                            game.value.custom = JSON.stringify(gameInformation)
                            gameStore.updateGame(game.value)
                        }
                    }

                }, 1000)
            } else {
                setTimeout(() => {
                    firstCard.isRevealed = false
                    card.isRevealed = false

                    moves.pop()
                    moves.push({ "user_id": 7, "first_card": toRaw(firstCard), "second_card": toRaw(card) })

                    firstCard = null
                    matched.value = false

                }, 1000)
            }
        }
    }

    return { status, board, matched, gameTimer, gameTime, numCols, numRows, boardId, start, move
     }
}
