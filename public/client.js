const socket = io();
const term = new Terminal({
  cursorBlink: true,
  disableStdin: false,
  convertEol: true,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 14,
});

term.open(document.getElementById("terminal"));
term.focus();

let history = [];
let currentCommand = "";
let awaitingResponse = false;

document
  .getElementById("terminal")
  .addEventListener("click", () => term.focus());
window.addEventListener("load", () => term.focus());

term.onData((data) => {
  console.log("Sending input:", JSON.stringify(data));
  socket.emit("input", data);
  term.write(data);

  if (data === "\r") {
    if (currentCommand.trim()) {
      awaitingResponse = true;
      history.push({ command: currentCommand.trim(), response: "" });
    }
    currentCommand = "";
  } else {
    currentCommand += data;
  }
});

socket.on("output", (data) => {
  console.log("Received output:", JSON.stringify(data));
  term.write(`\n${data}`);

  if (awaitingResponse && history.length > 0) {
    history[history.length - 1].response += data;
    awaitingResponse = false;
    renderHistory(); // 🔁 Update history in real-time
  }
});
socket.on("connect", () => {
  console.log("Connected to server");
  term.write("Connected to terminal\r\n");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  term.write("\r\n[Disconnected from server]\r\n");
});

// History toggle
function showHistory() {
  const historyDiv = document.getElementById("history");
  const terminalDiv = document.getElementById("terminal");

  const isHidden =
    historyDiv.style.display === "none" || historyDiv.style.display === "";
  historyDiv.style.display = isHidden ? "block" : "none";
  terminalDiv.classList.toggle("half", isHidden);

  if (isHidden) {
    renderHistory();
  }
}
// Help popup
function showHelp() {
  alert(`Usage:
- Type a command and press Enter
- Click History to view past commands and responses
- Docs opens the documentation link
- Toggle Theme switches between light and dark modes
`);
}
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
  }
}

// Apply saved theme on load
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.add(savedTheme + "-theme");
});
function renderHistory() {
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML =
    "<h3>Command History</h3>" +
    history
      .map(
        (entry) =>
          `<div class="history-entry"><code>&gt; ${entry.command}</code><pre>${entry.response}</pre></div>`
      )
      .join("");
}
