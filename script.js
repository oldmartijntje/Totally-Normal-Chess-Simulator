const tokenAmount = document.getElementById('tokenAmount')
let tokens = localStorage.getItem('tokens') ? localStorage.getItem('tokens') : 100
tokenAmount.innerHTML = tokens

const sendToStore = document.getElementById('sendToStore')

window.onload = () => {


    gameState = localStorage.getItem('gameState') ? JSON.parse(localStorage.getItem('gameState')) : undefined;
    localStorage.removeItem('gameState')

    const chessboard = new Chessboard(undefined, gameState);

    sendToStore.addEventListener('click', () => {
        localStorage.setItem('tokens', tokens)
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()))
        window.location.href = './store'
    })
};