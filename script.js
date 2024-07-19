const tokenAmount = document.getElementById('tokenAmount')
let tokens = localStorage.getItem('tokens') ? localStorage.getItem('tokens') : 100
tokenAmount.innerHTML = tokens
localStorage.setItem('tokens', tokens)
const lootboxesAmount = document.getElementById('lootboxesAmount')
let lootboxes = localStorage.getItem('lootboxes') ? localStorage.getItem('lootboxes') : 3
localStorage.setItem('lootboxes', lootboxes)
lootboxesAmount.innerHTML = lootboxes
const degugButton = document.getElementById('debugButton')
const sendToStore1 = document.getElementById('sendToStore1')
const lootBoxIcon = document.getElementById('summonLootbox')
const popupOverlay = document.getElementById('popupOverlay');
const noLootboxPopup = document.getElementById('noLootboxPopup');
const goToShopButton = document.getElementById('goToShopButton');
const closePopupButton = document.getElementById('closePopupButton');
const shopButton = document.getElementById('shopButton');
const debugBox = document.getElementById('debugBox');

function debugMessage(message) {
    if (!DEBUG_MODE) {
        return;
    }
    debugBox.innerHTML = message + '| ' + debugBox.innerHTML;
    if (debugBox.innerHTML.length > 1000) {
        debugBox.innerHTML = debugBox.innerHTML.slice(0, 1000);
    }
}

if (!DEBUG_MODE) {
    debugBox.style.display = 'none';
}

function showPopup() {
    popupOverlay.style.display = 'block';
    noLootboxPopup.style.display = 'block';
}

function hidePopup() {
    popupOverlay.style.display = 'none';
    noLootboxPopup.style.display = 'none';
}

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

    lootBoxIcon.addEventListener('click', () => {
        lootboxes = localStorage.getItem('lootboxes') ? localStorage.getItem('lootboxes') : 0
        if (lootboxes <= 0) {
            console.warn('No lootboxes left');
            showPopup();
            return;
        }
        let success = chessboard.generateLootBox(chessboard.getGameState(), 100);
        if (success) {
            lootboxes--;
            lootboxesAmount.innerHTML = lootboxes;
            render();
            localStorage.setItem('lootboxes', lootboxes);
        }
    });

    closePopupButton.addEventListener('click', hidePopup);

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            hidePopup();
        }
    });

    goToShopButton.addEventListener('click', () => {
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()));
        window.location.href = './shop';
    });

    shopButton.addEventListener('click', () => {
        localStorage.setItem('gameState', JSON.stringify(chessboard.getGameState()));
        window.location.href = './shop';
    });

    // degugButton.addEventListener('click', () => {
    //     console.warn('Debugging button clicked')
    // })
};