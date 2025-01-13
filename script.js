const board = document.getElementById('board');
const restartButton = document.getElementById('restart');
const playerChoice = document.getElementById('player-choice');
const modeSelect = document.getElementById('mode');
let cells = [];
let currentPlayer = 'X';
let playerSymbol = 'X';
let botSymbol = 'O';
let gameMode = '2player';

// Initialize board
function initializeBoard() {
  board.innerHTML = '';
  cells = Array(9).fill(null);
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

// Handle cell click
function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (cells[index] || checkWinner()) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('taken');

  if (checkWinner()) {
    setTimeout(() => alert(`${currentPlayer} wins!`), 100);
  } else if (cells.every(cell => cell)) {
    setTimeout(() => alert("It's a draw!"), 100);
  } else {
    switchPlayer();
    if (gameMode !== '2player' && currentPlayer === botSymbol) {
      setTimeout(botMove, 300);
    }
  }
}

// Switch player
function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Bot move
function botMove() {
  let index;
  if (gameMode === 'easy') {
    do {
      index = Math.floor(Math.random() * 9);
    } while (cells[index]);
  } else {
    index = findBestMove(gameMode === 'impossible');
  }
  if (index !== null) {
    const cell = board.querySelector(`.cell[data-index='${index}']`);
    cell.click();
  }
}

// Check winner
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

// Minimax Algorithm for "Impossible" Level
function findBestMove(isImpossible) {
  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < cells.length; i++) {
    if (!cells[i]) {
      cells[i] = botSymbol;
      let score = minimax(cells, 0, false, isImpossible);
      cells[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing, isImpossible) {
  if (checkWinner()) return isMaximizing ? -10 : 10;
  if (board.every(cell => cell)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = botSymbol;
        let score = minimax(board, depth + 1, false, isImpossible);
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
        let score = minimax(board, depth + 1, true, isImpossible);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Restart game
restartButton.addEventListener('click', () => {
  currentPlayer = playerSymbol;
  initializeBoard();
});

// Update settings
playerChoice.addEventListener('change', e => {
  playerSymbol = e.target.value;
  botSymbol = playerSymbol === 'X' ? 'O' : 'X';
  currentPlayer = playerSymbol;
  initializeBoard();
});

modeSelect.addEventListener('change', e => {
  gameMode = e.target.value;
  initializeBoard();
});

// Start game
initializeBoard();
