// Step 1: Find the elements we need to work with
const inputBox = document.getElementById("project-input");
const addButton = document.getElementById("add-button");
const projectList = document.getElementById("project-list");

// Auto-focus the input box when the page loads
inputBox.focus();

// Step 2: Load any saved projects from the browser's storage
let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Step 3: A helper function to save projects to storage and re-render the list
function saveAndRender() {
    // Save to browser storage
    localStorage.setItem("projects", JSON.stringify(projects));

    // Clear the current list on the page
    projectList.innerHTML = "";

    // Rebuild the list from our projects array
    projects.forEach(function (projectName) {
        const newItem = document.createElement("li");
        newItem.textContent = projectName;
        projectList.appendChild(newItem);
    });
}

// Step 4: Listen for a click on the "Add Project" button
addButton.addEventListener("click", function () {
    const projectName = inputBox.value.trim();

    if (projectName === "") {
        alert("You can't add an empty project. Try again.");
        return;
    }

    // Add the new project to our array
    projects.push(projectName);

    // Clear the input box
    inputBox.value = "";
    inputBox.focus();

    // Save and re-draw the list
    saveAndRender();
});

// Step 5: Allow the user to press Enter to add a project
inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addButton.click();
    }
});

// Step 6: When the page loads, draw the list from storage
saveAndRender();
