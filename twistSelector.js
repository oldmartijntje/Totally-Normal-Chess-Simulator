const twists = [
    {
        id: 0,
        name: "Change Piece",
        image: "https://i.imgur.com/5Tb1TzQ.png",
        description: "Change a X piece to Y.",
        options: {
            X: ["pawn", "knight", "bishop", "rook", "queen"],
            Y: [Object.keys(pieces), "random"].flat()
        },
        random: Object.keys(pieces)
    },
    {
        id: 1,
        name: "Summon Piece",
        image: "https://i.imgur.com/VjbJmAM.png",
        description: "Summon a X piece on a random empty square.",
        options: {
            X: [Object.keys(pieces), "random"].flat(),
        },
        random: Object.keys(pieces)
    },
    {
        id: 2,
        name: "Win Condition",
        image: "https://i.imgur.com/TbxbWp9.png",
        description: "Add win condition: Capture X x Y.",
        options: {
            X: [1, 2, 2, 3, 3, 3, 4, 4, 5],
            Y: ["pawn", "knight", "bishop", "rook", "queen"]
        },
    },
    {
        id: 3,
        name: "Upgrade Piece",
        image: "https://i.imgur.com/5Tb1TzQ.png",
        description: "Upgrade a X piece.",
        options: {
            X: ["pawn", "knight", "bishop", "rook", "queen"],
        },
    },
    {
        id: 4,
        name: "Move Piece",
        image: "https://i.imgur.com/5Tb1TzQ.png",
        description: "Move a X piece to YZ.",
        options: {
            X: ["pawn", "knight", "bishop", "rook", "queen"],
            Y: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            Z: [3, 4, 5, 6]
        },
    }
]
let twistsGenerated = [];
let chosenTwists = {
    'white': undefined,
    'black': undefined
}
if (loadedSettings.twistSelector == "2") {
    document.getElementById('optionsOverlay').style.display = 'none';
} else {
    generateTwistOptions()
}

function generateTwistOptions() {
    for (let i = 0; i < AMOUNT_OF_TWISTS; i++) {
        let randomSelectedTemplate = JSON.parse(JSON.stringify(twists[Math.floor(Math.random() * twists.length)]));
        console.log(randomSelectedTemplate)
        for (let index = 0; index < Object.keys(randomSelectedTemplate.options).length; index++) {
            let selectedOption = randomSelectedTemplate.options[Object.keys(randomSelectedTemplate.options)[index]][Math.floor(Math.random() * randomSelectedTemplate.options[Object.keys(randomSelectedTemplate.options)[index]].length)];
            randomSelectedTemplate.options[Object.keys(randomSelectedTemplate.options)[index]] = selectedOption;
            randomSelectedTemplate.description = randomSelectedTemplate.description.replace(Object.keys(randomSelectedTemplate.options)[index], selectedOption);
            if (pieces[selectedOption]) {
                randomSelectedTemplate.display = JSON.parse(JSON.stringify(pieces[selectedOption].display));
                randomSelectedTemplate.display.pieceName = selectedOption;
            }
        }
        console.log(randomSelectedTemplate)
        twistsGenerated.push(
            {
                id: randomSelectedTemplate.id,
                image: randomSelectedTemplate.image,
                text: randomSelectedTemplate.description,
                options: randomSelectedTemplate.options,
                display: randomSelectedTemplate.display,
                random: randomSelectedTemplate.random
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
    let colors = ['white', 'black'];
    for (let i = 0; i < colors.length; i++) {
        if (chosenTwists[colors[i]]) {
            let twist = chosenTwists[colors[i]]
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
                    let randomLocation = locations[Math.floor(Math.random() * locations.length)];
                    activeGameState.boardState[randomLocation[0]][randomLocation[1]] = neutralizePiece({ type: twist.options.Y, color: colors[i] });
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
                // case 2:
                //     let winCondition = {
                //         piece: twist.options.Y,
                //         amount: twist.options.X
                //     }
                //     activeGameState.winConditions.push(winCondition);
                //     break;
                // case 3:
                //     let upgradedPiece = pieces[twist.options.X].upgradesTo;
                //     activeGameState.boardState[0][0] = upgradedPiece;
                //     break;
                // case 4:
                //     let pieceToMove = twist.options.X;
                //     let row = twist.options.Y;
                //     let column = twist.options.Z;
                //     activeGameState.boardState[row][column] = pieceToMove;
                //     break;
                // default:
                //     break;
            }
        }
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
    console.log(chosenTwists);
    document.getElementById(player + 'Options').style.display = 'none';

    if (player === 'white') {
        document.getElementById('blackConfirmation').style.display = 'block';
    } else {
        document.getElementById('optionsOverlay').style.display = 'none';
        console.log('Game options selection completed');
        gameState = chessboard.getGameState();
        gameState = editChessBoard(gameState);
        createChessboard(gameState);
    }
}

function skipSelection() {
    console.log('Selection skipped');
    document.getElementById('optionsOverlay').style.display = 'none';
}

function generateOptions(player) {
    const optionsContainer = document.getElementById(player + 'OptionsContainer');
    optionsContainer.innerHTML = ''; // Clear any existing options

    // shuffle order
    twistsGenerated = twistsGenerated.sort(() => Math.random() - 0.5);
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