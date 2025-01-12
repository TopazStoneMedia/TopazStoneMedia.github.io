const players = [];
const gameCards = generateGameCards();
const assignmentEndCards = generateAssignmentEndCards();
let currentPlayerIndex = 0;

// Generate game cards
function generateGameCards() {
    const cards = [];
    for (let i = 1; i <= 24; i++) {
        cards.push({
            id: i,
            points: Math.floor(Math.random() * 10) - 5,
            imageSide1: `/image/gameCards/S1/gameCard${i}.png`,
            imageSide2: `/image/gameCards/S2/gameCard${i}.png`
        });
    }
    return shuffle(cards);
}

// Generate assignment end cards
function generateAssignmentEndCards() {
    const cards = [];
    for (let i = 1; i <= 24; i++) {
        cards.push({
            id: i,
            points: Math.floor(Math.random() * 10),
            imageSide1: `/image/lastCards/S1/assignmentEnd${i}.png`,
          imageSide2: `/image/lastCards/S2/assignmentEnd${i}.png`
        });
    }
    return shuffle(cards);
}

// Shuffle cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize players
function initializePlayers(numPlayers) {
    for (let i = 1; i <= numPlayers; i++) {
        players.push({
            name: `Player ${i}`,
            points: 0,
            hasEnded: false
        });
    }
    renderPlayers();
}

// Render players
function renderPlayers() {
    const playersDiv = document.getElementById('players');
    playersDiv.innerHTML = '';
    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.innerHTML = `
            <strong>${player.name}</strong> - Points: <span id="points-${index}">${player.points}</span>
            <button onclick="endGame(${index})">End Game</button>
        `;
        playersDiv.appendChild(playerDiv);
    });
}

// Render game cards
function renderGameCards() {
    const gameCardsDiv = document.getElementById('game-cards');
    gameCardsDiv.innerHTML = '';
    gameCards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.innerHTML = `<img src="${card.image}" alt="Card ${card.id}">`;
        cardDiv.onclick = () => drawCard(index);
        gameCardsDiv.appendChild(cardDiv);
    });
}

// Draw a card
function drawCard(cardIndex) {
    if (currentPlayerIndex >= players.length) currentPlayerIndex = 0;
    const card = gameCards.splice(cardIndex, 1)[0];
    players[currentPlayerIndex].points += card.points;
    document.getElementById(`points-${currentPlayerIndex}`).textContent = players[currentPlayerIndex].points;
    currentPlayerIndex++;
    renderGameCards();
}

// End game for a player
function endGame(playerIndex) {
    const endCard = assignmentEndCards.pop();
    const player = players[playerIndex];
    if (player.points > endCard.points) {
        alert(`${player.name} wins with ${player.points} points!`);
    } else {
        alert(`${player.name} loses with ${player.points} points.`);
    }
    player.hasEnded = true;
    checkGameEnd();
}

// Check if the game has ended
function checkGameEnd() {
    if (players.every(player => player.hasEnded) || gameCards.length === 0) {
        alert('Game over!');
        // Save results to spreadsheet
        saveResultsToSpreadsheet();
    }
}

// Save results to spreadsheet (dummy function)
function saveResultsToSpreadsheet() {
    // Implement saving to spreadsheet logic here
    console.log('Saving results to spreadsheet...');
}

// Initialize game
initializePlayers(4); // Initialize with 4 players
renderGameCards();

document.getElementById('end-game').onclick = () => {
    players.forEach((player, index) => endGame(index));
};
