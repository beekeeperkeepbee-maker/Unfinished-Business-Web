// Step 1: Find the elements we need to work with
const inputBox = document.getElementById("project-input");
const addButton = document.getElementById("add-button");
const projectList = document.getElementById("project-list");
const statusMessage = document.getElementById("status-message");
const notifyButton = document.getElementById("enable-notifications");
const finishedHeading = document.getElementById("finished-heading");
const finishedList = document.getElementById("finished-list");

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

// Step 2: Load saved data from the browser
let data = JSON.parse(localStorage.getItem("unfinishedBusinessData")) || {
    unfinished: [],
    finished: []
};

// Step 2.5: Handle Notification Permissions
notifyButton.addEventListener("click", function() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
    } else if (Notification.permission === "granted") {
        alert("Reminders are already enabled!");
        scheduleRandomReminder(); // <-- Add this line
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                alert("Reminders enabled! You'll be notified about your projects.");
                                scheduleRandomReminder(); // Start the random cycle immediately
                new Notification("Unfinished Business", {
                    body: "Notifications are working. Don't make me use the shame letter.",
                });
            }
        });
    }
});

// Step 3: A helper to save and re-render everything
function saveAndRender() {
    localStorage.setItem("unfinishedBusinessData", JSON.stringify(data));

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

        data.finished.forEach(function (projectName) {
            const listItem = document.createElement("li");
            listItem.textContent = projectName;
            finishedList.appendChild(listItem);
        });
    } else {
        finishedHeading.style.display = "none";
        finishedList.style.display = "none";
    }
}

// The function that runs when a project is finished
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
        
        data.finished.push(finishedName);
        data.unfinished.splice(index, 1);
        saveAndRender();
    }, 600); // 600ms matches the new CSS animation time
}

// The function that runs when a project is deleted
function shameAndDelete(index) {
    const projectName = data.unfinished[index];
    
    const shameLetter = prompt(
        `You are trying to remove: '${projectName}'.\n\n` +
        `This is shameful to leave a project undone. Therefore, you have to write a shame letter.\n\n` +
        `I am ashamed that even I started this project I am incapable of finishing it.\n` +
        `even though humans can do anything if they really want to...\n\n` +
        `(Type the rest of your letter below. Be honest. It must be at least 500 characters long to count.)`
    );

    if (shameLetter === null) {
        return;
    }

    if (shameLetter.length < 500) {
        alert(`Your letter is only ${shameLetter.length} characters long. That's not a page. Try again.`);
    } else {
        alert("...You have shamed yourself. The project has been removed.");
        data.unfinished.splice(index, 1);
        saveAndRender();
    }
}

// Listen for a click on the "Add Project" button
addButton.addEventListener("click", function () {
    const projectName = inputBox.value.trim();

    if (projectName === "") {
        alert("You can't add an empty project. Try again.");
        return;
    }

    const isFirstProject = data.unfinished.length === 0 && data.finished.length === 0;

    data.unfinished.push(projectName);
    inputBox.value = "";
    inputBox.focus();

    if (isFirstProject) {
        alert(
            "Project added!\n\n" +
            "To let the app remind you about your unfinished business, you need to:\n" +
            "1. Click the '🔔 Enable Reminders' button at the top.\n" +
            "2. Click 'Allow' when the browser asks.\n" +
            "3. Keep this tab open in the background."
        );
    }
    
    saveAndRender();
});

// Allow the user to press Enter to add a project
inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addButton.click();
    }
});

// Draw the list when the page loads
saveAndRender();

// --- RANDOM REMINDER LOGIC ---

function showReminderNotification() {
    if (Notification.permission !== "granted") return;

    // Pick a random unfinished project to remind the user about
    if (data.unfinished.length === 0) {
        // If they have no unfinished projects, remind them to start one!
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification("Unfinished Business", {
                body: "Your list is empty. What are you waiting for? Start something!",
            });
        });
    } else {
        // Pick a random project from the list
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
    // Pick a random time between 1 and 3 hours (in milliseconds)
    // 1 hour = 3,600,000 ms. 3 hours = 10,800,000 ms.
    const minTime = 10 * 1000;
    const maxTime = 30 * 1000;
    const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

    console.log(`Next reminder scheduled in ${Math.round(randomTime / 60000)} minutes.`);

    setTimeout(function() {
        showReminderNotification();
        // After showing, schedule the next one
        scheduleRandomReminder();
    }, randomTime);
}

// Start the reminder cycle when the page loads (only if permission is granted)
console.log("Page loaded. Notification permission:", Notification.permission);
if (Notification.permission === "granted") {
    scheduleRandomReminder();
}
