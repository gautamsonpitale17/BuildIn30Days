const textInput=document.getElementById('text-input');
const speakButton=document.getElementById('speak-button');
const voiceSelect=document.getElementById('voice-select');
const modeToggle=document.getElementById('mode-toggle');
const body=document.body;
const synth=window.speechSynthesis;
let voices=[];

function loadVoices(){
  voices=synth.getVoices();
  voiceSelect.innerHTML='';
  voices.forEach(v=>{
    const o=document.createElement('option');
    o.textContent=`${v.name} (${v.lang})`;
    o.dataset.name=v.name;
    o.dataset.lang=v.lang;
    voiceSelect.appendChild(o);
  });
}
synth.onvoiceschanged=loadVoices;
loadVoices();

speakButton.addEventListener('click',()=>{
  const text=textInput.value.trim();
  if(!text) return alert("Please enter some text to speak.");
  synth.cancel();
  const u=new SpeechSynthesisUtterance(text);
  const selected=voiceSelect.selectedOptions[0].dataset.name;
  u.voice=voices.find(v=>v.name===selected);
  synth.speak(u);
});

const saved=localStorage.getItem('mode');
const prefersLight=window.matchMedia('(prefers-color-scheme: light)').matches;
if(saved==='light'||(!saved&&prefersLight)){
  body.classList.add('light-mode');
  modeToggle.innerHTML='<i class="fas fa-moon"></i>';
}else modeToggle.innerHTML='<i class="fas fa-sun"></i>';

modeToggle.addEventListener('click',()=>{
  body.classList.toggle('light-mode');
  if(body.classList.contains('light-mode')){
    modeToggle.innerHTML='<i class="fas fa-moon"></i>';
    localStorage.setItem('mode','light');
  } else {
    modeToggle.innerHTML='<i class="fas fa-sun"></i>';
    localStorage.setItem('mode','dark');
  }
});
