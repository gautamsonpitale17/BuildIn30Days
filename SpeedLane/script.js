const road = document.querySelector('.game-road');
const player = document.querySelector('.player-car');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const highScoreDisplay = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const finalHighScore = document.getElementById('final-high-score');
const restartBtn = document.getElementById('restart-btn');
const powerUpInfo = document.getElementById('power-up-info');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const difficultySelect = document.getElementById('difficulty');

let score = 0;
let lives = 3;
let gameSpeed = 5;
let obstacles = [];
let powerUps = [];
let gameRunning = false;
let playerLane = 1;
let powerActive = null;
let powerTimer = null;
let lanePositions = [];

let highScore = parseInt(localStorage.getItem('speedlaneHighScore')) || 0;
highScoreDisplay.textContent = highScore;

function calculateLanes() {
  const roadWidth = road.clientWidth;
  lanePositions = [roadWidth / 6 - 40, roadWidth / 2 - 40, 5 * roadWidth / 6 - 40];
  player.style.left = lanePositions[playerLane] + "px";
}

function setDifficulty() {
  const diff = difficultySelect.value;
  gameSpeed = diff === 'easy' ? 6 : diff === 'medium' ? 8 : 12;
}

startBtn.addEventListener('click', () => {
  if(!gameRunning){
    calculateLanes();
    setDifficulty();
    gameRunning = true;
    gameLoop();
    startBtn.disabled = true;
  }
});

pauseBtn.addEventListener('click', () => {
  gameRunning = !gameRunning;
  if(gameRunning) gameLoop();
});

document.addEventListener('keydown', e => {
  if(!gameRunning) return;
  if(e.key === "ArrowLeft" && playerLane > 0) playerLane--;
  if(e.key === "ArrowRight" && playerLane < 2) playerLane++;
  player.style.left = lanePositions[playerLane] + "px";
});

const obstacleImages = ['./images/orange_car.png'];

function createObstacle() {
  if(!gameRunning) return;
  const obs = document.createElement('div');
  obs.classList.add('obstacle');
  const lane = Math.floor(Math.random() * 3);
  obs.dataset.lane = lane;
  obs.style.left = lanePositions[lane] + "px";
  obs.style.top = "-100px";
  obs.style.backgroundImage = `url('${obstacleImages[Math.floor(Math.random()*obstacleImages.length)]}')`;
  road.appendChild(obs);
  obstacles.push(obs);
}

function createPowerUp() {
  if(!gameRunning) return;
  const power = document.createElement('div');
  power.classList.add('power-up');
  const lane = Math.floor(Math.random() * 3);
  power.dataset.lane = lane;
  power.style.left = lanePositions[lane] + "px";
  power.style.top = "-40px";
  const types = ['s','d','m'];
  power.type = types[Math.floor(Math.random()*types.length)];
  power.classList.add(power.type);
  power.textContent = power.type.toUpperCase();
  road.appendChild(power);
  powerUps.push(power);
}

function moveObstacles() {
  obstacles.forEach((obs, i) => {
    let top = parseInt(obs.style.top) + gameSpeed;
    obs.style.top = top + "px";
    if(playerLane == parseInt(obs.dataset.lane) && top + 100 >= 400 && top <= 500){
      if(powerActive==='s'){ activatePower(null); obs.remove(); obstacles.splice(i,1); }
      else { lives--; livesDisplay.textContent=lives; obs.remove(); obstacles.splice(i,1); if(lives<=0) endGame(); }
    }
    if(top > 500){ score++; if(powerActive==='m') score++; scoreDisplay.textContent=score; obs.remove(); obstacles.splice(i,1); }
  });

  powerUps.forEach((p, i) => {
    let top = parseInt(p.style.top) + gameSpeed;
    p.style.top = top + "px";
    if(playerLane == parseInt(p.dataset.lane) && top + 40 >= 400 && top <= 500){
      activatePower(p.type); p.remove(); powerUps.splice(i,1);
    }
    if(top > 500){ p.remove(); powerUps.splice(i,1); }
  });
}

function activatePower(type) {
  powerActive = type;
  if(powerTimer) clearTimeout(powerTimer);
  if(type==='s') powerUpInfo.textContent="Shield Activated!";
  if(type==='d'){ powerUpInfo.textContent="Slow Motion!"; gameSpeed/=2; }
  if(type==='m') powerUpInfo.textContent="Score Multiplier!";
  if(type){
    powerTimer = setTimeout(()=>{ if(type==='d') gameSpeed*=2; powerUpInfo.textContent=''; powerActive=null; },5000);
  }
}

function endGame(){
  gameRunning=false;
  finalScore.textContent=score;
  if(score>highScore){ highScore=score; localStorage.setItem('speedlaneHighScore',highScore); }
  finalHighScore.textContent=highScore;
  gameOverScreen.style.display='block';
}

restartBtn.addEventListener('click', ()=>window.location.reload());

function gameLoop(){ if(!gameRunning) return; moveObstacles(); requestAnimationFrame(gameLoop); }

setInterval(()=>{ if(gameRunning) createObstacle(); },1000);
setInterval(()=>{ if(gameRunning) createPowerUp(); },8000);
