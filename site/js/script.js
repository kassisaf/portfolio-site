/* Shared elements */
const body = document.querySelector("body");


/* Dark mode */
// Get dark mode preference
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

document.getElementById("dark-mode-btn").addEventListener("click", toggleDarkMode);


/* Load content in-place */
const NAV_SECTIONS = ["home", "about", "projects", "courses", "contact"];
// Use name of clicked button to fetch matching fragment
for (id of NAV_SECTIONS) {
    const btn = document.getElementById(`nav-${id}`);
    console.log(btn);
    btn.addEventListener("click", function(event) {
        if (event.target.name) {
            loadFragment(`content/${event.target.name}.html`);
        }
        else {
            loadFragment(`content/${event.target.parentElement.name}.html`);
        }
    })
}

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text()
}

async function loadFragment(fragmentName) {
    const contentDiv = document.getElementById("main-content");
    contentDiv.innerHTML = await fetchHtmlAsText(`fragments/${fragmentName}`);
}

// Get home content on page load
loadFragment("content/home.html");