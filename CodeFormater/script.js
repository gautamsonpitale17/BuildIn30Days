const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const outputCard = document.getElementById('outputCard');
const formatBtn = document.getElementById('formatBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

function detectLanguage(text) {
  const t = text.trim();
  if (!t) return 'html';
  if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) return 'json';
  if (/<[a-z][\s\S]*>/i.test(t)) return 'html';
  if (/^[\s\S]*\{[\s\S]*\}/.test(t) || /:[\s\S]*;/.test(t)) return 'css';
  return 'javascript';
}

function formatCode(text, lang) {
  const opts = { indent_size: 2, max_preserve_newlines: 2, space_in_empty_paren: true };
  switch (lang) {
    case 'html': return html_beautify(text, opts);
    case 'css': return css_beautify(text, opts);
    case 'json':
      try { return JSON.stringify(JSON.parse(text), null, 2); } 
      catch (e) { return `⚠ Invalid JSON: ${e.message}`; }
    case 'javascript': return js_beautify(text, opts);
    default: return text;
  }
}

formatBtn.addEventListener('click', () => {
  const raw = inputEl.value;
  if (!raw.trim()) { outputCard.classList.add('hidden'); return; }
  const lang = detectLanguage(raw);
  outputEl.textContent = formatCode(raw, lang);
  outputCard.classList.remove('hidden');
});

copyBtn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(outputEl.textContent); alert('Copied to clipboard ✅'); } 
  catch { alert('Copy failed. Please copy manually.'); }
});

clearBtn.addEventListener('click', () => {
  inputEl.value = '';
  outputEl.textContent = '';
  outputCard.classList.add('hidden');
  inputEl.focus();
});

inputEl.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); formatBtn.click(); }
});
