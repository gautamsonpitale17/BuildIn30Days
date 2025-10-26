document.addEventListener('DOMContentLoaded', () => {
    const lengthInput = document.getElementById('length');
    const lengthSlider = document.getElementById('lengthSlider');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generateBtn = document.getElementById('generateBtn');
    const passwordOutput = document.getElementById('passwordOutput');
    const showHideBtn = document.getElementById('showHideBtn');
    const copyBtn = document.getElementById('copyBtn');
    const themeSwitch = document.getElementById('themeSwitch');
    const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
    const historyContainer = document.getElementById('historyContainer');
    const passwordHistoryUl = document.getElementById('passwordHistory');
    const deleteHistoryBtn = document.getElementById('deleteHistoryBtn');
    const downloadHistoryBtn = document.getElementById('downloadHistoryBtn');

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

    function generatePassword(length, options) {
        let characterPool = '';
        if (options.uppercase) characterPool += charSets.uppercase;
        if (options.lowercase) characterPool += charSets.lowercase;
        if (options.numbers) characterPool += charSets.numbers;
        if (options.symbols) characterPool += charSets.symbols;

        if (characterPool.length === 0) {
            passwordOutput.value = '';
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterPool.length);
            password += characterPool[randomIndex];
        }

        passwordOutput.value = password;
        
        saveToHistory(password);
    }

    function saveToHistory(password) {
        const timestamp = new Date().toLocaleString();
        const newEntry = { password, timestamp };
        
        passwordHistory.unshift(newEntry);
        
        if (passwordHistory.length > 10) {
            passwordHistory = passwordHistory.slice(0, 10);
        }
        
        localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
        renderHistory();
    }

    function renderHistory() {
        passwordHistoryUl.innerHTML = '';
        if (passwordHistory.length === 0) {
            passwordHistoryUl.innerHTML = '<li>No history saved.</li>';
            return;
        }

        passwordHistory.forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${entry.password}</strong> <span>${entry.timestamp}</span>`;
            passwordHistoryUl.appendChild(li);
        });
    }

    lengthInput.addEventListener('input', () => {
        lengthSlider.value = lengthInput.value;
    });
    lengthSlider.addEventListener('input', () => {
        lengthInput.value = lengthSlider.value;
    });

    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthInput.value);
        const options = {
            uppercase: uppercaseCheckbox.checked,
            lowercase: lowercaseCheckbox.checked,
            numbers: numbersCheckbox.checked,
            symbols: symbolsCheckbox.checked,
        };

        if (length < 4 || length > 32) {
            alert('Password length must be between 4 and 32 characters.');
            return;
        }
        if (!Object.values(options).some(v => v)) {
            alert('You must select at least one character type.');
            return;
        }

        generatePassword(length, options);
    });

    showHideBtn.addEventListener('click', () => {
        const isPassword = passwordOutput.type === 'password';
        passwordOutput.type = isPassword ? 'text' : 'password';
        showHideBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    copyBtn.addEventListener('click', () => {
        if (passwordOutput.value) {
            navigator.clipboard.writeText(passwordOutput.value).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 1500);
            });
        }
    });

    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('light-theme', themeSwitch.checked);
        document.body.classList.toggle('dark-theme', !themeSwitch.checked);
    });

    toggleHistoryBtn.addEventListener('click', () => {
        const isHidden = historyContainer.style.display === 'none' || historyContainer.style.display === '';
        historyContainer.style.display = isHidden ? 'flex' : 'none';
        toggleHistoryBtn.textContent = isHidden ? 'Hide History' : 'Show History';
    });

    deleteHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all saved passwords? This cannot be undone.')) {
            localStorage.removeItem('passwordHistory');
            passwordHistory = [];
            renderHistory();
        }
    });

    downloadHistoryBtn.addEventListener('click', () => {
        if (passwordHistory.length === 0) {
            alert('No history to download.');
            return;
        }

        const csvContent = "data:text/csv;charset=utf-8," 
                           + "Password,Timestamp\n" 
                           + passwordHistory.map(e => `"${e.password}", "${e.timestamp}"`).join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'password_history.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    renderHistory();
});