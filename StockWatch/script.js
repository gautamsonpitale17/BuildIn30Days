const watchlistContainer = document.getElementById('watchlist-container');
const mainStockView = document.getElementById('main-stock-view');
const stockChartCanvas = document.getElementById('stockChart');
const themeToggle = document.getElementById('theme-toggle');
let activeSymbol = null;
let stockChart = null;

// Mock stock data
let stocks = [
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 420.75, change: -0.45, volume: 2800000, history: generateMockHistory(425, 30) },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2900.50, change: 0.85, volume: 1500000, history: generateMockHistory(2900, 30) },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 987.21, change: -1.20, volume: 8900000, history: generateMockHistory(980, 30) },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 3450.99, change: 0.15, volume: 4500000, history: generateMockHistory(3400, 30) },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.40, change: 2.10, volume: 12000000, history: generateMockHistory(170, 30) },
];

// Helper Functions
function generateMockHistory(basePrice, count) {
    let history = [];
    let currentPrice = basePrice;
    for (let i = 0; i < count; i++) {
        currentPrice += (Math.random() - 0.5) * (basePrice * 0.005);
        history.push(parseFloat(currentPrice.toFixed(2)));
    }
    return history;
}

function formatCurrency(number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
}

function formatVolume(number) {
    if (number >= 1000000) return (number / 1000000).toFixed(2) + 'M';
    if (number >= 1000) return (number / 1000).toFixed(2) + 'K';
    return number;
}

// Watchlist rendering
function createWatchlistItemHTML(stock) {
    const isPositive = stock.change >= 0;
    const changeClass = isPositive ? 'positive' : 'negative';
    const changeSign = isPositive ? '+' : '';
    return `
        <div class="watchlist-item ${stock.symbol === activeSymbol ? 'active' : ''}" data-symbol="${stock.symbol}">
            <div>
                <p>${stock.symbol}</p>
                <p>${stock.name}</p>
            </div>
            <div>
                <p>${formatCurrency(stock.price)}</p>
                <p class="${changeClass}">${changeSign}${stock.change.toFixed(2)}%</p>
            </div>
        </div>
    `;
}

function renderWatchlist() {
    watchlistContainer.innerHTML = stocks.map(createWatchlistItemHTML).join('');
    attachWatchlistListeners();
}

function attachWatchlistListeners() {
    document.querySelectorAll('.watchlist-item').forEach(item => {
        item.addEventListener('click', () => {
            const symbol = item.getAttribute('data-symbol');
            setActiveStock(symbol);
        });
    });
}

function setActiveStock(symbol) {
    activeSymbol = symbol;
    renderWatchlist();
    renderMainStockView(true);
}

function getGradient(ctx, isPositive) {
    if (!ctx) return 'rgba(0,0,0,0)';
    const chart = ctx.canvas;
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    const color = isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
    
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    return gradient;
}

function renderMainStockView(forceChartCreation = false) {
    const stock = stocks.find(s => s.symbol === activeSymbol);
    if (!stock) {
        mainStockView.innerHTML = `<p>Select a stock from the watchlist to view details.</p>`;
        if (stockChart) {
            stockChart.destroy();
            stockChart = null;
        }
        return;
    }

    const isPositive = stock.change >= 0;
    const changeClass = isPositive ? 'positive' : 'negative';
    const changeSign = isPositive ? '↑' : '↓';

    // Check if the chart canvas needs to be re-created or its container updated
    const isChartInDOM = document.getElementById('stockChart');
    if (!isChartInDOM || forceChartCreation) {
        if (stockChart) stockChart.destroy();

        mainStockView.innerHTML = `
            <h2>${stock.symbol} - ${stock.name}</h2>
            <p>Price: ${formatCurrency(stock.price)}</p>
            <p class="${changeClass}">Change: ${changeSign} ${Math.abs(stock.change).toFixed(2)}%</p>
            <p>Volume: ${formatVolume(stock.volume)}</p>
            <canvas id="stockChart"></canvas>
        `;
    } else {
        document.querySelector('#main-stock-view h2').textContent = `${stock.symbol} - ${stock.name}`;
        document.querySelector('#main-stock-view p:nth-child(2)').textContent = `Price: ${formatCurrency(stock.price)}`;
        const changeElement = document.querySelector('#main-stock-view p:nth-child(3)');
        changeElement.className = changeClass;
        changeElement.textContent = `Change: ${changeSign} ${Math.abs(stock.change).toFixed(2)}%`;
        document.querySelector('#main-stock-view p:nth-child(4)').textContent = `Volume: ${formatVolume(stock.volume)}`;
    }


    const ctx = document.getElementById('stockChart') ? document.getElementById('stockChart').getContext('2d') : null;
    const color = isPositive ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)';

    if (!stockChart || forceChartCreation) {
        if (ctx) {
            // Destroy existing chart if it exists and we're forcing creation
            if (stockChart) stockChart.destroy(); 
            stockChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: stock.history.map((_, i) => i + 1),
                    datasets: [{
                        label: `${stock.symbol} Price`,
                        data: stock.history,
                        borderColor: color,
                        backgroundColor: (context) => getGradient(context.chart.ctx, isPositive),
                        fill: 'start',
                        tension: 0.2,
                        pointRadius: 0,
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: {
                        duration: 500,
                        easing: 'linear'
                    },
                    plugins: { 
                        legend: { display: false } 
                    },
                    scales: {
                        x: { 
                            display: false,
                            grid: { display: false }
                        },
                        y: { 
                            display: true, 
                            title: { display: true, text: 'Price (USD)', color: 'var(--color-text)' },
                            ticks: { color: 'var(--color-text)' },
                            grid: { display: false } // Removed horizontal grid lines
                        }
                    }
                }
            });
        }
    } else if (stockChart && stockChart.data.datasets.length > 0) {
        // Update existing chart data and colors
        stockChart.options.scales.y.title.color = 'var(--color-text)';
        stockChart.options.scales.y.ticks.color = 'var(--color-text)';
        stockChart.options.scales.y.grid.display = false; // Ensure grid lines stay hidden on update

        stockChart.data.datasets[0].borderColor = color;
        stockChart.data.datasets[0].backgroundColor = (context) => getGradient(context.chart.ctx, isPositive);
        stockChart.data.datasets[0].data = stock.history;
        stockChart.data.labels = stock.history.map((_, i) => i + 1);
        stockChart.update();
    }
}

// Theme Toggle Functionality
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLightTheme = document.body.classList.contains('light-theme');
    themeToggle.textContent = isLightTheme ? '☀️' : '🌙';

    // Force chart re-creation/update to pick up new colors from CSS variables
    if (activeSymbol) {
        renderMainStockView(true); 
    }
}

// Simulate price updates
function simulateStockUpdates() {
    stocks.forEach(stock => {
        const priceDelta = (Math.random() - 0.5) * (stock.price * 0.01);
        stock.price = parseFloat((stock.price + priceDelta).toFixed(2));
        stock.change += (Math.random() - 0.5) * 0.1;
        stock.history.shift();
        stock.history.push(stock.price);
    });
    renderWatchlist();
    if (activeSymbol) renderMainStockView(); 
}

// Initialize
window.onload = function() {
    if (stocks.length > 0) activeSymbol = stocks[0].symbol;
    renderWatchlist();
    renderMainStockView(true);
    setInterval(simulateStockUpdates, 3000);

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
};