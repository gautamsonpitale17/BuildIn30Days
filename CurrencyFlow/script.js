const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const swapBtn = document.getElementById("swapBtn");
const resultDiv = document.getElementById("result");
const themeToggle = document.getElementById("themeToggle");
const chartCanvas = document.getElementById("rateChart");

let currencyChart;

function checkInitialTheme() {
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "🌙";
    } else {
        themeToggle.textContent = "☀️";
    }
}

async function loadCurrencies() {
    try {
        const res = await fetch("https://api.frankfurter.app/currencies");
        const data = await res.json();
        const symbols = Object.keys(data);

        symbols.forEach((currency) => {
            const option1 = document.createElement("option");
            const option2 = document.createElement("option");
            option1.value = option2.value = currency;
            option1.textContent = option2.textContent = `${currency} (${data[currency]})`;
            fromCurrency.appendChild(option1);
            toCurrency.appendChild(option2);
        });

        fromCurrency.value = "USD";
        toCurrency.value = "INR";
    } catch (e) {
        console.error("Error loading currencies:", e);
        resultDiv.textContent = "Error: Could not load currency list.";
    }
}

async function convertCurrency() {
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        resultDiv.textContent = "Enter a valid amount (> 0)";
        amountInput.classList.add("error");
        return;
    }
    amountInput.classList.remove("error");

    const from = fromCurrency.value;
    const to = toCurrency.value;
    resultDiv.textContent = `Converting ${amount.toFixed(2)} ${from}...`;

    try {
        const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
        const data = await res.json();
        const rate = data.rates[to];

        if (rate) {
            resultDiv.textContent = `${amount.toFixed(2)} ${from} = ${rate.toFixed(2)} ${to}`;
            fetchHistoricalDataAndDrawChart(from, to);
        } else {
            resultDiv.textContent = "Conversion failed. Currency pair may not be supported.";
        }
    } catch (e) {
        console.error("Conversion error:", e);
        resultDiv.textContent = "Could not connect to the exchange rate service.";
    }
}

function get30DaysAgoDate() {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
}

async function fetchHistoricalDataAndDrawChart(from, to) {
    const startDate = get30DaysAgoDate();
    const endDate = new Date().toISOString().split('T')[0];

    try {
        const res = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${from}&to=${to}`);
        const data = await res.json();

        if (!data.rates || Object.keys(data.rates).length === 0) {
            console.error("No historical data available for this pair.");
            return;
        }

        const dates = Object.keys(data.rates).sort();
        const rates = dates.map(date => data.rates[date][to]);

        const isDarkMode = document.body.classList.contains("dark");
        const bodyStyle = getComputedStyle(document.body);

        const accentColor = isDarkMode ? bodyStyle.getPropertyValue('--text-dark').trim() : bodyStyle.getPropertyValue('--primary-accent').trim();
        const textColor = isDarkMode ? bodyStyle.getPropertyValue('--text-dark').trim() : bodyStyle.getPropertyValue('--text-light').trim();
        const gridColor = isDarkMode ? bodyStyle.getPropertyValue('--input-border-dark').trim() + '80' : bodyStyle.getPropertyValue('--input-border-light').trim() + '80';

        if (currencyChart) {
            currencyChart.destroy();
        }

        currencyChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: dates.map(d => d.substring(5)),
                datasets: [{
                    label: `${from} to ${to}`,
                    data: rates,
                    borderColor: accentColor,
                    backgroundColor: accentColor + '30',
                    tension: 0.2,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: textColor, maxTicksLimit: 7 },
                        grid: { color: gridColor }
                    },
                    y: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });

    } catch (e) {
        console.error("Error fetching historical data:", e);
    }
}

swapBtn.addEventListener("click", () => {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    convertCurrency();
});

amountInput.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "🌙" : "☀️";
    convertCurrency();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        convertCurrency();
        amountInput.blur();
    }
    if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        swapBtn.click();
    }
});

checkInitialTheme();

loadCurrencies().then(() => {
    convertCurrency();
});