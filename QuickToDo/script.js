const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const themeToggle = document.getElementById("theme-toggle");
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let selectedIndex = -1;

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌙";
} else {
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  } else {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  }
});

function renderTasks() {
  listContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("checked");
    if (index === selectedIndex) li.classList.add("selected");
    li.textContent = task.text;
    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.setAttribute("data-index", index);
    li.appendChild(span);
    li.setAttribute("data-index", index);
    listContainer.appendChild(li);
  });
}

function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = inputBox.value.trim();
  if (text === "") return;
  tasks.push({ text: text, done: false });
  saveData();
  renderTasks();
  inputBox.value = "";
}

listContainer.addEventListener("click", function (e) {
  const target = e.target;
  if (target.tagName === "SPAN") {
    const idx = Number(target.getAttribute("data-index"));
    if (!Number.isNaN(idx)) {
      tasks.splice(idx, 1);
      saveData();
      renderTasks();
    }
    return;
  }
  if (target.tagName === "LI") {
    const idx = Number(target.getAttribute("data-index"));
    if (!Number.isNaN(idx)) {
      tasks[idx].done = !tasks[idx].done;
      saveData();
      renderTasks();
    }
    return;
  }
}, false);

inputBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

document.addEventListener("keydown", function (e) {
  if (document.activeElement === inputBox) {
    if ((e.key === "Delete" || e.key === "Backspace") && inputBox.value === "") {
      tasks.pop();
      saveData();
      renderTasks();
    }
    return;
  }

  if (e.key === "ArrowUp") {
    if (tasks.length > 0) {
      selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : tasks.length - 1;
      renderTasks();
    }
  }

  if (e.key === "ArrowDown") {
    if (tasks.length > 0) {
      selectedIndex = selectedIndex < tasks.length - 1 ? selectedIndex + 1 : 0;
      renderTasks();
    }
  }

  if (e.key === " " && selectedIndex !== -1) {
    e.preventDefault();
    tasks[selectedIndex].done = !tasks[selectedIndex].done;
    saveData();
    renderTasks();
  }

  if (e.key === "Delete" && selectedIndex !== -1) {
    tasks.splice(selectedIndex, 1);
    if (selectedIndex >= tasks.length) selectedIndex = tasks.length - 1;
    saveData();
    renderTasks();
  }
});

renderTasks();
