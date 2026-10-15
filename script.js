// Step 1: Find the elements we need to work with
const inputBox = document.getElementById("project-input");
const addButton = document.getElementById("add-button");
const projectList = document.getElementById("project-list");
const statusMessage = document.getElementById("status-message");

// Auto-focus the input box when the page loads
inputBox.focus();

// Step 2: Load saved data from the browser
// We now store TWO lists: unfinished and finished
let data = JSON.parse(localStorage.getItem("unfinishedBusinessData")) || {
    unfinished: [],
    finished: []
};

// Step 3: A helper to save and re-render everything
function saveAndRender() {
    localStorage.setItem("unfinishedBusinessData", JSON.stringify(data));

    // Clear the list and the status message
    projectList.innerHTML = "";
    statusMessage.innerHTML = "";

    // Render the unfinished projects with a "Finish" button on each
    data.unfinished.forEach(function (projectName, index) {
        const listItem = document.createElement("li");
        listItem.textContent = projectName;

        const finishButton = document.createElement("button");
        finishButton.textContent = "Finish";
        finishButton.className = "finish-button";
        finishButton.addEventListener("click", function () {
            finishProject(index);
        });

        listItem.appendChild(finishButton);
        projectList.appendChild(listItem);
    });

    // Render the proud/encouraging message
    const finishedCount = data.finished.length;
    if (finishedCount === 0) {
        statusMessage.innerHTML = `
            <p>I see you couldn't manage to finish any projects yet.</p>
            <p>Roll up your sleeves, get things done. I'm ready to celebrate your success with you.</p>
        `;
    } else {
        statusMessage.innerHTML = `
            <p>I proudly announce that you have finished <strong>${finishedCount}</strong> successful project(s) with us. So proud of you.</p>
        `;
    }
}

// Step 4: The function that runs when a project is finished
function finishProject(index) {
    const finishedName = data.unfinished[index];

    // Show a celebration
    alert(`🎉 You finished: '${finishedName}'! 🎉\n\nThe world you see today is made by some dedicated and determined souls like you. Finishing a project is a brick laid perfectly in the castle of your dreams.\n\nWell done. Truly.`);

    // Move it from unfinished to finished
    data.finished.push(finishedName);
    data.unfinished.splice(index, 1);

    // Save and redraw
    saveAndRender();
}

// Step 5: Listen for a click on the "Add Project" button
addButton.addEventListener("click", function () {
    const projectName = inputBox.value.trim();

    if (projectName === "") {
        alert("You can't add an empty project. Try again.");
        return;
    }

    data.unfinished.push(projectName);
    inputBox.value = "";
    inputBox.focus();
    saveAndRender();
});

// Step 6: Allow the user to press Enter to add a project
inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addButton.click();
    }
});

// Step 7: Draw the list when the page loads
saveAndRender();
