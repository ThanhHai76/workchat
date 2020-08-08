const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const favicon = require("serve-favicon");
const apiRouter = require("./routes/api/api-routes");
const webRouter = require("./routes/web/web-routes");
const config = require("./config/config");

const app = express();
dotenv.config();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRouter);
app.use("/", webRouter);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(favicon("public/images/favicon.ico"));

const server = require("http").Server(app);
const port = process.env.PORT || 3000;

//Connect to MongoDB -----------------------------
mongoose.connect(config.dbHost, { useNewUrlParser: true });
const db = mongoose.connection;
if (!db) {
  console.log("Error connecting db");
} else {
  console.log("Db connected successfully");
}

//--------------------------------------
//Socket.io
const io = require("socket.io")(server);

const Chat = require("./models/messages");
const chatController = require("./controllers/chatController");
const CONSTANTS = require("./config/constants");

io.use((socket, next) => {
  try {
    chatController.addSocketId({
      userId: socket.request._query["userId"],
      socketId: socket.id,
    });
    next();
  } catch (error) {
    // Error
    console.error(error);
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);

  //disconnect
  socket.on("disconnect", function () {
    console.log("Socket disconnected: " + socket.id);
    chatController.disconnected(socket.id);
    /**
     * sending the disconnected user to all socket users.
     */
    socket.broadcast.emit("chat-list-response", {
      error: false,
      userDisconnected: true,
      userid: socket.request._query["userId"],
    });
  });

  /**
   * Logout the user
   */
  socket.on("logout", (data) => {
    console.log(data.userId + " logout");
    try {
      const userId = data.userId;
      chatController.logout(userId);
      io.to(socket.id).emit("logout-response", {
        //sending to individual socketid (private message)
        error: false,
        message: CONSTANTS.USER_LOGGED_OUT,
        userId: userId,
      });

      socket.broadcast.emit("chat-list-response", {
        // sending to all clients except sender
        error: false,
        userDisconnected: true,
        userid: userId,
      });
    } catch (error) {
      io.to(socket.id).emit("logout-response", {
        error: true,
        message: CONSTANTS.SERVER_ERROR_MESSAGE,
        userId: userId,
      });
    }
  });

  //   /* Get the user's Chat list	*/
  socket.on("chat-list", async (data) => {
    // console.log("chat-list " + data.userId);
    if (data.userId == "") {
      io.emit("chat-list-response", {
        //sending to all connected clients
        error: true,
        message: CONSTANTS.USER_NOT_FOUND,
      });
    } else {
      try {
        const [UserInfoResponse, chatlistResponse] = await Promise.all([
          chatController.getUserInfo({
            userId: data.userId,
            socketId: false,
          }),
          chatController.getChatlist(socket.id),
        ]);
        io.to(socket.id).emit("chat-list-response", {
          //sending to individual socketid (private message)
          error: false,
          singleUser: false,
          chatList: chatlistResponse,
        });
        // console.log(chatController.getChatlist(socket.id));
        socket.broadcast.emit("chat-list-response", {
          //sending to all clients except sender
          error: false,
          singleUser: true,
          chatList: UserInfoResponse,
        });
      } catch (error) {
        io.to(socket.id).emit("chat-list-response", {
          error: true,
          chatList: [],
        });
      }
    }
  });


  /**
   * send the messages to the user
   */
  socket.on('add-message', async (data) => {
    if (data.message === "") {
      io.to(socket.id).emit('add-message-response', {
        error: true,
        message: CONSTANTS.MESSAGE_NOT_FOUND,
      });
    } else if (data.senderId === "") {
      io.to(socket.id).emit('add-message-response', {
        error: true,
        message: CONSTANTS.SERVER_ERROR_MESSAGE,
      });
    } else if (data.receiverId === "") {
      io.to(socket.id).emit('add-message-response', {
        error: true,
        message: CONSTANTS.SELECT_USER,
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
        io.to(receiverSocketId).emit('add-message-response', data);
      } catch (error) {
        io.to(socket.id).emit('add-message-response', {
          error: true,
          message: CONSTANTS.MESSAGE_STORE_ERROR,
        });
      }
    }
  });
});

//------------------------
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${server.address().port}`);
});
