// --- CONFIGURATION ---
const API_URL = "https://unfinished-business-api.onrender.com";

// Step 1: Find the elements we need to work with
const inputBox = document.getElementById("project-input");
const addButton = document.getElementById("add-button");
const projectList = document.getElementById("project-list");
const statusMessage = document.getElementById("status-message");
const notifyButton = document.getElementById("enable-notifications");
const finishedHeading = document.getElementById("finished-heading");
const finishedList = document.getElementById("finished-list");
const clearFinishedButton = document.getElementById("clear-finished-button");

// Register the service worker for notifications
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(function(registration) {
            console.log("Service Worker registered:", registration);
        })
        .catch(function(error) {
            console.log("Service Worker registration failed:", error);
        });
}

// Auto-focus the input box when the page loads
inputBox.focus();

// Data will now live on the server, not in localStorage
let data = { unfinished: [], finished: [] };

// --- STEP 2: FETCH DATA FROM THE SERVER ---
function fetchData() {
    fetch(`${API_URL}/projects`)
        .then(response => response.json())
        .then(serverData => {
            data = serverData;
            saveAndRender();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            statusMessage.innerHTML = `<p style="color: #d62828;">Could not connect to the backend. Is it awake?</p>`;
        });
}

// --- STEP 3: RENDER THE UI ---
function saveAndRender() {
    projectList.innerHTML = "";
    statusMessage.innerHTML = "";

    // Render the unfinished projects
    data.unfinished.forEach(function (projectName, index) {
        const listItem = document.createElement("li");

        const textSpan = document.createElement("span");
        textSpan.textContent = projectName;

        const finishButton = document.createElement("button");
        finishButton.textContent = "Finish";
        finishButton.className = "finish-button";
        finishButton.addEventListener("click", function () {
            finishProject(index);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", function () {
            shameAndDelete(index);
        });

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "button-group";
        buttonGroup.appendChild(finishButton);
        buttonGroup.appendChild(deleteButton);

        listItem.appendChild(textSpan);
        listItem.appendChild(buttonGroup);
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

    // Render the Finished Projects trophy case
    finishedList.innerHTML = "";

    if (finishedCount > 0) {
        finishedHeading.style.display = "block";
        finishedList.style.display = "block";
        clearFinishedButton.style.display = "inline-block";
        
        data.finished.forEach(function (projectName) {
            const listItem = document.createElement("li");
            listItem.textContent = projectName;
            finishedList.appendChild(listItem);
        });
    } else {
        finishedHeading.style.display = "none";
        finishedList.style.display = "none";
        clearFinishedButton.style.display = "none";
    }
}

// --- STEP 4: ACTIONS (Add, Finish, Delete) ---

// Add Project
addButton.addEventListener("click", function () {
    const projectName = inputBox.value.trim();
    if (projectName === "") {
        alert("You can't add an empty project. Try again.");
        return;
    }

    const isFirstProject = data.unfinished.length === 0 && data.finished.length === 0;

    // Send to backend
    fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName })
    })
    .then(response => response.json())
    .then(serverData => {
        data = serverData.data;
        inputBox.value = "";
        inputBox.focus();
        saveAndRender();

        if (isFirstProject) {
            alert(
                "Project added!\n\n" +
                "To let the app remind you about your unfinished business, you need to:\n" +
                "1. Click the '🔔 Enable Reminders' button at the top.\n" +
                "2. Click 'Allow' when the browser asks.\n" +
                "3. Keep this tab open in the background."
            );
        }
    });
});

// Finish Project
function finishProject(index) {
    const finishedName = data.unfinished[index];
    
    // Find the specific list item on the screen
    const items = document.querySelectorAll("#project-list li");
    const itemToAnimate = items[index];

    // Add the fade-out class
    if (itemToAnimate) {
        itemToAnimate.classList.add("fade-out");
    }

    // Wait 600ms for the animation to finish, THEN do the logic
    setTimeout(function() {
        alert(`🎉 You finished: '${finishedName}'! 🎉\n\nThe world you see today is made by some dedicated and determined souls like you. Finishing a project is a brick laid perfectly in the castle of your dreams.\n\nWell done. Truly.`);
        
        fetch(`${API_URL}/projects/finish/${index}`, { method: "POST" })
            .then(response => response.json())
            .then(serverData => {
                data = serverData.data;
                saveAndRender();
            });
    }, 600);
}

// Delete Project (Shame Letter)
function shameAndDelete(index) {
    const projectName = data.unfinished[index];
    
    const shameLetter = prompt(
        `You are trying to remove: '${projectName}'.\n\n` +
        `This is shameful to leave a project undone. Therefore, you have to write a shame letter.\n\n` +
        `I am ashamed that even I started this project I am incapable of finishing it.\n` +
        `even though humans can do anything if they really want to...\n\n` +
        `(Type the rest of your letter below. Be honest. It must be at least 500 characters long to count.)`
    );

    if (shameLetter === null) return;

    if (shameLetter.length < 500) {
        alert(`Your letter is only ${shameLetter.length} characters long. That's not a page. Try again.`);
    } else {
        alert("...You have shamed yourself. The project has been removed.");
        fetch(`${API_URL}/projects/delete/${index}`, { method: "POST" })
            .then(response => response.json())
            .then(serverData => {
                data = serverData.data;
                saveAndRender();
            });
    }
}

// Clear Trophy Case
clearFinishedButton.addEventListener("click", function () {
    if (data.finished.length === 0) return;
    const confirmed = confirm("Are you sure you want to clear your trophy case? Your accomplishments will be forgotten.");
    if (confirmed) {
        // Note: We haven't built a backend endpoint for this yet, so for now it will just clear the UI
        // In a future update, we'll add a route to clear finished projects on the server.
        data.finished = [];
        saveAndRender();
    }
});

// Allow the user to press Enter to add a project
inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addButton.click();
    }
});

// Start the app by fetching from the backend
fetchData();

// --- RANDOM REMINDER LOGIC ---
function showReminderNotification() {
    if (Notification.permission !== "granted") return;

    if (data.unfinished.length === 0) {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification("Unfinished Business", {
                body: "Your list is empty. What are you waiting for? Start something!",
            });
        });
    } else {
        const randomIndex = Math.floor(Math.random() * data.unfinished.length);
        const randomProject = data.unfinished[randomIndex];
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification("Unfinished Business Reminder", {
                body: `Don't forget: you started "${randomProject}". Are you making progress?`,
            });
        });
    }
}

function scheduleRandomReminder() {
    const minTime = 1 * 60 * 60 * 1000;
    const maxTime = 8 * 60 * 60 * 1000;
    const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    console.log(`Next reminder scheduled in ${Math.round(randomTime / 60000)} minutes.`);
    setTimeout(function() {
        showReminderNotification();
        scheduleRandomReminder();
    }, randomTime);
}

notifyButton.addEventListener("click", function() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
    } else if (Notification.permission === "granted") {
        alert("Reminders are already enabled!");
        scheduleRandomReminder();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                alert("Reminders enabled! You'll be notified about your projects.");
                scheduleRandomReminder();
            }
        });
    }
});

if (Notification.permission === "granted") {
    scheduleRandomReminder();
}
