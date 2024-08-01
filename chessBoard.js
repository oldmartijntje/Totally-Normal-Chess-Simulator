class Chessboard {
    constructor(
        boardElementId = 'chessboard',
        gameState,
        playerIndicators = { white: 'whitePlayer', black: 'blackPlayer', pieceInfoField: 'infoBox', winConditionsIndicator: 'winConditionBox' },
        boardData = { blockInteraction: false, lootBoxAnimation: false, sandboxChessBoard: false, ignoreUnlocks: false, useWinConditionBoxFunction: true },
        loadedSettings = {
            boardOrientation: "1",
            aiOpponent: "1",
            allowLootboxSummoning: "1",
            checkmateDetection: "2"
        }) {

        // sandboxChessBoard -> no lootbox spawning, no XP gain

        // Binding the decorator to all methods of the class
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if (typeof this[key] === 'function' && key !== 'constructor') {
                this[key] = errorHandlerDecorator(this[key], this.handleError);
            }
        }

        this.playerSettings = loadedSettings;
        this.boardDataSettings = boardData;
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
            this.modifiedGameData = gameState.modifiedGameData ? gameState.modifiedGameData : {};
            if (gameState.selectedPiece) {
                this.render(); // it has to render first to get the selected piece
                this.selectedPiece = document.getElementById(gameState.selectedPiece);
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
                this.render();
            } else {
                this.render();
            }


        }
        if (DEBUG_MODE) {
            console.log(this.boardState);
        }

        allEvents.on('LOOTBOX_PICKUP', this, this.gainExperiencePoints);
    }

    unsubscribe() {
        allEvents.unsubscribe(this);
    }

    getChessCoordinate(pos) {
        let [x, y] = pos
        x = parseInt(x)
        y = parseInt(y)
        return this.letters[y] + (BOARDSIZE - x)
    }

    getPieceByCoordinate(pos) {
        let [x, y] = pos
        x = parseInt(x)
        y = parseInt(y)
        return this.boardState[x][y]
    }

    renderInfoBox() {
        if (!this.playerIndicators || !this.playerIndicators.pieceInfoField) {
            return;
        }
        let box = document.getElementById(this.playerIndicators.pieceInfoField)
        let selectedPiece = this.selectedPiece ? this.selectedPiece.id.split(',') : this.lastPlayedMove[1];
        if (selectedPiece) {
            if (box) {
                box.style.display = 'block';
                let tile = this.getPieceByCoordinate(selectedPiece)
                let content = `<h2>${tile ? tile.type : 'Empty Tile'} ${this.getChessCoordinate(selectedPiece)}</h2>`
                if (!tile) {
                    content += `<p>Empty Tile</p>`
                    box.innerHTML = content
                    return;
                }
                for (let index = 0; index < Object.keys(tile).length; index++) {
                    if (Object.keys(tile)[index] == 'carrying') {
                        content += `<p>carrying: ${tile.carrying.moved ? 'moved' : 'unmoved'} ${tile.carrying.type}</p>`
                        continue;
                    }
                    content += `<p>${Object.keys(tile)[index]}: ${tile[Object.keys(tile)[index]]}</p>`

                }
                box.innerHTML = content
                return;
            }
        }
        // box.style.display = 'none';

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
        this.generateLootBox(this.getGameState(), 'lootbox', 10);
        this.render()
    }

    render() {
        let renderBoard = this.boardState;
        if ((this.playerSettings.boardOrientation == "2" || this.playerSettings.boardOrientation == "4") && this.activePlayer == 'black') {
            this.board.classList.add('flipped-board');
        } else {
            this.board.classList.remove('flipped-board');
        }
        this.cacheMoveData()
        this.board.innerHTML = '';
        let squareCount = 0;
        for (let i = 0; i < renderBoard.length; i++) {
            for (let j = 0; j < renderBoard[i].length; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                if (renderBoard[i][j] != 404) {
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

                if ((this.playerSettings.boardOrientation == "3" || this.playerSettings.boardOrientation == "4") && this.activePlayer == 'black') {
                    square.classList.add('flipped-tile');
                } else if (this.playerSettings.boardOrientation == "5" && renderBoard[i][j] && renderBoard[i][j].color == 'black') {
                    square.classList.add('flipped-tile');
                }
                if (this.isThisALegalMove(i, j)) {
                    square.classList.add('legal-move');
                }
                if (this.lastPlayedMove.length != 0 && (i == this.lastPlayedMove[0][0] && j == this.lastPlayedMove[0][1] || i == this.lastPlayedMove[1][0] && j == this.lastPlayedMove[1][1])) {
                    square.classList.add('last-move');
                }

                if (renderBoard[i][j] && renderBoard[i][j] != 404) {
                    if (this.isThisALegalMove(i, j)) {
                        square.classList.add('attack-move');
                        if (this.isPieceMergable(this.cachedPieceData.boardData, renderBoard[i][j])) {
                            square.classList.add('mergeable');
                        } else if (renderBoard[i][j].color == this.activePlayer) {
                            square.classList.add('carry-move');
                        }
                    }
                    square.innerHTML = pieces[renderBoard[i][j].type].display[renderBoard[i][j].color];
                    square.setAttribute('piece-name', renderBoard[i][j].type);
                    square.setAttribute('piece-team', renderBoard[i][j].color);
                    if (renderBoard[i][j].carrying) {
                        square.classList.add('carrying-piece');
                        square.innerHTML += pieces[renderBoard[i][j].carrying.type].display[renderBoard[i][j].carrying.color];
                    }
                }

                this.board.appendChild(square, 1);
            }
            if (renderBoard[i].length < BOARDSIZE) {
                for (let j = renderBoard[i].length; j < BOARDSIZE; j++) {
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
        this.renderInfoBox()
    }

    getGameState() {
        return {
            boardState: this.boardState,
            lostPieces: this.lostPieces,
            activePlayer: this.activePlayer,
            selectedPiece: this.selectedPiece?.id,
            cachedPieceData: this.cachedPieceData,
            lastPlayedMove: this.lastPlayedMove,
            modifiedGameData: this.modifiedGameData
        }
    }

    isThisALegalMove(x, y) {
        let legal = this.isLegalMove(x, y);
        return INVERTED_LOGIC != legal;
    }

    isPieceMergable(piece1boardData, piece2) {
        if (!piece2 || !piece1boardData) {
            return false;
        }
        if (piece2?.color != piece1boardData?.color) {
            return false;
        }
        if (!pieces[piece1boardData.type].mergability) {
            return false;
        }
        if (pieces[piece1boardData.type].mergability[piece2.type]) {
            return true;
        }
        return false;
    }

    mergePieces(piece1, piece2Type) {
        return pieces[piece1.type].mergability[piece2Type];
    }

    cacheMoveData() {
        if (!this.cachedPieceData.boardData) {
            return;
        }
        if (!this.selectedPiece) {
            return;
        }
        let attackLocations = []
        let movementLocations = []
        let carryingLocations = []
        if (this.cachedPieceData.pieceData.patterns) {
            attackLocations = this.cachedPieceData.pieceData.patterns.capture ? this.getAllLegalMoves(this.cachedPieceData.pieceData.patterns.capture, true) : []
            movementLocations = this.cachedPieceData.pieceData.patterns.movement ? this.getAllLegalMoves(this.cachedPieceData.pieceData.patterns.movement, false) : []
        }
        if (this.cachedPieceData.boardData.carrying) {
            let carryingPieceType = this.cachedPieceData.boardData.carrying.type
            carryingLocations = pieces[carryingPieceType].patterns.movement ? this.getAllLegalMoves(pieces[carryingPieceType].patterns.movement, false) : []
            movementLocations = [movementLocations, carryingLocations].flat()
        }
        this.cachedPieceData.movementLocations = { attackLocations, movementLocations }
    }

    getAllLegalMoves(patterns, attack = false) {
        let allMoves = []
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
                let coordinates = findCoordinates(pattern);
                for (let j = 0; j < coordinates.oneCoordinates.length; j++) {
                    let coordinate = `${parseInt(this.selectedPiece.id.split(',')[0]) + coordinates.oneCoordinates[j][0] - coordinates.zeroPosition[0]},${parseInt(this.selectedPiece.id.split(',')[1]) + coordinates.oneCoordinates[j][1] - coordinates.zeroPosition[1]}`
                    if (patterns[i].exclude) {
                        allMoves = allMoves.filter(x => x != coordinate);
                    } else {
                        allMoves.push(coordinate);
                    }
                }
            } else if (patterns[i].direction) {
                const locations = this.grabAllLocationsOnALine(parseInt(this.selectedPiece.id.split(',')[0]), parseInt(this.selectedPiece.id.split(',')[1]), patterns[i].direction, patterns[i].distance, patterns[i].jump, attack, patterns[i].extraThickLine);
                for (let j = 0; j < locations.length; j++) {
                    if (patterns[i].exclude) {
                        allMoves = allMoves.filter(x => x != `${locations[j][0]},${locations[j][1]}`);
                    } else {
                        allMoves.push(`${locations[j][0]},${locations[j][1]}`);
                    }

                }
            } else if (patterns[i].everywhere) {
                for (let io = 0; io < this.boardState.length; io++) {
                    for (let j = 0; j < this.boardState[i].length; j++) {
                        if (patterns[i].exclude) {
                            allMoves = allMoves.filter(x => x != `${io},${j}`);
                        } else {
                            allMoves.push(`${io},${j}`);
                        }
                    }
                }
            }
        }
        // strip all cords outside the BOARDSIZE
        for (let index = 0; index < allMoves.length; index++) {
            let [x, y] = allMoves[index].split(',');
            x = parseInt(x);
            y = parseInt(y);
            if (y > BOARDSIZE - 1 || x > BOARDSIZE - 1 || y < 0 || x < 0) {
                allMoves.splice(index, 1);
                index--;
            }
        }
        for (let i = 0; i < allMoves.length; i++) {
            let [x, y] = allMoves[i].split(',');
            x = parseInt(x);
            y = parseInt(y);
            if (this.boardState[x][y] == null) {
                continue;
            }
            if (this.boardState[x][y].type && pieces[this.boardState[x][y].type].ignoresThings) {
                if (pieces[this.boardState[x][y].type].ignoresThings.ignoreKill && this.boardState[x][y].color != this.activePlayer) {
                    allMoves.splice(i, 1);
                    i--;
                } else if (pieces[this.boardState[x][y].type].ignoresThings.ignoreCarry && this.boardState[x][y].color == this.activePlayer && this.cachedPieceData.pieceData.carrying) {
                    allMoves.splice(i, 1);
                    i--;
                }


            } else if (this.boardState[x][y] == 404) {
                allMoves.splice(i, 1);
                i--;
            }
        }
        return allMoves;
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
        if (!this.cachedPieceData.movementLocations) {
            return false;
        }
        if (!friendlyFire && this.boardState[x][y] && this.boardState[x][y].color == this.selectedPiece.getAttribute('piece-team')) {
            if (this.isPieceMergable(this.cachedPieceData.boardData, this.boardState[x][y])) {

            } else if (this.cachedPieceData.pieceData.carrying && !this.boardState[x][y].carrying) {

            } else {
                return false;
            }
        }
        let patterns = this.boardState[x][y] ? 'attackLocations' : 'movementLocations';
        if (!patterns) {
            return false;
        }
        let piece = null
        if (this.boardState[x][y]) {
            piece = this.boardState[x][y].type
        }
        let legalMove = false;
        for (let i = 0; i < this.cachedPieceData.movementLocations[patterns].length; i++) {
            if (this.cachedPieceData.movementLocations[patterns][i] == `${x},${y}`) {
                legalMove = true;
                break;
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

    saveGameState() {
        localStorage.setItem('gameState', JSON.stringify(this.getGameState()));
    }

    handleSquareClick(square) {
        if (this.boardDataSettings.blockInteraction) {
            return;
        }
        if (!this.selectedPiece && square.getAttribute('piece-team') == 'neutral') {
            console.warn('Cannot select neutral pieces at: ' + square.id + '. PieceInfo:', this.boardState[square.id.split(',')[0]][square.id.split(',')[1]]);
        }
        if (this.selectedPiece && this.selectedPiece.id !== square.id) {
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
            if (this.cachedPieceData.pieceData.needsDiscovery && !discoveredPieces[this.cachedPieceData.boardData.type] && !this.boardDataSettings.ignoreUnlocks) {
                discoveredPieces[this.cachedPieceData.boardData.type] = true
                this.gainExperiencePoints('discovering');
                localStorage.setItem('discoveredPieces', JSON.stringify(discoveredPieces))
            }
            let capture;
            square.dataset.selected = false;
            let placeOnOldLocation = null;
            let location = square.id.split(',');
            location = location.map(x => parseInt(x));

            if (this.boardState[location[0]][location[1]]) {
                if (this.boardState[location[0]][location[1]].color != this.activePlayer) {
                    capture = true;
                }
                if (this.boardState[location[0]][location[1]].color == this.activePlayer && this.isPieceMergable(this.cachedPieceData.boardData, this.boardState[location[0]][location[1]])) {
                    let pieceType = this.mergePieces(this.cachedPieceData.boardData, this.boardState[location[0]][location[1]].type)
                    this.gainExperiencePoints('merging');
                    this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]].type = pieceType;
                    if (pieces[pieceType].summonOnBeingMerged) {
                        placeOnOldLocation = { color: this.activePlayer, type: pieces[pieceType].summonOnBeingMerged, moved: true }
                    }
                    // unlock it in the encyclopedia
                    if (pieces[pieceType].needsDiscovery && !discoveredPieces[pieceType] && !this.boardDataSettings.ignoreUnlocks) {
                        discoveredPieces[pieceType] = true
                        this.gainExperiencePoints('discovering');
                        localStorage.setItem('discoveredPieces', JSON.stringify(discoveredPieces))
                    }
                } else if (this.boardState[location[0]][location[1]].color == this.activePlayer && this.cachedPieceData.pieceData.carrying) {
                    if (this.cachedPieceData.boardData.carrying) {
                        placeOnOldLocation = this.cachedPieceData.boardData.carrying;
                    }
                    this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]].carrying = this.boardState[location[0]][location[1]];
                    this.gainExperiencePoints('carrying');
                }

            }

            if (capture) {
                if (pieces[this.boardState[location[0]][location[1]].type].experiencePointsGainType) {
                    this.gainExperiencePoints(pieces[this.boardState[location[0]][location[1]].type].experiencePointsGainType);
                }
                if (this.boardState[location[0]][location[1]].color == 'neutral') {
                    if (this.boardState[location[0]][location[1]].type == 'lootbox') {
                        runLootBoxUnboxing(getLootboxPiece(this.cachedPieceData.boardData.type), this.cachedPieceData.boardData.color, this.boardState, JSON.parse(JSON.stringify(this.cachedPieceData)), this.boardDataSettings.lootBoxAnimation);
                    }
                } else {
                    this.gainExperiencePoints('capturing');
                    let saved = false;
                    if (pieces[this.boardState[location[0]][location[1]].type].captureFlee != undefined) {
                        let yDirection = this.boardState[location[0]][location[1]].color == 'black' ? -1 : 1;
                        if (this.boardState[location[0] + yDirection][location[1]] == null) {
                            if (percentageRandomiser(pieces[this.boardState[location[0]][location[1]].type].captureFlee.percentageChance)) {
                                saved = true;
                                this.boardState[location[0] + yDirection][location[1]] = this.boardState[location[0]][location[1]];
                                this.boardState[location[0] + yDirection][location[1]].moved = true;
                                this.boardState[location[0]][location[1]] = null;
                            }
                        }
                    }
                    if (!saved) {
                        this.lostPieces[this.boardState[location[0]][location[1]].color].push(this.boardState[location[0]][location[1]].type);
                        if (this.boardState[location[0]][location[1]].carrying) {
                            this.lostPieces[this.boardState[location[0]][location[1]].color].push(this.boardState[location[0]][location[1]].carrying.type);
                        }
                        if (!this.boardDataSettings.sandboxChessBoard) {
                            for (let i = 0; i < Object.keys(WIN_CONDITIONS['slainTroops']).length; i++) {
                                if (this.reachedWinConditionCheck(this.boardState[location[0]][location[1]])) {
                                    this.render();
                                    let loser = this.boardState[location[0]][location[1]].color;
                                    setTimeout(() => {
                                        alert(`${loser} has been slain!`);
                                        this.gainExperiencePoints('winning');
                                        this.boardDataSettings.sandboxChessBoard = true;
                                    }, 1);
                                }
                            }
                        }
                    }
                }

                if (this.boardState[location[0]][location[1]] && pieces[this.boardState[location[0]][location[1]].type].needsDiscovery && !discoveredPieces[this.boardState[location[0]][location[1]].type] && !this.boardDataSettings.ignoreUnlocks) {
                    discoveredPieces[this.boardState[location[0]][location[1]].type] = true
                    this.gainExperiencePoints('discovering');
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
                        this.gainExperiencePoints('converting');
                    }
                }
            }

            if (placeOnOldLocation) {
                if (pieces[placeOnOldLocation.type].neutralObject) {
                    placeOnOldLocation.color = 'neutral';
                }
                if (pieces[placeOnOldLocation.type].needsDiscovery && !discoveredPieces[placeOnOldLocation.type] && !this.boardDataSettings.ignoreUnlocks) {
                    discoveredPieces[placeOnOldLocation.type] = true
                    this.gainExperiencePoints('discovering');
                    localStorage.setItem('discoveredPieces', JSON.stringify(discoveredPieces))
                }
                this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]] = placeOnOldLocation;
            } else {
                this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]] = null;
            }
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

    reachedWinConditionCheck(killedPiece) {
        for (let index = 0; index < Object.keys(WIN_CONDITIONS['slainTroops']).length; index++) {
            let amountOfThisPieceDied = this.lostPieces[killedPiece.color].filter(x => x == Object.keys(WIN_CONDITIONS['slainTroops'])[index]).length;
            if (!this.playerIndicators.winConditionsIndicator || !this.boardDataSettings.useWinConditionBoxFunction) {
                updateProgress(killedPiece.color, 'slainTroops', Object.keys(WIN_CONDITIONS['slainTroops'])[index], amountOfThisPieceDied);
            }
            if (amountOfThisPieceDied >= WIN_CONDITIONS['slainTroops'][Object.keys(WIN_CONDITIONS['slainTroops'])[index]]) {
                return true;
            }
        }
        return false;
    }

    generateLootBox(gameState, pieceName = 'lootbox', customPercentage = null) {
        // if empty space exists on the board, spawn a lootbox
        let emptySpaces = []
        for (let i = 0; i < gameState.boardState.length; i++) {
            for (let j = 0; j < gameState.boardState[i].length; j++) {
                if (!gameState.boardState[i][j]) {
                    emptySpaces.push([i, j]);
                }
            }
        }
        if (emptySpaces.length > 0 && percentageRandomiser(customPercentage ? customPercentage : pieces[pieceName].spawnChance)) {
            let randomIndex = Math.floor(Math.random() * emptySpaces.length);
            let [x, y] = emptySpaces[randomIndex];
            if (pieces[pieceName].neutralObject) {
                gameState.boardState[x][y] = { color: 'neutral', type: pieceName };
            } else {
                gameState.boardState[x][y] = { color: this.activePlayer, type: pieceName };
            }
            return true;
        }
        return false;
    }

    switchActivePlayer() {
        this.activePlayer = this.activePlayer == 'white' ? 'black' : 'white';
        this.render();
    }

    afterMove(gameState) {
        this.gainExperiencePoints('moving');
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
        if (!this.boardDataSettings.sandboxChessBoard) {
            for (let index = 0; index < RANDOM_SPAWNING_PIECES.length; index++) {
                this.generateLootBox(gameState, RANDOM_SPAWNING_PIECES[index]);
            }
        }
        this.cacheMoveData();
        this.render();

    }
    grabAllLocationsOnALine(x, y, direction, distance, jump = false, attack = false, extraThickLine = 0) {
        const locations = [];
        const directions = {
            'vertical': { "directions": [[-1, 0], [1, 0]], "offsetDir": [true, false] },
            'horizontal': { "directions": [[0, -1], [0, 1]], "offsetDir": [false, true] },
            'diagonal/': { "directions": [[-1, -1], [1, 1]], "offsetDir": [true, false] },
            'diagonal\\': { "directions": [[-1, 1], [1, -1]], "offsetDir": [false, true] }
        };

        for (const [dx, dy] of directions[direction]["directions"]) {
            let offsetDir = directions[direction]["offsetDir"];
            let offset = extraThickLine != 0 ? extraThickLine * -1 : 0;
            for (let io = 1; io <= Math.floor(extraThickLine * 2 + 1); io++) {
                for (let i = 1; i <= distance; i++) {
                    let newX = x + i * dx;
                    let newY = y + i * dy;
                    if (offsetDir[1] && extraThickLine != 0) {
                        newX += Math.floor(offset + io - 1);
                    }
                    if (offsetDir[0] && extraThickLine != 0) {
                        newY += Math.floor(offset + io - 1);
                    }
                    if (newX < 0 || newX >= BOARDSIZE || newY < 0 || newY >= BOARDSIZE) {
                        break; // Out of bounds
                    }
                    if (this.boardState[newX][newY] != null && !jump) {
                        // pieces can't merge ith this enabled
                        // if (attack && this.boardState[newX][newY].color != this.cachedPieceData.boardData.color || true) {
                        //     locations.push([newX, newY]);
                        // }

                        locations.push([newX, newY]);
                        break; // Obstacle found
                    }

                    locations.push([newX, newY]);
                }
            }

        }
        return locations;
    }

    gainExperiencePoints(action) {
        if (this.boardDataSettings.sandboxChessBoard) {
            return;
        }
        let experiencePointsCache = getExperiencePoints();
        let amount = EXPERIENCE_POINTS[action];
        amount = amount * EXPERIENCE_POINTS_MODIFIER;
        if (amount) {
            experiencePointsCache += amount;
            setExperiencePoints(experiencePointsCache);
        }
        console.log(`Gained ${amount} experience points for:`, action);
    }
}

function setExperiencePoints(xp) {
    experiencePointsCache = xp;
    const chessPlayerData = JSON.parse(localStorage.getItem(getCorrectLocalStorageName('CHESS_PLAYER')));
    chessPlayerData.playerXP = xp;
    localStorage.setItem(getCorrectLocalStorageName('CHESS_PLAYER'), JSON.stringify(chessPlayerData));
}

function getExperiencePoints() {
    const chessPlayerData = JSON.parse(localStorage.getItem(getCorrectLocalStorageName('CHESS_PLAYER')));
    if (!chessPlayerData) {
        localStorage.setItem(getCorrectLocalStorageName('CHESS_PLAYER'), JSON.stringify({ playerXP: 0 }));
        return 0;
    }
    return chessPlayerData.playerXP;
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