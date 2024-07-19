const animationMultiplier = 1

function runLootBoxUnboxing(piece, color, chessBoardState = null, cachedPieceData = null) {
    const overlay = document.getElementById('lootboxOverlay');
    const lootbox = document.getElementById('lootbox');
    const prize = document.getElementById('prize');
    const spinningStripes = document.getElementById('spinningStripes');

    overlay.style.display = 'flex';

    setTimeout(() => {
        lootbox.classList.add('open');

        setTimeout(() => {
            lootbox.style.display = 'none';

            if (pieces[piece].neutralObject) {
                color = 'neutral';
            }
            prize.innerHTML = `<div class="prizeItem">${pieces[piece]["display"][color]}</div>`;
            prize.style.display = 'block';
            spinningStripes.style.display = 'block';

            setTimeout(() => {
                overlay.style.display = 'none';
                lootbox.classList.remove('open');
                prize.style.display = 'none';
                spinningStripes.style.display = 'none';

                lootbox.style.display = 'flex';
                debugMessage('played animation for lootbox unboxing');
                spawnLootboxPiece(piece, color, chessBoardState, cachedPieceData);
            }, 1500 * animationMultiplier);
        }, 1000 * animationMultiplier);
    }, 1000 * animationMultiplier);
}

function spawnLootboxPiece(piece, color, chessBoardState, cachedPieceData) {
    if (!cachedPieceData || !chessBoardState) {
        return;
    }
    if (pieces[piece].neutralObject) {
        color = 'neutral';
    }
    let location = cachedPieceData.location;
    chessBoardState[parseInt(location[0])][parseInt(location[1])] = {
        type: piece,
        color: color,
    }
    debugMessage('spawned piece from lootbox: ' + piece + ' at ' + location);
    render()

}

function getLootboxPiece(capturingPiece = null) {
    // grab 5 items from piece
    // then, add pieces[the items]['lootbox']['weight'] to the array
    // then, add the capturingPiece * LOOTBOX_CAPTURING_PIECE_WEIGHT times to the array
    // then, shuffle the array
    // then, return the first item from the array
    let lootboxPieces = []
    for (let i = 0; i < 5; i++) {
        let type = Object.keys(pieces)[Math.floor(Math.random() * Object.keys(pieces).length)]
        if (!pieces[type]['lootbox']) {
            continue
        }
        for (let j = 0; j < Math.floor(pieces[type]['lootbox']['weight'] * 10); j++) {
            lootboxPieces.push(type)
        }
    }
    if (capturingPiece) {
        for (let i = 0; i < LOOTBOX_CAPTURING_PIECE_WEIGHT; i++) {
            lootboxPieces.push(capturingPiece)
        }
    }
    lootboxPieces = shuffle(lootboxPieces)
    // console.log(lootboxPieces.length, lootboxPieces.find((x) => x === 'lootbox') != undefined, lootboxPieces[0] == 'lootbox')

    debugMessage('piece to spawn in lootbox: ' + lootboxPieces[0])
    return lootboxPieces[0]
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
