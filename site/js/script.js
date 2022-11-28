const NAV_SECTIONS = ["home", "about", "projects", "courses", "contact"];
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
// Use name of clicked button to fetch matching fragment
for (section of NAV_SECTIONS) {
    const navLink = document.getElementById(`nav-${section}`);
    navLink.addEventListener("click", function(event) {
        loadFragment(`content/${event.target.closest("a").name}.html`);
        setActive(this.name);
    })
}

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text()
}

async function loadFragment(fragmentName) {
    const contentDiv = document.getElementById("main-content");
    contentDiv.innerHTML = await fetchHtmlAsText(`fragments/${fragmentName}`);
}

function setActive(targetSection) {
    for (section of NAV_SECTIONS) {
        document.getElementById(`nav-${section}`).classList.remove("active");
        console.log(`making ${section} inactive`);
    }
    document.getElementById(`nav-${targetSection}`).classList.add("active");
    console.log(`making ${targetSection} active`);
}

// Get home content on page load
// loadFragment("content/home.html");
loadFragment("content/about.html");
