document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const ampmIndicator = document.getElementById('ampm-indicator');
    const dateReadout = document.getElementById('date-readout');
    const greetingContext = document.getElementById('greeting-context');

    const DARK_THEME = 'dark-theme';
    const LIGHT_THEME = 'light-theme';
    const THEME_STORAGE_KEY = 'digiclock-theme';

    function applyTheme(themeName) {
        body.classList.remove(DARK_THEME, LIGHT_THEME);
        body.classList.add(themeName);
        localStorage.setItem(THEME_STORAGE_KEY, themeName);

        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = themeName === DARK_THEME ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    function initializeTheme() {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        const initialTheme = storedTheme || DARK_THEME;
        applyTheme(initialTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains(DARK_THEME) ? DARK_THEME : LIGHT_THEME;
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyTheme(newTheme);
    });

    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }

    function getGreeting(hour) {
        if (hour < 5) return "Good Night";
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        if (hour < 22) return "Good Evening";
        return "Good Night";
    }

    function updateClock() {
        const now = new Date();
        let hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        const ampm = hour >= 12 ? 'PM' : 'AM';
        let displayHour = hour % 12;
        displayHour = displayHour === 0 ? 12 : displayHour;

        hoursElement.textContent = padZero(displayHour);
        minutesElement.textContent = padZero(minute);
        secondsElement.textContent = padZero(second);
        ampmIndicator.textContent = ampm;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateReadout.textContent = now.toLocaleDateString('en-US', options);

        greetingContext.textContent = getGreeting(hour);
    }

    initializeTheme();
    updateClock();
    setInterval(updateClock, 1000);
});
