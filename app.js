const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "/public")));

// Socket.IO connection
io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        console.log(`Received location from ${socket.id}:`, data);
        io.emit("receive-location", { id: socket.id, ...data });
    });
    console.log("Client connected:", socket.id);
    socket.on("disconnect",function(){
        io.emit("user-disconnect",socket.id);
    })
});


// Route to render the index page
app.get("/", (req, res) => {
    console.log("Serving the index page");
    res.render("index");
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
