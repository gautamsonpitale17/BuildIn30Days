const fileInput = document.getElementById('fileInput');
const dropzone = document.getElementById('dropzone');
const targetSelect = document.getElementById('targetSelect');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const modeToggle = document.getElementById('modeToggle');
const body = document.body;
let loadedFile = null;
let originalName = '';
if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
}
['dragenter','dragover'].forEach(ev=>{
    dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
    });
});
['dragleave','drop'].forEach(ev=>{
    dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
    });
});
dropzone.addEventListener('drop', (e)=>{
    const f = e.dataTransfer.files[0];
    if(f) handleFile(f);
});
fileInput.addEventListener('change', (e)=>{
    const f = e.target.files[0];
    if(f) handleFile(f);
});
function resetState(){
    loadedFile = null;
    originalName = '';
    convertBtn.disabled = true;
    resetBtn.disabled = true;
    fileInput.value = '';
}
resetBtn.addEventListener('click', resetState);
function handleFile(file){
    resetState();
    loadedFile = file;
    originalName = file.name;
    convertBtn.disabled = false;
    resetBtn.disabled = false;
}
function isImageTarget(target){
    return target === 'image/jpeg' || target === 'image/png';
}
function isImageType(name){
    const ext = name.split('.').pop().toLowerCase();
    return ['png','jpg','jpeg','gif'].includes(ext);
}
function isTextType(name){
    const ext = name.split('.').pop().toLowerCase();
    return ['txt','md','html','css','js','json'].includes(ext);
}
function readAsText(file){
    return new Promise((res,rej)=>{
        const r = new FileReader();
        r.onload = ()=>res(String(r.result));
        r.onerror = ()=>rej(new Error('Failed to read file as text'));
        r.readAsText(file);
    });
}
function readAsDataURL(file){
    return new Promise((res,rej)=>{
        const r = new FileReader();
        r.onload = ()=>res(String(r.result));
        r.onerror = ()=>rej(new Error('Failed to read file as data URL'));
        r.readAsDataURL(file);
    });
}
convertBtn.addEventListener('click', async ()=>{
    if(!loadedFile) return;
    const target = targetSelect.value;
    try{
        if(target === 'pdf'){
            if(isImageType(originalName)){
                const dataUrl = await readAsDataURL(loadedFile);
                await convertImageToPDF(dataUrl);
            } else if(isTextType(originalName)){
                const text = await readAsText(loadedFile);
                convertTextToPDF(text);
            } else {
                alert('File type must be an image or text for PDF conversion.');
            }
        } else if(isImageTarget(target)){
            if(isImageType(originalName)){
                const dataUrl = await readAsDataURL(loadedFile);
                await convertImageDataURL(dataUrl, target);
            } else {
                alert('Only image files can be converted to JPEG or PNG.');
            }
        } else {
            alert('Unsupported conversion: Please select PDF, PNG, or JPEG.');
        }
    }catch(e){
        alert('Conversion failed: ' + (e && e.message || e));
    }
});
function convertTextToPDF(text){
    if(typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        alert('Error: jsPDF library not loaded. Check your HTML script tag.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 10, 10);
    doc.save(changeExtension(originalName, 'pdf'));
}
function convertImageToPDF(dataUrl){
    if(typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        alert('Error: jsPDF library not loaded. Check your HTML script tag.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const img = new Image();
    img.onload = () => {
        const doc = new jsPDF({
            orientation: img.naturalWidth > img.naturalHeight ? 'l' : 'p',
            unit: 'px',
            format: [img.naturalWidth, img.naturalHeight]
        });
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        doc.addImage(dataUrl, 'JPEG', 0, 0, w, h);
        doc.save(changeExtension(originalName, 'pdf'));
    };
    img.onerror = ()=> alert('Failed to load image for PDF conversion');
    img.src = dataUrl;
}
function convertImageDataURL(dataUrl, targetMime){
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const outMime = targetMime;
            if(canvas.toBlob){
                canvas.toBlob(blob=>{
                    if(!blob){
                        reject(new Error('Conversion to blob failed'));
                        return;
                    }
                    const outName = changeExtension(originalName, outMime);
                    downloadBlob(blob, outName);
                    resolve();
                }, outMime);
            } else {
                try{
                    const dataURL = canvas.toDataURL(outMime);
                    const blob = dataURLtoBlob(dataURL);
                    const outName = changeExtension(originalName, outMime);
                    downloadBlob(blob, outName);
                    resolve();
                }catch(err){ reject(err) }
            }
        };
        img.onerror = ()=> reject(new Error('Failed to load image for conversion'));
        img.src = dataUrl;
    });
}
function changeExtension(filename, target){
    const base = filename.includes('.') ? filename.slice(0, filename.lastIndexOf('.')) : filename;
    const ext = extFromTarget(target);
    return base + (ext ? '.' + ext : '');
}
function extFromTarget(target){
    if(!target) return '';
    if(target === 'image/jpeg') return 'jpg';
    if(target === 'image/png') return 'png';
    if(target === 'pdf') return 'pdf';
    return target.replace(/\W+/g,'').toLowerCase();
}
function downloadBlob(blob, filename){
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 5000);
}
function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], {type:mime});
}

// --- Dark/Light Mode Logic ---

function applyMode(isLight) {
    if (isLight) {
        body.classList.add('light-mode');
        // Use Moon emoji for dark mode toggle button
        modeToggle.textContent = '☀️'; 
        localStorage.setItem('mode', 'light');
    } else {
        body.classList.remove('light-mode');
        // Use Sun emoji for light mode toggle button
        modeToggle.textContent = '🌙'; 
        localStorage.setItem('mode', 'dark');
    }
}

function toggleMode() {
    const isLight = body.classList.contains('light-mode');
    applyMode(!isLight);
}

// Initialize mode from local storage or system preference
document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('mode');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedMode) {
        // Use saved preference
        applyMode(savedMode === 'light');
    } else {
        // Use system preference as default
        applyMode(prefersLight);
    }
});

modeToggle.addEventListener('click', toggleMode);