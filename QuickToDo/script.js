const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let selectedIndex = -1;

// Detect screen width for responsive adjustments
function adjustForScreen() {
  const width = window.innerWidth;

  listContainer.querySelectorAll("li").forEach((li) => {
    if (width <= 480) {
      li.style.fontSize = "16px";
      li.style.padding = "12px 8px 12px 45px";
      li.querySelector("span").style.width = "35px";
      li.querySelector("span").style.height = "35px";
      li.querySelector("span").style.fontSize = "20px";
    } else if (width <= 768) {
      li.style.fontSize = "16px";
      li.style.padding = "12px 8px 12px 48px";
      li.querySelector("span").style.width = "38px";
      li.querySelector("span").style.height = "38px";
      li.querySelector("span").style.fontSize = "21px";
    } else if (width <= 1024) {
      li.style.fontSize = "17px";
      li.style.padding = "14px 8px 14px 50px";
      li.querySelector("span").style.width = "40px";
      li.querySelector("span").style.height = "40px";
      li.querySelector("span").style.fontSize = "22px";
    } else {
      li.style.fontSize = "18px";
      li.style.padding = "16px 8px 16px 55px";
      li.querySelector("span").style.width = "45px";
      li.querySelector("span").style.height = "45px";
      li.querySelector("span").style.fontSize = "24px";
    }
  });
}

// Render tasks
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

  adjustForScreen(); // Adjust after rendering
}

// Save to localStorage
function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task
function addTask() {
  const text = inputBox.value.trim();
  if (text === "") {
    alert("You must enter your task!");
    return;
  }
  tasks.push({ text: text, done: false });
  saveData();
  renderTasks();
  inputBox.value = "";
  inputBox.focus();
}

// Delete or toggle done
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
});

// Enter key to add task
inputBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});

// Keyboard navigation
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

// Re-render on resize for responsiveness
window.addEventListener("resize", adjustForScreen);

renderTasks();
