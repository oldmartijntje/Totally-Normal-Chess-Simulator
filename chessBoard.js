class Chessboard {
    constructor(boardElementId) {
        this.pieces = {
            white: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
            black: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟']
        };
        this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.board = document.getElementById(boardElementId);
        this.selectedPiece = null;
        this.characterCodes = {
            '♖': {
                color: 'white',
                type: 'R',
            },
            '♘': {
                color: 'white',
                type: 'N',
            },
            '♗': {
                color: 'white',
                type: 'B',
            },
            '♕': {
                color: 'white',
                type: 'Q',
            },
            '♔': {
                color: 'white',
                type: 'K',
            },
            '♙': {
                color: 'white',
                type: '',
            },
            '♜': {
                color: 'black',
                type: 'R',
            },
            '♞': {
                color: 'black',
                type: 'N',
            },
            '♝': {
                color: 'black',
                type: 'B',
            },
            '♛': {
                color: 'black',
                type: 'Q',
            },
            '♚': {
                color: 'black',
                type: 'K',
            },
            '♟': {
                color: 'black',
                type: '',
            },
        }

        this.createBoard();
    }



    createBoard() {
        for (let i = 0; i < 64; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + Math.floor(i / 8)) % 2 === 0 ? 'white' : 'black');
            square.addEventListener('click', () => this.handleSquareClick(square));

            square.id = `${this.letters[i % 8]}${8 - Math.floor(i / 8)}`;
            this.board.appendChild(square);
        }
        this.setupInitialPosition();
    }

    setupInitialPosition() {
        const squares = this.board.getElementsByClassName('square');

        // Set up white pieces
        for (let i = 0; i < 16; i++) {
            squares[i + 48].textContent = this.pieces.white[i];
        }

        // Set up black pieces
        for (let i = 0; i < 16; i++) {
            squares[i].textContent = this.pieces.black[i];
        }
    }

    handleSquareClick(square) {
        if (this.selectedPiece && this.selectedPiece.id !== square.id) {
            let capture;
            if (square.textContent) {
                capture = true;
            }
            square.textContent = this.selectedPiece.textContent;
            this.selectedPiece.textContent = '';
            this.selectedPiece.style.backgroundColor = '';
            this.selectedPiece = null;
            console.log(`${this.characterCodes[square.textContent] ? this.characterCodes[square.textContent].color + ': ' : ''}${this.characterCodes[square.textContent] ? this.characterCodes[square.textContent].type : ''}${capture ? 'x' : ''}${square.id}`);
        } else if (this.selectedPiece && this.selectedPiece.id == square.id) {
            this.selectedPiece.style.backgroundColor = '';
            this.selectedPiece = null;
        } else if (square.textContent) {
            this.selectedPiece = square;
            square.style.backgroundColor = 'yellow';
        }
    }
}
