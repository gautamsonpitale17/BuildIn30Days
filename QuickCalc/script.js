// Display 
const display = document.querySelector('.display input');

// Calculator Functions 
function appendValue(val) {
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
    display.value = eval(display.value) || '';
  } catch {
    display.value = 'Error';
    setTimeout(() => (display.value = ''), 1000);
  }
}

// Keyboard Support 
const buttons = document.querySelectorAll('.calculator input');

document.addEventListener('keydown', (event) => {
  const key = event.key;

  buttons.forEach(button => {
    if (button.value === key || (key === 'Enter' && button.value === '=')) {
      button.classList.add('active');
      setTimeout(() => button.classList.remove('active'), 100);
    }
  });

  // Handle key input

  if (!isNaN(key)) {
    appendValue(key);
  } else if (key === '.') {
    appendValue('.');
  } else if (['+', '-', '*', '/'].includes(key)) {
    appendValue(key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key.toLowerCase() === 'c') {
    clearDisplay();
  }
});
