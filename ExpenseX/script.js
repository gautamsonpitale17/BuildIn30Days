let expenses = JSON.parse(localStorage.getItem("expensex")) || [];
let chart;
let editingId = null;
const THEME_KEY = "expensex-theme";

const CHART_COLORS = {
    dark: ["#FFFFFF", "#00E5FF", "#7C4DFF", "#00FF95", "#FF007F", "#FFEA00", "#18FFFF", "#8E24AA"],
    light: ["#1565C0", "#42A5F5", "#D84315", "#388E3C", "#FFC107", "#00BCD4", "#673AB7", "#E91E63"]
};

const dom = getElements();

function getElements() {
    return {
        body: document.body,
        expenseList: document.getElementById("expenseList"),
        totalDisplay: document.getElementById("totalDisplay"),
        themeToggleBtn: document.getElementById("themeToggleBtn"),
        
        searchInput: document.getElementById("searchInput"),
        monthFilter: document.getElementById("monthFilter"),
        clearFiltersBtn: document.getElementById("clearFilters"),

        modal: document.getElementById("modal"),
        modalTitle: document.getElementById("modalTitle"),
        addBtnOpen: document.getElementById("addBtnOpen"),
        closeModalBtn: document.getElementById("closeModal"),
        saveExpenseBtn: document.getElementById("saveExpense"),

        titleInput: document.getElementById("titleInput"),
        amountInput: document.getElementById("amountInput"),
        dateInput: document.getElementById("dateInput"),
        categoryInput: document.getElementById("categoryInput")
    };
}

function closeAndResetModal() {
    dom.titleInput.value = "";
    dom.amountInput.value = "";
    dom.dateInput.value = new Date().toISOString().split('T')[0]; 
    dom.categoryInput.value = "Food";
    editingId = null;
    dom.modal.classList.add("hidden");
}

function deleteExpense(id) {
    event.stopPropagation(); 
    
    if (!confirm("Delete this expense permanently?")) return;
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem("expensex", JSON.stringify(expenses));
    renderExpenses();
}

function handleSaveOrUpdate() {
    const title = dom.titleInput.value.trim();
    const amount = dom.amountInput.value;
    const date = dom.dateInput.value;
    const category = dom.categoryInput.value;

    if (!title || !amount || !date || Number(amount) <= 0) {
        alert("Please enter a valid title, amount, and date.");
        return;
    }

    const newExpense = { title, amount: Number(amount), date, category };

    if (editingId !== null) {
        const index = expenses.findIndex(e => e.id === editingId);
        if (index !== -1) {
            expenses[index] = { ...newExpense, id: editingId };
        }
    } else {
        expenses.push({ ...newExpense, id: Date.now() });
    }

    localStorage.setItem("expensex", JSON.stringify(expenses));
    closeAndResetModal();
    renderExpenses();
}

function openEditModal(id) {
    editingId = id;
    const expense = expenses.find(e => e.id === id);

    dom.modalTitle.textContent = "Edit Expense";
    dom.saveExpenseBtn.textContent = "Update";

    dom.titleInput.value = expense.title;
    dom.amountInput.value = expense.amount;
    dom.dateInput.value = expense.date;
    dom.categoryInput.value = expense.category;

    dom.modal.classList.remove("hidden");
}

function renderExpenses() {
    dom.expenseList.innerHTML = "";

    const text = dom.searchInput.value.toLowerCase();
    const month = dom.monthFilter.value;

    const filtered = expenses.filter(e =>
        e.title.toLowerCase().includes(text) && (!month || e.date.startsWith(month))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    dom.totalDisplay.textContent = total.toFixed(2);

    if (filtered.length === 0) {
        dom.expenseList.innerHTML = `<li style="text-align: center; color: var(--text-secondary);">No expenses found for this period.</li>`;
    }

    filtered.forEach(exp => {
        const li = document.createElement("li");
        li.className = "exp-item";
        
        const formattedDate = new Date(exp.date + 'T00:00:00').toLocaleDateString();

        li.innerHTML = `
            <div class="exp-item-content">
                <div class="exp-left">
                    <div class="exp-avatar">${exp.title.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="exp-title">${exp.title}</div>
                        <div class="exp-meta">${exp.category} · ${formattedDate}</div>
                    </div>
                </div>
                <div class="exp-right">
                    <div class="exp-amount">₹${exp.amount.toFixed(2)}</div>
                </div>
            </div>
            <button class="delete-btn" data-id="${exp.id}">🗑️</button>
        `;

        li.querySelector('.exp-item-content').onclick = () => openEditModal(exp.id);
        li.querySelector('.delete-btn').onclick = () => deleteExpense(exp.id);

        dom.expenseList.appendChild(li);
    });

    updateChart(filtered);
}

function updateChart(data) {
    const categories = {};
    data.forEach(e => categories[e.category] = (categories[e.category] || 0) + e.amount);

    const labels = Object.keys(categories);
    const values = Object.values(categories);
    
    const isLightMode = dom.body.classList.contains("light-mode");
    const currentChartColors = isLightMode ? CHART_COLORS.light : CHART_COLORS.dark;
    
    const backgroundColors = labels.map((_, i) => currentChartColors[i % currentChartColors.length]);

    if (chart) chart.destroy();

    const labelColor = isLightMode ? "#444444" : "#E0E0E0";
    const tooltipBg = isLightMode ? "#F7F7F7" : "#181818";
    const chartBorderColor = isLightMode ? "#FFFFFF" : "#181818";
    const tooltipTitleColor = isLightMode ? "#1565C0" : "#00AEEF";
    
    const isDesktop = window.innerWidth >= 900;
    const legendPosition = isDesktop ? "right" : "bottom"; 
    const legendAlign = isDesktop ? 'start' : 'center';

    chart = new Chart(document.getElementById("chart"), {
        type: "doughnut",
        data: {
            labels,
            datasets: [{ 
                data: values, 
                backgroundColor: backgroundColors, 
                borderColor: chartBorderColor, 
                borderWidth: 2 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
                legend: { 
                    position: legendPosition,
                    align: legendAlign, 
                    labels: { 
                        color: labelColor,
                        padding: 10,
                        boxWidth: 15
                    } 
                },
                tooltip: { backgroundColor: tooltipBg, bodyColor: labelColor, titleColor: tooltipTitleColor }
            }
        }
    });
}

function applyTheme() {
    const theme = localStorage.getItem(THEME_KEY) || "dark"; 

    if (theme === "light") {
        dom.body.classList.add("light-mode");
        dom.themeToggleBtn.textContent = "☀️";
    } else {
        dom.body.classList.remove("light-mode");
        dom.themeToggleBtn.textContent = "🌙";
    }

    renderExpenses(); 
}

function initListeners() {
    dom.addBtnOpen.onclick = () => {
        editingId = null;
        dom.modalTitle.textContent = "Add Expense";
        dom.saveExpenseBtn.textContent = "Save";
        closeAndResetModal();
        dom.modal.classList.remove("hidden");
    };

    dom.closeModalBtn.onclick = closeAndResetModal;
    dom.saveExpenseBtn.onclick = handleSaveOrUpdate;
    dom.searchInput.oninput = renderExpenses;
    dom.monthFilter.oninput = renderExpenses;

    dom.clearFiltersBtn.onclick = () => {
        dom.searchInput.value = "";
        dom.monthFilter.value = "";
        renderExpenses();
    };

    dom.themeToggleBtn.onclick = () => {
        const currentTheme = dom.body.classList.contains("light-mode") ? "light" : "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme();
    };
    
    window.addEventListener('resize', () => {
        renderExpenses(); 
    });
}

function init() {
    dom.dateInput.value = new Date().toISOString().split('T')[0];
    initListeners();
    applyTheme();
}

init();