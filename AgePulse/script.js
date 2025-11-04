const dobInput = document.getElementById('dobInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultContainer = document.getElementById('resultContainer');
const ageResultLine = document.getElementById('ageResultLine');
const errorDisplay = document.getElementById('error');
const themeToggle = document.getElementById('themeToggle'); 
const body = document.body; 

function setTheme(isLight) {
    if (isLight) {
        body.classList.add('light-theme');
        themeToggle.textContent = '☀️'; 
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        themeToggle.textContent = '🌙'; 
        localStorage.setItem('theme', 'dark');
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    setTheme(true);
} else {
    setTheme(false);
}

themeToggle.addEventListener('click', () => {
    const isLight = body.classList.contains('light-theme');
    setTheme(!isLight);
});

function calculateAge(dob, today) {
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days = prevMonth.getDate() + days;
    }

    if (months < 0) {
        years--;
        months = 12 + months;
    }

    return { years, months, days };
}

function displayResult(age) {
    resultContainer.classList.remove("hidden");
    
    const resultText = `${age.years} years, ${age.months} months, and ${age.days} days old`;
    
    ageResultLine.textContent = resultText;
    
    resultContainer.style.opacity = '0';
    setTimeout(() => {
        resultContainer.style.opacity = '1';
    }, 10);
}

function displayError(msg) {
    errorDisplay.textContent = msg;
    errorDisplay.style.display = "block";
    resultContainer.classList.add("hidden");
}
function hideError() {
    errorDisplay.style.display = "none";
}

calculateBtn.addEventListener('click', () => {
    hideError();
    const dobString = dobInput.value;

    if (!dobString) return displayError("Please enter your date of birth.");

    const dob = new Date(dobString);
    const today = new Date();

    if (dob >= today) return displayError("Date cannot be today or future.");

    const age = calculateAge(dob, today);
    displayResult(age);
});

window.onload = () => {
    dobInput.max = new Date().toISOString().split("T")[0];
};