const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const favicon = require('serve-favicon');
const apiRouter = require("./routes/api/api-routes");
const webRouter = require("./routes/web/web-routes");
const config = require("./config/config");
const https = require('https');
const fs = require('fs');
const cors = require("cors");

const app = express();
dotenv.config();
app.use(express.static("public"));
app.use(express.static('files'))
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json({limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));
app.use("/api", apiRouter);
app.use("/", webRouter);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(favicon('public/images/favicon.ico'));
// app.use(cors({ origin: "*" }));

const httpsOptions = {
    key: fs.readFileSync('../ssl/localhost.key'),
    cert: fs.readFileSync('../ssl/localhost.crt')
}
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

io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);
  
  socket.on("connection",(data)=>{
    try {
      chatController.addSocketId({
        userId: data.userId,
        socketId: socket.id,
      });
    } catch (error) {
      // Error
      console.error(error);
    }
  })

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
    chatController.disconnected(socket.id);

    const userId = data.userId;
    try {
      chatController.logout(userId);
      io.to(socket.id).emit("logout-response", {
        //sending to individual socketid (private message)
        error: false,
        message: "User logged out",
        userId: userId,
      });

      socket.broadcast.emit("chat-left-response", {
        // sending to all clients except sender
        error: false,
        userDisconnected: true,
        userid: userId,
      });
    } catch (error) {
      io.to(socket.id).emit("logout-response", {
        error: true,
        message: "Server error messages",
        userId: userId,
      });
    }
  });

   //   /* Get the user's Chat list	*/
  socket.on("chat-left", async (data) => {
    console.log("chat-left " + data.userId);
    if (data.userId == "") {
      io.emit("chat-left-response", {
        //sending to all connected clients
        error: true,
        message: "User not found",
      });
    } else {
      try {
        const [UserInfoResponse, chatlistResponse] = await Promise.all([
          chatController.getUserInfo({
            userId: data.userId,
            socketId: false,
          }),
          chatController.getChatlist(socket.id, data.userId),
        ]);
        io.to(socket.id).emit("chat-left-response", {
          //sending to individual socketid (private message)
          error: false,
          singleUser: false,
          chatList: chatlistResponse,
        });
        // console.log(chatController.getChatlist(socket.id));
        socket.broadcast.emit("chat-left-response", {
          //sending to all clients except sender
          error: false,
          singleUser: true,
          chatList: UserInfoResponse,
        });
      } catch (error) {
        io.to(socket.id).emit("chat-left-response", {
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
        message: 'Message not found',
      });
    } else if (data.senderId === "") {
      io.to(socket.id).emit('add-message-response', {
        error: true,
        message: 'Error message, no sender',
      });
    } else if (data.receiverId === "") {
      io.to(socket.id).emit('add-message-response', {
        error: true,
        message: 'Select a user to chat',
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
          message: 'Could not store message, server error',
        });
      }
    }
  });

});


//---------------------------
server.listen(port, () => {
  console.log(`Server listening on: https://localhost:${server.address().port}`);
});
