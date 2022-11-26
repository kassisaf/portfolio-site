const body = document.querySelector("body");

const preferredTheme = window.localStorage.getItem("theme");
if (preferredTheme) {
    setDarkMode(preferredTheme == "dark");
}
else {
    setDarkMode(true);
}

function setDarkMode(enable) {
    if (enable) {
        body.classList.add("dark");
        body.classList.remove("light");
        window.localStorage.setItem("theme", "dark");
    }
    else {
        body.classList.add("light");
        body.classList.remove("dark");
        window.localStorage.setItem("theme", "light");
    }
}

function toggleDarkMode() {
    setDarkMode(body.classList.contains("light"));
}

document.getElementById("dark-mode-btn").addEventListener("click", toggleDarkMode);
