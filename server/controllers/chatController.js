const Users = require("../models/users");
const Mongodb = require("./../config/db");
var MongoClient = require("mongodb").MongoClient;
const config = require("../config/config");
var url = config.dbUri;
const { ObjectId } = require("bson");

exports.addSocketId = function ({ userId, socketId }) {
  // console.log(userId);
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
    MongoClient.connect(url,(err,db)=>{
      var dbo = db.db("chatwork");
      let query = { _id: ObjectId(data.id) };
      dbo.collection('users').updateOne(query, data.value, (err)=>{

      })
    })
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.logout = function (userId) {
  // console.log(userId);
  const data = {
    $set: {
      socketId: "",
      status: "offline",
    },
  };
  try {
    MongoClient.connect(url,(err,db)=>{
      var dbo = db.db("chatwork");
      let query = { _id: ObjectId(userId) };
      dbo.collection('users').updateOne(query, data, (err)=>{
      })
    })
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.disconnected = function (socketId) {
  const data = {
    $set: {
      socketId: "",
      status: "offline",
    },
  };
  try {
    MongoClient.connect(url,(err,db)=>{
      var dbo = db.db("chatwork");
      let query = { socketId: socketId };
      dbo.collection('users').updateOne(query, data, (err)=>{
      })
    })
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
      message: "UserId not found",
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
        messages: "User not login",
      });
    }
  }
};
