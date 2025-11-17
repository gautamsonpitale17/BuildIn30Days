const lockModal = document.getElementById('lockModal');
const vaultBox = document.getElementById('vaultBox');
const masterPwdInput = document.getElementById('masterPwd');
const unlockBtn = document.getElementById('unlockBtn');

const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');

const notePanel = document.getElementById('notePanel');
const noteTitle = document.getElementById('noteTitle');
const noteBody = document.getElementById('noteBody');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const cancelNoteBtn = document.getElementById('cancelNoteBtn');

const noteView = document.getElementById('noteView');
const viewTitle = document.getElementById('viewTitle');
const viewContent = document.getElementById('viewContent');
const copyBtn = document.getElementById('copyBtn');
const closeViewBtn = document.getElementById('closeViewBtn');

let masterPassword = null;
let autoLockTimeout = null;

const STORAGE_KEY = 'ciphervault_notes';

function strToBytes(str){const encoder=new TextEncoder();return encoder.encode(str);}
function bytesToStr(bytes){const decoder=new TextDecoder();return decoder.decode(bytes);}
function bytesToBase64(bytes){let b='';for(let i=0;i<bytes.length;i++)b+=String.fromCharCode(bytes[i]);return btoa(b);}
function base64ToBytes(b64){const bin=atob(b64);const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return arr;}
function deriveKeyBytes(password,length){const pwd=strToBytes(password);const key=new Uint8Array(length);for(let i=0;i<length;i++)key[i]=pwd[i%pwd.length];return key;}
function encryptText(text,password){const pt=strToBytes(text);const key=deriveKeyBytes(password,pt.length);const enc=new Uint8Array(pt.length);for(let i=0;i<pt.length;i++)enc[i]=pt[i]^key[i];return bytesToBase64(enc);}
function decryptText(encB64,password){try{const enc=base64ToBytes(encB64);const key=deriveKeyBytes(password,enc.length);const pt=new Uint8Array(enc.length);for(let i=0;i<enc.length;i++)pt[i]=enc[i]^key[i];return bytesToStr(pt);}catch{return null;}}

function loadVault(){return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');}
function saveVault(notes){localStorage.setItem(STORAGE_KEY,JSON.stringify(notes));}

function unlockVault(){
    const pwd = masterPwdInput.value.trim();
    if(!pwd){alert('Enter password');return;}
    masterPassword = pwd;
    lockModal.style.display = 'none';
    vaultBox.classList.remove('hidden');
    startAutoLockTimer();
    renderNotes();
}

function renderNotes(){
    const notes = loadVault();
    notesList.innerHTML='';
    if(notes.length===0){notesList.innerHTML='<div style="color:#888">No notes</div>';return;}
    notes.slice().reverse().forEach(n=>{
        const item = document.createElement('div'); item.className='note-item';
        const titleSpan = document.createElement('span'); titleSpan.textContent = n.title;
        const right = document.createElement('div');
        const viewBtn = document.createElement('button'); viewBtn.textContent='View'; viewBtn.onclick=()=>viewNote(n.id);
        const delBtn = document.createElement('button'); delBtn.textContent='Del'; delBtn.onclick=()=>deleteNote(n.id);
        right.appendChild(viewBtn); right.appendChild(delBtn);
        item.appendChild(titleSpan); item.appendChild(right);
        notesList.appendChild(item);
    });
}

function newNote(){noteTitle.value='';noteBody.value='';notePanel.classList.remove('hidden');noteView.classList.add('hidden');}
function cancelNewNote(){notePanel.classList.add('hidden');}

function saveNewNote(){
    const title = noteTitle.value.trim() || 'Untitled';
    const body = noteBody.value;
    if(!body){alert('Type something');return;}
    const enc = encryptText(body,masterPassword);
    const notes = loadVault();
    notes.push({id:'n_'+Date.now(),title,content:enc});
    saveVault(notes);
    notePanel.classList.add('hidden');
    noteView.classList.add('hidden');
    renderNotes();
    startAutoLockTimer();
}

function viewNote(id){
    const notes = loadVault();
    const note = notes.find(n=>n.id===id);
    if(!note) return alert('Not found');
    viewTitle.textContent = note.title;
    noteView.dataset.noteId = id;
    
    viewContent.textContent = decryptText(note.content, masterPassword); 
    
    notePanel.classList.add('hidden'); 
    noteView.classList.remove('hidden');
    startAutoLockTimer();
}

function deleteNote(id){
    if(!confirm('Delete this note?')) return;
    const notes = loadVault().filter(n=>n.id!==id);
    saveVault(notes);
    renderNotes();
}

copyBtn.addEventListener('click',()=>{navigator.clipboard.writeText(viewContent.textContent||'');alert('Copied');});
unlockBtn.addEventListener('click',unlockVault);
addNoteBtn.addEventListener('click',newNote);
cancelNoteBtn.addEventListener('click',cancelNewNote);
saveNoteBtn.addEventListener('click',saveNewNote);
closeViewBtn.addEventListener('click',()=>{noteView.classList.add('hidden');notePanel.classList.add('hidden');});
masterPwdInput.addEventListener('keydown',(e)=>{if(e.key==='Enter'){e.preventDefault();unlockVault();}});

function startAutoLockTimer(){stopAutoLockTimer(); autoLockTimeout=setTimeout(lockVault,2*60*1000);}
function stopAutoLockTimer(){if(autoLockTimeout) clearTimeout(autoLockTimeout);}
function lockVault(){masterPassword=null;vaultBox.classList.add('hidden');lockModal.style.display='flex';stopAutoLockTimer();}