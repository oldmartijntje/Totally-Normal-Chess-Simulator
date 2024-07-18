const tokenAmount = document.getElementById('tokenAmount')
let tokens = localStorage.getItem('tokens') ? localStorage.getItem('tokens') : 100
tokenAmount.innerHTML = tokens
const degugButton = document.getElementById('debugButton')

const sendToStore = document.getElementById('sendToStore')

function percentageRandomiser(percent) {
    return Math.random() <= percent / 100;
}

window.onload = () => {
    console.log(setupData)

    gameState = localStorage.getItem('gameState') ? JSON.parse(localStorage.getItem('gameState')) : undefined;
    localStorage.removeItem('gameState')

    const chessboard = new Chessboard(undefined, gameState);

    sendToStore.addEventListener('click', () => {
        localStorage.setItem('tokens', tokens)
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()))
        window.location.href = './store'
    })

    degugButton.addEventListener('click', () => {
        console.warn('Debugging button clicked')
        runLootBoxUnboxing("pawn", 'black')
    })
};