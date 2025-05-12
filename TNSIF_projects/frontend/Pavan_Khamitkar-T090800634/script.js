let gameState = {
    players: [],
    scores: {},
    currentRound: 1,
    totalRounds: 0,
    currentPlayer: 0,
    roundHistory: [],
    playersInRound: 0
};

function startGame() {
    const rounds = parseInt(document.getElementById('rounds').value);
    if (!rounds || rounds < 1) {
        alert('Please enter a valid number of rounds');
        return;
    }

    gameState.totalRounds = rounds;
    gameState.players = [];
    gameState.scores = {};

    for (let i = 1; i <= 4; i++) {
        const playerName = document.getElementById(`player${i}`).value.trim() || `Player ${i}`;
        gameState.players.push(playerName);
        gameState.scores[playerName] = 0;
    }

    document.querySelector('.setup-screen').classList.add('hidden');
    document.querySelector('.game-screen').classList.remove('hidden');
    updateDisplay();
}

function rollDice() {
    const roll = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = gameState.players[gameState.currentPlayer];
    
    gameState.scores[currentPlayer] += roll;
    gameState.roundHistory.push({
        round: gameState.currentRound,
        player: currentPlayer,
        roll: roll
    });

    document.getElementById('dice').textContent = getDiceFace(roll);
    gameState.playersInRound++;

    if (gameState.playersInRound === 4) {
        gameState.playersInRound = 0;
        gameState.currentRound++;

        if (gameState.currentRound > gameState.totalRounds) {
            document.getElementById('currentPlayer').textContent = "Wait a second...";
            setTimeout(showResults, 1000); // Wait for 10 seconds before showing results
            return;
        }
    }

    gameState.currentPlayer = (gameState.currentPlayer + 1) % 4;
    setTimeout(updateDisplay, 1000);
}

function getDiceFace(number) {
    const diceFaces = ['⚀ - 1', '⚁ - 2', '⚂ - 3', '⚃ - 4', '⚄ - 5', '⚅ - 6'];
    return diceFaces[number - 1];
}

function updateDisplay() {
    document.getElementById('currentRound').textContent = gameState.currentRound;
    document.getElementById('currentPlayer').textContent = 
        `${gameState.players[gameState.currentPlayer]}'s Turn`;
    document.getElementById('dice').textContent = '🎲';
}

function showResults() {
    document.querySelector('.game-screen').classList.add('hidden');
    document.querySelector('.result-screen').classList.remove('hidden');

    const resultsBody = document.getElementById('resultsBody');
    const historyBody = document.getElementById('historyBody');
    resultsBody.innerHTML = '';
    historyBody.innerHTML = '';

    // Sort players by score
    const sortedPlayers = [...gameState.players].sort((a, b) => 
        gameState.scores[b] - gameState.scores[a]
    );

    // Display final scores
    sortedPlayers.forEach(player => {
        const row = resultsBody.insertRow();
        row.innerHTML = `
            <td>${player}</td>
            <td>${gameState.scores[player]}</td>
        `;
        if (player === sortedPlayers[0]) {
            row.classList.add('winner');
        }
    });

    // Display round history
    gameState.roundHistory.forEach(record => {
        const row = historyBody.insertRow();
        row.innerHTML = `
            <td>${record.round}</td>
            <td>${record.player}</td>
            <td>${getDiceFace(record.roll)}</td>
        `;
    });
}
