const board = document.getElementById('board');
const restartButton = document.getElementById('restart');
const playerChoice = document.getElementById('player-choice');
const modeSelect = document.getElementById('mode');
let winnerDisplay = null;
let cells = [];
let currentPlayer = 'X';
let playerSymbol = 'X';
let botSymbol = 'O';
let gameMode = '2player';

function initializeBoard() {
  board.innerHTML = '';
  cells = Array(9).fill(null);
  currentPlayer = playerSymbol;

  if (winnerDisplay) {
    winnerDisplay.remove();
    winnerDisplay = null;
  }

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (cells[index] || checkWinner()) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('taken', currentPlayer);

  if (checkWinner()) {
    displayWinner(`${currentPlayer} wins!`);
  } else if (cells.every(cell => cell)) {
    displayWinner("It's a draw!");
  } else {
    switchPlayer();
    if (gameMode !== '2player' && currentPlayer === botSymbol) {
      setTimeout(botMove, 300);
    }
  }
}

function displayWinner(message) {
  winnerDisplay = document.createElement('div');
  winnerDisplay.classList.add('winner');
  winnerDisplay.textContent = message;
  document.querySelector('.container').appendChild(winnerDisplay);
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function botMove() {
  let index;
  if (gameMode === 'easy') {
    do {
      index = Math.floor(Math.random() * 9);
    } while (cells[index]);
  } else if (gameMode === 'hard') {
    index = findWinnableMove() || getRandomMove();
  } else {
    index = findBestMove();
  }

  if (index !== null) {
    const cell = board.querySelector(`.cell[data-index='${index}']`);
    cell.click();
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function findWinnableMove() {
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i]) {
      cells[i] = botSymbol;
      if (checkWinner()) {
        cells[i] = null;
        return i;
      }
      cells[i] = null;
    }
  }
  return null;
}

function getRandomMove() {
  const emptyCells = cells.map((cell, idx) => (cell ? null : idx)).filter(idx => idx !== null);
  return emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

function findBestMove() {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < cells.length; i++) {
    if (!cells[i]) {
      cells[i] = botSymbol;
      const score = minimax(cells, 0, false);
      cells[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner()) return isMaximizing ? -10 : 10;
  if (board.every(cell => cell)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = botSymbol;
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = playerSymbol;
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

restartButton.addEventListener('click', initializeBoard);

playerChoice.addEventListener('change', e => {
  playerSymbol = e.target.value;
  botSymbol = playerSymbol === 'X' ? 'O' : 'X';
  initializeBoard();
});

modeSelect.addEventListener('change', e => {
  gameMode = e.target.value;
  initializeBoard();
});

initializeBoard();
