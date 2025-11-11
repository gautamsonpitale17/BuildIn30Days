const easyWords = [
  "cat", "dog", "sun", "book", "pen", "tree", "car", "run", "jump", "walk",
  "ball", "fish", "bird", "milk", "home", "shoe", "hat", "bag", "cup", "moon",
  "rain", "star", "frog", "apple", "egg", "door", "desk", "chair", "grass", "leaf",
  "toy", "lamp", "bell", "bus", "road", "river", "hand", "eye", "nose", "foot"
];

const mediumWords = [
  "javascript", "coding", "function", "object", "variable", "element", "string", "array", "style", "query",
  "console", "button", "window", "screen", "browser", "design", "layout", "toggle", "script", "module",
  "syntax", "branch", "commit", "editor", "import", "export", "render", "update", "canvas", "memory",
  "server", "client", "cookie", "output", "return", "method", "integer", "boolean", "feature", "event"
];

const hardWords = [
  "developer", "algorithm", "challenge", "frontend", "backend", "responsive", "debugging", "framework", "performance", "deployment",
  "asynchronous", "optimization", "recursion", "architecture", "integration", "dependency", "synchronization", "microservice", "encapsulation", "inheritance",
  "virtualization", "polymorphism", "compilation", "concurrency", "authentication", "authorization", "serialization", "abstraction", "implementation", "transpilation",
  "configuration", "infrastructure", "scalability", "initialization", "multithreading", "containerization", "observability", "optimization", "distributed", "interpreter"
];


const gameArea = document.getElementById("gameArea");
const wordInput = document.getElementById("wordInput");
const timeLeftEl = document.getElementById("timeLeft");

const levelSelect = document.getElementById("levelSelect");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");

const controlButtons = document.getElementById("controlButtons");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const difficultyBtn = document.getElementById("difficultyBtn");

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartBtnOverlay = document.getElementById("restartBtnOverlay");

let wordList = [];
let score = 0;
let activeWords = [];
let gameInterval;
let timerInterval;
let paused = true;
let timeLeft = 30;
let difficultyMultiplier = 1;

function checkOverlap(newX, newWidth) {
  const padding = 20;
  for (const wordObj of activeWords) {
    const existingX = parseFloat(wordObj.el.style.left);
    const existingWidth = wordObj.el.offsetWidth;

    const overlapRight = newX < existingX + existingWidth + padding;
    const overlapLeft = newX + newWidth > existingX - padding;

    if (overlapRight && overlapLeft) {
      return true;
    }
  }
  return false;
}

function spawnSingleWord() {
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  const isPowerup = Math.random() < 0.1;

  const wordEl = document.createElement("div");
  wordEl.classList.add("word");
  if (isPowerup) wordEl.classList.add("powerup");
  wordEl.textContent = word;

  wordEl.style.position = 'absolute';
  wordEl.style.visibility = 'hidden';
  gameArea.appendChild(wordEl);
  const wordWidth = wordEl.offsetWidth;
  wordEl.style.visibility = 'visible';

  const maxX = gameArea.offsetWidth - wordWidth - 10;
  let newX;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    newX = Math.floor(Math.random() * maxX);
    attempts++;
    if (attempts >= maxAttempts) {
      break; 
    }
  } while (checkOverlap(newX, wordWidth));
  
  wordEl.style.left = newX + "px";
  wordEl.style.top = "10px";

  let baseSpeed = 0.5 * difficultyMultiplier;
  let wordSpeed = baseSpeed + (Math.random() * 0.4);

  activeWords.push({ text: word, el: wordEl, y: 10, speed: wordSpeed, powerup: isPowerup, width: wordWidth });
}

function maintainWordCount() {
  if (paused) return;
  const requiredCount = 5;
  while (activeWords.length < requiredCount) {
    spawnSingleWord();
  }
}

startBtn.addEventListener("click", () => {
  const chosen = difficultySelect.value;
  if (chosen === "easy") {
    wordList = easyWords;
    difficultyMultiplier = 0.8;
  } else if (chosen === "medium") {
    wordList = mediumWords;
    difficultyMultiplier = 1.2;
  } else if (chosen === "hard") {
    wordList = hardWords;
    difficultyMultiplier = 1.6;
  }

  levelSelect.style.display = "none";
  wordInput.style.display = "block";
  controlButtons.style.display = "flex";
  startGame();
});

function moveWords() {
  if (paused) return;

  const safeZoneBottom = gameArea.offsetHeight - 10; 

  for (let i = activeWords.length - 1; i >= 0; i--) {
    const wordObj = activeWords[i];
    wordObj.y += wordObj.speed;
    wordObj.el.style.top = Math.round(wordObj.y) + "px";

    if (wordObj.y + wordObj.el.offsetHeight >= safeZoneBottom) {
      gameArea.removeChild(wordObj.el);
      activeWords.splice(i, 1);
      if (!paused) {
        spawnSingleWord(); 
      }
    }
  }
}

function updateStats() {
  timeLeftEl.textContent = timeLeft;
  
  if (timeLeft <= 10 && !paused) {
    timeLeftEl.classList.add("blinking");
  } else {
    timeLeftEl.classList.remove("blinking");
  }
}

wordInput.addEventListener("input", () => {
  const input = wordInput.value.trim();
  for (let i = 0; i < activeWords.length; i++) {
    if (activeWords[i].text === input) {
      const wordObj = activeWords[i];

      wordObj.el.style.transform = "scale(1.2)";
      wordObj.el.style.opacity = "0";

      setTimeout(() => {
        if (gameArea.contains(wordObj.el)) {
          gameArea.removeChild(wordObj.el);
        }
      }, 180);

      activeWords.splice(i, 1);

      if (wordObj.powerup) {
        score += 3;
      } else {
        score++;
      }

      wordInput.value = "";
      updateStats();
      
      if (!paused) {
        spawnSingleWord();
      }
      
      break;
    }
  }
});

function startGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);

  score = 0;
  timeLeft = 30; 
  
  activeWords.forEach(w => gameArea.removeChild(w.el));
  activeWords = [];
  
  wordInput.disabled = false;
  wordInput.value = "";
  paused = false;
  pauseBtn.textContent = "Pause";
  
  updateStats();
  gameOverScreen.style.display = "none";
  wordInput.focus();

  maintainWordCount();

  gameInterval = setInterval(moveWords, 30);

  timerInterval = setInterval(() => {
    if (!paused) {
      timeLeft--;
      updateStats();
      if (timeLeft <= 0) endGame();
    }
  }, 1000);
}

pauseBtn.addEventListener("click", () => {
  paused = !paused;
  wordInput.disabled = paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  
  if (paused) {
    timeLeftEl.classList.remove("blinking");
  } else {
    wordInput.focus();
    updateStats();
  }
});

restartBtn.addEventListener("click", startGame);

difficultyBtn.addEventListener("click", resetToLevelSelect);
restartBtnOverlay.addEventListener("click", resetToLevelSelect);

function resetToLevelSelect() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  
  activeWords.forEach(w => gameArea.removeChild(w.el));
  activeWords = [];
  
  gameOverScreen.style.display = "none";
  wordInput.style.display = "none";
  controlButtons.style.display = "none";
  levelSelect.style.display = "flex";
  
  paused = true;
  timeLeft = 30;
  updateStats();
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  
  wordInput.disabled = true;
  paused = true;
  
  activeWords.forEach(w => gameArea.removeChild(w.el));
  activeWords = [];
  
  finalScore.textContent = `Final Score: ${score}`;
  gameOverScreen.style.display = "flex";
  timeLeftEl.classList.remove("blinking");
}