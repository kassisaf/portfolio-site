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
// Event listener for nav links uses name of clicked element to fetch matching fragment
for (section of NAV_SECTIONS) {
    const navLink = document.getElementById(`nav-${section}`);
    navLink.addEventListener("click", function(event) {
        let sectionName = event.target.closest("a").name;
        loadFragment(`content/${sectionName}.html`, sectionName);
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
    setActive(title);                          // Set nav button style
    document.title = newTitle;                 // Set page title
    history.pushState(null, "", `#${title}`);  // Add to browser history

    createModalListeners();
}

function setActive(targetSection) {
    for (section of NAV_SECTIONS) {
        document.getElementById(`nav-${section}`).classList.remove("active");
    }
    document.getElementById(`nav-${targetSection}`).classList.add("active");
}

// Loads the fragment specified by anchor tag, else loads homepage fragment
function loadFragmentFromAnchor() {
    let anchor = window.location.hash.replace("#", "");
    if (!NAV_SECTIONS.includes(anchor)) {
        anchor = "home";
    }
    loadFragment(`content/${anchor}.html`, anchor);
}

/* Modal logic */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add("active");
    body.ariaHidden = "true";
    modal.ariaHidden = "false";
}
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("active");
    body.ariaHidden = "false";
    modal.ariaHidden = "true";
}
function hideAllModals() {
    Array.from(document.querySelectorAll(".modal.active")).forEach(modal => {
        hideModal(modal.id);
    });
}
function createModalListeners() {
    // Add event listeners to modal buttons
    Array.from(document.getElementsByClassName("modal")).forEach(modal => {
        modal.ariaHidden = "true";  // Hide from screen readers until shown
        const modalBtn = document.getElementById(`modal-btn-${modal.id}`);
        const modalClose = document.getElementById(`modal-close-${modal.id}`);
        if (modalBtn) {
            modalBtn.addEventListener("click", function() {
                hideAllModals();
                showModal(modal.id);
            });
        }
        if (modalClose) {
            modalClose.addEventListener("click", function() {
                hideModal(modal.id);
            });
        }
    });
    // Close modal when clicking outside
    body.addEventListener("click", function(event) {
        const activeModal = document.querySelector(".modal.active");
        if (activeModal                                           // If a modal is active
            && event.target.closest(".modal") != activeModal      // And the click was not on the active modal
            && event.target.id != `modal-btn-${activeModal.id}`)  // And the click was not on the active modal's button
        {
                hideModal(activeModal.id);
        };
    });
}

/* Execute once on page load */
loadFragmentFromAnchor();