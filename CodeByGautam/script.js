lucide.createIcons();

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    const isVisible = mobileMenu.style.display === 'block';
    mobileMenu.style.display = isVisible ? 'none' : 'block';
    
    lucide.createIcons();
});

const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.style.display = 'none';
    });
});

const thirtyDaysCard = document.getElementById('thirty-days-card');
const mainProjectsView = document.getElementById('main-projects-view');
const thirtyDaysDetailView = document.getElementById('thirty-days-detail-view');
const backButton = document.getElementById('back-to-featured');
const projectListGrid = document.getElementById('project-list-grid');

const thirtyProjectsData = [
    {
        id: 30,
        title: "Day 30: CodeByGautam",
        description: "Personal portfolio showcasing web projects and achievements.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/CodeByGautam/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/CodeByGautam"
    },
    {
        id: 29,
        title: "Day 29: FlashLearn",
        description: "Learning platform using flashcards to view, flip, navigate, and add custom cards for efficient memorization.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/FlashLearn/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/FlashLearn"
    },
    {
        id: 28,
        title: "Day 28: QuickBrief",
        description: "Summarizes text to a chosen length with copy and download options.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/QuickBrief/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/QuickBrief"
    },
    {
        id: 27,
        title: "Day 27: CipherVault",
        description: "Stores and manages encrypted notes with password protection and auto-locking.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/CipherVault/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/CipherVault"
    },
    {
        id: 26,
        title: "Day 26: CodeFormater",
        description: "Automatically formats JavaScript, HTML, CSS, and JSON code with copy functionality.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/CodeFormater/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/CodeFormater"
    },
    {
        id: 25,
        title: "Day 25: InvisiClean",
        description: "Detects and removes hidden or invisible Unicode characters from text with live cleaning and stats.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/InvisiClean/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/InvisiClean"
    },
    {
        id: 24,
        title: "Day 24: SnakeGame",
        description: "Classic snake game with food collection, increasing speed, multiple difficulty levels, and high score tracking.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/SnakeGame/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/SnakeGame"
    },
    {
        id: 23,
        title: "Day 23: SpeedLane",
        description: "Car lane game with obstacles, power-ups, multiple difficulty levels, and high score tracking.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/SpeedLane/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/SpeedLane"
    },
    {
        id: 22,
        title: "Day 22: WordFall",
        description: "Typing game where falling words must be typed correctly with multiple difficulty levels.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/WordFall/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/WordFall"
    },
    {
        id: 21,
        title: "Day 21: StockWatch",
        description: "Tracks stock prices in real-time, visualizes trends, and manages a watchlist.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/StockWatch/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/StockWatch"
    },
    {
        id: 20,
        title: "Day 20: NewsNow",
        description: "Aggregates live news from multiple sources with search and article viewing.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/NewsNow/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/NewsNow"
    },
    {
        id: 19,
        title: "Day 19: SwapDocs",
        description: "Converts text and image files to PDF, PNG, or JPEG with instant download.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/SwapDocs/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/SwapDocs"
    },
    {
        id: 18,
        title: "Day 18: DevFinder",
        description: "Searches GitHub users and displays their profile info, repositories, and followers.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/DevFinder/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/DevFinder"
    },
    {
        id: 17,
        title: "Day 17: CryptoDash",
        description: "Tracks real-time cryptocurrency prices with search and sorting options.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/CryptoDash/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/CryptoDash"
    },
    {
        id: 16,
        title: "Day 16: SkillPath",
        description: "Suggests careers based on user strengths and interests with a compatibility score.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/SkillPath/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/SkillPath"
    },
    {
        id: 15,
        title: "Day 15: QRaft",
        description: "Generates QR codes from text or URLs with download option.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/QRaft/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/QRaft"
    },
    {
        id: 14,
        title: "Day 14: AgePulse",
        description: "Calculates exact age in years, months, and days.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/AgePulse/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/AgePulse"
    },
    {
        id: 13,
        title: "Day 13: EchoText",
        description: "Converts typed text to speech with selectable voice options.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/EchoText/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/EchoText"
    },
    {
        id: 12,
        title: "Day 12: TempShift",
        description: "Converts temperatures between Celsius, Fahrenheit, and Kelvin with unit swap and clipboard copy.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/TempShift/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/TempShift"
    },
    {
        id: 11,
        title: "Day 11: EmiCalc",
        description: "Calculates monthly EMI, total payment, and total interest with adjustable loan details.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/EmiCalc/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/EmiCalc"
    },
    {
        id: 10,
        title: "Day 10: FitRatio",
        description: "Calculates BMI and BMR, provides ideal weight guidance, and visualizes BMI with a chart.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/FitRatio/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/FitRatio"
    },
    {
        id: 9,
        title: "Day 9: ExpenseX",
        description: "Track, categorize, and analyze expenses with add, edit, delete, and chart features.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/ExpenseX/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/ExpenseX"
    },
    {
        id: 8,
        title: "Day 8: CurrencyFlow",
        description: "Converts currencies in real-time and shows 30-day exchange rate trends.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/CurrencyFlow/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/CurrencyFlow"
    },
    {
        id: 7,
        title: "Day 7: Weatherly",
        description: "Shows real-time weather and air quality for any city or current location.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/Weatherly/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/Weatherly"
    },
    {
        id: 6,
        title: "Day 6: RapidKeys",
        description: "Measures typing speed and accuracy with adjustable difficulty and test duration.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/RapidKeys/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/RapidKeys"
    },
    {
        id: 5,
        title: "Day 5: RandomKey",
        description: "Generates customizable passwords, saves history, and allows copying or downloading passwords.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/RandomKey/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/RandomKey"
    },
    {
        id: 4,
        title: "Day 4: DigiClock",
        description: "Displays real-time clock, date and dynamic greeting",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/DigiClock/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/DigiClock"
    },
    {
        id: 3,
        title: "Day 3: ThinkFast",
        description: "Timed quiz with randomized questions, score tracking, and answer feedback.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/ThinkFast/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/ThinkFast"
    },
    {
        id: 2,
        title: "Day 2: QuickToDo",
        description: "Add, complete, and delete tasks with keyboard support and localStorage persistence ",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/QuickToDo/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/QuickToDo"
    },
    {
        id: 1,
        title: "Day 1: QuickCalc",
        description: "Performs basic arithmetic with keyboard support and clear/delete functions.",
        demoLink: "https://gautamsonpitale17.github.io/BuildIn30Days/QuickCalc/",
        githubLink: "https://github.com/gautamsonpitale17/BuildIn30Days/tree/main/QuickCalc"
    },
];

function renderThirtyProjects() {
    projectListGrid.innerHTML = ''; 
    thirtyProjectsData.forEach(project => {
        const cardHtml = `
            <div class="project-detail-card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-links" style="margin-top: 1rem;">
                    <a href="${project.demoLink}" target="_blank">
                        <i data-lucide="eye" class="w-5 h-5"></i> Demo
                    </a>
                    <a href="${project.githubLink}" target="_blank">
                        <i data-lucide="github" class="w-5 h-5"></i> Code
                    </a>
                </div>
            </div>
        `;
        projectListGrid.innerHTML += cardHtml;
    });
    lucide.createIcons();
}

function switchToDetailView() {
    mainProjectsView.style.opacity = 0;
    setTimeout(() => {
        mainProjectsView.style.display = 'none';
        thirtyDaysDetailView.style.display = 'block';
        renderThirtyProjects();
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            thirtyDaysDetailView.style.opacity = 1;
        }, 10);
    }, 500);
}

function switchToMainView() {
    thirtyDaysDetailView.style.opacity = 0;
    setTimeout(() => {
        thirtyDaysDetailView.style.display = 'none';
        mainProjectsView.style.display = 'block';
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            mainProjectsView.style.opacity = 1;
        }, 10);
    }, 500);
}

mainProjectsView.style.opacity = 1;
thirtyDaysDetailView.style.opacity = 0;


thirtyDaysCard.addEventListener('click', switchToDetailView);
backButton.addEventListener('click', switchToMainView);