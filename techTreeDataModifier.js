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