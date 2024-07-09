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

                if (this.boardState[i][j]) {
                    square.innerHTML = pieces[this.boardState[i][j].type].display[this.boardState[i][j].color];
                }

                this.board.appendChild(square, 1);
            }
            squareCount++;
        }
    }

    setupInitialPosition() {
        const squares = this.board.getElementsByClassName('square');

        // Set up white pieces
        for (let i = 0; i < 16; i++) {
            this.boardState[Math.floor((i + 48) / BOARDSIZE)][(i + 48) % BOARDSIZE] = { color: 'white', type: this.pieces.white[i] };
        }

        // Set up black pieces
        for (let i = 0; i < 16; i++) {
            this.boardState[Math.floor(i / BOARDSIZE)][i % BOARDSIZE] = { color: 'black', type: this.pieces.black[i] };
        }
    }

    handleSquareClick(square) {
        if (this.selectedPiece && this.selectedPiece.id !== square.id) {
            let capture;
            if (square.innerHTML) {
                capture = true;
            }
            // square.innerHTML = this.selectedPiece.innerHTML;
            // this.selectedPiece.innerHTML = '';
            square.dataset.selected = false;
            this.boardState[square.id.split(',')[0]][square.id.split(',')[1]] = this.boardState[this.selectedPiece.id.split(',')[0]][this.selectedPiece.id.split(',')[1]];
            this.boardState[this.selectedPiece.id.split(',')[0]][this.selectedPiece.id.split(',')[1]] = null;
            this.selectedPiece = null;
        } else if (this.selectedPiece && this.selectedPiece.id == square.id) {
            this.selectedPiece = null;
        } else if (square.innerHTML) {
            this.selectedPiece = square;
        }
        this.render();
    }
}
