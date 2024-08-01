const setupData = {
    votingUrl: 'https://www.reddit.com/r/AnarchyChess/comments/1ef67en/6_added_a_choosable_optional_random_secret_twist/',
    githubRepo: 'https://github.com/oldmartijntje/Totally-Normal-Chess-Simulator',
    version: 6 // This is the X amount of vote added / in development.
}

const editableRulebook = [
    {
        length: 1,
        content: `<h1>Base game</h1>
                    <p>The chess game has the following moves by default:</p>
                    <ul>
                        <li>The king can only move 1 step in each direction.</li>
                        <li>Pawns can move 2 steps their first time, and hit diagonally.</li>
                        <li>Knights move in an L-shape.</li>
                        <li>Bishops move diagonally.</li>
                        <li>Rooks move horizontally and vertically.</li>
                        <li>Queens move in all directions.</li>
                    </ul>
                    <p>When a pawn reaches the other side of the board, it is promoted to a queen.</p>
                    <p>The game doesn't have:</p>
                    <ul>
                        <li>Castling</li>
                        <li>En passant</li>
                        <li>Check notifier</li>
                        <li>Checkmate (hit the king to win)</li>
                        <li>Stalemate</li>
                    </ul>
                    <p>Once you have won, you can continue playing, You'll just get a "You won!" popup every time you trigger the win condition again.</p>`

    },
    {
        length: 0,
        content: `<h1>Reddit rules:</h1>
                    <p>Reddit is able to vote on the next additions <a href="${setupData.votingUrl}" target="_blank">here</a>. <br>The top comment gets added to the website.</p>
                    <p>This is what they have added so far:</p>`
    }
]

const addedFeatures = [
    {
        length: 0.5,
        content: `<h2>5.Added a Twist selector.</h2>
                    <div class="option">
            <div class="square"><img src="https://i.imgur.com/L2QFLNn.png" alt="???"></div>
            <p style="color:black">???</p>
        </div>
                    <p>A the start of the game, both players choose a secret twist.<br>This twist can be anything.<br>Both players have the same choices.</p>`,


        commentLink: "https://www.reddit.com/r/AnarchyChess/comments/1edeyhi/comment/lf6gapg/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
    },
    {
        length: 0.5,
        content: `<h2>4.Added piece Carrying.</h2>
                    <div class="square carrying-piece" piece-name="reversed-rook" piece-team="white"><img src="https://i.imgur.com/KiRlbQJ.png"><img src="https://i.imgur.com/vIA5kSR.png"></div>
                    <p>You can carry a piece with upside-down pieces.</p>
                    <p>When you attack a piece of your color with the upside-down piece (carrier), it will pick it up.<br>Selecting a carrying piece will allow you to move with both pieces their movesets, but can only attack as the the carrier.<br>You can also choose to leave the piece you carry behind, by attacking another 1 of your pieces.</p>
                    <p>The indicator for carrying a piece is a cyan cube outline.</p>`,


        commentLink: "https://www.reddit.com/r/AnarchyChess/comments/1e8mxgr/comment/le91ci4/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
    },
    {
        length: 0.5,
        content: `<h2>3.Merging pieces</h2>
                        <img src="https://i.imgur.com/O2bofNX.png" class="imageDisplay">
                        <p>You can mere specific pieces together to make new pieces.</p>
                        <p>All base pieces turn into something else once merged with the same type of pieces. You can see how the movement of each piece works in <a href="./encyclopedia">the Encyclopedia</a>.</p>
                        <p>Pieces that you haven't moved or killed yet will appear as ???.</p>
                        <p>The indicator for merging a piece is a purple attack circle.</p>`,
        commentLink: "https://www.reddit.com/r/AnarchyChess/comments/1e750dz/comment/ldyngi1/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
    },
    {
        length: 0.5,
        content: `<h2>2.Lootboxes</h2>
                        <div class="box symbol">
                            <div class="upper"></div>
                            <div class="lower"></div>
                            <div class="latch"></div>
                        </div>
                        <p>Lootboxes spawn randomly into empty squares on the field.</p>
                        <p>When you land on a lootbox, you will get a random piece, this piece will be placed on the
                            square
                            you moved away from.</p>
                        <p>You can also buy lootboxes in <a href="./shop">the shop</a>.</p>`,
        commentLink: "https://www.reddit.com/r/AnarchyChess/comments/1e048c0/comment/lckl9g6/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
    },
    {
        length: 0.5,
        content: `<h2>1.Microtransactions</h2>
                    <img src="https://i.imgur.com/jSEigOH.png" alt="Token" class="symbol">
                    <p>Tokens / Credits can be bought in <a href="./store">the credits store</a></p>
                    <p>These were useless when they were added, but you can now spend them in <a href="./shop">the
                            shop</a>.</p>`,
        commentLink: "https://www.reddit.com/r/AnarchyChess/comments/1dz5fm8/comment/lcde3x3/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
    }
]

editableRulebook.push(...addedFeatures)

const autoGeneratedRulebook = {}

let totalPages = 0;

function generateRulebook() {
    let currentPageSize = 0;
    let currentPage = '';
    editableRulebook.forEach((page) => {
        if (currentPageSize >= 1 || (currentPageSize + page.length > 1 && currentPageSize != 0)) {
            totalPages++;
            autoGeneratedRulebook[totalPages] = currentPage;
            currentPage = '';
            currentPageSize = 0;
        }
        currentPage += '<section>' + page.content;
        if (page.commentLink) {
            currentPage += `<span>This got added because of <a target="_blank"
                            href=${page.commentLink}>This comment</a></span>`
        }
        currentPage += '</section>';
        currentPageSize += page.length;
    });
    totalPages++;
    autoGeneratedRulebook[totalPages] = currentPage;
}

function errorHandlerDecorator(fn, errorHandler) {
    return function (...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            errorHandler.call(this, error);
        }
    };
}

function debugMessage(message) {
    if (!DEBUG_MODE) {
        return;
    }
    debugBox.innerHTML = message + '| ' + debugBox.innerHTML;
    if (debugBox.innerHTML.length > 1000) {
        debugBox.innerHTML = debugBox.innerHTML.slice(0, 1000);
    }
}

function percentageRandomiser(percent) {
    if (percent == 0 || percent == null || percent == undefined) {
        return false
    }
    let x = percent / 100
    let y = Math.random()
    return y <= x
}

function render() {
    if (chessboard) {
        chessboard.render()
    }
}

generateRulebook()