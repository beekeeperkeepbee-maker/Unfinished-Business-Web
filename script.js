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

    // Render the unfinished projects with "Finish" and "Delete" buttons on each
    data.unfinished.forEach(function (projectName, index) {
        const listItem = document.createElement("li");

        // 1. Create the text span for the project name
        const textSpan = document.createElement("span");
        textSpan.textContent = projectName;

        // 2. Create the Finish button
        const finishButton = document.createElement("button");
        finishButton.textContent = "Finish";
        finishButton.className = "finish-button";
        finishButton.addEventListener("click", function () {
            finishProject(index);
        });

        // 3. Create the Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", function () {
            shameAndDelete(index);
        });

        // 4. Group the buttons together
        const buttonGroup = document.createElement("div");
        buttonGroup.className = "button-group";
        buttonGroup.appendChild(finishButton);
        buttonGroup.appendChild(deleteButton);

        // 5. Assemble the final list item
        listItem.appendChild(textSpan);
        listItem.appendChild(buttonGroup);
        
        // 6. Add it to the page
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

// The function that runs when a project is finished
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

// Step 4: The function that runs when a project is finished
function shameAndDelete(index) {
    const projectName = data.unfinished[index];
    
    // The prompt() function asks the user for input
    const shameLetter = prompt(
        `You are trying to remove: '${projectName}'.\n\n` +
        `This is shameful to leave a project undone. Therefore, you have to write a shame letter.\n\n` +
        `I am ashamed that even I started this project I am incapable of finishing it.\n` +
        `even though humans can do anything if they really want to...\n\n` +
        `(Type the rest of your letter below. Be honest. It must be at least 500 characters long to count.)`
    );

    // If the user clicked "Cancel", shameLetter will be null. Stop here.
    if (shameLetter === null) {
        return;
    }

    // Check the length
    if (shameLetter.length < 500) {
        alert(`Your letter is only ${shameLetter.length} characters long. That's not a page. Try again.`);
    } else {
        alert("...You have shamed yourself. The project has been removed.");
        data.unfinished.splice(index, 1);
        saveAndRender();
    }
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
