const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const highEl = document.getElementById('highscore');
const finalScoreEl = document.getElementById('finalScore');
const finalHighscoreEl = document.getElementById('finalHighscore');
const gameOverBox = document.getElementById('gameOverBox');
const restartFromGameOverBtn = document.getElementById('restartFromGameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const difficultySelect = document.getElementById('difficulty');

const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

const gridSize = 25;
const cellSize = canvas.width / gridSize;

let snake = [];
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let food = null;
let running = false;
let paused = false;
let score = 0;
let highscore = Number(localStorage.getItem('snake-high') || 0);
highEl.textContent = highscore;

let baseSpeed = 120;
let speed = baseSpeed;
let gameLoop = null;

let touchstartX = 0;
let touchstartY = 0;
const minSwipeDistance = 40;

function setDifficulty(level) {
  baseSpeed = level === 'easy' ? 160 : level === 'hard' ? 80 : 120;
  speed = baseSpeed;
}

difficultySelect.addEventListener('change', (e) => {
  setDifficulty(e.target.value);
});

function resetGame() {
  snake = [{ x: 10, y: 12 }, { x: 9, y: 12 }, { x: 8, y: 12 }];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = score;
  placeFood();
  gameOverBox.style.display = 'none';
  document.querySelector('.hidden-while-playing').style.display = 'none';
}

function placeFood() {
  while (true) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (!snake.some(s => s.x === x && s.y === y)) {
      food = { x, y };
      return;
    }
  }
}

function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCell(food.x, food.y, '#888');
  snake.forEach((s, i) => drawCell(s.x, s.y, i === 0 ? '#fff' : '#666'));
}

function update() {
  if (!running || paused) return;

  if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) dir = nextDir;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) return gameOver();
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) return gameOver();

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;

    if (score > highscore) {
      highscore = score;
      highEl.textContent = highscore;
      localStorage.setItem('snake-high', highscore);
    }

    placeFood();

    if (score % 5 === 0 && speed > 40) {
      speed -= 6;
      restartLoop();
    }
  } else {
    snake.pop();
  }

  draw();
}

function gameOver() {
  running = false;
  clearInterval(gameLoop);
  finalScoreEl.textContent = score;
  finalHighscoreEl.textContent = highscore;
  gameOverBox.style.display = 'flex';
  document.querySelector('.hidden-while-playing').style.display = 'block';
}

function startGame() {
  if (running) return;
  resetGame();
  running = true;
  paused = false;
  setDifficulty(difficultySelect.value);
  restartLoop();
  draw();
}

function restartLoop() {
  clearInterval(gameLoop);
  gameLoop = setInterval(update, speed);
}

function pauseGame() {
  if (!running) return;
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
}

function restartGame() {
  paused = false;
  running = false;
  clearInterval(gameLoop);
  startGame();
}

window.addEventListener('keydown', (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();

  switch(e.key){
    case 'ArrowUp': case 'w': case 'W': nextDir = {x:0,y:-1}; break;
    case 'ArrowDown': case 's': case 'S': nextDir = {x:0,y:1}; break;
    case 'ArrowLeft': case 'a': case 'A': nextDir = {x:-1,y:0}; break;
    case 'ArrowRight': case 'd': case 'D': nextDir = {x:1,y:0}; break;
    case ' ': pauseGame(); break;
    case 'Enter': if(!running) startGame(); break;
  }
});

canvas.addEventListener('touchstart',(e)=>{
  if(e.touches.length===1){touchstartX=e.touches[0].clientX;touchstartY=e.touches[0].clientY;}
});

canvas.addEventListener('touchend',(e)=>{
  if(e.changedTouches.length===1){
    const dx=e.changedTouches[0].clientX-touchstartX;
    const dy=e.changedTouches[0].clientY-touchstartY;
    if(Math.abs(dx)>minSwipeDistance||Math.abs(dy)>minSwipeDistance){
      nextDir=Math.abs(dx)>Math.abs(dy)?dx>0?{x:1,y:0}:{x:-1,y:0}:dy>0?{x:0,y:1}:{x:0,y:-1};
    }
  }
});

upBtn.addEventListener('click',()=>nextDir={x:0,y:-1});
downBtn.addEventListener('click',()=>nextDir={x:0,y:1});
leftBtn.addEventListener('click',()=>nextDir={x:-1,y:0});
rightBtn.addEventListener('click',()=>nextDir={x:1,y:0});
canvas.addEventListener('touchmove',(e)=>e.preventDefault(),{passive:false});

startBtn.addEventListener('click',startGame);
pauseBtn.addEventListener('click',pauseGame);
restartBtn.addEventListener('click',restartGame);
restartFromGameOverBtn.addEventListener('click',restartGame);

resetGame();
draw();
