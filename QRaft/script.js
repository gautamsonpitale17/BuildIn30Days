const qrText = document.getElementById('qrText');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrcodeDiv = document.getElementById('qrcode');
const themeToggle = document.getElementById('themeToggle');

let qrcode;

function generateQRCode() {
    const text = qrText.value.trim();
    qrcodeDiv.innerHTML = "";

    if (!text) return;

    qrcode = new QRCode(qrcodeDiv, {
        text,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    qrcodeDiv.style.display = "flex";
}

function downloadQR() {
    const img = qrcodeDiv.querySelector("img") || qrcodeDiv.querySelector("canvas");
    if (!img) return;

    const link = document.createElement("a");
    link.download = "qraft-qr.png";
    link.href = img.src || img.toDataURL();
    link.click();
}

generateBtn.addEventListener("click", generateQRCode);
downloadBtn.addEventListener("click", downloadQR);

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light")
        ? "☀️"
        : "🌙";
});
