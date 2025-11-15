function removeHiddenUnicode() {
  let inputTextarea = document.getElementById('inputText');
  let outputTextarea = document.getElementById('output');
  let statusElement = document.getElementById('status');
  let copyContainer = document.querySelector('.copy-container');
  let originalText = inputTextarea.value;

  let hiddenRegex = /[\u200B-\u200D\uFEFF\u0000-\u0008\u000E-\u001F\u007F-\u009F]/g;
  let cleanedText = originalText.replace(hiddenRegex, '');
  outputTextarea.value = cleanedText;

  let originalLength = originalText.length;
  let cleanedLength = cleanedText.length;
  let removedCount = originalLength - cleanedLength;

  document.getElementById('originalCount').innerText = originalLength;
  document.getElementById('cleanedCount').innerText = cleanedLength;
  document.getElementById('removedCount').innerText = removedCount;

  if (removedCount > 0) {
    statusElement.innerText = "Cleaned! " + removedCount + " hidden character(s) removed.";
    statusElement.style.color = "#dc3545";
    outputTextarea.style.display = 'block';
    copyContainer.style.display = 'block';
  } else {
    statusElement.innerText = "No hidden characters found. ✅";
    statusElement.style.color = "#28a745";
    outputTextarea.style.display = 'none';
    copyContainer.style.display = 'none';
  }
}

function autoClean() {
  let inputText = document.getElementById('inputText').value;
  if (!inputText) {
    document.getElementById('output').style.display = 'none';
    document.querySelector('.copy-container').style.display = 'none';
    document.getElementById('status').innerText = '';
    document.getElementById('originalCount').innerText = '0';
    document.getElementById('cleanedCount').innerText = '0';
    document.getElementById('removedCount').innerText = '0';
    return;
  }
  removeHiddenUnicode();
}

function copyText() {
  let outputTextarea = document.getElementById('output');
  if (!outputTextarea.value) return;
  navigator.clipboard.writeText(outputTextarea.value)
    .then(() => {
      let copyBtn = document.getElementById('copyBtn');
      copyBtn.innerText = "✅ Copied!";
      setTimeout(() => {
        copyBtn.innerText = "Copy Clean Text";
      }, 1500);
    });
}

function resetApp() {
  document.getElementById('inputText').value = '';
  document.getElementById('output').value = '';
  document.getElementById('status').innerText = '';
  document.getElementById('originalCount').innerText = '0';
  document.getElementById('cleanedCount').innerText = '0';
  document.getElementById('removedCount').innerText = '0';
  document.getElementById('copyBtn').innerText = "Copy Clean Text";
  document.getElementById('output').style.display = 'none';
  document.querySelector('.copy-container').style.display = 'none';
}

function toggleTheme() {
  let body = document.body;
  let themeToggle = document.getElementById('themeToggle');
  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeToggle.innerText = "🌙";
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeToggle.innerText = "☀️";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputText').addEventListener('input', () => {
    if (!document.getElementById('inputText').value) {
      document.getElementById('output').style.display = 'none';
      document.querySelector('.copy-container').style.display = 'none';
      document.getElementById('status').innerText = '';
      document.getElementById('originalCount').innerText = '0';
      document.getElementById('cleanedCount').innerText = '0';
      document.getElementById('removedCount').innerText = '0';
    }
  });
});
