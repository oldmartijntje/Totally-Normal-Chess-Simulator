class Chessboard {
    constructor(boardElementId = 'chessboard') {
        this.pieces = {
            white: ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
            black: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn']
        };
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.board = document.getElementById(boardElementId);
        this.boardState = new Array(BOARDSIZE).fill(null).map(() => new Array(BOARDSIZE).fill(null));
        console.log(this.boardState);
        this.selectedPiece = null
        this.cachedPieceData = {
            pieceData: null,
            boardData: null,
            location: null
        }

        this.createBoard();
    }



    createBoard() {
        this.setupInitialPosition();
        this.render()
    }

    render() {
        this.board.innerHTML = '';
        let squareCount = 0;
        // console.log(this.boardState)
        for (let i = 0; i < this.boardState.length; i++) {
            for (let j = 0; j < this.boardState[i].length; j++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
                square.addEventListener('click', () => this.handleSquareClick(square));

                square.id = `${i},${j}`;
                if (this.selectedPiece && this.selectedPiece.id == square.id) {
                    square.style.backgroundColor = 'yellow';
                }
                if (this.isLegalMove(i, j)) {
                    square.classList.add('legal-move');
                }

                if (this.boardState[i][j]) {
                    square.innerHTML = pieces[this.boardState[i][j].type].display[this.boardState[i][j].color];
                    square.setAttribute('piece-name', this.boardState[i][j].type);
                    square.setAttribute('piece-team', this.boardState[i][j].color);
                }

                this.board.appendChild(square, 1);
            }
            squareCount++;
        }
    }

    isLegalMove(x, y) {
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
                        console.log(coordinates)
                    }
                }
            } else if (patterns[i].direction) {
                const locations = grabAllLocationsOnALine(x, y, patterns[i].direction, patterns[i].distance, patterns[i].jump);
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
        if (this.selectedPiece && this.selectedPiece.id !== square.id) {
            let capture;
            if (square.innerHTML) {
                capture = true;
            }
            square.dataset.selected = false;
            this.boardState[square.id.split(',')[0]][square.id.split(',')[1]] = this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]];
            this.boardState[square.id.split(',')[0]][square.id.split(',')[1]].moved = true;
            this.boardState[this.cachedPieceData.location[0]][this.cachedPieceData.location[1]] = null;
            this.selectedPiece = null;
            this.cachedPieceData = {
                pieceData: null,
                boardData: null,
                location: null
            }

            // Should re-add the notation logging.
            // console.log(`${this.characterCodes[square.innerHTML] ? this.characterCodes[square.innerHTML].color + ': ' : ''}${this.characterCodes[square.innerHTML] ? this.characterCodes[square.innerHTML].type : ''}${capture ? 'x' : ''}${square.id}`);
        } else if (this.selectedPiece && this.selectedPiece.id == square.id) {
            this.selectedPiece = null;
            this.cachedPieceData = {
                pieceData: null,
                boardData: null,
                location: null
            }
        } else if (square.innerHTML) {

            this.selectedPiece = square;
            this.cachedPieceData = {
                pieceData: pieces[square.getAttribute('piece-name')],
                boardData: this.boardState[this.selectedPiece.id.split(',')[0]][this.selectedPiece.id.split(',')[1]],
                location: this.selectedPiece.id.split(',')
            }

        }
        this.render();
    }
}

function grabAllLocationsOnALine(x, y, direction, distance, jump = false) {

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