class Chessboard {
    constructor(boardElementId = 'chessboard', gameState, playerIndicators = { white: 'whitePlayer', black: 'blackPlayer' }, boardData = { blockInteraction: false, lootBoxAnimation: false }) {

        // Binding the decorator to all methods of the class
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if (typeof this[key] === 'function' && key !== 'constructor') {
                this[key] = errorHandlerDecorator(this[key], this.handleError);
            }
        }

        this.staticBoard = boardData.blockInteraction;
        this.lootBoxAnimation = boardData.lootBoxAnimation;
        this.playerIndicators = playerIndicators // the 2 elements that will be used to indicate the active player

        this.pieces = {
            white: ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            black: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn']
        };
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']; // unused, for notation
        this.board = document.getElementById(boardElementId);

        this.selectedPiece = null // This is used to store the selected piece coordinate
        this.cachedPieceData = { // This is used to store the piece data of the selected piece
            pieceData: null,
            boardData: null,
            location: null
        }

        this.lastPlayedMove = [] // this stores the last move, were you moved from and to.
        this.activePlayer = STARTING_PLAYER;

        if (!gameState) {
            this.boardState = new Array(BOARDSIZE).fill(null).map(() => new Array(BOARDSIZE).fill(null));
            this.lostPieces = {
                black: [],
                white: []
            }
            this.createBoard();
        } else {
            this.boardState = gameState.boardState ? gameState.boardState : new Array(BOARDSIZE).fill(null).map(() => new Array(BOARDSIZE).fill(null));
            this.lostPieces = gameState.lostPieces ? gameState.lostPieces : { black: [], white: [] };
            this.activePlayer = gameState.activePlayer ? gameState.activePlayer : STARTING_PLAYER;
            this.lastPlayedMove = gameState.lastPlayedMove ? gameState.lastPlayedMove : [];
            this.cachedPieceData = gameState.cachedPieceData ? gameState.cachedPieceData : { pieceData: null, boardData: null, location: null };
            if (gameState.selectedPiece) {
                this.render(); // it has to render first to get the selected piece
                this.selectedPiece = document.getElementById(gameState.selectedPiece);
                if (!this.cachedPieceData || !this.cachedPieceData.pieceData || !this.cachedPieceData.boardData || !this.cachedPieceData.location) {
                    // if there is no piece on the location of the active piece, then it will not select the piece
                    if (pieces[this.selectedPiece.getAttribute('piece-name')] == undefined || this.boardState[this.selectedPiece.id.split(',')[0]][this.selectedPiece.id.split(',')[1]] == null) {
                        this.selectedPiece = null;
                        return;
                    }
                    this.cachedPieceData = {
                        pieceData: pieces[this.selectedPiece.getAttribute('piece-name')],
                        boardData: this.boardState[this.selectedPiece.id.split(',')[0]][this.selectedPiece.id.split(',')[1]],
                        location: this.selectedPiece.id.split(',')
                    }
                }
                this.render();
            } else {
                this.render();
            }


        }
        console.log(this.boardState);
    }

    handleError(error) {
        console.error('An error occurred:', error);
        const gameState = this.getGameState()
        if (DEBUG_MODE) {
            localStorage.setItem('gameState-DEBUG_MODE', JSON.stringify(gameState))
        }
        console.warn('Game state saved:', gameState);
    }

    createBoard() {
        this.setupInitialPosition();
        this.generateLootBox(this.getGameState(), 10);
        this.render()
    }

    render() {
        this.board.innerHTML = '';
        let squareCount = 0;
        for (let i = 0; i < this.boardState.length; i++) {
            for (let j = 0; j < this.boardState[i].length; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                if (this.boardState[i][j] != 404) {
                    square.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
                    square.addEventListener('click', () => this.handleSquareClick(square));
                    square.addEventListener('touchend', (event) => {
                        event.preventDefault(); // Prevents the click event from also firing
                        this.handleSquareClick(square);
                    });
                }

                square.id = `${i},${j}`;
                if (this.selectedPiece && this.selectedPiece.id == square.id) {
                    square.style.backgroundColor = 'yellow';
                }
                if (this.isThisALegalMove(i, j)) {
                    square.classList.add('legal-move');
                }
                if (this.lastPlayedMove.length != 0 && (i == this.lastPlayedMove[0][0] && j == this.lastPlayedMove[0][1] || i == this.lastPlayedMove[1][0] && j == this.lastPlayedMove[1][1])) {
                    square.classList.add('last-move');
                }

                if (this.boardState[i][j] && this.boardState[i][j] != 404) {
                    square.innerHTML = pieces[this.boardState[i][j].type].display[this.boardState[i][j].color];
                    square.setAttribute('piece-name', this.boardState[i][j].type);
                    square.setAttribute('piece-team', this.boardState[i][j].color);
                }

                this.board.appendChild(square, 1);
            }
            if (this.boardState[i].length < BOARDSIZE) {
                for (let j = this.boardState[i].length; j < BOARDSIZE; j++) {
                    const square = document.createElement('div');
                    square.classList.add('square');
                    square.id = `${i},${j}`;
                    this.board.appendChild(square, 1);
                }
            }
            squareCount++;
        }
        if (this.playerIndicators && this.playerIndicators.white && this.playerIndicators.black) {
            setPlayerIndicator(this.activePlayer, this.playerIndicators);
        }
    }

    getGameState() {
        return {
            boardState: this.boardState,
            lostPieces: this.lostPieces,
            activePlayer: this.activePlayer,
            selectedPiece: this.selectedPiece?.id,
            cachedPieceData: this.cachedPieceData,
            lastPlayedMove: this.lastPlayedMove
        }
    }

    isThisALegalMove(x, y) {
        let legal = this.isLegalMove(x, y);
        return INVERTED_LOGIC != legal;
    }

    isLegalMove(x, y) {
        if (this.cachedPieceData.boardData && this.cachedPieceData.boardData.color != this.activePlayer && FORCE_PLAYER_TURNS) {
            return false;
        }
        if (this.selectedPiece == null) {
            return false;
        }
        if (this.selectedPiece.id == `${x},${y}`) {
            return false;
        }
        if (!friendlyFire && this.boardState[x][y] && this.boardState[x][y].color == this.selectedPiece.getAttribute('piece-team')) {
            return false;
        }
        let patterns = this.boardState[x][y] ? this.cachedPieceData.pieceData.patterns.capture : this.cachedPieceData.pieceData.patterns.movement;
        if (!patterns) {
            return false;
        }
        let piece = null
        if (this.boardState[x][y]) {
            piece = this.boardState[x][y].type
        }
        let legalMove = false;
        for (let i = 0; i < patterns.length; i++) {
            if (patterns[i].area) {
                let pattern = patterns[i].area;
                if (patterns[i].unmoved && !this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]].moved) {
                    pattern = patterns[i].unmoved;
                } else if (patterns[i].moved && this.boardState[this.selectedPiece.id.split(',')[0]][this.selectedPiece.id.split(',')[1]].moved) {
                    pattern = patterns[i].moved;
                }
                if (patterns[i].flipForBlack && this.cachedPieceData.boardData.color == 'black') {
                    pattern = [...pattern].reverse();
                }
                let coordinates = findCoordinates(pattern, piece);
                for (let j = 0; j < coordinates.oneCoordinates.length; j++) {
                    if (parseInt(this.selectedPiece.id.split(',')[0]) + coordinates.oneCoordinates[j][0] - coordinates.zeroPosition[0] == x && parseInt(this.selectedPiece.id.split(',')[1]) + coordinates.oneCoordinates[j][1] - coordinates.zeroPosition[1] == y) {
                        if (patterns[i].exclude) {
                            legalMove = false;
                        } else {
                            legalMove = true;
                        }
                    }
                }
            } else if (patterns[i].direction) {
                const locations = grabAllLocationsOnALine(this, x, y, patterns[i].direction, patterns[i].distance, patterns[i].jump);
                for (let j = 0; j < locations.length; j++) {
                    if (locations[j][0] == this.selectedPiece.id.split(',')[0] && locations[j][1] == this.selectedPiece.id.split(',')[1]) {
                        if (patterns[i].exclude) {
                            legalMove = false;
                        } else {
                            legalMove = true;
                        }
                    }
                }
            } else if (patterns[i].everywhere) {
                if (patterns[i].type && !patterns[i].type.includes(piece)) {
                    continue;
                }
                if (patterns[i].exclude) {
                    legalMove = false;
                } else {
                    legalMove = true;
                }
            }
        }


        return legalMove;
    }
    setupInitialPosition() {
        // Set up white pieces
        for (let i = 0; i < 16; i++) {
            this.boardState[Math.floor((i + 48) / BOARDSIZE)][(i + 48) % BOARDSIZE] = { color: 'white', type: this.pieces.white[i], moved: false };
        }

        // Set up black pieces
        for (let i = 0; i < 16; i++) {
            this.boardState[Math.floor(i / BOARDSIZE)][i % BOARDSIZE] = { color: 'black', type: this.pieces.black[i], moved: false };
        }
    }

    handleSquareClick(square) {
        if (this.staticBoard) {
            return;
        }
        if (!this.selectedPiece && square.getAttribute('piece-team') == 'neutral') {
            console.warn('Cannot select neutral pieces at: ' + square.id + '. PieceInfo:', this.boardState[square.id.split(',')[0]][square.id.split(',')[1]]);
        }
        else if (this.selectedPiece && this.selectedPiece.id !== square.id) {
            // if you have selected a piece and you click on a different square
            if (!this.isThisALegalMove(parseInt(square.id.split(',')[0]), parseInt(square.id.split(',')[1])) && !UNLOCK_MOVEMENT) {
                this.selectedPiece = null;
                this.cachedPieceData = {
                    pieceData: null,
                    boardData: null,
                    location: null
                }
                this.render();
                return;
            }
            let discoveredPieces = localStorage.getItem('discoveredPieces') ? JSON.parse(localStorage.getItem('discoveredPieces')) : {}
            console.log(this.cachedPieceData)
            if (this.cachedPieceData.pieceData.needsDiscovery && !discoveredPieces[this.cachedPieceData.boardData.type]) {
                discoveredPieces[this.cachedPieceData.boardData.type] = true
                localStorage.setItem('discoveredPieces', JSON.stringify(discoveredPieces))
            }

            let capture;
            square.dataset.selected = false;
            let location = square.id.split(',');
            location = location.map(x => parseInt(x));

            if (this.boardState[location[0]][location[1]]) {
                capture = true;

                if (this.boardState[location[0]][location[1]].color == 'neutral') {
                    if (this.boardState[location[0]][location[1]].type == 'lootbox') {
                        runLootBoxUnboxing(getLootboxPiece(this.cachedPieceData.boardData.type), this.cachedPieceData.boardData.color, this.boardState, JSON.parse(JSON.stringify(this.cachedPieceData)), this.lootBoxAnimation);
                    }
                } else {
                    this.lostPieces[this.boardState[location[0]][location[1]].color].push(this.boardState[location[0]][location[1]].type);
                    for (let i = 0; i < Object.keys(winConditions['slainTroops']).length; i++) {
                        if (this.lostPieces[this.boardState[location[0]][location[1]].color].filter(x => x == Object.keys(winConditions['slainTroops'])[i]).length >= winConditions['slainTroops'][Object.keys(winConditions['slainTroops'])[i]]) {
                            this.render();
                            let loser = this.boardState[location[0]][location[1]].color;
                            setTimeout(() => {
                                alert(`${loser} has been slain!`);
                            }, 1);
                        }
                    }
                }
            }

            if (capture) {
                if (pieces[this.boardState[location[0]][location[1]].type].needsDiscovery && !discoveredPieces[this.boardState[location[0]][location[1]].type]) {
                    discoveredPieces[this.boardState[location[0]][location[1]].type] = true
                    localStorage.setItem('discoveredPieces', JSON.stringify(discoveredPieces))
                }
            }

            this.lastPlayedMove = [this.cachedPieceData.location, location];
            this.boardState[location[0]][location[1]] = this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]];
            this.boardState[location[0]][location[1]].moved = true;

            if (this.cachedPieceData.pieceData.convertion) {
                let y = location[0];
                if (this.cachedPieceData.boardData.color == 'black') {
                    y = 7 - y;
                }
                if (this.cachedPieceData.pieceData.convertion.collumns.includes(location[1])) {
                    if (this.cachedPieceData.pieceData.convertion.rows.includes(y)) {
                        this.boardState[location[0]][location[1]].type = this.cachedPieceData.pieceData.convertion.convertsTo;
                    }
                }
            }

            this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]] = null;
            this.selectedPiece = null;
            this.cachedPieceData = {
                pieceData: null,
                boardData: null,
                location: null
            }

            this.afterMove(this.getGameState());
            return;

            // Should re-add the notation logging.
            // console.log(`${this.characterCodes[square.innerHTML] ? this.characterCodes[square.innerHTML].color + ': ' : ''}${this.characterCodes[square.innerHTML] ? this.characterCodes[square.innerHTML].type : ''}${capture ? 'x' : ''}${square.id}`);
        } else if (this.selectedPiece && this.selectedPiece.id == square.id) {
            // if you have selected a piece and you click on the same square
            this.selectedPiece = null;
            this.cachedPieceData = {
                pieceData: null,
                boardData: null,
                location: null
            }
        } else if (square.innerHTML) {
            // if you click on a square with a piece
            this.selectedPiece = square;
            this.cachedPieceData = {
                pieceData: pieces[square.getAttribute('piece-name')],
                boardData: this.boardState[this.selectedPiece.id.split(',')[0]][this.selectedPiece.id.split(',')[1]],
                location: this.selectedPiece.id.split(',')
            }

        } else {
        }
        this.render();
    }

    generateLootBox(gameState, customPercentage = null) {
        // if empty space exists on the board, spawn a lootbox
        let emptySpaces = []
        for (let i = 0; i < gameState.boardState.length; i++) {
            for (let j = 0; j < gameState.boardState[i].length; j++) {
                if (!gameState.boardState[i][j]) {
                    emptySpaces.push([i, j]);
                }
            }
        }
        if (emptySpaces.length > 0 && percentageRandomiser(customPercentage ? customPercentage : LOOTBOX_SPAWN_PERCENTAGE)) {
            let randomIndex = Math.floor(Math.random() * emptySpaces.length);
            let [x, y] = emptySpaces[randomIndex];
            console.log('Lootbox spawned at:', x, y);
            gameState.boardState[x][y] = { color: 'neutral', type: 'lootbox' };
            return true;
        }
        return false;
    }

    switchActivePlayer() {
        this.activePlayer = this.activePlayer == 'white' ? 'black' : 'white';
        this.render();
    }

    afterMove(gameState) {
        let nextPlayer = this.activePlayer == 'white' ? 'black' : 'white';
        let piecesLeftOfActivePlayer = 0;
        for (let i = 0; i < this.boardState.length; i++) {
            for (let j = 0; j < this.boardState[i].length; j++) {
                if (this.boardState[i][j] && this.boardState[i][j].color == nextPlayer) {
                    piecesLeftOfActivePlayer++;
                }
            }
        }
        if (piecesLeftOfActivePlayer == 0) {
            nextPlayer = nextPlayer == 'white' ? 'black' : 'white';
        }
        this.activePlayer = nextPlayer;
        this.generateLootBox(gameState);
        this.render();

    }
}

function grabAllLocationsOnALine(self, x, y, direction, distance, jump = false) {
    const locations = [];
    const directions = {
        'vertical': [[-1, 0], [1, 0]],
        'horizontal': [[0, -1], [0, 1]],
        'diagonal/': [[-1, -1], [1, 1]],
        'diagonal\\': [[-1, 1], [1, -1]]
    };

    for (const [dx, dy] of directions[direction]) {
        for (let i = 1; i <= distance; i++) {
            const newX = x + i * dx;
            const newY = y + i * dy;

            if (newX < 0 || newX >= BOARDSIZE || newY < 0 || newY >= BOARDSIZE || (self.boardState[newX][newY] && !jump)) {
                locations.push([newX, newY]);
                break; // Out of bounds
            }
            if (self.boardState[newX][newY] != null) {
                locations.push([newX, newY]);
                break; // Obstacle found
            }

            locations.push([newX, newY]);
        }
    }
    return locations;
}


function findCoordinates(matrix, extraCondition = null) {
    const coordinatesToFind = [1]
    if (extraCondition) {
        coordinatesToFind.push(extraCondition)
    }
    let zeroPosition = null;
    const oneCoordinates = [];

    // Find the position of 0
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0) {
                zeroPosition = [i, j];
                break;
            }
        }
        if (zeroPosition) break;
    }

    // If zeroPosition is not found, return an empty array
    if (!zeroPosition) return oneCoordinates;

    // Collect all the coordinates of 1s
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (coordinatesToFind.includes(matrix[i][j])) {
                oneCoordinates.push([i, j]);
            }
        }
    }

    return { zeroPosition, oneCoordinates };
}