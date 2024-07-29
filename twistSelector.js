if (loadedSettings.twistSelector == "2") {
    document.getElementById('optionsOverlay').style.display = 'none';
}

// Placeholder functions for the overlay
function showOptions(player) {
    document.getElementById(player + 'Confirmation').style.display = 'none';
    const optionsContainer = document.getElementById(player + 'OptionsContainer');
    optionsContainer.innerHTML = ''; // Clear any existing options

    const options = generateOptions(player);

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.onclick = () => selectOption(player, option.id);
        optionElement.innerHTML = `
            <img src="${option.image}" alt="${option.text}">
            <p>${option.text}</p>
        `;
        optionsContainer.appendChild(optionElement);
    });

    document.getElementById(player + 'Options').style.display = 'flex';
}

function selectOption(player, option) {
    console.log(player + ' player selected option ' + option);
    document.getElementById(player + 'Options').style.display = 'none';

    if (player === 'white') {
        document.getElementById('blackConfirmation').style.display = 'block';
    } else {
        document.getElementById('optionsOverlay').style.display = 'none';
        console.log('Game options selection completed');
        createChessboard(gameState);
    }
}

function skipSelection() {
    console.log('Selection skipped');
    document.getElementById('optionsOverlay').style.display = 'none';
}

function generateOptions(player) {
    // This function will generate and return an array of options
    // You can customize this to generate different options for each player
    return [
        { id: 1, image: "https://i.imgur.com/5Tb1TzQ.png", text: "Option 1" },
        { id: 2, image: "https://i.imgur.com/VjbJmAM.png", text: "Option 2" },
        { id: 3, image: "https://i.imgur.com/TbxbWp9.png", text: "Option 3" }
    ];
}