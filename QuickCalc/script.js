document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const display = document.querySelector('.display input');
    const calculatorForm = document.querySelector('.calculator form');
    const buttons = calculatorForm.querySelectorAll('input[type="button"]');


    const DARK_THEME = 'dark-theme';
    const LIGHT_THEME = 'light-theme';
    const THEME_STORAGE_KEY = 'quickcalc-theme';

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


    function appendValue(val) {
        const lastChar = display.value.slice(-1);
        
        if (['+', '-', '*', '/', '%', '.'].includes(val) && ['+', '-', '*', '/', '%', '.'].includes(lastChar)) {
            return; 
        }

        if (val === '00' && display.value === '') {
            return;
        }

        display.value += val;
    }

    function clearDisplay() {
        display.value = '';
    }

    function deleteLast() {
        display.value = display.value.slice(0, -1);
    }

    function calculate() {
        try {
            let expression = display.value.replace(/%/g, '/100');
            let result = eval(expression);
            
            if (result.toString().includes('.')) {
                result = parseFloat(result.toFixed(10));
            }
            
            display.value = result;
        } catch (e) {
            display.value = 'Error';
            setTimeout(() => (display.value = ''), 1000); 
        }
    }

    calculatorForm.addEventListener('click', (event) => {
        const button = event.target;
        if (button.tagName === 'INPUT' && button.type === 'button') {
            const value = button.value;
            const dataType = button.getAttribute('data-type');
            
            if (dataType === 'number' || dataType === 'decimal' || dataType === 'operator') {
                appendValue(value);
            } else if (dataType === 'clear') {
                clearDisplay();
            } else if (dataType === 'delete') {
                deleteLast();
            } else if (dataType === 'equals') {
                calculate();
            }
        }
    });


    document.addEventListener('keydown', (event) => {
        const key = event.key;

        buttons.forEach(button => {
            let match = false;
            if (button.value === key) match = true;
            if (key === 'Enter' && button.value === '=') match = true;
            if (key === 'Backspace' && button.value === 'DEL') match = true;
            if (key.toLowerCase() === 'c' && button.value === 'AC') match = true;

            if (match) {
                button.classList.add('active');
                setTimeout(() => button.classList.remove('active'), 100);
            }
        });

        if (!isNaN(key) || ['+', '-', '*', '/', '%', '.'].includes(key)) {
            appendValue(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault(); 
            calculate();
        } else if (key === 'Backspace') {
            deleteLast();
        } else if (key.toLowerCase() === 'c' || key.toLowerCase() === 'a') {
            clearDisplay();
        }
    });
    
    initializeTheme();
});