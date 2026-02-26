// Digital Clock
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  // Update clock digits in separate spans
  document.getElementById("hh").textContent = h;
  document.getElementById("mm").textContent = m;
  document.getElementById("ss").textContent = s;

  // Update date text
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("date").textContent = now.toLocaleDateString('en-US', options);
}

setInterval(updateClock, 1000);
updateClock();


// Stopwatch
let stopwatchInterval;
let stopwatchTime = 0;

function updateStopwatchDisplay() {
  const hours = String(Math.floor(stopwatchTime / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((stopwatchTime % 3600) / 60)).padStart(2, '0');
  const seconds = String(stopwatchTime % 60).padStart(2, '0');

  document.getElementById("stopwatch").textContent = `${hours}:${minutes}:${seconds}`;
}

function startStopwatch() {
  if (!stopwatchInterval) {
    stopwatchInterval = setInterval(() => {
      stopwatchTime++;
      updateStopwatchDisplay();
    }, 1000);
  }
}

function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}

function resetStopwatch() {
  stopStopwatch();
  stopwatchTime = 0;
  document.getElementById("laps").innerHTML = "";
  updateStopwatchDisplay();
}

function lapStopwatch() {
  const lapTime = document.getElementById("stopwatch").textContent;
  const lapList = document.getElementById("laps");
  const lapItem = document.createElement("li");
  lapItem.textContent = `Lap: ${lapTime}`;
  lapList.appendChild(lapItem);
}


// Timer
let timerInterval;
let timerTime = 0;

function startTimer() {
  clearInterval(timerInterval);  // Clear any existing timer interval first

  const mins = parseInt(document.getElementById("timerMinutes").value) || 0;
  const secs = parseInt(document.getElementById("timerSeconds").value) || 0;

  timerTime = mins * 60 + secs;

  if (timerTime <= 0) return;

  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timerTime--;
    if (timerTime <= 0) {
      clearInterval(timerInterval);

      // Play the timer sound when time is up
      const sound = document.getElementById("timerSound");
      sound.currentTime = 0;  // rewind to start
      sound.play().then(() => {
        // After sound starts playing, show the message (non-blocking)
        showTimerEndedMessage();
      }).catch(error => {
        console.log("Audio play failed:", error);
        // Show message even if sound fails
        showTimerEndedMessage();
      });
    }
    updateTimerDisplay();
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerTime = 0;
  updateTimerDisplay();

  // Hide message on reset
  const messageContainer = document.getElementById("timerMessage");
  if (messageContainer) {
    messageContainer.style.display = "none";
  }
}

function updateTimerDisplay() {
  const mins = String(Math.floor(timerTime / 60)).padStart(2, '0');
  const secs = String(timerTime % 60).padStart(2, '0');
  document.getElementById("timerDisplay").textContent = `${mins}:${secs}`;
}

// Show timer ended message (non-blocking)
function showTimerEndedMessage() {
  const messageContainer = document.getElementById("timerMessage");
  if (messageContainer) {
    messageContainer.textContent = "⏰ Time's up!";
    messageContainer.style.display = "block";

    // Optional: hide after 5 seconds
    setTimeout(() => {
      messageContainer.style.display = "none";
    }, 5000);
  }
}


// Theme Toggle
const toggle = document.getElementById("themeSwitcher");

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Persist theme across reloads
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggle.checked = true;
}
