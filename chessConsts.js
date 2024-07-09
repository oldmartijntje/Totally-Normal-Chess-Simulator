const BOARDSIZE = 8;
const INFINITE = BOARDSIZE * BOARDSIZE
const friendlyFire = false;

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
            white: '♖',
            black: '♜',
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
            { everywhere: true, exclude: true, type: ['pawn'] },
            ],
        },
        display: {
            white: '♘',
            black: '♞',
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
            white: '♗',
            black: '♝',
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
            capture: null,
        },
        display: {
            white: '♕',
            black: '♛',
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
            white: '♔',
            black: '♚',
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
            white: '♙',
            black: '♟',
        },
        notationType: '',
    },
}