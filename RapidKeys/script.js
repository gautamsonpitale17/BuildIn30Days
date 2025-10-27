const displaySentenceEl = document.getElementById("display-sentence");
const typingInput = document.getElementById("typing-input");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const durationSelect = document.getElementById("duration-select");

const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeLeftEl = document.getElementById("time-left");
const errorsEl = document.getElementById("errors");

const themeToggle = document.getElementById("theme-toggle");
const interactionHintEl = document.getElementById("interaction-hint");

const sentenceBank = Array.from(document.querySelectorAll("#sentence-bank p")).map(
  (p) => p.textContent
);

const ctx = document.getElementById("performance-chart").getContext("2d");
let performanceChart;

let state = {
  referenceText: "",
  userInput: "",
  charIndex: 0,
  isRunning: false,
  startTime: null,
  timer: null,
  duration: parseInt(durationSelect.value) || 30,
  errors: 0,
  totalKeystrokes: 0,
  currentMistakes: {},
  wpmData: [],
  accuracyData: [],
  timeLabels: []
};

function getRandomSentence() {
  const difficulty = document.getElementById("difficulty-select").value || "medium";
  const difficultyContainer = document.getElementById(`${difficulty}-sentences`);

  let sentences = sentenceBank;
  if (difficultyContainer) {
    sentences = Array.from(difficultyContainer.querySelectorAll("p")).map(
      (p) => p.textContent
    );
  }

  return sentences[Math.floor(Math.random() * sentences.length)];
}

function formatTime(sec) {
  const s = sec % 60;
  return `00:${s < 10 ? "0" + s : s}`;
}

function showHint() {
  if (interactionHintEl) interactionHintEl.classList.remove("hidden");
}

function hideHint() {
  if (interactionHintEl) interactionHintEl.classList.add("hidden");
}

function resetState() {
  clearInterval(state.timer);
  state.isRunning = false;
  state.userInput = "";
  state.charIndex = 0;
  state.errors = 0;
  state.totalKeystrokes = 0;
  state.currentMistakes = {};

  const selectedDuration = durationSelect.value;
  state.duration = selectedDuration ? parseInt(selectedDuration) : 30;

  state.referenceText = getRandomSentence();
  displaySentenceEl.innerHTML = state.referenceText;
  typingInput.value = "";
  typingInput.disabled = false;

  timeLeftEl.textContent = formatTime(state.duration);
  wpmEl.textContent = 0;
  accuracyEl.textContent = "0%";
  errorsEl.textContent = 0;

  state.wpmData = [];
  state.accuracyData = [];
  state.timeLabels = [];
  updateChart();

  showHint();
  updateSpans();
}

function initChart() {
  if (performanceChart) performanceChart.destroy();

  const wpmColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-speed")
    .trim();
  const accuracyColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-correct")
    .trim();
  const textColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-text")
    .trim();

  performanceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: state.timeLabels,
      datasets: [
        {
          label: "WPM",
          data: state.wpmData,
          borderColor: wpmColor,
          backgroundColor: wpmColor + "33",
          yAxisID: "y-wpm",
          fill: "origin",
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: "Accuracy (%)",
          data: state.accuracyData,
          borderColor: accuracyColor,
          backgroundColor: accuracyColor + "33",
          yAxisID: "y-accuracy",
          fill: false,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (s)",
            color: textColor
          },
          ticks: { color: textColor },
          grid: { color: "rgba(122, 122, 122, 0.2)" }
        },
        "y-wpm": {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "WPM (Speed)",
            color: wpmColor
          },
          min: 0,
          ticks: { color: wpmColor },
          grid: { color: "rgba(122, 122, 122, 0.2)" }
        },
        "y-accuracy": {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "Accuracy (%)",
            color: accuracyColor
          },
          min: 0,
          max: 100,
          ticks: { color: accuracyColor },
          grid: { drawOnChartArea: false }
        }
      },
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      }
    }
  });
}

function updateChart() {
  if (!performanceChart) return;
  performanceChart.data.labels = state.timeLabels;
  performanceChart.data.datasets[0].data = state.wpmData;
  performanceChart.data.datasets[1].data = state.accuracyData;
  performanceChart.update();
}

function startTimer() {
  if (!state.duration || state.duration === 0) {
    const selectedDuration = durationSelect.value;
    state.duration = selectedDuration ? parseInt(selectedDuration) : 30;
  }

  const endTime = Date.now() + state.duration * 1000;
  calculateAndDisplayStats(0, true);
  let sampleCounter = 0;

  state.timer = setInterval(() => {
    const elapsedMs = Date.now() - state.startTime;
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    timeLeftEl.textContent = formatTime(remaining);

    calculateAndDisplayStats(elapsedMs);

    if (sampleCounter % 1 === 0) {
      calculateAndDisplayStats(elapsedMs, true);
    }
    sampleCounter++;

    if (remaining <= 0) endTest();
  }, 1000);
}

function startTest() {
  if (state.isRunning) return;

  if (!state.duration || state.duration === 0) {
    const selectedDuration = durationSelect.value;
    state.duration = selectedDuration ? parseInt(selectedDuration) : 30;
  }

  state.isRunning = true;
  state.startTime = Date.now();
  startTimer();
  hideHint();
  typingInput.focus();
}

function endTest() {
  if (!state.isRunning) return;

  clearInterval(state.timer);
  state.isRunning = false;
  typingInput.disabled = true;

  const finalElapsedMs = Date.now() - state.startTime;
  calculateAndDisplayStats(finalElapsedMs, true);

  let timeInSeconds;
  if (state.userInput.length >= state.referenceText.length) {
    const elapsedMs = finalElapsedMs;
    timeInSeconds = Math.max(1, Math.floor(elapsedMs / 1000));
  } else {
    timeInSeconds = state.duration;
  }

  const elapsedMinutes = timeInSeconds / 60;
  const netChars = state.totalKeystrokes - state.errors;
  const finalWpm = Math.max(0, Math.round(netChars / 5 / elapsedMinutes)) || 0;
  const finalAccuracy =
    state.totalKeystrokes === 0
      ? 0
      : Math.max(0, Math.round((netChars / state.totalKeystrokes) * 100));

  wpmEl.textContent = finalWpm;
  accuracyEl.textContent = `${finalAccuracy}%`;
  timeLeftEl.textContent = "00:00";

  showHint();
}

function calculateAndDisplayStats(elapsedTimeMs, shouldSample = false) {
  if (elapsedTimeMs <= 0) return;

  const elapsedMinutes = elapsedTimeMs / 60000;
  const netChars = state.totalKeystrokes - state.errors;
  const wpm = Math.max(0, Math.round(netChars / 5 / elapsedMinutes)) || 0;
  const accuracy =
    state.totalKeystrokes === 0
      ? 0
      : Math.max(0, Math.round((netChars / state.totalKeystrokes) * 100));

  wpmEl.textContent = wpm;
  accuracyEl.textContent = `${accuracy}%`;

  if (shouldSample) {
    const timeInSeconds = Math.round(elapsedTimeMs / 1000);
    if (state.timeLabels[state.timeLabels.length - 1] !== timeInSeconds) {
      state.timeLabels.push(timeInSeconds);
      state.wpmData.push(wpm);
      state.accuracyData.push(accuracy);
      updateChart();
    }
  }
}

typingInput.addEventListener("keydown", (e) => {
  if (!state.isRunning) {
    if (e.key.length === 1 || e.key === "Backspace") {
      e.preventDefault();
      startTest();
    } else return;
  }

  const key = e.key;
  const isTypingKey = key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey;

  if (isTypingKey) {
    state.totalKeystrokes++;
    if (state.charIndex < state.referenceText.length) {
      const expectedChar = state.referenceText[state.charIndex];
      if (key !== expectedChar) {
        if (!state.currentMistakes[state.charIndex]) {
          state.errors++;
        }
        state.currentMistakes[state.charIndex] = true;
      } else {
        if (state.currentMistakes[state.charIndex]) {
          delete state.currentMistakes[state.charIndex];
        }
      }
    }
  } else if (key === "Backspace") {
    if (state.charIndex > 0) {
      delete state.currentMistakes[state.charIndex - 1];
    }
  } else if (key === " " && state.userInput.length >= state.referenceText.length) {
    e.preventDefault();
    endTest();
    return;
  }

  if (isTypingKey) {
    state.charIndex++;
  } else if (key === "Backspace" && state.charIndex > 0) {
    state.charIndex--;
  }

  errorsEl.textContent = state.errors;
});

typingInput.addEventListener("input", () => {
  state.userInput = typingInput.value;
  if (state.startTime) calculateAndDisplayStats(Date.now() - state.startTime);
  updateSpans();
  if (state.userInput.length >= state.referenceText.length) {
    if (state.charIndex >= state.referenceText.length) endTest();
  }
});

function updateSpans() {
  const html = state.referenceText
    .split("")
    .map((char, idx) => {
      let spanClass = "";
      if (idx < state.userInput.length) {
        spanClass = state.currentMistakes[idx] ? "text-incorrect" : "text-correct";
      }
      if (idx === state.charIndex && idx < state.referenceText.length) {
        spanClass = (spanClass + " text-current").trim();
      }
      return `<span class="${spanClass}">${char}</span>`;
    })
    .join("");

  displaySentenceEl.innerHTML =
    state.charIndex >= state.referenceText.length
      ? html + `<span class="text-current"></span>`
      : html;

  const currentCursorSpan = displaySentenceEl.querySelector(".text-current");
  if (currentCursorSpan) {
    const wrapper = displaySentenceEl.parentElement;
    const cursorPositionX = currentCursorSpan.offsetLeft;
    const wrapperScrollX = wrapper.scrollLeft;
    const wrapperWidth = wrapper.clientWidth;
    const scrollThreshold = 100;

    if (cursorPositionX > wrapperScrollX + wrapperWidth - scrollThreshold) {
      wrapper.scrollLeft = cursorPositionX - wrapperWidth + scrollThreshold;
    } else if (cursorPositionX < wrapperScrollX + scrollThreshold) {
      wrapper.scrollLeft = cursorPositionX - scrollThreshold;
    }
  }
}

startBtn.addEventListener("click", startTest);
resetBtn.addEventListener("click", resetState);
document.getElementById("difficulty-select").addEventListener("change", resetState);
durationSelect.addEventListener("change", resetState);

document.getElementById("sentence-wrapper").addEventListener("click", () => {
  typingInput.focus();
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLightMode = document.body.classList.contains("light-mode");
    localStorage.setItem("themePreference", isLightMode ? "light-mode" : "dark-mode");
    themeToggle.textContent = isLightMode ? "🌙" : "☀️";
    initChart();
    updateChart();
  });
}

function init() {
  const savedTheme = localStorage.getItem("themePreference");
  if (savedTheme === "light-mode") {
    document.body.classList.add("light-mode");
    if (themeToggle) themeToggle.textContent = "🌙";
  } else {
    if (themeToggle) themeToggle.textContent = "☀️";
  }

  const selectedDuration = durationSelect.value;
  state.duration = selectedDuration ? parseInt(selectedDuration) : 30;

  initChart();
  resetState();
}

init();
