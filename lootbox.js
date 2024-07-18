function runLootBoxUnboxing(piece, color) {
    const overlay = document.getElementById('lootboxOverlay');
    const lootbox = document.getElementById('lootbox');
    const prize = document.getElementById('prize');
    const spinningStripes = document.getElementById('spinningStripes');

    overlay.style.display = 'flex';

    setTimeout(() => {
        lootbox.classList.add('open');

        setTimeout(() => {
            lootbox.style.display = 'none';
            prize.innerHTML = `<div class="prizeItem">${pieces[piece]["display"][color]}</div>`;
            prize.style.display = 'block';
            spinningStripes.style.display = 'block';

            setTimeout(() => {
                overlay.style.display = 'none';
                lootbox.classList.remove('open');
                prize.style.display = 'none';
                spinningStripes.style.display = 'none';

                lootbox.style.display = 'flex';
            }, 1500);
        }, 1000);
    }, 1000);
}