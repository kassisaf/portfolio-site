/* Shared elements */
const body = document.querySelector("body");

/* Get dark mode preference */
const preferredTheme = window.localStorage.getItem("theme");
if (preferredTheme) {
    setDarkMode(preferredTheme == "dark");
}
else {
    setDarkMode(true);
}

/* Event listeners */
document.getElementById("dark-mode-btn").addEventListener("click", toggleDarkMode);

/* Helper functions */

function setDarkMode(enable) {
    if (enable) {
        body.classList.add("dark");
        window.localStorage.setItem("theme", "dark");
    }
    else {
        body.classList.remove("dark");
        window.localStorage.setItem("theme", "light");
    }
}

function toggleDarkMode() {
    body.style.transition = "150ms";
    setDarkMode(!body.classList.contains("dark"));
}