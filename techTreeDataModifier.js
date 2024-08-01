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
    pieces['experience_orb'].spawnChance = 5;
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
    XP_BONUS_MULTIPLIER = 1.05;
}
if (includes(9)) {
    XP_BONUS_MULTIPLIER = 1.1;
}
if (includes(10)) {
    XP_BONUS_MULTIPLIER = 1.15;
}
if (includes(11)) {
    pieces['lootbox'].spawnChance = 10;
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