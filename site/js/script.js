const PAGE_TITLE_BASE = "akassis.dev";
const NAV_SECTIONS = ["home", "about", "projects", "courses", "contact"];
const body = document.querySelector("body");
const contentDiv = document.getElementById("main-content");
const navExpand = document.getElementById("nav-expand");

const darkModeIcon = document.getElementById("dark-mode-icon");
const sun = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
const moon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

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
        darkModeIcon.innerHTML = sun;
    }
    else {
        body.classList.remove("dark");
        window.localStorage.setItem("theme", "light");
        darkModeIcon.innerHTML = moon;
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
        navExpand.checked = false;
    })
}

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text()
}

async function loadFragment(fragmentPath, title) {
    contentDiv.innerHTML = await fetchHtmlAsText(`fragments/${fragmentPath}`);
    if (title) {
        var newTitle = `${title} - ${PAGE_TITLE_BASE}`;
    }
    else {
        var newTitle = PAGE_TITLE_BASE;
        title = "";
    }
    document.title = newTitle;
    history.pushState(null, "", `#${title}`);
}

function setActive(targetSection) {
    for (section of NAV_SECTIONS) {
        document.getElementById(`nav-${section}`).classList.remove("active");
    }
    document.getElementById(`nav-${targetSection}`).classList.add("active");
}

// Get home content on page load
// loadFragment("content/home.html", "home");
loadFragment("content/courses.html");
