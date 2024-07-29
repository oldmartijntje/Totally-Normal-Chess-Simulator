const BOARDSIZE = 8;
const INFINITE = BOARDSIZE * BOARDSIZE
const friendlyFire = false;
const UNLOCK_MOVEMENT = false;
const INVERTED_LOGIC = false;
const LOOTBOX_SPAWN_PERCENTAGE = 5
const LOOTBOX_CAPTURING_PIECE_WEIGHT = 5
const DEBUG_MODE = false;
const FORCE_PLAYER_TURNS = true;
const STARTING_PLAYER = 'white';
const LOOTBOX_RARITY_MODIFIER = 10;
const AMOUNT_OF_TWISTS = 3;

const WIN_CONDITIONS = {
    slainTroops: {
        'king': 1,
        // 'pawn': 8 // funy
    }
}

const defaultSettings = {
    boardOrientation: "5",
    aiOpponent: "1",
    allowLootboxSummoning: "1",
    checkmateDetection: "2",
    twistSelector: "1"
};

const pieces = {
    'rook': {
        lootbox: {
            weight: 10,
        },
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
            white: '<img src="https://i.imgur.com/dzq4vtf.png">',
            black: '<img src="https://i.imgur.com/iQBNl18.png">',
            // white: '♖',
            // black: '♜',
        },
        mergability: {
            'rook': 'reversed-rook',
        }

    },
    'knight': {
        lootbox: {
            weight: 20,
        },
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
        description: "<p>Jumps over pieces.</p>",
        mergability: {
            'knight': 'winged-knight',
        }

    },
    'bishop': {
        lootbox: {
            weight: 20,
        },
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
        mergability: {
            'bishop': 'double-bishop',
        }
    },
    'queen': {
        lootbox: {
            weight: 5,
        },
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
        mergability: {
            'queen': 'royal-queen',
        }
    },
    'king': {
        lootbox: {
            weight: 0,
        },
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
        description: "<p>Once captured, you lose.</p><p><a href=\"https://en.wikipedia.org/wiki/Castling\" target=\"_blank\">Castling</a> is not a thing.</p>"
    },
    'pawn': {
        lootbox: {
            weight: 2.5,
        },
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
        description: "<p>First move can move 2 spaces forward instead of 1<br>Attacks diagonally forward.<br>Transforms into a queen once you reach the opposite side of the board.<br>Black moves in the opposite direction.</p><p><a href=\"https://en.wikipedia.org/wiki/En_passant\" target=\"_blank\">En passant</a> is not a thing.</p>",
        convertion: {
            rows: [0],
            collumns: [0, 1, 2, 3, 4, 5, 6, 7],
            convertsTo: 'queen',
        },
        mergability: {
            'pawn': 'pawned',
        }
    },
    'lootbox': {
        lootbox: {
            weight: 1,
        },
        neutralObject: true,
        needsDiscovery: true,
        description: "<p>Once captured, you will get a random piece.<br>Spawns randomly and can be bought.</p>",
        display: {
            neutral: `<div class="container">
  <div class="box">
  <div class="upper"></div>
  <div class="lower"></div>
  <div class="latch"></div>
  </div>
</div>`,
        }
    },
    'reversed-rook': {
        lootbox: {
            weight: 1,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'horizontal', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'vertical', distance: INFINITE, jump: false, exclude: true },
                { direction: 'horizontal', distance: INFINITE, jump: false, exclude: true },

            ],
            capture: [
                { direction: 'vertical', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'horizontal', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'vertical', distance: INFINITE, jump: false, exclude: true },
                { direction: 'horizontal', distance: INFINITE, jump: false, exclude: true },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/KiRlbQJ.png">',
            black: '<img src="https://i.imgur.com/9sCgUI8.png">',
        },
        needsDiscovery: true,
        description: "<p>Unlocked by merging 2 rooks.<br>It can carry other pieces.</p>",
        carrying: true,

    },
    'winged-knight': {
        lootbox: {
            weight: 2,
        },
        patterns: {
            movement: [{
                area: [
                    [null, null, 1, null, null, null, 1, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [1, null, null, 1, null, 1, null, null, 1],
                    [null, null, 1, null, null, null, 1, null, null,],
                    [null, null, null, null, 0, null, null, null, null,],
                    [null, null, 1, null, null, null, 1, null, null,],
                    [1, null, null, 1, null, 1, null, null, 1],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, 1, null, null, null, 1, null, null,],
                ]
            }],
            capture: [{
                area: [
                    [null, null, 1, null, null, null, 1, null, null],
                    [null, null, null, null, null, null, null, null, null],
                    [1, null, null, 1, null, 1, null, null, 1],
                    [null, null, 1, null, null, null, 1, null, null,],
                    [null, null, null, null, 0, null, null, null, null,],
                    [null, null, 1, null, null, null, 1, null, null,],
                    [1, null, null, 1, null, 1, null, null, 1],
                    [null, null, null, null, null, null, null, null, null],
                    [null, null, 1, null, null, null, 1, null, null,],
                ]

            },
                // { everywhere: true, exclude: true }, // funny
                // { everywhere: true, type: ['pawn'] },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/O2bofNX.png">',
            black: '<img src="https://i.imgur.com/srBBfh4.png">',
        },
        description: "<p>Unlocked by merging 2 Knights and can do 2 jumps in a row.</p>",
        needsDiscovery: true,

    },
    'double-bishop': {
        lootbox: {
            weight: 2,
        },
        patterns: {
            movement: [
                { direction: 'diagonal/', distance: INFINITE, jump: false, extraThickLine: 1 },
                { direction: 'diagonal\\', distance: INFINITE, jump: false, extraThickLine: 1 },
            ],
            capture: [
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/Nr8OCKj.png">',
            black: '<img src="https://i.imgur.com/9miqt0h.png">'
        },
        description: "<p>Unlocked by merging 2 Bishops. Moves like 3 Bishops next to each other, Attacks like a normal bishop.</p>",
        needsDiscovery: true,
    },
    'royal-queen': {
        lootbox: {
            weight: 0.5,
        },
        patterns: {
            movement: [
                { direction: 'vertical', distance: INFINITE, jump: true },
                { direction: 'horizontal', distance: INFINITE, jump: true },
                { direction: 'diagonal/', distance: INFINITE, jump: true },
                { direction: 'diagonal\\', distance: INFINITE, jump: true },
            ],
            capture: [
                { direction: 'vertical', distance: INFINITE, jump: false },
                { direction: 'horizontal', distance: INFINITE, jump: false },
                { direction: 'diagonal/', distance: INFINITE, jump: false },
                { direction: 'diagonal\\', distance: INFINITE, jump: false },
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/NR7aMX1.png">',
            black: '<img src="https://i.imgur.com/tli76ZK.png">'
        },
        needsDiscovery: true,
        description: "<p>Unlocked by merging 2 Queens. Attacks like a normal queen, but whilst moving to an empty piece it can jump over pieces.</p>",
    },
    'pawned': {
        lootbox: {
            weight: 0.25,
        },
        carrying: true,
        patterns: {
            movement: [
                { direction: 'vertical', distance: 2, jump: false },
                {
                    area: [
                        [null, 1, null],
                        [null, null, null],
                        [null, 0, null],
                        [null, null, null],
                        [null, 1, null],
                    ],
                    unmoved: [
                        [null, 0, null],
                    ],
                    exclude: true,
                }
            ],
            capture: [
                {
                    area: [
                        [1, null, 1],
                        [null, 0, null],
                        [1, null, 1],
                    ],
                }
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/kCamJU1.png">',
            black: '<img src="https://i.imgur.com/YBxZXmv.png">',
        },
        needsDiscovery: true,
        description: "<p>First move can move 2 spaces instead of 1<br>Attacks diagonally.<br>It can carry other pieces.<br>Transforms into something once you reach the opposite side of the board.</p>",
        convertion: {
            rows: [0],
            collumns: [0, 1, 2, 3, 4, 5, 6, 7],
            convertsTo: 'queened',
        },
        // summonOnBeingMerged: 'brick', <- add this to the piece if you want to summon a piece when merging
    },
    'queened': {
        lootbox: {
            weight: 0.05,
        },
        carrying: true,
        patterns: {
            movement: [
                { everywhere: true, exclude: false },
                { direction: 'vertical', distance: INFINITE, jump: false, exclude: true },
                { direction: 'horizontal', distance: INFINITE, jump: false, exclude: true },
                { direction: 'diagonal/', distance: INFINITE, jump: false, exclude: true },
                { direction: 'diagonal\\', distance: INFINITE, jump: false, exclude: true },
            ],
            capture: [{
                area: [
                    [null, 1, null, 1, null],
                    [1, null, null, null, 1],
                    [null, null, 0, null, null],
                    [1, null, null, null, 1],
                    [null, 1, null, 1, null],
                ],
            }
            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/3xivipk.png">',
            black: '<img src="https://i.imgur.com/rJ7Pd34.png">'
        },
        needsDiscovery: true,
        description: "<p>Moves as an inversed Queen, attacks as a Knight. Unlocked by promoting a Pawned.<br>It can carry other pieces.</p>",
    },
    'brick': {
        lootbox: {
            weight: 0,
        },
        patterns: {
            movement: [

            ],
            capture: [

            ],
        },
        display: {
            white: '<img src="https://i.imgur.com/g3qXsth.png">',
            black: '<img src="https://i.imgur.com/bYTLYrb.png">'
        },
        // needsDiscovery: true,
        description: "<p>Brick can not be moved or killed. But it can be carried.</p>",
        ignoresThings: {
            "ignoreCarry": false,
            "ignoreKill": true,
        }
    },
}