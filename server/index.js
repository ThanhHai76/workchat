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

});



//---------------------------
server.listen(port, () => {
  console.log(`Server listening on: https://localhost:${server.address().port}`);
});
