const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const favicon = require("serve-favicon");
const apiRouter = require("./routes/api/api-routes");
const webRouter = require("./routes/web/web-routes");
const config = require("./config/config");
const https = require("https");
const fs = require("fs");
const cors = require("cors");

const app = express();
dotenv.config();
app.use(express.static("public"));
app.use(express.static("files"));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/api", apiRouter);
app.use("/", webRouter);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(favicon("public/images/favicon.ico"));
// app.use(cors({ origin: "*" }));

const httpsOptions = {
  key: fs.readFileSync("../ssl/localhost.key"),
  cert: fs.readFileSync("../ssl/localhost.crt"),
};
const server = https.createServer(httpsOptions, app);
// const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

mongoose.connect(config.dbUri, { useNewUrlParser: true });
const db = mongoose.connection;
if (!db) {
  console.log("Error connecting db");
} else {
  console.log("Db connected successfully");
}

//--------------------------------------
//Socket.io

const chatController = require("./controllers/chatController");
const userController = require("./controllers/userController");
const Users = require("./models/users");

io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);

  socket.on("connection", (data) => {
    chatController.addSocketId({
      userId: data.userId,
      socketId: socket.id,
    });
    setTimeout(()=>{
      Users.findById(data.userId, function (err, users) {
        socket.broadcast.emit("user-login", {
          // sending to all clients except sender
          _id: users._id,
          name: users.name,
          avatar: users.avatar,
          status: users.status,
          newestMessage: users.newestMessage,
          sendtime: users.sendtime,
          message: "User login",
        });
      });
    },400)
  });

  //disconnect
  socket.on("disconnect", function (data) {
    console.log("Socket disconnected: " + socket.id);
    chatController.disconnected(socket.id);
    /**
     * sending the disconnected user to all socket users.
     */
    socket.broadcast.emit("chat-left-response", {
      error: false,
      userDisconnected: true,
      userid: data.userId,
    });
  });

  /**
   * Logout the user
   */
  socket.on("logout", (data) => {
    console.log(data.userId + " logout");
    const userId = data.userId;
    try {
      chatController.logout(userId);
      io.to(socket.id).emit("logout-response", {
        //sending to individual socketid (private message)
        error: false,
        message: "User logged out",
        userId: userId,
      });
      setTimeout(()=>{
        Users.findById(userId, function (err, users) {
          socket.broadcast.emit("user-logout", {
            // sending to all clients except sender
            _id: users._id,
            name: users.name,
            avatar: users.avatar,
            status: users.status,
            newestMessage: users.newestMessage,
            sendtime: users.sendtime,
            message: "User logout",
          });
        });
      },400);
    } catch (error) {
      io.to(socket.id).emit("logout-response", {
        error: true,
        message: "Server error messages",
        userId: userId,
      });
    }
  });

  /**
   * send the messages to the user
   */
  socket.on("add-message", async (data) => {
    if (data.message === "") {
      io.to(socket.id).emit("add-message-response", {
        //sending to individual socketid (private message)
        error: true,
        message: "Message not found",
      });
    } else if (data.senderId === "") {
      io.to(socket.id).emit("add-message-response", {
        error: true,
        message: "Error message, no sender",
      });
    } else if (data.receiverId === "") {
      io.to(socket.id).emit("add-message-response", {
        error: true,
        message: "Select a user to chat",
      });
    } else {
      try {
        const [receiverSocketId, messageResult] = await Promise.all([
          chatController.getUserInfo({
            userId: data.receiverId,
            socketId: true,
          }),
          chatController.insertMessages(data),
        ]);
        userController.insertNewestMessages(data);
        io.to(receiverSocketId).emit("add-message-response", data);
      } catch (error) {
        io.to(socket.id).emit("add-message-response", {
          error: true,
          message: "Could not store message, server error",
        });
      }
    }
  });
});

//---------------------------
server.listen(port, () => {
  console.log(
    `Server listening on: https://localhost:${server.address().port}`
  );
});
