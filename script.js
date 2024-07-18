const tokenAmount = document.getElementById('tokenAmount')
let tokens = localStorage.getItem('tokens') ? localStorage.getItem('tokens') : 100
tokenAmount.innerHTML = tokens
const lootboxesAmount = document.getElementById('lootboxesAmount')
let lootboxes = localStorage.getItem('lootboxes') ? localStorage.getItem('lootboxes') : 3
lootboxesAmount.innerHTML = lootboxes
const degugButton = document.getElementById('debugButton')
const sendToStore1 = document.getElementById('sendToStore1')
const sendToStore2 = document.getElementById('sendToStore2')
const lootBoxIcon = document.getElementById('lootBoxIcon')

let chessboard

function percentageRandomiser(percent) {
    let x = percent / 100
    let y = Math.random()
    return y <= x
}

function render() {
    if (chessboard) {
        chessboard.render()
    }
}

window.onload = () => {
    console.log(setupData)

    gameState = localStorage.getItem('gameState') ? JSON.parse(localStorage.getItem('gameState')) : undefined;
    localStorage.removeItem('gameState')

    chessboard = new Chessboard(undefined, gameState);

    sendToStore1.addEventListener('click', () => {
        localStorage.setItem('tokens', tokens)
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()))
        window.location.href = './store'
    })
    sendToStore2.addEventListener('click', () => {
        localStorage.setItem('lootboxes', lootboxes)
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()))
        window.location.href = './store'
    })

    lootBoxIcon.addEventListener('click', () => {
        if (lootboxes <= 0) {
            console.warn('No lootboxes left')
            alert('No lootboxes left')
            return
        }
        let success = chessboard.generateLootBox(chessboard.getGameState(), 100);
        if (success) {
            lootboxes--
            lootboxesAmount.innerHTML = lootboxes
            render()
            localStorage.setItem('lootboxes', lootboxes)
        }
    })

    degugButton.addEventListener('click', () => {
        console.warn('Debugging button clicked')
        // runLootBoxUnboxing(getLootboxPiece(), 'black')
    })
};