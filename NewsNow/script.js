const newsContainer = document.getElementById('newsContainer');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

const feeds = [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'http://rss.cnn.com/rss/edition.rss',
    'http://feeds.reuters.com/reuters/topNews'
];

const RSS2JSON = feed => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`;

async function fetchNews() {
    newsContainer.innerHTML = '<p style="text-align:center;">Loading news...</p>';
    let allNews = [];
    for (let feed of feeds) {
        try {
            const response = await fetch(RSS2JSON(feed));
            const data = await response.json();
            allNews = allNews.concat(data.items);
        } catch (error) {
            console.error(error);
        }
    }
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    allNews = allNews.slice(0, 6);
    displayNews(allNews);
}

function displayNews(news) {
    newsContainer.innerHTML = '';
    const filterText = searchInput.value.toLowerCase();
    news.forEach(item => {
        if (item.title.toLowerCase().includes(filterText)) {
            const card = document.createElement('div');
            card.classList.add('news-card');
            const imageUrl = item.thumbnail || 'https://via.placeholder.com/300x150?text=No+Image';
            card.innerHTML = `
                <img src="${imageUrl}" alt="News Image">
                <h2>${item.title}</h2>
                <p>${item.pubDate.split(' ')[0]}</p>
                <a href="${item.link}" target="_blank">Read more</a>
            `;
            newsContainer.appendChild(card);
        }
    });
}

searchInput.addEventListener('input', () => fetchNews());

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌙';
});

fetchNews();
setInterval(fetchNews, 120000);
