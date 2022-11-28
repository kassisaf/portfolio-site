const PAGE_TITLE_BASE = "akassis.dev";
const NAV_SECTIONS = ["home", "about", "projects", "courses", "contact"];
const body = document.querySelector("body");
const contentDiv = document.getElementById("main-content");

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


/* SPA fetch mechanism */
// Use name of clicked nav button to fetch matching fragment
for (section of NAV_SECTIONS) {
    const navLink = document.getElementById(`nav-${section}`);
    navLink.addEventListener("click", function(event) {
        let sectionName = event.target.closest("a").name;
        loadFragment(`content/${sectionName}.html`, sectionName);
        setActive(this.name);
    })
}

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text()
}

async function loadFragment(fragmentPath, newTitle) {
    contentDiv.innerHTML = await fetchHtmlAsText(`fragments/${fragmentPath}`);
    document.title = `${PAGE_TITLE_BASE} - ${newTitle}`;
    history.pushState(null, "", `#${newTitle}`);
}

function setActive(targetSection) {
    for (section of NAV_SECTIONS) {
        document.getElementById(`nav-${section}`).classList.remove("active");
    }
    document.getElementById(`nav-${targetSection}`).classList.add("active");
}

// Get home content on page load
loadFragment("content/home.html", "home");
// loadFragment("content/projects.html", "projects");
