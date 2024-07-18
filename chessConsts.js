const BOARDSIZE = 8;
const INFINITE = BOARDSIZE * BOARDSIZE
const friendlyFire = false;
const UNLOCK_MOVEMENT = false;
const INVERTED_LOGIC = false;
const LOOTBOX_SPAWN_PERCENTAGE = 5

const winConditions = {
    slainTroops: {
        'king': 1,
        // 'pawn': 8 // funy
    }
}

const pieces = {
    'rook': {
        patterns: {
            movement: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
            ],
            capture: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
            ],
        },
        display: {
            // white: '♖',
            // black: '♜',
            white: '<img src="https://i.imgur.com/dzq4vtf.png">',
            black: '<img src="https://i.imgur.com/iQBNl18.png">',
        },
        notationType: 'R',

    },
    'knight': {
        patterns: {
            movement: [{
                area: [
                    [null, 1, null, 1, null],
                    [1, null, null, null, 1],
                    [null, null, 0, null, null],
                    [1, null, null, null, 1],
                    [null, 1, null, 1, null],
                ]
            }],
            capture: [{
                area: [
                    [null, 1, null, 1, null],
                    [1, null, null, null, 1],
                    [null, null, 0, null, null],
                    [1, null, null, null, 1],
                    [null, 1, null, 1, null],
                ],

            },
                // { everywhere: true, exclude: true }, // funny
                // { everywhere: true, type: ['pawn'] },
            ],
        },
        display: {
            // white: '♘',
            // black: '♞',
            white: '<img src="https://i.imgur.com/SXaYjIk.png">',
            black: '<img src="https://i.imgur.com/iXtJNpw.png">',
        },
        notationType: 'N',
    },
    'bishop': {
        patterns: {
            movement: [
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
            capture: [
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
        },
        display: {
            // white: '♗',
            // black: '♝',
            white: '<img src="https://i.imgur.com/vIA5kSR.png">',
            black: '<img src="https://i.imgur.com/yhW9ulD.png">'
        },
        notationType: 'B',
    },
    'queen': {
        patterns: {
            movement: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
            capture: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
        },
        display: {
            // white: '♕',
            // black: '♛',
            white: '<img src="https://i.imgur.com/PAPV0hG.png">',
            black: '<img src="https://i.imgur.com/j6QeiaI.png">'
        },
        notationType: 'Q',
    },
    'king': {
        patterns: {
            movement: [
                { direction: 'vertical', distance: 1, jump: false },
                { direction: 'horizontal', distance: 1, jump: false },
                { direction: 'diagonal/', distance: 1, jump: false },
                { direction: 'diagonal\\', distance: 1, jump: false },
            ],
            capture: [
                { direction: 'vertical', distance: 1, jump: false },
                { direction: 'horizontal', distance: 1, jump: false },
                { direction: 'diagonal/', distance: 1, jump: false },
                { direction: 'diagonal\\', distance: 1, jump: false }
            ],
        },
        display: {
            // white: '♔',
            // black: '♚',
            white: '<img src="https://i.imgur.com/wfis9bD.png">',
            black: '<img src="https://i.imgur.com/YAdx7Sr.png">'
        },
        notationType: 'K',
    },
    'pawn': {
        patterns: {
            movement: [
                { direction: 'vertical', distance: 2, jump: false },
                {
                    area: [
                        [null, 1, null],
                        [null, null, null],
                        [null, 0, null],
                        [null, 1, null],
                        [null, 1, null],
                    ],
                    unmoved: [
                        [null, 0, null],
                        [null, 1, null],
                        [null, 1, null],
                    ],
                    exclude: true,
                    flipForBlack: true,
                }
            ],
            capture: [
                {
                    area: [
                        [1, null, 1],
                        [null, 0, null],
                        [null, null, null],
                    ],
                    flipForBlack: true,
                }
            ],
        },
        display: {
            // white: '♙',
            // black: '♟',
            white: '<img src="https://i.imgur.com/wJM6aPc.png">',
            black: '<img src="https://i.imgur.com/1TN3hWU.png">',
        },
        notationType: '',
        convertion: {
            rows: [0],
            collumns: [0, 1, 2, 3, 4, 5, 6, 7],
            convertsTo: 'queen',
        }
    },
    'lootbox': {
        display: {
            neutral: `<div class="container">
  <div class="box">
  <div class="upper"></div>
  <div class="lower"></div>
  <div class="latch"></div>
  </div>
</div>`,
        }
    }
}