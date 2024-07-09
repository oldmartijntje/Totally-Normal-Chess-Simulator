window.onload = () => {
    console.log(setupData)
    const element = document.getElementById('linkToVoting');
    element.href = setupData.votingUrl;
    const chessboard = new Chessboard('chessboard');
};