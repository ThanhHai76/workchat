const Users = require("../models/users");
const Mongodb = require("./../config/db");

exports.addSocketId = function ({ userId, socketId }) {
  const data = {
    id: userId,
    value: {
      $set: {
        socketId: socketId,
        status: "active",
      },
    },
  };
  try {
    let condition = {};
    condition._id = data.id;

    Users.update(condition, data.value, (err, res) => {
      if (err) {
        // res.status(500).send(err);
      } else {
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.logout = function (userId, isSocketId) {
  // console.log(userId);
  const data = {
    $set: {
      socketId: "",
      status: "invisible",
    },
  };
  try {
    let condition = {};
    if (isSocketId) {
      condition.socketId = userId;
    } else {
      condition._id = userId;
    }
    Users.update(condition, data, (err, res) => {
      if (err) {
        res.status(500).send(err);
      } else {
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.disconnected = function (socketId) {
  const data = {
    $set: {
      socketId: "",
      status: "invisible",
    },
  };
  try {
    let condition = {};
    condition.socketId = socketId;

    Users.update(condition, data, (err, res) => {
      if (err) {
        res.status(500).send(err);
      } else {
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUserInfo = function ({ userId, socketId = false }) {
  let queryProjection = null;
  if (socketId) {
    queryProjection = {
      socketId: true,
    };
  } else {
    queryProjection = {
      name: true,
      status: true,
      _id: false,
      id: "$_id",
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      var dbo = DB.db("chatwork");
      dbo
        .collection("users")
        .aggregate([
          {
            $match: {
              _id: ObjectID(userId),
            },
          },
          {
            $project: queryProjection,
          },
        ])
        .toArray((err, result) => {
          DB.close();
          if (err) {
            reject(err);
          }
          socketId ? resolve(result[0]["socketId"]) : resolve(result);
        });
    } catch (error) {
      reject(error);
    }
  });
};

exports.insertMessages = function (messagePacket) {
  return new Promise(async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      var dbo = DB.db("chatwork");
      dbo.collection("messages").insertOne(messagePacket, (err, result) => {
        DB.close();
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
};

getMessages = function ({ sender, receiver }) {
  const data = {
    $or: [
      {
        $and: [
          {
            receiver: sender,
          },
          {
            sender: receiver,
          },
        ],
      },
      {
        $and: [
          {
            receiver: receiver,
          },
          {
            sender: sender,
          },
        ],
      },
    ],
  };
  return new Promise(async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      var dbo = DB.db("chatwork");
      dbo
        .collection("messages")
        .find(data)
        .sort({ timestamp: 1 })
        .toArray((err, result) => {
          DB.close();
          if (err) {
            reject(err);
          }
          resolve(result);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// Handle get messages
exports.getMessagesHandler = async function (request, response) {
  let senderId = request.body.senderId;
  let receiverId = request.body.receiverId;
  if (senderId == "") {
    response.status(412).json({
      error: true,
      message: 'UserId not found',
    });
  } else {
    try {
      const messagesResponse = await this.getMessages({
        senderId: senderId,
        receiverId: receiverId,
      });
      response.status(200).json({
        error: false,
        messages: messagesResponse,
      });
    } catch (error) {
      response.status(503).json({
        error: true,
        messages: 'User not login',
      });
    }
  }
};