// Description: This file contains the logic for the encyclopedia page.
const discoveredPieces = localStorage.getItem('discoveredPieces') ? JSON.parse(localStorage.getItem('discoveredPieces')) : {}

const descriptionBox = document.getElementById('description')
const switchPageBtn = document.getElementById('switchPageBtn')

let currentPage = 'encyclopedia'

function generateGameState(pieceName, x = 4, y = 5) {

    let board = []
    for (let i = 0; i < 8; i++) {
        let row = []
        for (let j = 0; j < 8; j++) {
            if (i === x && j === y) {
                let piece = {
                    "color": "white",
                    "type": pieceName
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

function switchPage() {
    if (currentPage === 'encyclopedia') {
        currentPage = 'other'
        switchPageBtn.textContent = 'Encyclopedia'
        // Hide encyclopedia content
        document.getElementById('buttons').style.display = 'none'
        document.getElementById('chessboard').style.display = 'none'
        document.getElementById('description').style.display = 'none'
        // Show other page content (you'll need to create this)
        showOtherPageContent()
    } else {
        currentPage = 'encyclopedia'
        switchPageBtn.textContent = 'Other Page'
        // Show encyclopedia content
        document.getElementById('buttons').style.display = 'flex'
        document.getElementById('chessboard').style.display = 'grid'
        document.getElementById('description').style.display = 'block'
        // Hide other page content
        hideOtherPageContent()
    }
}

function showOtherPageContent() {
    // Create and append content for the other page
    const otherContent = document.createElement('div')
    otherContent.id = 'otherContent'
    otherContent.innerHTML = '<h2>Mergables Information</h2>'

    // Create buttons for each key in mergablesListDict
    const buttonContainer = document.createElement('div')
    buttonContainer.id = 'mergableButtons'
    buttonContainer.style.display = 'flex'
    buttonContainer.style.flexWrap = 'wrap'
    buttonContainer.style.gap = '10px'
    buttonContainer.style.marginBottom = '20px'

    for (let key of Object.keys(mergablesListDict)) {
        if (!mergablesListDict[key]) {
            continue
        }
        const button = document.createElement('button')
        button.textContent = key
        button.onclick = () => displayMergablesInfo(key)
        buttonContainer.appendChild(button)
    }
    for (let key of Object.keys(summonOnMerge)) {
        if (!summonOnMerge[key] || mergablesListDict[key]) {
            continue
        }
        const button = document.createElement('button')
        button.textContent = key
        button.onclick = () => displayMergablesInfo(key)
        buttonContainer.appendChild(button)
    }

    otherContent.appendChild(buttonContainer)

    // Add a div for displaying mergables info
    const infoDiv = document.createElement('div')
    infoDiv.id = 'mergablesInfoDisplay'
    otherContent.appendChild(infoDiv)

    document.getElementById('main').appendChild(otherContent)
}

function displayMergablesInfo(key) {
    const infoDiv = document.getElementById('mergablesInfoDisplay')
    infoDiv.innerHTML = '' // Clear previous content
    if (!mergablesListDict[key] && !summonOnMerge[key]) {
        return
    }

    const title = document.createElement('h3')
    title.textContent = `Mergables for: ${key}`
    infoDiv.appendChild(title)

    // Create a container for the rows
    const rowsContainer = document.createElement('div')
    rowsContainer.style.display = 'flex'
    rowsContainer.style.flexDirection = 'column'
    rowsContainer.style.gap = '20px'

    // Display mergables
    if (mergablesListDict[key]) {
        const mergablesRow = document.createElement('div')
        mergablesRow.style.backgroundColor = '#f0f0f0'
        mergablesRow.style.padding = '10px'
        mergablesRow.style.borderRadius = '5px'

        const mergablesTitle = document.createElement('h4')
        mergablesTitle.textContent = 'Mergable Combinations:'
        mergablesRow.appendChild(mergablesTitle)

        for (let merge of mergablesListDict[key]) {
            const combination = document.createElement('div')
            combination.style.fontSize = '2.2em'
            combination.style.display = 'flex'
            combination.style.alignItems = 'center'
            combination.style.marginBottom = '10px'

            combination.appendChild(createPieceDisplay(merge.piece1))
            combination.appendChild(createText(' + '))
            combination.appendChild(createPieceDisplay(merge.piece2))
            combination.appendChild(createText(' = '))
            combination.appendChild(createPieceDisplay(merge.creates))

            if (merge.leaveBehind) {
                combination.appendChild(createText(' & '))
                combination.appendChild(createPieceDisplay(merge.leaveBehind))
                // combination.appendChild(createText(')'))
            }

            mergablesRow.appendChild(combination)
        }

        rowsContainer.appendChild(mergablesRow)
    }

    // Display summon on merge
    if (summonOnMerge[key]) {
        const summonRow = document.createElement('div')
        summonRow.style.backgroundColor = '#e0e0e0'
        summonRow.style.padding = '10px'
        summonRow.style.borderRadius = '5px'

        const summonTitle = document.createElement('h4')
        summonRow.appendChild(createPieceDisplay(key))
        summonTitle.textContent = 'Can be summoned when these are created by merge:'
        summonRow.appendChild(summonTitle)

        const summonList = document.createElement('div')
        summonList.style.display = 'flex'
        summonList.style.flexWrap = 'wrap'
        summonList.style.gap = '10px'

        for (let summon of summonOnMerge[key]) {
            summonList.appendChild(createPieceDisplay(summon))
        }

        summonRow.appendChild(summonList)
        rowsContainer.appendChild(summonRow)
    }

    infoDiv.appendChild(rowsContainer)
}

function createPieceDisplay(pieceName) {
    const pieceDiv = document.createElement('div')
    pieceDiv.className = 'square black'
    if (pieces[pieceName] && pieces[pieceName].neutralObject) {
        pieceDiv.innerHTML = pieces[pieceName] ? pieces[pieceName].display.neutral : '???'
    } else {
        pieceDiv.innerHTML = pieces[pieceName] ? pieces[pieceName].display.white : '???'
    }
    return pieceDiv
}

function createText(text) {
    const textNode = document.createTextNode(text)
    return textNode
}

function hideOtherPageContent() {
    // Remove the other page content
    const otherContent = document.getElementById('otherContent')
    if (otherContent) {
        otherContent.remove()
    }
}

function generateChessboard(pieceName) {
    chessboard = new Chessboard(undefined, generateGameState(pieceName), null, { blockInteraction: false, sandboxChessBoard: true, ignoreUnlocks: true });
}

let chessboard;
let mergableShowcase = {}

function goHome() {
    window.location.href = '../'
}

function checkForUnlocked(piece) {
    if (!pieces[piece]) {
        return false
    }
    if (pieces[piece].needsDiscovery && !discoveredPieces[piece]) {
        return false
    }
    return true
}

let allPiecesMakableByMerge = []
let mergablesListDict = {}
let summonOnMerge = {}
for (let piece of Object.keys(pieces)) {
    if (pieces[piece].mergability) {
        for (let piece2 of Object.keys(pieces[piece].mergability)) {
            const type = pieces[piece].mergability[piece2]
            if (type.type) {
                if (type.leaveBehind) {
                    mergablesListDict[type.leaveBehind] = mergablesListDict[type.leaveBehind] || []
                    mergablesListDict[type.leaveBehind].push({ piece1: piece, piece2: piece2, creates: type.type, leaveBehind: type.leaveBehind })
                    allPiecesMakableByMerge.push(type.leaveBehind)
                }
                mergablesListDict[type.type] = mergablesListDict[type.type] || []
                mergablesListDict[type.type].push({ piece1: piece, piece2: piece2, creates: type.type, leaveBehind: type.leaveBehind })
                allPiecesMakableByMerge.push(type.type)
            } else {
                mergablesListDict[type] = mergablesListDict[type] || []
                mergablesListDict[type].push({ piece1: piece, piece2: piece2, creates: type })
                allPiecesMakableByMerge.push(type)
            }
        }
    } else if (pieces[piece].summonOnBeingMerged) {
        allPiecesMakableByMerge.push(pieces[piece].summonOnBeingMerged.type)
        summonOnMerge[pieces[piece].summonOnBeingMerged.type] = summonOnMerge[pieces[piece].summonOnBeingMerged.type] || []
        summonOnMerge[pieces[piece].summonOnBeingMerged.type].push(piece)
    }
}
summonOnMerge['???'] = []
mergablesListDict['???'] = []
for (let piece of Object.keys(pieces)) {
    if (pieces[piece].needsDiscovery && !discoveredPieces[piece]) {
        if (summonOnMerge[piece]) {
            for (let summon of summonOnMerge[piece]) {
                summonOnMerge['???'].push(summon)
            }
            summonOnMerge[piece] = undefined
        }
        if (mergablesListDict[piece]) {
            for (let merge of mergablesListDict[piece]) {
                merge.creates = '???'
                if (merge.leaveBehind && !checkForUnlocked(merge.leaveBehind)) {
                    merge.leaveBehind = '???'
                }
                if (!checkForUnlocked(merge.piece1)) {
                    merge.piece1 = '???'
                }
                if (!checkForUnlocked(merge.piece2)) {
                    merge.piece2 = '???'
                }
                mergablesListDict['???'].push(merge)
            }
            mergablesListDict[piece] = undefined
        }
    } else {
        if (mergablesListDict[piece]) {
            for (let index = 0; index < mergablesListDict[piece].length; index++) {
                if (!checkForUnlocked(mergablesListDict[piece][index].piece1)) {
                    mergablesListDict[piece][index].piece1 = '???'
                }
                if (!checkForUnlocked(mergablesListDict[piece][index].piece2)) {
                    mergablesListDict[piece][index].piece2 = '???'
                }
                if (!checkForUnlocked(mergablesListDict[piece][index].creates)) {
                    mergablesListDict[piece][index].creates = '???'
                }
                if (mergablesListDict[piece][index].leaveBehind && !checkForUnlocked(mergablesListDict[piece][index].leaveBehind)) {
                    mergablesListDict[piece][index].leaveBehind = '???'
                }
            }
        }
    }
}
if (summonOnMerge['???'].length === 0) {
    summonOnMerge['???'] = undefined
}
if (mergablesListDict['???'].length === 0) {
    mergablesListDict['???'] = undefined
}
// filter for duplicaates
console.log(allPiecesMakableByMerge)

allPiecesMakableByMerge = allPiecesMakableByMerge.filter((value, index, self) => self.indexOf(value) === index)
console.log(allPiecesMakableByMerge, summonOnMerge, mergablesListDict)


generateButtons()
generateChessboard(Object.keys(pieces)[0])
setExplenation(Object.keys(pieces)[0])