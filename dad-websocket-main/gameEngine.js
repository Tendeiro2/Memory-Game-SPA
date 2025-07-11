exports.createGameEngine = () => {

    const shufflerandom = (array) => {
        let currentIndex = array.length

        while (currentIndex != 0) {

            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            let tempValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = tempValue
        }
    }

    const numPars = (boardId) => {
        switch (boardId) {
            case 1:
                return 6;
            case 2:
                return 8;
            case 3:
                return 18;
            
        }
    }

    const createBoard = (boardId) => {

        let board = [];
        let numRows = 0;
        let numCols = 0;
        let allCards = [];
        let gameCards = []

        switch (boardId) {
            case 1:
                numRows = 4;
                numCols = 3;
                break;
            case 2:
                numRows = 4;
                numCols = 4;
                break;
            case 3:
                numRows = 6;
                numCols = 6;
                break;
        };

        let numPars = numRows * numCols / 2

        for (let i = 1; i <= 40; i++) {
            allCards.push(i)
        }

        shufflerandom(allCards)

        for (let i = 1; i <= numPars; i++) {
            gameCards.push(allCards[i])
            gameCards.push(allCards[i])
        }

        shufflerandom(gameCards)

        for (let i = 0; i < numRows * numCols; i++) {
            board.push({
                id: i,
                value: gameCards[i],
                isRevealed: false,
                isMatched: false,
                playerID: null
            })
        }
        return board;
    };

    const initGame = (game) => {
        game.status = null;
        game.numParsWin = 0;
        game.currentPlayer = 1;
        game.board = createBoard(game.boardId);
        game.numPars = numPars(game.boardId);
        game.numParsLeft = game.numPars;
        game.numPlayersPlaying = game.numberCurrentPlayers;
    };

    const play = (cardID, game, playerSocketId) => {  
        let result = 0
        game.players.forEach(player => {
            if (player.playerSocketId == playerSocketId) {
                if (game.currentPlayer !== player.id) {
                    return {
                        errorCode: 5,
                        errorMessage: 'It is not your turn!'
                    }
                }
           
                card = game.board.find((searchCard) => searchCard.id == cardID)
              
                card.playerID = player.id
               
                if (!game.firstCard) {
                    game.firstCard = card
                    card.isRevealed = true
                    game.board[cardID] = card;
                 
                    result = 1
                } else {
                    card.isRevealed = true
                    game.board[cardID] = card;
                    result = 2
                }
            }
        })
        return result
    }

    const nextPlayer = (currentPlayerID, game) => {
        let nextPlayerID = currentPlayerID
        do{
            
            nextPlayerID = (nextPlayerID+1 > game.numPlayersPlaying) ? 1 : nextPlayerID+1
            
            nextPlayerToPlay = game.players.find(player => player.id == nextPlayerID)
            if(!nextPlayerToPlay.leaved && game.currentPlayer != nextPlayerID){
               
                return nextPlayerID
            }

        }while(game.currentPlayer != nextPlayerID) 
           
            return -1 
    };

    return {
        initGame,
        play,
        nextPlayer
    };
};