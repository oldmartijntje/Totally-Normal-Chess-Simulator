const TWIST_SELECTOR_ID = 'twistSelector.js';
const twists = [
    {
        id: 0,
        name: "Change Piece",
        image: "https://i.imgur.com/cVr2dKE.png",
        description: "Change Zx X piece to Y.",
        options: {
            X: ["pawn", "knight", "bishop", "rook", "queen"],
            Y: [Object.keys(pieces), "random"].flat(),
            Z: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 4, 5]
        },
        splice: { Y: 'X' }, // remove the item chosen in X out of the Y array
        random: Object.keys(pieces),
        usePieceIcons: true
    },
    {
        id: 1,
        name: "Summon Piece",
        image: "https://i.imgur.com/B7oFS1z.png",
        description: "Summon a X piece on a random empty square.",
        options: {
            X: [Object.keys(pieces), "random"].flat(),
        },
        random: Object.keys(pieces),
        usePieceIcons: true
    },
    {
        id: 2,
        name: "Win Condition",
        image: "https://i.imgur.com/qBUbzOY.png",
        description: "Add win condition: Capture X x Y.",
        options: {
            X: [1, 2, 2, 3, 3, 3, 4, 4, 5],
            Y: ["pawn", "knight", "bishop", "rook", "queen"]
        },
    },
    {
        id: 3,
        name: "Upgrade Piece",
        image: "https://i.imgur.com/PMotr8t.png",
        description: "Upgrade a X piece.",
        options: {
            X: ["pawn", "knight", "bishop", "rook", "queen", "random"]

        },
        random: ["pawn", "knight", "bishop", "rook", "queen"],
        usePieceIcons: true
    },
    {
        id: 4,
        name: "Move Piece",
        image: "https://i.imgur.com/rEstsd6.png",
        description: "Move a X piece to a random empty square.",
        options: {
            X: ["pawn", "knight", "bishop", "rook", "queen", "random", "king"],
        },
        random: ["pawn", "knight", "bishop", "rook", "queen", "king"],
    },
    {
        id: 5,
        name: "Switch Pieces",
        image: "https://i.imgur.com/KGpx5Pb.png",
        description: "Shuffle locations All pieces except for X(s).",
        options: {
            X: ["pawn", "knight", "bishop", "rook", "queen", "king", "nothing"],
        }
    }
]
let twistsGenerated = [];
let chosenTwists = {
    'white': undefined,
    'black': undefined
}

allEvents.on('chessboardInit', TWIST_SELECTOR_ID, (gameState) => {
    gameState = chessboard?.getGameState();
    if (loadedSettings.twistSelector == "2" || gameState?.modifiedGameData?.didTwistSelecting) {
        document.getElementById('optionsOverlay').style.display = 'none';
    } else {
        generateTwistOptions()
    }
});

function generateTwistOptions() {
    for (let i = 0; i < AMOUNT_OF_TWISTS + 1; i++) {
        let randomSelectedTemplate = JSON.parse(JSON.stringify(twists[Math.floor(Math.random() * twists.length)]));
        for (let index = 0; index < Object.keys(randomSelectedTemplate.options).length; index++) {
            let optionsKey = Object.keys(randomSelectedTemplate.options)[index];
            // remove the item chosen in X out of the Y array
            if (randomSelectedTemplate.splice && randomSelectedTemplate.splice[optionsKey]) {
                let index = randomSelectedTemplate.options[optionsKey].indexOf(randomSelectedTemplate.options[randomSelectedTemplate.splice[optionsKey]]);
                if (index > -1) {
                    randomSelectedTemplate.options[optionsKey].splice(index, 1);
                }
            }
            let selectedOption = randomSelectedTemplate.options[optionsKey][Math.floor(Math.random() * randomSelectedTemplate.options[optionsKey].length)];
            randomSelectedTemplate.options[optionsKey] = selectedOption;
            randomSelectedTemplate.description = randomSelectedTemplate.description.replace(optionsKey, selectedOption);
            if (pieces[selectedOption] && randomSelectedTemplate.usePieceIcons) {
                randomSelectedTemplate.display = JSON.parse(JSON.stringify(pieces[selectedOption].display));
                randomSelectedTemplate.display.pieceName = selectedOption;
            }
        }
        twistsGenerated.push(
            {
                name: randomSelectedTemplate.name,
                id: randomSelectedTemplate.id,
                image: randomSelectedTemplate.image,
                text: randomSelectedTemplate.description,
                options: randomSelectedTemplate.options,
                display: randomSelectedTemplate.display,
                random: randomSelectedTemplate.random,
                offset: randomSelectedTemplate.offset
            }
        )
    }

}

function neutralizePiece(piece) {
    if (pieces[piece.type].neutralObject) {
        piece.color = 'neutral';
    }
    return piece;
}

function editChessBoard(activeGameState) {
    let reveal = false;
    let revealColor = '';
    let colors = ['white', 'black'];
    for (let i = 0; i < colors.length; i++) {
        if (chosenTwists[colors[i]]) {
            let twist = chosenTwists[colors[i]]
            if (twist.secret) {
                reveal = true;
                revealColor = colors[i];
            }
            switch (twist.id) {
                case 0:
                    if (twist.options.Y === 'random') {
                        twist.options.Y = twist.random[Math.floor(Math.random() * twist.random.length)];
                    }
                    // find a piece of type X and change it to Y
                    let locations = [];
                    activeGameState.boardState.forEach((row, rowIndex) => {
                        row.forEach((square, squareIndex) => {
                            if (square && square.type === twist.options.X && square.color === colors[i]) {
                                locations.push([rowIndex, squareIndex]);
                            }
                        })
                    });
                    for (let index = 0; index < twist.options.Z; index++) {
                        if (locations.length === 0) {
                            break;
                        }
                        let randomLocation = locations[Math.floor(Math.random() * locations.length)];
                        locations.splice(locations.indexOf(randomLocation), 1);
                        activeGameState.boardState[randomLocation[0]][randomLocation[1]] = neutralizePiece({ type: twist.options.Y, color: colors[i] });
                    }
                    break;
                case 1:
                    let emptySquares = [];
                    activeGameState.boardState.forEach((row, rowIndex) => {
                        row.forEach((square, squareIndex) => {
                            if (!square) {
                                emptySquares.push([rowIndex, squareIndex]);
                            }
                        })
                    });
                    let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
                    if (twist.options.X === 'random') {
                        twist.options.X = twist.random[Math.floor(Math.random() * twist.random.length)];
                    }
                    activeGameState.boardState[randomSquare[0]][randomSquare[1]] = neutralizePiece({ type: twist.options.X, color: colors[i] });
                    break;
                case 2:
                    WIN_CONDITIONS.slainTroops[twist.options.Y] = twist.options.X;
                    break;
                case 3:
                    if (twist.options.X === 'random') {
                        twist.options.X = twist.random[Math.floor(Math.random() * twist.random.length)];
                    }
                    // find a piece of type X and change it to Y
                    let foundLocations = [];
                    activeGameState.boardState.forEach((row, rowIndex) => {
                        row.forEach((square, squareIndex) => {
                            if (square && square.type === twist.options.X && square.color === colors[i]) {
                                foundLocations.push([rowIndex, squareIndex]);
                            }
                        })
                    });
                    let randomFoundLocation = foundLocations[Math.floor(Math.random() * foundLocations.length)];
                    let allUpgradesPossible = Object.values(pieces[twist.options.X].mergability);
                    let randomChosenUpgrade = allUpgradesPossible[Math.floor(Math.random() * allUpgradesPossible.length)];
                    if (randomChosenUpgrade.type) {
                        randomChosenUpgrade = randomChosenUpgrade.type;
                    }
                    activeGameState.boardState[randomFoundLocation[0]][randomFoundLocation[1]] = neutralizePiece({ type: randomChosenUpgrade, color: colors[i] });
                    break;
                case 4:
                    if (twist.options.X === 'random') {
                        twist.options.X = twist.random[Math.floor(Math.random() * twist.random.length)];
                    }
                    // find a piece of type X and change it to Y
                    let foundPositions = [];
                    activeGameState.boardState.forEach((row, rowIndex) => {
                        row.forEach((square, squareIndex) => {
                            if (square && square.type === twist.options.X && square.color === colors[i]) {
                                foundPositions.push([rowIndex, squareIndex]);
                            }
                        })
                    });
                    let emptyPositions = [];
                    activeGameState.boardState.forEach((row, rowIndex) => {
                        row.forEach((square, squareIndex) => {
                            if (!square) {
                                emptyPositions.push([rowIndex, squareIndex]);
                            }
                        })
                    });
                    let newLocation = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
                    let randomPosition = foundPositions[Math.floor(Math.random() * foundPositions.length)];
                    activeGameState.boardState[newLocation[0]][newLocation[1]] = activeGameState.boardState[randomPosition[0]][randomPosition[1]];
                    activeGameState.boardState[randomPosition[0]][randomPosition[1]] = null;

                    break;

                case 5:
                    let foundPositionsOfPieces = [];
                    let foundPiecesTotal = [];
                    activeGameState.boardState.forEach((row, rowIndex) => {
                        row.forEach((square, squareIndex) => {
                            if (square && (square.type != twist.options.X) && square.color === colors[i]) {
                                foundPositionsOfPieces.push([rowIndex, squareIndex]);
                                foundPiecesTotal.push(square);
                            }
                        })
                    });
                    // shuffle both list orders
                    foundPositionsOfPieces.sort(() => Math.random() - 0.5);
                    foundPiecesTotal.sort(() => Math.random() - 0.5);
                    // loop through the items, and set the location of index with piece of the other list
                    foundPositionsOfPieces.forEach((position, index) => {
                        activeGameState.boardState[position[0]][position[1]] = foundPiecesTotal[index];
                    });
                    break;
                default:
                    break;
            }
        }
    }
    if (reveal) {
        alert(`The hidden twist is: ${chosenTwists[revealColor].oldData.text}`);

    }
    return activeGameState;



}

// Placeholder functions for the overlay
function showOptions(player) {
    document.getElementById(player + 'Confirmation').style.display = 'none';
    generateOptions(player);

    document.getElementById(player + 'Options').style.display = 'flex';
}

function selectOption(player, option) {
    chosenTwists[player] = option;
    document.getElementById(player + 'Options').style.display = 'none';

    if (player === 'white') {
        document.getElementById('blackConfirmation').style.display = 'block';
    } else {
        document.getElementById('optionsOverlay').style.display = 'none';
        gameState = chessboard.getGameState();
        if (!gameState.modifiedGameData) {
            gameState.modifiedGameData = {};
        }
        gameState.modifiedGameData.didTwistSelecting = true;
        gameState.winConditions = WIN_CONDITIONS
        gameState = editChessBoard(gameState);
        createChessboard(gameState);
        updateWinConditionBox();
    }
}

function skipSelection() {
    gameState = chessboard.getGameState();
    if (!gameState.modifiedGameData) {
        gameState.modifiedGameData = {};
    }
    gameState.modifiedGameData.didTwistSelecting = true;
    createChessboard(gameState);
    document.getElementById('optionsOverlay').style.display = 'none';
}

function generateOptions(player) {
    const optionsContainer = document.getElementById(player + 'OptionsContainer');
    optionsContainer.innerHTML = ''; // Clear any existing options

    // shuffle order, but keep the last one as the last option
    let lastOption = twistsGenerated.pop();
    if (!lastOption.oldData) {
        lastOption.oldData = {
            text: lastOption.text,
            display: lastOption.display,
            image: lastOption.image,
        }
    }
    lastOption.text = '???';
    lastOption.display = undefined;
    lastOption.image = 'https://i.imgur.com/L2QFLNn.png';
    lastOption.secret = true;
    twistsGenerated.sort(() => Math.random() - 0.5);
    twistsGenerated.push(lastOption);

    const options = twistsGenerated;

    options.forEach(option => {
        let color = player;
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.onclick = () => selectOption(player, option);
        if (option.display) {
            if (pieces[option.display.pieceName].neutralObject) {
                color = 'neutral';
            }
            optionElement.innerHTML = `
            <div class="square">${option.display[color]}</div>
            <p>${option.text}</p>
        `;
        } else {
            optionElement.innerHTML = `
            <div class="square"><img src="${option.image}" alt="${option.text}"></div>
            <p>${option.text}</p>
        `;
        }
        optionsContainer.appendChild(optionElement);
    });
}