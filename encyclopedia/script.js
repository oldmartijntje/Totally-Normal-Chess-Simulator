// Description: This file contains the logic for the encyclopedia page.
const discoveredPieces = localStorage.getItem('discoveredPieces') ? JSON.parse(localStorage.getItem('discoveredPieces')) : {}

const descriptionBox = document.getElementById('description')

function generateGameState(pieceName, x = 4, y = 5) {

    let board = []
    for (let i = 0; i < 8; i++) {
        let row = []
        for (let j = 0; j < 8; j++) {
            if (i === x && j === y) {
                let piece = {
                    "color": "white",
                    "type": pieceName,
                    "moved": true
                }
                if (pieces[pieceName].neutralObject) {
                    piece.color = "neutral"
                }
                row.push(piece)
            } else {
                row.push(null)
            }
        }
        board.push(row)
    }

    newGameState = { "boardState": board, "activePlayer": "white", "selectedPiece": `${x},${y}` }
    return newGameState
}

function setExplenation(pieceName) {
    if (pieces[pieceName].description) {
        descriptionBox.innerHTML = pieces[pieceName].description
    } else {
        descriptionBox.innerHTML = "<p>...</p>"
    }
}

function generateButtons() {
    let buttons = document.getElementById('buttons')
    for (let piece of Object.keys(pieces)) {
        let button = document.createElement('button')
        button.innerHTML = piece
        if (pieces[piece].needsDiscovery && !discoveredPieces[piece]) {
            button.disabled = true
            button.innerHTML = '???'
        }
        button.onclick = () => {
            generateChessboard(piece)
            setExplenation(piece)
        }
        buttons.appendChild(button)
    }
}

function generateChessboard(pieceName) {
    chessboard = new Chessboard(undefined, generateGameState(pieceName), null, { blockInteraction: true });
}

let chessboard;


generateButtons()
generateChessboard(Object.keys(pieces)[0])
setExplenation(Object.keys(pieces)[0])