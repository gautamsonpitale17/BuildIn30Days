let CRYPTO_DATA = [];
const cryptoListBody = document.getElementById("crypto-list-body");
const tableHeaderDynamic = document.getElementById("table-header-dynamic");
const messageBox = document.getElementById("message-box");
const themeIcon = document.getElementById("theme-icon");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

const formatCurrency = x => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: x > 100 ? 2 : 8
}).format(x);

const formatPercentage = x => x.toFixed(2) + "%";

const showMessage = (msg, type = "info") => {
    messageBox.textContent = msg;
    
    if (type === "error") {
        messageBox.style.backgroundColor = '#dc2626'; 
    } else if (type === "success") {
        messageBox.style.backgroundColor = '#059669';
    } else {
        messageBox.style.backgroundColor = '#3b82f6';
    }
    
    messageBox.className = `message-box`;
    messageBox.classList.remove("hidden");
    
    setTimeout(() => messageBox.classList.add("hidden"), 3000);
};

const THEME_ICONS = {
    light: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>`,
    dark: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 11.002 11.002 0 0012 20a11.002 11.002 0 008.354-4.646z"/>`
};

const updateThemeIcon = (theme) => {
    themeIcon.innerHTML = THEME_ICONS[theme];
};

window.toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    const newTheme = isDark ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
    showMessage(`Switched to ${newTheme} mode`);
};

const initializeTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    
    let currentTheme;
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    updateThemeIcon(currentTheme);
};

const renderTableHeader = () => {
    const isMarketCapSort = sortSelect.value === 'market_cap_desc';
    const isMobile = window.innerWidth <= 480;
    
    let marketCapClass = 'hidden-md';

    if (isMarketCapSort && isMobile) {
        marketCapClass = ''; 
    } else if (isMobile) {
        marketCapClass = 'hidden-md';
    }

    tableHeaderDynamic.innerHTML = `
        <tr>
            <th class="column-rank">#</th>
            <th class="column-coin">Coin</th>
            <th class="column-price">Price</th>
            <th class="column-market-cap ${marketCapClass}">Market Cap</th>
            <th class="column-change">24h Change</th>
        </tr>
    `;
};

const renderCryptoList = data => {
    if (!data.length) {
        cryptoListBody.innerHTML = `<tr><td colspan="5" class="loading-message">No results found.</td></tr>`;
        return;
    }
    
    const isMarketCapSort = sortSelect.value === 'market_cap_desc';
    const isMobile = window.innerWidth <= 480;
    
    let marketCapClass = 'hidden-md';

    if (isMarketCapSort && isMobile) {
        marketCapClass = ''; 
    } else if (isMobile) {
        marketCapClass = 'hidden-md';
    }

    cryptoListBody.innerHTML = data.map((coin, i) => {
        const isPositive = coin.price_change_percentage_24h >= 0;
        const changeClass = isPositive ? 'positive' : 'negative';
        const changeArrow = isPositive ? '▲' : '▼';
        const icon = coin.image || `https://placehold.co/32x32?text=${coin.symbol[0].toUpperCase()}`;
        
        return `
            <tr class="table-row-hover">
                <td class="column-rank-body">${i + 1}</td>
                <td class="column-coin-body">
                    <div class="coin-info">
                        <img src="${icon}" class="coin-icon" alt="${coin.name} icon">
                        <div>
                            <div class="coin-name">${coin.name}</div>
                            <div class="coin-symbol">${coin.symbol}</div>
                        </div>
                    </div>
                </td>
                <td class="column-price-body">${formatCurrency(coin.current_price)}</td>
                <td class="column-market-cap-body ${marketCapClass}">${formatCurrency(coin.market_cap)}</td>
                <td class="column-change-body ${changeClass}">
                    ${changeArrow} ${formatPercentage(coin.price_change_percentage_24h)}
                </td>
            </tr>`;
    }).join("");
};

const SORT_MAP = {
    market_cap_desc: (a, b) => b.market_cap - a.market_cap,
    price_desc: (a, b) => b.current_price - a.current_price,
    price_asc: (a, b) => a.current_price - b.current_price,
    change_24h_desc: (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
};

const applyFiltersAndSort = () => {
    const search = searchInput.value.toLowerCase();
    const sortKey = sortSelect.value;
    
    const filteredData = CRYPTO_DATA.filter(c =>
        c.name.toLowerCase().includes(search) || c.symbol.toLowerCase().includes(search)
    );

    filteredData.sort(SORT_MAP[sortKey]);
    
    renderTableHeader();
    renderCryptoList(filteredData);
};

const fetchCryptoData = async () => {
    const API = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1`;

    try {
        const res = await fetch(API);
        CRYPTO_DATA = await res.json();
        showMessage("Live data loaded ✅", "success");
    } catch (e) {
        showMessage("Using mock data ⚠️", "error");
        CRYPTO_DATA = [
            { name: "Bitcoin", symbol: "btc", current_price: 67890, market_cap: 1339876543210, price_change_percentage_24h: 3.45, image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
            { name: "Ethereum", symbol: "eth", current_price: 3876, market_cap: 465432109870, price_change_percentage_24h: 1.15, image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
            { name: "Solana", symbol: "sol", current_price: 135.5, market_cap: 60000000000, price_change_percentage_24h: -5.7, image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
            { name: "Binance Coin", symbol: "bnb", current_price: 601.2, market_cap: 90000000000, price_change_percentage_24h: 0.82, image: "https://assets.coingecko.com/coins/images/825/large/bnb.png" },
            { name: "XRP", symbol: "xrp", current_price: 0.52, market_cap: 28000000000, price_change_percentage_24h: -1.21, image: "https://assets.coingecko.com/coins/images/44/large/xrp-icon.png" },
        ];
    }

    renderTableHeader();
    applyFiltersAndSort(); 
};

searchInput.addEventListener('input', applyFiltersAndSort);
sortSelect.addEventListener('change', applyFiltersAndSort);

window.addEventListener('resize', () => {
    renderTableHeader();
    applyFiltersAndSort();
});

window.addEventListener('load', () => {
    initializeTheme();
    fetchCryptoData();
});