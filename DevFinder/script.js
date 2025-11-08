const API_URL = "https://api.github.com/users/";
const DEFAULT_USER = "gautamsonpitale17";

const body = document.body;
const toggleBtn = document.getElementById("toggleTheme");
const searchInput = document.getElementById("searchInput");
const profileCard = document.getElementById("profileCard");
const errorMsg = document.getElementById("errorMessage");

const avatarEl = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const reposEl = document.getElementById("repos");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");
const profileLinkEl = document.getElementById("profileLink");

function updateProfileUI(data) {
  avatarEl.src = data.avatar_url;
  avatarEl.alt = `${data.login}'s Avatar`;
  nameEl.textContent = data.name || data.login;
  usernameEl.textContent = `@${data.login}`;
  bioEl.textContent = data.bio || "This user has no bio.";
  reposEl.textContent = data.public_repos.toLocaleString();
  followersEl.textContent = data.followers.toLocaleString();
  followingEl.textContent = data.following.toLocaleString();
  profileLinkEl.href = data.html_url;

  profileCard.classList.remove("hidden");
  errorMsg.classList.add("hidden");
}

function displayError(message) {
  profileCard.classList.add("hidden");
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

async function fetchProfile(username) {
  try {
    const res = await fetch(API_URL + username);

    if (res.status === 404) {
      displayError("No results: User not found!");
      return;
    }

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    updateProfileUI(data);

  } catch (error) {
    console.error("Fetch error:", error);
    displayError("Something went wrong while fetching the profile.");
  }
}

window.searchUser = function() {
  const username = searchInput.value.trim();
  
  if (username) {
    fetchProfile(username);
  } else {
    displayError("Please enter a username.");
  }
};

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("light");
  const isLight = body.classList.contains("light");
  
  toggleBtn.textContent = isLight ? "☀️" : "🌙"; 
  
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isLight = savedTheme === 'light';

    if (isLight) {
        body.classList.add('light');
    } else {
        body.classList.remove('light');
    }
    
    toggleBtn.textContent = isLight ? "☀️" : "🌙";
}

window.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  fetchProfile(DEFAULT_USER);
});

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); 
        searchUser();
    }
});