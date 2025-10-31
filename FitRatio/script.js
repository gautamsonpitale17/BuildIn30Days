const elements = {
    bmiForm: document.getElementById('bmiForm'),
    heightInput: document.getElementById('heightInput'),
    weightInput: document.getElementById('weightKg'),
    age: document.getElementById('age'),
    gender: document.getElementById('gender'),
    
    heightUnit: document.getElementById('heightUnit'),
    weightUnit: document.getElementById('weightUnit'),

    bmiValue: document.getElementById('bmiValue'),
    bmiStatusText: document.getElementById('bmiStatusText'),
    bmiResultBox: document.getElementById('bmiResultBox'),
    
    bmrValue: document.getElementById('bmrValue'),
    
    suggestionBox: document.getElementById('suggestionBox'),
    weightSuggestion: document.getElementById('weightSuggestion'),
    
    unitsToggle: document.getElementById('unitsToggle'),
    resetBtn: document.getElementById('resetBtn'),
    themeToggle: document.getElementById('themeToggle'),
    toast: document.getElementById('toast'),
    
    bmiChart: document.getElementById('bmiChart'),
};

let currentUnits = localStorage.getItem('bmi_units') || 'metric';
let chartInstance = null;

const BMI_RANGES = {
    underweight: { min: 0, max: 18.49 },
    normal: { min: 18.5, max: 24.99 },
    overweight: { min: 25, max: 29.99 },
    obese: { min: 30, max: 999 },
};

function convertValue(value, unitType, toUnits) {
    if (isNaN(value)) return null;
    
    if (unitType === 'height') {
        if (toUnits === 'imperial') {
            return value * 0.393701;
        } else {
            return value / 0.393701;
        }
    } else if (unitType === 'weight') {
        if (toUnits === 'imperial') {
            return value * 2.20462;
        } else {
            return value / 2.20462;
        }
    }
    return value;
}

function updateUnitLabels(units) {
    if (units === 'metric') {
        elements.heightUnit.textContent = 'cm';
        elements.weightUnit.textContent = 'kg';
        elements.unitsToggle.textContent = 'METRIC';
    } else {
        elements.heightUnit.textContent = 'in';
        elements.weightUnit.textContent = 'lbs';
        elements.unitsToggle.textContent = 'IMPERIAL';
    }
}

function handleUnitsToggle() {
    const newUnits = currentUnits === 'metric' ? 'imperial' : 'metric';
    
    const height = parseFloat(elements.heightInput.value);
    const weight = parseFloat(elements.weightInput.value);
    
    if (!isNaN(height) && height !== 0) {
        const newHeight = convertValue(height, 'height', newUnits);
        elements.heightInput.value = newUnits === 'imperial' ? newHeight.toFixed(0) : newHeight.toFixed(1);
    }
    
    if (!isNaN(weight) && weight !== 0) {
        const newWeight = convertValue(weight, 'weight', newUnits);
        elements.weightInput.value = newUnits === 'imperial' ? newWeight.toFixed(0) : newWeight.toFixed(1);
    }
    
    currentUnits = newUnits;
    localStorage.setItem('bmi_units', newUnits);
    updateUnitLabels(newUnits);
    showToast(`Switched to ${newUnits.toUpperCase()} units!`, 'info');
}

function calculateBMI(weight, height) {
    if (currentUnits === 'imperial') {
        weight = convertValue(weight, 'weight', 'metric');
        height = convertValue(height, 'height', 'metric') / 100;
    } else {
        height = height / 100;
    }
    
    if (height <= 0 || weight <= 0) return 0;
    return weight / (height * height);
}

function getBMIStatus(bmi) {
    if (isNaN(bmi) || bmi === 0) {
        return { text: 'Enter values and calculate', class: '' };
    } else if (bmi < BMI_RANGES.underweight.max) {
        return { text: 'Underweight', class: 'bmi-under' };
    } else if (bmi < BMI_RANGES.normal.max) {
        return { text: 'Fit / Normal', class: 'bmi-fit' };
    } else if (bmi < BMI_RANGES.overweight.max) {
        return { text: 'Overweight', class: 'bmi-over' };
    } else {
        return { text: 'Obese', class: 'bmi-extreme' };
    }
}

function calculateBMR(weight, height, age, gender) {
    if (currentUnits === 'imperial') {
        weight = convertValue(weight, 'weight', 'metric');
        height = convertValue(height, 'height', 'metric');
    }
    
    let bmr = 0;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    return bmr > 0 ? bmr.toFixed(0) : 0;
}

function generateWeightSuggestion(currentWeight, currentHeight, bmiStatus) {
    const targetBMI = 22;
    let targetKgForStatus = 0;
    let suggestionText = '--';
    let suggestionColorClass = '';

    const heightInMeters = currentUnits === 'imperial' 
        ? convertValue(currentHeight, 'height', 'metric') / 100
        : currentHeight / 100;
        
    const currentWeightKg = currentUnits === 'imperial' 
        ? convertValue(currentWeight, 'weight', 'metric')
        : currentWeight;

    if (bmiStatus === 'Fit / Normal') {
        suggestionText = `Congratulations! You are currently in the normal weight range!`;
        suggestionColorClass = 'bmi-fit';
    } else if (bmiStatus === 'Underweight') {
        targetKgForStatus = BMI_RANGES.normal.min * (heightInMeters * heightInMeters);
        const diffKg = targetKgForStatus - currentWeightKg;
        
        const displayUnits = currentUnits === 'imperial' ? 'lbs' : 'kg';
        let diffDisplay = Math.abs(diffKg);

        if (currentUnits === 'imperial') {
            diffDisplay = convertValue(diffDisplay, 'weight', 'imperial');
        }
        
        suggestionText = `You need to gain ${diffDisplay.toFixed(1)} ${displayUnits} to reach the normal BMI range.`;
        suggestionColorClass = 'bmi-under';
        
    } else {
        targetKgForStatus = BMI_RANGES.normal.max * (heightInMeters * heightInMeters);
        const diffKg = currentWeightKg - targetKgForStatus;
        
        const displayUnits = currentUnits === 'imperial' ? 'lbs' : 'kg';
        let diffDisplay = Math.abs(diffKg);

        if (currentUnits === 'imperial') {
            diffDisplay = convertValue(diffDisplay, 'weight', 'imperial');
        }
        
        suggestionText = `You need to lose ${diffDisplay.toFixed(1)} ${displayUnits} to reach the normal BMI range.`;
        suggestionColorClass = 'bmi-over';
    }
    
    elements.weightSuggestion.innerHTML = suggestionText;
    const colorVar = `--${suggestionColorClass}`;
    const color = getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
    elements.suggestionBox.style.borderColor = color;
    elements.suggestionBox.hidden = false;
}


function createOrUpdateChart(bmi) {
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const maxBMI = 40; 
    const normalizedBMI = Math.min(bmi, maxBMI);
    const remainder = maxBMI - normalizedBMI;
    
    const status = getBMIStatus(bmi);
    let barColorVariable;

    switch (status.class) {
        case 'bmi-under': barColorVariable = '--bmi-under'; break;
        case 'bmi-fit': barColorVariable = '--bmi-fit'; break;
        case 'bmi-over': barColorVariable = '--bmi-over'; break;
        case 'bmi-extreme': barColorVariable = '--bmi-extreme'; break;
        default: barColorVariable = '--muted';
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue(barColorVariable).trim();
    const mutedColor = rootStyles.getPropertyValue('--muted').trim();

    const data = {
        labels: ['BMI', 'Remaining'],
        datasets: [{
            data: [normalizedBMI, remainder],
            backgroundColor: [
                primaryColor,
                mutedColor + '1A',
            ],
            borderColor: [
                primaryColor,
                'transparent',
            ],
            borderWidth: 1,
            cutout: '80%', 
            circumference: 270, 
            rotation: 225, 
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label === 'BMI') {
                                return `BMI: ${normalizedBMI.toFixed(1)}`;
                            }
                            return null;
                        }
                    }
                },
            },
            elements: {
                arc: {
                    borderRadius: 5,
                    borderAlign: 'inner',
                }
            }
        }
    };

    chartInstance = new Chart(elements.bmiChart, config);
}


function handleSubmit(event) {
    event.preventDefault();
    
    const height = parseFloat(elements.heightInput.value);
    const weight = parseFloat(elements.weightInput.value);
    const age = parseInt(elements.age.value);
    const gender = elements.gender.value;
    
    if (isNaN(height) || isNaN(weight) || isNaN(age) || height <= 0 || weight <= 0 || age <= 0) {
        showToast('Please fill in all fields with valid numbers (Height, Weight, Age).', 'error');
        return;
    }
    
    const bmi = calculateBMI(weight, height);
    const bmiStatus = getBMIStatus(bmi);
    
    elements.bmiValue.textContent = bmi.toFixed(1);
    elements.bmiStatusText.textContent = bmiStatus.text;
    elements.bmiResultBox.className = 'stat bmi-result-box ' + bmiStatus.class;
    
    const bmr = calculateBMR(weight, height, age, gender);
    elements.bmrValue.textContent = bmr.toLocaleString();
    
    generateWeightSuggestion(weight, height, bmiStatus.text);
    
    createOrUpdateChart(bmi);
    
    showToast('Calculations complete!', 'success');
}

function resetApp() {
    elements.bmiForm.reset();
    
    elements.bmiValue.textContent = '—';
    elements.bmiStatusText.textContent = 'Enter values and calculate';
    elements.bmiResultBox.className = 'stat bmi-result-box';
    
    elements.bmrValue.textContent = '—';
    
    elements.weightSuggestion.textContent = '--';
    elements.suggestionBox.hidden = true;
    
    createOrUpdateChart(0); 

    showToast('Form cleared and reset.', 'info');
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('bmi_theme', newTheme);
    elements.themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    
    // Re-render chart to pick up new theme colors
    const currentBmi = parseFloat(elements.bmiValue.textContent) || 0;
    createOrUpdateChart(currentBmi);
}

function loadTheme() {
    const storedTheme = localStorage.getItem('bmi_theme') || 'dark'; 
    document.documentElement.setAttribute('data-theme', storedTheme);
    elements.themeToggle.textContent = storedTheme === 'dark' ? '🌙' : '☀️';
}

function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    let colorVar = type === 'error' ? '--danger' : (type === 'info' ? '--accent' : '--goal-met');
    const color = getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
    elements.toast.style.borderColor = color;
    
    elements.toast.removeAttribute('hidden');
    setTimeout(() => {
        elements.toast.setAttribute('hidden', '');
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    
    updateUnitLabels(currentUnits);
    
    elements.bmiForm.addEventListener('submit', handleSubmit);
    elements.resetBtn.addEventListener('click', resetApp);
    elements.unitsToggle.addEventListener('click', handleUnitsToggle);
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    createOrUpdateChart(0);
});