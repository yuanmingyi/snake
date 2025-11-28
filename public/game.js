// Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const gameOverDiv = document.getElementById('gameOver');
const restartBtn = document.getElementById('restart');
const restartGameOverBtn = document.getElementById('restartGameOver');

// Game settings
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let dx = 0;
let dy = 0;
let foodX = 0;
let foodY = 0;
let score = 0;
let gameRunning = false;
let gameStarted = false;

function init() {
  snake = [{ x: 10, y: 10 }];
  dx = 0; dy = 0;
  score = 0;
  scoreElement.textContent = score;
  gameOverDiv.classList.add('hidden');
  generateFood();
  gameRunning = true;
  gameStarted = false;
  drawGame();
  
  // Show start message
  showStartMessage();
}

function generateFood() {
  foodX = Math.floor(Math.random() * tileCount);
  foodY = Math.floor(Math.random() * tileCount);
  for (let segment of snake) {
    if (segment.x === foodX && segment.y === foodY) {
      generateFood();
      return;
    }
  }
}

function drawGame() {
  ctx.fillStyle = '#ecf0f1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // snake
  ctx.fillStyle = '#2ecc71';
  for (let segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  }

  // food
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(foodX * gridSize + gridSize / 2, foodY * gridSize + gridSize / 2, gridSize / 2 - 1, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw start message if game hasn't started
  if (!gameStarted) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('按任意方向键开始游戏', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = '16px Arial';
    ctx.fillText('使用方向键 ↑ ↓ ← → 控制蛇的移动', canvas.width / 2, canvas.height / 2 + 20);
  }
}

function updateGame() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
    return;
  }

  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);

  if (head.x === foodX && head.y === foodY) {
    score++;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function gameLoop() {
  if (!gameRunning) return;
  updateGame();
  drawGame();
  setTimeout(gameLoop, 100);
}

function gameOver() {
  gameRunning = false;
  gameStarted = false;
  finalScoreElement.textContent = score;
  gameOverDiv.classList.remove('hidden');
}

function showStartMessage() {
  drawGame();
}

document.addEventListener('keydown', function (e) {
  if (!gameRunning) return;
  
  let keyPressed = false;
  switch (e.key) {
    case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; keyPressed = true; } break;
    case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; keyPressed = true; } break;
    case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; keyPressed = true; } break;
    case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; keyPressed = true; } break;
  }
  
  // Start game loop when first key is pressed
  if (gameRunning && keyPressed && !gameStarted) {
    gameStarted = true;
    gameLoop();
  }
});

restartBtn.addEventListener('click', init);
restartGameOverBtn.addEventListener('click', init);

// Initialize game but don't start loop until first key press
init();
