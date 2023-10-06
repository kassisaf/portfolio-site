const PAGE_TITLE_BASE = "akassis.dev";
const NAV_SECTIONS = ["about", "projects", "courses", "contact"];
const DEFAULT_SECTION = "about";
const body = document.querySelector("body");
const overlay = document.getElementById("overlay");
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
    // Fetch fragment and render in main div
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
    // Set focus to section header
    const sectionHeader = document.getElementById("section-header");
    sectionHeader.focus();
    sectionHeader.tabIndex = 0;
    // Run section-specific setup
    switch (title) {
        case "courses":
            createModalListeners();
            break;
        case "projects":
            createProjectLinkListeners();
            break;
        default:
    }
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
        anchor = DEFAULT_SECTION;
    }
    loadFragment(`content/${anchor}.html`, anchor);
}

/* Modal logic */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalHeading = document.querySelector(`#${modalId} h3`);
    modal.classList.add("active");
    overlay.classList.add("active");
    // Accessibility
    body.ariaHidden = "true";
    modal.ariaHidden = "false";
    modalHeading.focus();
    modalHeading.tabIndex = 0;
}
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalBtn = document.getElementById(`modal-btn-${modalId}`);
    modal.classList.remove("active");
    overlay.classList.remove("active");
    // Accessibility
    body.ariaHidden = "false";
    modal.ariaHidden = "true";
    modalBtn.focus();
    modalBtn.tabIndex = 0;
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

/* Project loading mechanism */
function createProjectLinkListeners() {
    Array.from(document.querySelectorAll(".project-card button.link")).forEach(projectButton => {
        projectButton.addEventListener("click", function(event) {
            projectID = event.currentTarget.attributes["project-id"];
            if (projectID != undefined) {
                // console.log(projectID.value);
                currentProjectListItem = event.target.parentNode.parentNode;
                projectList = currentProjectListItem.parentNode;
                currentColumnCount = getGridElementColumnCount(projectList);

                // Destroy any existing project details
                for (projectDetails of document.getElementsByClassName("project-details")) {
                    projectDetails.remove();
                }

                // Construct a project details element and insert it after the current project card
                projectDetails = document.createElement("li");
                projectDetails.classList.add("project-details");
                projectDetails.style.gridColumn = `span ${currentColumnCount}`;
                projectDetails.innerHTML = `<h3>Project ${projectID.value} details Here</h3>`; // TODO replace with actual project data
                currentProjectListItem.insertAdjacentElement("afterend", projectDetails);

                // TODO loop through project cards and fade all except the selected one (disable? add class?)
                // TODO set focus and tabIndex if needed for accessibility
            }
        });
    });
    /* On browser resize, update project details span if present*/
    window.addEventListener("resize", function() {
        // TODO not performant, find a better way... observer on grid-template-columns?
        projectDetails = document.querySelector(".project-details");
        if (projectDetails != undefined) {
            projectDetails.style.gridColumn = `span 1`; // Shrink first for accurate column count
            currentColumnCount = getGridElementColumnCount(projectDetails.parentNode);
            projectDetails.style.gridColumn = `span ${currentColumnCount}`;
        }
    });
}
function getGridElementColumnCount(gridElement) {
    return window.getComputedStyle(gridElement).getPropertyValue("grid-template-columns").split(" ").length;
}

/* Execute once on page load */
loadFragmentFromAnchor();
