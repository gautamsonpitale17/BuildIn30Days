const defaultCards = [
    { question: "What is Artificial Intelligence (AI)?", answer: "The simulation of human intelligence processes by machines, focusing on tasks like learning, reasoning, and problem-solving." },
    { question: "What is Machine Learning (ML)?", answer: "A field of AI that uses statistical models and algorithms to allow systems to learn patterns from data without explicit programming." },
    { question: "What is the goal of \"training\" an ML model?", answer: "To allow the model to adjust its parameters by analyzing data examples to make accurate predictions or decisions." },
    { question: "What is a Neural Network?", answer: "A type of ML model structured in layers of interconnected nodes (neurons) designed to recognize complex patterns." },
    { question: "What is supervised learning?", answer: "ML where the model is trained on labeled data, meaning the input data is paired with the correct output." },
    { question: "What is a \"large language model\" (LLM)?", answer: "A deep learning model trained on massive text datasets to understand, generate, and summarize human language." },
    { question: "What is an IP address?", answer: "A unique numerical label assigned to every device participating in a computer network for identification and location addressing." },
    { question: "What does HTTP stand for?", answer: "HyperText Transfer Protocol, the foundation for data communication on the World Wide Web." },
    { question: "What is the purpose of DNS?", answer: "Domain Name System, which translates human-readable domain names (like google.com) into IP addresses." },
    { question: "What is an API?", answer: "Application Programming Interface, a set of rules that allows different software components to communicate with each other." }
];

let flashcards = JSON.parse(localStorage.getItem('flashcards'));
if (!flashcards || flashcards.length < defaultCards.length) {
    flashcards = defaultCards;
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

let currentIndex = 0;

const flashcardEl = document.getElementById('flashcard');
const frontEl = flashcardEl.querySelector('.flashcard-front');
const backEl = flashcardEl.querySelector('.flashcard-back');
const addCardFormEl = document.getElementById('addCardForm');
const editCardFormEl = document.getElementById('editCardForm');
const editQuestionEl = document.getElementById('editQuestion');
const editAnswerEl = document.getElementById('editAnswer');
const addCardToggleBtn = document.getElementById('addCardToggle');

function saveFlashcards() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

function showCard() {
    if (flashcards.length === 0) {
        frontEl.innerText = "No cards yet! Add one below.";
        backEl.innerText = "No cards yet! Add one below.";
        editCardFormEl.classList.remove('visible');
        return;
    }
    flashcardEl.classList.remove('flipped');
    frontEl.innerText = flashcards[currentIndex].question;
    backEl.innerText = flashcards[currentIndex].answer;
}

function flipCard() {
    if (flashcards.length === 0) return;
    flashcardEl.classList.toggle('flipped');
}

function nextCard() {
    if (flashcards.length === 0) return;
    currentIndex = (currentIndex + 1) % flashcards.length;
    showCard();
}

function prevCard() {
    if (flashcards.length === 0) return;
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    showCard();
}

function toggleAddCardForm() {
    addCardFormEl.classList.toggle('visible');
    editCardFormEl.classList.remove('visible');
    addCardToggleBtn.style.display = addCardFormEl.classList.contains('visible') ? 'none' : 'inline-block';
}

function addCard() {
    const question = document.getElementById('question').value.trim();
    const answer = document.getElementById('answer').value.trim();
    if (question && answer) {
        flashcards.push({ question, answer });
        saveFlashcards();
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
        addCardFormEl.classList.remove('visible');
        addCardToggleBtn.style.display = 'inline-block';
        currentIndex = flashcards.length - 1;
        showCard();
    } else {
        alert("Please enter both question and answer!");
    }
}

function editCardToggle() {
    if (flashcards.length === 0) {
        alert("Cannot edit. There are no cards.");
        return;
    }
    addCardFormEl.classList.remove('visible');
    editQuestionEl.value = flashcards[currentIndex].question;
    editAnswerEl.value = flashcards[currentIndex].answer;
    editCardFormEl.classList.toggle('visible');
    addCardToggleBtn.style.display = editCardFormEl.classList.contains('visible') ? 'none' : 'inline-block';
}

function saveEdit() {
    const question = editQuestionEl.value.trim();
    const answer = editAnswerEl.value.trim();
    if (question && answer) {
        flashcards[currentIndex].question = question;
        flashcards[currentIndex].answer = answer;
        saveFlashcards();
        editCardFormEl.classList.remove('visible');
        showCard();
        addCardToggleBtn.style.display = 'inline-block';
    } else {
        alert("Please enter both question and answer for the edit!");
    }
}

function deleteCard() {
    if (flashcards.length === 0) return;
    if (confirm("Are you sure you want to delete this flashcard?")) {
        flashcards.splice(currentIndex, 1);
        saveFlashcards();
        if (currentIndex >= flashcards.length) {
            currentIndex = Math.max(0, flashcards.length - 1);
        }
        editCardFormEl.classList.remove('visible');
        showCard();
        addCardToggleBtn.style.display = 'inline-block';
    }
}

showCard();
