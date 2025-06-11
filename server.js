const express = require("express");
const http = require("http");
const { spawn } = require("child_process");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve our static frontend
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Spawn the CLI (adjust path if needed)
  const cli = spawn(path.join(__dirname, "calculator-cli.exe"), [], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  // Forward CLI stdout/stderr to browser
  cli.stdout.on("data", (data) => {
    let output = data.toString();
    console.log("CLI stdout:", JSON.stringify(output));

    // Ensure proper line endings for terminal display
    output = output.replace(/\r\n/g, "\r\n").replace(/\n/g, "\r\n");

    socket.emit("output", output);
  });

  cli.stderr.on("data", (data) => {
    let output = data.toString();
    console.log("CLI stderr:", JSON.stringify(output));

    // Ensure proper line endings for terminal display
    output = output.replace(/\r\n/g, "\r\n").replace(/\n/g, "\r\n");

    socket.emit("output", output);
  });

  cli.on("close", (code) => {
    const message = `\r\n[process exited with code ${code}]\r\n`;
    console.log("CLI closed:", code);
    socket.emit("output", message);
  });
  // Send user keystrokes into CLI stdin
  socket.on("input", (data) => {
    console.log("Received input:", JSON.stringify(data));

    // Convert Enter key to proper Windows line ending for the CLI
    if (data === "\r") {
      data = "\r\n";
    }

    // Send to CLI (no echo needed as CLI will output its response)
    cli.stdin.write(data);
  });

  // Clean up if the browser disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    cli.kill();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
