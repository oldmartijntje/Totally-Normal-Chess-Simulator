const canvas = document.getElementById('techTreeCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvas-container');
const infoOverlay = document.getElementById('info-overlay');
const resetButton = document.getElementById('resetButton');
const alertOverlay = document.getElementById('alertOverlay');
const confirmResetButton = document.getElementById('confirmReset');
const cancelResetButton = document.getElementById('cancelReset');

resetButton.addEventListener('click', function () {
    alertOverlay.style.display = 'block';
});

confirmResetButton.addEventListener('click', function () {
    alertOverlay.style.display = 'none';
    resetTechTree();
});

cancelResetButton.addEventListener('click', function () {
    alertOverlay.style.display = 'none';
});

const URL404 = 'https://i.imgur.com/xgsFaaa.png'
BACKGROUND_URL = ''


let experiencePointsCache = 0;
let techTreeCache = {
    0: {
        unocked: true,
    }
}
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

const images = {};

function autoFillRequirements() {
    techTree.forEach(tech => {
        tech.parents = techTree
            .filter(t => t.connections.includes(tech.id))
            .map(t => t.id);
    });
}

function generateCoordinates() {
    const parentClusters = {}; // Store nodes by parent
    const floaterNodes = []; // Store nodes that have no parents
    const radius = 150; // Distance from the parent
    const maxAngleIncrement = 45; // Maximum angle increment
    const maxRootAngleIncrement = 180; // Maximum angle increment for the root node

    function assignClusters() {
        // Assign children to parent node clusters
        techTree.forEach(allNodesNode => {
            if (allNodesNode.parents.length == 0) {
                floaterNodes.push(allNodesNode);
            } else {
                if (!parentClusters[allNodesNode.parents[0]]) {
                    parentClusters[allNodesNode.parents[0]] = [];
                }
                parentClusters[allNodesNode.parents[0]].push(allNodesNode);
            }
        });
    }

    // Start clustering from the root node
    assignClusters();

    function computeCoordinatesForNode(node, parentAngle, index) {
        if (!parentClusters[node.id]) {
            return;
        }
        const children = parentClusters[node.id];
        const numChildren = children.length;

        // Determine the increment angle for the first child
        let incrementPerKid
        if (!node.parents.length == 0) {
            incrementPerKid = maxAngleIncrement * 2 / numChildren;
        } else {
            incrementPerKid = maxRootAngleIncrement * 2 / numChildren;
        }

        children.forEach((childNode, idx) => {
            let angle;
            if (!node.parents.length == 0) {
                angle = parentAngle - maxAngleIncrement + (incrementPerKid * idx) + incrementPerKid / 2;
            } else {
                angle = parentAngle - maxRootAngleIncrement + (incrementPerKid * idx) + incrementPerKid / 2;
            }
            const angleRad = angle * Math.PI / 180;
            childNode.x = node.x + radius * Math.cos(angleRad);
            childNode.y = node.y + radius * Math.sin(angleRad);

            // Recursively compute coordinates for children
            computeCoordinatesForNode(childNode, angle, index + 1);
        });
    }

    // Place the root node at the center of the canvas
    techTree[0].x = canvas.width / 2;
    techTree[0].y = canvas.height / 2;
    floaterNodes.forEach((floaterNode, index) => {
        computeCoordinatesForNode(floaterNode, 0, index);
    });
}

function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    draw();
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function loadImageTryCatch(title, imageSrc) {
    try {
        images[title] = await loadImage(imageSrc);
    } catch (error) {
        console.error('Error loading image:', error);
    }
}

async function preloadImages() {
    for (const tech of techTree) {
        await loadImageTryCatch(tech.id, tech.image);
    }
    await loadImageTryCatch('background_image', BACKGROUND_URL);
    await loadImageTryCatch('404', URL404);
    draw(); // Initial draw after images are preloaded
}

function setXpCounter() {
    // <div class="xp-counter" id="xpCounter">XP: 15000</div>
    const xpCounter = document.getElementById('xpCounter');
    if (!xpCounter) {
        return;
    }
    xpCounter.textContent = `XP: ${experiencePointsCache}`;

}


function drawBackground() {
    // Draw the static background image
    const backgroundImage = images['background_image'];

    if (backgroundImage) {
        // Calculate aspect ratios
        const imageAspectRatio = backgroundImage.width / backgroundImage.height;
        const canvasAspectRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight;

        let xDiff = canvas.width - backgroundImage.width;
        let yDiff = canvas.height - backgroundImage.height;

        // keep the original image aspect ratio, but fit it to the canvas
        if (xDiff >= 0 && yDiff >= 0) {
            drawWidth = backgroundImage.width;
            drawHeight = backgroundImage.height;
        } else {
            if (canvasAspectRatio > imageAspectRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imageAspectRatio;
            } else {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imageAspectRatio;
            }
        }

        // Calculate positions to center the image
        const xOffset = (canvas.width - drawWidth) / 2;
        const yOffset = (canvas.height - drawHeight) / 2;

        // Draw the image
        ctx.drawImage(backgroundImage, xOffset, yOffset, drawWidth, drawHeight);
    } else {
        // Fallback background color if image not loaded
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function cacheProgression() {
    techTreeCache = JSON.parse(localStorage.getItem(getCorrectLocalStorageName('TECH_TREE'))) || { 0: { unlocked: true, } };
    if (!localStorage.getItem(getCorrectLocalStorageName('TECH_TREE'))) {
        localStorage.setItem(getCorrectLocalStorageName('TECH_TREE'), JSON.stringify(techTreeCache));
    }
    const chessPlayerData = JSON.parse(localStorage.getItem(getCorrectLocalStorageName('CHESS_PLAYER')));
    experiencePointsCache = chessPlayerData?.playerXP || 0;
    if (!localStorage.getItem(getCorrectLocalStorageName('CHESS_PLAYER'))) {
        localStorage.setItem(getCorrectLocalStorageName('CHESS_PLAYER'), JSON.stringify({ playerXP: 0 }));
    } else if (!chessPlayerData.playerXP) {
        chessPlayerData.playerXP = 0;
        localStorage.setItem(getCorrectLocalStorageName('CHESS_PLAYER'), JSON.stringify(chessPlayerData));
    }
    setXpCounter();
}

function setExperiencePoints(xp) {
    experiencePointsCache = xp;
    const chessPlayerData = JSON.parse(localStorage.getItem(getCorrectLocalStorageName('CHESS_PLAYER')));
    chessPlayerData.playerXP = xp;
    localStorage.setItem(getCorrectLocalStorageName('CHESS_PLAYER'), JSON.stringify(chessPlayerData));
    setXpCounter();
}

function isUnlocked(id) {
    return techTreeCache[id]?.unlocked;
}

function isEnabled(id) {
    if (!isUnlocked(id)) {
        return false;
    }
    if (techTreeCache[id]?.enabled == undefined) {
        techTreeCache[id].enabled = true;
        localStorage.setItem(getCorrectLocalStorageName('TECH_TREE'), JSON.stringify(techTreeCache));
    }
    return techTreeCache[id]?.enabled;
}

function step(id) {
    cacheProgression();
    setTimeout(() => {
        step(id + 1);
    }, 5000);
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the static background first
    drawBackground();
    setXpCounter();

    // Save the current state
    ctx.save();

    // Apply the translation only for the tech tree content
    ctx.translate(translateX, translateY);

    // Draw connections with conditional line colors
    techTree.forEach(tech => {
        tech.connections.forEach(connId => {
            const connTech = techTree.find(t => t.id === connId);
            if (!connTech) {
                return;
            }

            // Check if the current tech is unlocked
            if (isUnlocked(tech.id)) {
                ctx.strokeStyle = 'yellow'; // Set line color to yellow for unlocked nodes
            } else {
                ctx.strokeStyle = 'black'; // Default color for locked nodes
            }

            ctx.beginPath();
            ctx.lineWidth = 4; // Set line thickness
            ctx.moveTo(tech.x, tech.y);
            ctx.lineTo(connTech.x, connTech.y);
            ctx.stroke();
        });
    });

    // Draw nodes with circular images
    for (const tech of techTree) {
        const radius = 30;
        ctx.beginPath();
        ctx.arc(tech.x, tech.y, radius, 0, 2 * Math.PI);

        // Check if the node is unlocked but not enabled and set the outline color to yelow
        if (isUnlocked(tech.id) && isEnabled(tech.id)) {
            ctx.strokeStyle = 'yellow';
        } else {
            ctx.strokeStyle = 'black';
        }

        ctx.stroke();

        let img = images[tech.id];
        if (!img) {
            // Fallback image if not loaded
            img = images['404'];
        }
        if (img) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(tech.x, tech.y, radius, 0, 2 * Math.PI);
            ctx.clip();

            const size = radius * 2;
            const aspectRatio = img.width / img.height;
            let drawWidth, drawHeight;

            if (aspectRatio > 1) {
                drawHeight = size;
                drawWidth = size * aspectRatio;
            } else {
                drawWidth = size;
                drawHeight = size / aspectRatio;
            }

            if (!isUnlocked(tech.id)) {
                ctx.filter = 'grayscale(100%)';
            }

            ctx.drawImage(img,
                tech.x - drawWidth / 2,
                tech.y - drawHeight / 2,
                drawWidth,
                drawHeight
            );

            ctx.filter = 'none'; // Reset filter for the next drawing
            ctx.restore();
        }

        // Draw text with background and wrap if necessary
        ctx.save();
        const text = getTitle(tech);
        const fontSize = 12;
        const maxWidth = 100; // Maximum width before wrapping
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Wrap text
        const words = text.split(' ');
        let line = '';
        const lines = [];
        words.forEach(word => {
            const testLine = line + (line ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth) {
                lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        });
        lines.push(line);

        // Measure text height
        const textHeight = fontSize * 1.2;
        const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
        const textPadding = 4; // Padding around the text

        // Draw background rectangles
        lines.forEach((line, index) => {
            ctx.fillStyle = 'white'; // Background color
            ctx.fillRect(tech.x - textWidth / 2 - textPadding, tech.y + 45 + index * textHeight - textHeight / 2 - textPadding, textWidth + textPadding * 2, textHeight + textPadding * 2);
        });

        // Draw text
        ctx.fillStyle = 'black'; // Text color
        lines.forEach((line, index) => {
            ctx.fillText(line, tech.x, tech.y + 45 + index * textHeight);
        });
        ctx.restore();
    }

    // Restore the previous state
    ctx.restore();
}



function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX || e.touches[0].clientX) - rect.left - translateX;
    const clickY = (e.clientY || e.touches[0].clientY) - rect.top - translateY;

    techTree.forEach(tech => {
        const dx = tech.x - clickX;
        const dy = tech.y - clickY;
        if (dx * dx + dy * dy <= 900) { // 30^2, where 30 is the radius
            showNodeInfo(tech);
            console.log(tech);
        }
    });
}

function getDescription(tech) {
    if (!tech.hiddenDescription || !tech.parents) {
        return tech.description;
    }
    let unlockParents = [];
    for (let index = 0; index < tech.parents.length; index++) {
        if (!isUnlocked(tech.parents[index])) {
            unlockParents.push(tech.parents[index]);
        }
    }
    if (unlockParents.length > 0) {
        return `First unlock the parent nodes: ${unlockParents.join(', ')}${DEBUG_MODE ? ` (${tech.description})` : ''}`;
    } else {
        return tech.description;
    }

}

function getTitle(tech) {
    if (!tech.hiddenTitle || !tech.parents) {
        return tech.name;
    }
    let unlockParents = [];
    for (let index = 0; index < tech.parents.length; index++) {
        if (!isUnlocked(tech.parents[index])) {
            unlockParents.push(tech.parents[index]);
        }
    }
    if (unlockParents.length > 0) {
        return `???`;
    } else {
        return tech.name;
    }

}

function unlockNode(stringifiedNode) {
    const node = JSON.parse(stringifiedNode);
    let filteredParents = node.parents.filter(x => !isUnlocked(x));
    if (filteredParents.length > 0 && !DEBUG_MODE) {
        return;
    }
    if (experiencePointsCache < node.cost && !DEBUG_MODE) {
        return;
    }
    experiencePointsCache -= node.cost;
    setExperiencePoints(experiencePointsCache);
    techTreeCache[node.id] = { unlocked: true };
    localStorage.setItem(getCorrectLocalStorageName('TECH_TREE'), JSON.stringify(techTreeCache));
    draw();
    showNodeInfo(node);
}

function createButton(text, onClickHandler, isDisabled = false) {
    if (DEBUG_MODE) {
        isDisabled = false;
    }
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClickHandler;
    button.disabled = isDisabled;
    if (text != 'Unlock') {
        button.classList.add(text.toLowerCase());
    }
    return button;
}

function updateTechTreeCache(nodeId, isEnabled, node) {
    techTreeCache[nodeId].enabled = isEnabled;

    localStorage.setItem(getCorrectLocalStorageName('TECH_TREE'), JSON.stringify(techTreeCache));
    draw();
    showNodeInfo(node);
}

function showNodeInfo(node) {
    let filteredParents = node.parents.filter(x => !isUnlocked(x));
    let requires = filteredParents?.length > 0 ? `Requires: ${filteredParents.join(', ')}` : '';
    let cost = !isUnlocked(node.id) ? `<p>Cost: ${node.cost} XP</p>` : '';
    infoOverlay.innerHTML = `
                <h3>${getTitle(node)}</h3>
                <p>ID: ${node.id}</p>
                ${requires}
                ${cost}
                <p>${getDescription(node)}</p>
                <div id="button-container"></div>
            `;
    const buttonContainer = document.getElementById('button-container');
    if (!isUnlocked(node.id)) {
        const button = createButton('Unlock', () => unlockNode(JSON.stringify(node)), filteredParents.length > 0 || experiencePointsCache < node.cost);
        buttonContainer.appendChild(button);
    } else {
        const isNodeEnabled = isEnabled(node.id);
        const button = createButton(isNodeEnabled ? 'Disable' : 'Enable', () => {
            updateTechTreeCache(node.id, !isNodeEnabled, node);
        });
        buttonContainer.appendChild(button);
    }
    infoOverlay.style.display = 'block';
}

function resetTechTree() {
    let experience = 0;
    for (let i = 0; i < techTree.length; i++) {
        if (isUnlocked(techTree[i].id)) {
            experience += techTree[i].cost;
        }
    }
    console.log(experience);
    experience = Math.floor((experience / 4) * 3);
    experience += experiencePointsCache;
    techTreeCache = { 0: { unlocked: true } };
    localStorage.removeItem(getCorrectLocalStorageName('TECH_TREE'));
    setExperiencePoints(experience)
    draw();
}

let dragStartTime;

container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    dragStartTime = new Date().getTime();
});

container.addEventListener('mousemove', (e) => {
    if (isDragging) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        draw();
    }
});

container.addEventListener('mouseup', (e) => {
    const dragEndTime = new Date().getTime();
    const dragDuration = dragEndTime - dragStartTime;

    if (dragDuration < 200 && Math.abs(translateX - (e.clientX - startX)) < 5 && Math.abs(translateY - (e.clientY - startY)) < 5) {
        handleClick(e);
    }
    isDragging = false;
});

container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
        dragStartTime = new Date().getTime();
    }
});

container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        draw();
    }
});

container.addEventListener('touchend', (e) => {
    const dragEndTime = new Date().getTime();
    const dragDuration = dragEndTime - dragStartTime;

    if (dragDuration < 200) {
        handleClick({
            touches: [{ clientX: startX + translateX, clientY: startY + translateY }]
        });
    }
    isDragging = false;
});

container.addEventListener('mouseleave', () => {
    isDragging = false;
});

window.addEventListener('resize', resizeCanvas);

// Initialize
resizeCanvas();
autoFillRequirements();
generateCoordinates();
preloadImages();
step(0);