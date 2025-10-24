let questions = [
    {
        question: "In Game of Thrones, what is the name of the heavily armored military group that Daenerys acquires in Essos?",
        answers: [
            {text: "Dothraki", correct: false},
            {text: "Queen'sguard", correct: false},
            {text: "Second Sons", correct: false},
            {text: "Unsullied", correct: true},
        ]
    },
    {
        question: "In Breaking Bad, what color is the high-purity product that Walter White becomes famous for producing?",
        answers: [
            {text: "Red", correct: false},
            {text: "Green", correct: false},
            {text: "Blue", correct: true},
            {text: "Clear", correct: false},
        ]
    },
    {
        question: "In Dark, what is the precise number of years that separates the main time travel jumps?",
        answers: [
            {text: "33 Years", correct: true},
            {text: "27 Years", correct: false},
            {text: "176 Years", correct: false},
            {text: "21 Years", correct: false},
        ]
    },
    {
        question: "In Money Heist, what is the primary color of the jumpsuits worn by the entire crew during the heists?",
        answers: [
            {text: "White", correct: false},
            {text: "Red", correct: true}, 
            {text: "Black", correct: false},
            {text: "Green", correct: false},
        ]
    },
    {
        question: "In Alice in Borderland, which playing card suit represents the most brutal, psychological, and manipulative types of games?",
        answers: [
            {text: "Clubs", correct: false},
            {text: "Spades", correct: false},
            {text: "Hearts", correct: true},
            {text: "Diamonds", correct: false},
        ]
    }, 
    {
        question: "In Game of Thrones, what unique name is given to the special, large swords carried by Northern lords?",
        answers: [
            {text: "Steel", correct: false},
            {text: "Sharp", correct: false},
            {text: "Valyrian", correct: true},
            {text: "Master", correct: false},
        ]
    }, 
    {
        question: "In Game of Thrones, what region does the Stark family primarily call their homeland?",
        answers: [
            {text: "Vale", correct: false},
            {text: "North", correct: true},
            {text: "Riverrun", correct: false},
            {text: "Winterfell", correct: false},
        ]
    },
    {
        question: "In Game of Thrones, what powerful substance is used by the Lannisters to explode their enemies?",
        answers: [
            {text: "Wildfire", correct: true},
            {text: "Venom", correct: false},
            {text: "Fire", correct: false},
            {text: "Dragon", correct: false},
        ]
    },
    {
        question: "In Breaking Bad, what is the profession of Walter White's brother-in-law, Hank Schrader?",
        answers: [
            {text: "Police", correct: false},
            {text: "Agent", correct: false},
            {text: "FBI", correct: false},
            {text: "DEA", correct: true},
        ]
    },
    {
        question: "In Dark, what is the German name of the town where all of the mysteries and families are located?",
        answers: [
            {text: "Berlin", correct: false},
            {text: "Clausen", correct: false},
            {text: "Winden", correct: true},
            {text: "Bremen", correct: false},
        ]
    },
    {
        question: "In Dark, what structure is located on the edge of town and causes massive energy fluctuations?",
        answers: [
            {text: "Plant", correct: true},
            {text: "Bridge", correct: false},
            {text: "Portal", correct: false},
            {text: "Tower", correct: false},
        ]
    },
    {
        question: "In Dark, what common object does Noah use to murder his victims in his time travel experiments?",
        answers: [
            {text: "Knife", correct: false},
            {text: "Chair", correct: true},
            {text: "Gun", correct: false},
            {text: "Box", correct: false},
        ]
    },
    {
        question: "In Money Heist, what is the one-word title of the Italian resistance song that becomes the central anthem for the entire crew?",
        answers: [
            {text: "Aria", correct: false},
            {text: "Ciao", correct: true},
            {text: "Bella", correct: false},
            {text: "Adios", correct: false},
        ]
    },
    {
        question: "In Money Heist, what is the name of the police inspector who leads the investigation and negotiations against the Professor during the first heist?",
        answers: [
            {text: "Murillo", correct: true},
            {text: "Prieto", correct: false},
            {text: "Sierra", correct: false},
            {text: "Suarez", correct: false},
        ]
    },
    {
        question: "In Money Heist, what city name does the Professor's reckless brother use as his alias?",
        answers: [
            {text: "Oslo", correct: false},
            {text: "Moscow", correct: false},
            {text: "Nairobi", correct: false},
            {text: "Berlin", correct: true},
        ]
    },
    {
        question: "In Alice in Borderland, what common item do players receive that tracks their time remaining and shows game locations?",
        answers: [
            {text: "Clock", correct: false},
            {text: "Watch", correct: false},
            {text: "Phone", correct: true},
            {text: "Map", correct: false},
        ]
    },
    {
        question: "In Alice in Borderland, what is the name of the heavily guarded building where the main players try to gather all the playing cards?",
        answers: [
            {text: "Tower", correct: false},
            {text: "Beach", correct: true},
            {text: "Castle", correct: false},
            {text: "City", correct: false},
        ]
    },
    {
        question: "In Alice in Borderland, what happens to a player when their visa expires, signifying Game Over?",
        answers: [
            {text: "Bomb", correct: false},
            {text: "Laser", correct: true},
            {text: "Fall", correct: false},
            {text: "Wall", correct: false},
        ]
    },
    {
        question: "In Alice in Borderland, which playing card suit represents games that are primarily based on physical strength and athletic endurance?",
        answers: [
            {text: "Clubs", correct: false},
            {text: "Spades", correct: true},
            {text: "Hearts", correct: false},
            {text: "Diamonds", correct: false},
        ]
    },
    {
        question: "In Squid Game, what color is the uniform worn by the guards who administer the games?",
        answers: [
            {text: "White", correct: false},
            {text: "Red", correct: false},
            {text: "Pink", correct: true},
            {text: "Black", correct: false},
        ]
    },
    {
        question: "In The Boys, what is the specialized name for the main compound used to create super-powered individuals?",
        answers: [
            {text: "Serum", correct: false},
            {text: "Compound V", correct: true},
            {text: "Power", correct: false},
            {text: "Liquid", correct: false},
        ]
    },
    {
        question: "In The Boys, what is the single-word legal name of the corrupt corporation that manages all the superheroes?",
        answers: [
            {text: "Hero", correct: false},
            {text: "Seven", correct: false},
            {text: "Vought", correct: true},
            {text: "Global", correct: false},
        ]
    },
    {
        question: "In The Boys, what is the name of the speedster who is addicted to Compound V and accidentally kills a civilian?",
        answers: [
            {text: "Flash", correct: false},
            {text: "A-Train", correct: true},
            {text: "Turbo", correct: false},
            {text: "Fast", correct: false},
        ]
    },
    {
        question: "In The Boys, what is the one-word alias used by the leader of The Seven, known for his American aesthetic?",
        answers: [
            {text: "Soldier", correct: false},
            {text: "Homelander", correct: true},
            {text: "Deep", correct: false},
            {text: "Patriot", correct: false},
        ]
    },
    {
        question: "In Wednesday, what is the name of the special boarding school for outcasts that Wednesday attends?",
        answers: [
            {text: "Blackwood", correct: false},
            {text: "Salem", correct: false},
            {text: "Ravenclaw", correct: false},
            {text: "Nevermore", correct: true},
        ]
    },
    {
        question: "In Wednesday, what is the name of the female werewolf who is Wednesday's brightly colored roommate?",
        answers: [
            {text: "Enola", correct: false},
            {text: "Larissa", correct: false},
            {text: "Bianca", correct: false},
            {text: "Enid", correct: true},
        ]
    },
    {
        question: "In Wednesday, what is the name of the Addams family relative who serves as Wednesday's loyal, detached hand?",
        answers: [
            {text: "Thing", correct: true},
            {text: "Palm", correct: false},
            {text: "Hand", correct: false},
            {text: "Finger", correct: false},
        ]
    },
    {
        question: "In Game of Thrones, what is the final, highest position that Bran Stark ultimately accepts in the final season?",
        answers: [
            {text: "King", correct: true},
            {text: "Warden", correct: false},
            {text: "Dragon", correct: false},
            {text: "Lord", correct: false},
        ]
    },
    {
        question: "'Winter is coming' is the ancestral motto of House Stark and one of the most famous lines from which popular fantasy television series?",
        answers: [
            {text: "Vikings", correct: false},
            {text: "The Last Kingdom", correct: false},
            {text: "The Witcher", correct: false},
            {text: "Game of Thrones", correct: true},
        ]
    },
    {
        question: "Which main character from Breaking Bad delivers the famous, intimidating line, 'Say my name'",
        answers: [
            {text: "Jesse Pinkman", correct: false},
            {text: "Saul Goodman", correct: false},
            {text: "Mike Ehrmantraut", correct: false},
            {text: "Walter White", correct: true},
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const quitButton = document.getElementById("quit-btn");
const timerDisplay = document.getElementById("timer-display");
const timerContainer = document.getElementById("timer-container");

let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let unusedQuestions = [...questions];
const QUESTIONS_PER_ROUND = 5;
const TOTAL_ROUNDS = Math.ceil(questions.length / QUESTIONS_PER_ROUND);
let currentRound = 1;
const TIME_LIMIT = 15;
let countdown;

function toggleTimerVisibility(show) {
    timerContainer.style.display = show ? 'block' : 'none';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetState() {
    clearInterval(countdown);
    timerDisplay.innerText = TIME_LIMIT;
    nextButton.style.display = "none";
    nextButton.innerText = "Next";
    while(answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
    toggleTimerVisibility(false);
}

function startQuiz() {
    if (questions.length === 0) {
        questionElement.innerText = "Error: No questions available to start the quiz!";
        startButton.innerText = "Add Questions";
        toggleTimerVisibility(false);
        return;
    }
    
    startButton.style.display = "none";
    quitButton.style.display = "block";
    nextButton.style.display = "none";

    currentRound = 1;
    score = 0;
    unusedQuestions = [...questions];
    startButton.innerText = "Start Quiz";
    
    startRound();
}

function startRound() {
    resetState();
    currentQuestionIndex = 0;
    
    const numQuestionsToTake = Math.min(QUESTIONS_PER_ROUND, unusedQuestions.length);

    shuffleArray(unusedQuestions);
    quizQuestions = unusedQuestions.splice(0, numQuestionsToTake);
    
    if (quizQuestions.length > 0) {
        showQuestion();
    } else {
        showFinalResult(); 
    }
}

function showQuestion() {
    resetState();
    toggleTimerVisibility(true);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    if (!currentQuestion) {
        handleNextButton();
        return;
    }

    questionElement.innerText = `Round ${currentRound} - Q${currentQuestionIndex + 1}: ${currentQuestion.question}`;

    let timeRemaining = TIME_LIMIT;
    timerDisplay.innerText = timeRemaining;
    
    countdown = setInterval(() => {
        timeRemaining--;
        timerDisplay.innerText = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(countdown);
            disableButtonsAndProceed(false); 
        }
    }, 1000);

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if(answer.correct) button.dataset.correct = "true";
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });
}

function selectAnswer(e) {
    clearInterval(countdown);
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if(!isCorrect) selectedBtn.classList.add("incorrect");
    
    disableButtonsAndProceed(isCorrect);
}

function disableButtonsAndProceed(correct) {
    Array.from(answerButtons.children).forEach(btn => {
        if(btn.dataset.correct === "true") {
            btn.classList.add("correct");
        }
        btn.disabled = true;
    });
    
    if(correct) score++;

    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    
    if(currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        currentRound++;
        
        if(unusedQuestions.length === 0) {
            showFinalResult();
        } else {
            questionElement.innerText = `Round ${currentRound - 1} completed!\nScore so far: ${score}.`;
            nextButton.innerText = "Start Next Round";
            nextButton.style.display = "block";
        }
    }
}

function quitQuiz() {
    showFinalResult();
}

function showFinalResult() {
    resetState();
    
    const roundFinished = currentQuestionIndex >= quizQuestions.length ? currentRound - 1 : currentRound;
    const answeredInPreviousRounds = (roundFinished - 1) * QUESTIONS_PER_ROUND;
    const answeredInCurrentRound = currentQuestionIndex; 
    const totalAnswered = answeredInPreviousRounds + answeredInCurrentRound;
    
    const percentage = totalAnswered > 0 ? ((score / totalAnswered) * 100).toFixed(2) : '0.00';
    
    questionElement.innerText = 
        `Quiz Ended!\nYou answered ${totalAnswered} questions.\nYour Score: ${score}\nAccuracy: ${percentage}%\n`;
    
    startButton.style.display = "block";
    startButton.innerText = "Play Again";
    nextButton.style.display = "none";
    quitButton.style.display = "none";
    toggleTimerVisibility(false);
    
    unusedQuestions = [...questions];
    score = 0;
    currentRound = 1;
}

startButton.addEventListener("click", startQuiz);

nextButton.addEventListener("click", () => {
    if(currentQuestionIndex >= quizQuestions.length) {
        nextButton.innerText = "Next"; 
        startRound();
    } else {
        handleNextButton();
    }
});

quitButton.addEventListener("click", quitQuiz);
