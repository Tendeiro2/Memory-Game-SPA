import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useErrorStore } from '@/stores/error';
import { useRouter } from 'vue-router';
import { useToast } from '@/components/ui/toast/use-toast';

export const useGameStore = defineStore('game', () => {
    const router = useRouter();
    const { toast } = useToast();
    const storeError = useErrorStore();

    const games = ref([]);
    const gamesPlaying = ref([]);
    const boards = ref([]);
    const minTurns = ref(null); 

    

    const totalGames = computed(() => {
        return games.value ? games.value.length : 0;
    });

    const fetchBoards = async () => {
        try {
            const response = await axios.get('/boards');
            boards.value = response.data.map(board => ({
                id: board.id,
                label: `${board.board_cols}x${board.board_rows}`,
                numCols: board.board_cols,
                numRows: board.board_rows
            }));
        } catch (error) {
            console.error('Erro ao buscar boards:', error);
        }
    };

    const getBoardById = (boardId) => {
        return boards.value.find(board => board.id === boardId);
    };
    
    const fetchGames = async () => {
        storeError.resetMessages();
        try {
            const response = await axios.get('games');
            games.value = response.data.data;
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error fetching games!');
        }
    };

    const fetchGame = async (gameId) => {
        storeError.resetMessages();
        try {
            const response = await axios.get(`games/${gameId}`);
            return response.data.data;
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error fetching game!');
            return false;
        }
    };

    const fetchTopSinglePlayerGames = async (boardId) => {
        try {
          const response = await axios.get('/games/topSinglePlayer', {
            params: { board_id: boardId },
          });
      
          games.value = response.data.top_games.map((game) => ({
            nickname: game.user.nickname,
            total_time: game.total_time,
            board: `${game.board.board_cols}x${game.board.board_rows}`,
          }));
      
          minTurns.value = response.data.min_turns;
        } catch (error) {
          console.error('Erro ao buscar top Single Player para a board:', error);
        }
    };
    
    const fetchTopMultiplayerGames = async (boardId) => {
        try {
            const response = await axios.get('/games/topMultiplayer', {
                params: { board_id: boardId },
            });
            games.value = response.data.map((game) => ({
                nickname: game.winner.nickname,
                wins: game.wins,
                board: `${game.board.board_cols}x${game.board.board_rows}`,
            }));
        } catch (error) {
            console.error('Erro ao buscar top Multiplayer para a board:', error);
        }
    };

    const fetchAllMultiplayerGames = async () => {
        try {
            const response = await axios.get('/games/allMultiplayer');
            games.value = response.data.map((game) => ({
                id: game.id,
                winner: game.winner.nickname,
                total_time: game.total_time,
                board: `${game.board.board_cols}x${game.board.board_rows}`,
            }));
        } catch (error) {
            console.error('Error fetching all multiplayer games:', error);
        }
    };
    
    const insertGame = async (game) => {
        storeError.resetMessages();
        try {
            const response = await axios.post('/games', game);  
            gamesPlaying.value.push(response.data.data)
            toast({
                description: `Game #${response.data.data.id} created successfully!`
            })
            return response.data.data
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error creating game!');
            return false;
        }
    };
    
    const updateGame = async (game) => {
        storeError.resetMessages();
        try {

            const response = await axios.put(`games/${game.id}`, game);
            const index = gamesPlaying.value.findIndex(g => g.id === game.id);
            gamesPlaying.value[index] = response.data.data;
            toast({
                description: `Game #${game.id} updated successfully!`
            })
            return response.data.data;
        } catch (e) {
            storeError.setErrorMessages(e.response.data.message, e.response.data.errors, e.response.status, 'Error updating game!');
            return false;
        }
    }

    return {
        games,
        gamesPlaying,
        boards,
        totalGames,
        minTurns,
        fetchBoards,
        getBoardById,
        fetchGames,
        fetchGame,
        fetchTopSinglePlayerGames,
        fetchTopMultiplayerGames,
        fetchAllMultiplayerGames,
        insertGame,
        updateGame
    };
});
