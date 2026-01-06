let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

cells.forEach(cell => {
  cell.addEventListener('click', () => handleCellClick(cell));
});

function handleCellClick(cell) {
  const index = cell.getAttribute('data-index');
  
  if (board[index] !== '' || !gameActive) {
    return;
  }
  
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  
  checkResult();
}

function checkResult() {
  let roundWon = false;
  
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }
  
  if (roundWon) {
    status.textContent = `Player ${currentPlayer} wins! 🎉`;
    status.classList.add('winner');
    gameActive = false;
    return;
  }
  
  if (!board.includes('')) {
    status.textContent = "It's a draw! 🤝";
    status.classList.add('draw');
    gameActive = false;
    return;
  }
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function restartGame() {
  currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  status.textContent = "Player X's turn";
  status.classList.remove('winner', 'draw');
  
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
}
