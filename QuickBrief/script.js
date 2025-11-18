const inputText = document.getElementById("inputText");
const summaryLength = document.getElementById("summaryLength");
const summarizeBtn = document.getElementById("summarizeBtn");
const loading = document.getElementById("loading");
const summaryContainer = document.getElementById("summaryContainer");
const summaryOutput = document.getElementById("summary");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");
const resetBtn = document.getElementById("resetBtn");

const stopWords = [
    "a","about","above","after","again","against","all","am","an","and","any","are","aren't","as","at",
    "be","because","been","before","being","below","between","both","but","by",
    "can","can't","cannot","could","couldn't",
    "did","didn't","do","does","doesn't","doing","don't","down","during",
    "each","few","for","from","further",
    "had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's",
    "i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself",
    "let's",
    "me","more","most","mustn't","my","myself",
    "no","nor","not",
    "of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own",
    "same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such",
    "than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too",
    "under","until","up",
    "very",
    "was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't",
    "you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"
];


themeToggle.innerText = document.body.classList.contains("dark") ? "🌙" : "☀️";

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

function summarizeText() {
    const text = inputText.value.trim();
    if (!text) {
        summaryContainer.style.display = "none";
        loading.style.display = "none";
        return;
    }

    loading.style.display = "block";
    summaryContainer.style.display = "none";

    setTimeout(() => {
        const cleanText = text.replace(/\s+/g, " ").replace(/\n/g, " ").trim();
        const sentences = cleanText.match(/[^\.!\?]+[\.!\?]+/g) || [cleanText];
        const words = cleanText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const wordFreq = {};

        words.forEach(word => {
            if (!stopWords.includes(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        const sentenceScores = sentences.map(sentence => {
            let score = 0;
            const sentenceWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
            sentenceWords.forEach(word => {
                if (wordFreq[word]) score += wordFreq[word];
            });
            return { sentence: sentence.trim(), score };
        });

        sentenceScores.sort((a, b) => b.score - a.score);
        const keep = Math.ceil(sentences.length * parseFloat(summaryLength.value));
        const topSentences = sentenceScores.slice(0, keep).map(s => s.sentence);
        summaryOutput.innerText = topSentences.join(" ");

        summaryContainer.style.display = "block";
        loading.style.display = "none";
    }, 1000);
}

summarizeBtn.addEventListener("click", summarizeText);

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(summaryOutput.innerText);
    copyBtn.innerText = "Copied!";
    setTimeout(() => copyBtn.innerText = "Copy", 1500);
});

downloadBtn.addEventListener("click", () => {
    const blob = new Blob([summaryOutput.innerText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    link.click();
});

resetBtn.addEventListener("click", () => {
    inputText.value = "";
    summaryOutput.innerText = "";
    summaryContainer.style.display = "none";
    loading.style.display = "none";
});
