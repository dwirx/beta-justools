const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop = null;
let gameSpeed = 100;

function drawGame() {
  clearCanvas();
  moveSnake();
  checkCollision();
  drawFood();
  drawSnake();
}

function clearCanvas() {
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = '#1a1a2e';
  for (let i = 0; i < tileCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = '#10b981';
    } else {
      ctx.fillStyle = '#059669';
    }
    ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
    ctx.strokeStyle = '#047857';
    ctx.strokeRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
  });
}

function drawFood() {
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function moveSnake() {
  if (dx === 0 && dy === 0) return;
  
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    generateFood();
    if (gameSpeed > 50) gameSpeed -= 2;
  } else {
    snake.pop();
  }
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  // Make sure food doesn't spawn on snake
  snake.forEach(segment => {
    if (segment.x === food.x && segment.y === food.y) {
      generateFood();
    }
  });
}

function checkCollision() {
  const head = snake[0];
  
  // Wall collision
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
  }
  
  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

function gameOver() {
  clearInterval(gameLoop);
  gameLoop = null;
  alert(`Game Over! Score: ${score}`);
  resetGame();
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  gameSpeed = 100;
  scoreEl.textContent = score;
  generateFood();
  clearCanvas();
  drawFood();
  drawSnake();
}

function startGame() {
  if (gameLoop) return;
  resetGame();
  dx = 1;
  dy = 0;
  gameLoop = setInterval(drawGame, gameSpeed);
}

function changeDirection(dir) {
  switch(dir) {
    case 'up':
      if (dy !== 1) { dx = 0; dy = -1; }
      break;
    case 'down':
      if (dy !== -1) { dx = 0; dy = 1; }
      break;
    case 'left':
      if (dx !== 1) { dx = -1; dy = 0; }
      break;
    case 'right':
      if (dx !== -1) { dx = 1; dy = 0; }
      break;
  }
}

document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      changeDirection('up');
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      changeDirection('down');
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      changeDirection('left');
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      changeDirection('right');
      break;
  }
});

// Initial draw
clearCanvas();
drawFood();
drawSnake();
