const valueEl = document.getElementById('value');
const fromEl = document.getElementById('from');
const toEl = document.getElementById('to');
const convertBtn = document.getElementById('convert');
const swapBtn = document.getElementById('swap');
const outputEl = document.getElementById('output');
const noteEl = document.getElementById('note');
const clearBtn = document.getElementById('clear');
const copyBtn = document.getElementById('copy');
const themeToggle = document.getElementById('theme-toggle');

function cToF(c){return (c * 9/5) + 32}
function fToC(f){return (f - 32) * 5/9}
function cToK(c){return c + 273.15}
function kToC(k){return k - 273.15}

function convert(value, from, to){
    if(from === to) return value;
    let c;
    if(from === 'c') c = value;
    else if(from === 'f') c = fToC(value);
    else if(from === 'k') c = kToC(value);
    if(to === 'c') return c;
    else if(to === 'f') return cToF(c);
    else if(to === 'k') return cToK(c);
}

function round(n){
    return parseFloat(Number(n).toPrecision(7)).toString();
}

function getUnitDisplay(unit) {
    switch(unit) {
        case 'c': return '°C';
        case 'f': return '°F';
        case 'k': return 'K';
        default: return '';
    }
}

function showResult(text, isError = false){
    outputEl.textContent = text;
    outputEl.style.color = isError ? 'var(--danger)' : 'var(--accent)';
    copyBtn.disabled = isError;
}

function setTheme(theme) {
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        html.removeAttribute('data-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function checkInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return setTheme(savedTheme);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        return setTheme('dark');
    setTheme('light');
}

function handleConvert() {
    const value = parseFloat(valueEl.value);
    const from = fromEl.value;
    const to = toEl.value;
    if (isNaN(value)) {
        showResult('Invalid Input', true);
        noteEl.textContent = 'Please enter a valid number.';
        return;
    }
    const result = convert(value, from, to);
    const finalResult = round(result);
    showResult(finalResult + ' ' + getUnitDisplay(to));
    noteEl.textContent = `${round(value)} ${getUnitDisplay(from)} converted successfully.`;
}

function handleSwap() {
    const temp = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = temp;
    handleConvert();
}

function handleClear() {
    valueEl.value = '';
    showResult('—');
    noteEl.textContent = 'Enter a value and press Convert';
    valueEl.focus();
}

function handleCopy() {
    const textToCopy = outputEl.textContent;
    if (textToCopy === '—' || textToCopy === 'Invalid Input') return;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1200);
    });
}

convertBtn.addEventListener('click', handleConvert);
swapBtn.addEventListener('click', handleSwap);
clearBtn.addEventListener('click', handleClear);
copyBtn.addEventListener('click', handleCopy);
themeToggle.addEventListener('click', toggleTheme);
valueEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleConvert(); });
fromEl.addEventListener('change', handleConvert);
toEl.addEventListener('change', handleConvert);
checkInitialTheme();
