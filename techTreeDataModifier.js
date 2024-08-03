let techTreeCache;

function cacheProgression() {
    techTreeCache = JSON.parse(localStorage.getItem(getCorrectLocalStorageName('TECH_TREE'))) || { 0: { unlocked: true, } };
    if (!localStorage.getItem(getCorrectLocalStorageName('TECH_TREE'))) {
        localStorage.setItem(getCorrectLocalStorageName('TECH_TREE'), JSON.stringify(techTreeCache));
    }
}

function isUnlockedAndEnabled(techId) {
    return techTreeCache[techId] && techTreeCache[techId].unlocked && techTreeCache[techId].enabled;
}

function filterCachedTechTree(techTreeCache) {
    let enabled = []
    for (let i = 0; i < Object.keys(techTreeCache).length; i++) {
        if (isUnlockedAndEnabled(Object.keys(techTreeCache)[i])) {
            enabled.push(Object.keys(techTreeCache)[i]);
        }
    }
    return enabled;
}

function includes(num) {
    return techTreeCache.includes(`${num}`);
}

cacheProgression();
techTreeCache = filterCachedTechTree(techTreeCache)

console.log(techTreeCache);

if (includes(1)) {
    CREDIT_PURCHASE_BONUS_MULTIPLIER = 1.05;
}
if (includes(2)) {
    CREDIT_PURCHASE_BONUS_MULTIPLIER = 1.1;
}
if (includes(3)) {
    CREDIT_PURCHASE_BONUS_MULTIPLIER = 1.15;
}
if (includes(4)) {
    pieces['pawn'].captureFlee.percentageChance = 5;
    pieces['pawned'].captureFlee.percentageChance = 5;
}
if (includes(5)) {
    pieces['experience_orb'].spawnChance = 1;
}
if (includes(6)) {
    AUTO_BUY_BOXES = 25;
}
if (includes(7)) {
    ON_CAPTURE_GAIN_MATERIALS['gold'] = {
        chance: 10,
        amount: 1,
    };
}
if (includes(8)) {
    EXPERIENCE_POINTS_MODIFIER = 1.05;
}
if (includes(9)) {
    EXPERIENCE_POINTS_MODIFIER = 1.1;
}
if (includes(10)) {
    EXPERIENCE_POINTS_MODIFIER = 1.15;
}
if (includes(11)) {
    pieces['lootbox'].spawnChance = 10; // 10% chance to spawn a lootbox
}
if (includes(12)) {
    pieces['pawned'].summonOnBeingMerged = {
        'type': 'brick',
        'chance': 10,
    }
}
if (includes(13)) {
    pieces['pawn'].killSpree[5] = {
        "function": function () {
            alert("The Goverment has noticed your pawn's kill spree.")
        }
    }
}
if (includes(14)) {
    pieces['pawn'].itemGain.onDeath = {
        'stone': {
            'amount': 1,
            'chance': 100,
        }
    }
}
if (includes(15)) {
    STARTING_INVENTORY['iron'] = 1; // 1 iron ingot
}
if (includes(16)) {
    pieces['pawn'].mergability.pawn = 'procket';
}
if (includes(17)) {
    pieces['procket'].autoMove.chance = 50; // chance to move forward
}
if (includes(18)) {
    pieces['procket'].autoMove.explodeOnImpact.chance = 25; // chance to explode if can't move forward
}
if (includes(19)) {
    // Unlock crafting
}
if (includes(20)) {
    AMOUNT_OF_TWISTS = 4;
}
if (includes(21)) {
    EXPERIENCE_POINTS['capturing'] = EXPERIENCE_POINTS['capturing'] * 2;
}
if (includes(22)) {
    EXPERIENCE_POINTS['winning'] = EXPERIENCE_POINTS['winning'] * 3;
}
if (includes(23)) {
    EXPERIENCE_POINTS['merging'] = EXPERIENCE_POINTS['merging'] * 3;
}
if (includes(24)) {
    EXPERIENCE_POINTS['capturing'] = EXPERIENCE_POINTS['capturing'] * 2;
}
if (includes(25)) {
    EXPERIENCE_POINTS['lootbox_opening'] = 10;
}
if (includes(26)) {
    FREE_LOOTBOX_CHANCE = 5
}
if (includes(27)) {
    pieces['procket'].autoMove.explodeOnImpact.chance = 100;
}
if (includes(30)) {
    FREE_LOOTBOX_CHANCE = 10;
}


if (includes(31)) {
    pieces['procket'].autoMove.chance = 100;
}

// Latest changes
if (includes(28)) {
    pieces['experience_orb'].spawnChance = pieces['experience_orb'].spawnChance * 2;
}
if (includes(29)) {
    let total = EXPERIENCE_POINTS['capturing'] + EXPERIENCE_POINTS['merging'];
    EXPERIENCE_POINTS['capturing'] = total;
    EXPERIENCE_POINTS['merging'] = total;
}
if (includes(32)) {
    pieces['experience_orb'].spawnChance = pieces['experience_orb'].spawnChance * 2;
}