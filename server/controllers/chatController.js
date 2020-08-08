const Users = require("../models/users");
const Message = require("../models/messages");

var Mongodb = require("./../config/db");
const { db } = require("../models/users");

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
        res.status(500).send(err);
      } else {
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.logout = function (userId, isSocketId) {
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

exports.getChatlist = function (socketId) {
  return new Promise(async (resolve, reject) => {
    try {
      const [DB, ObjectID] = await Mongodb.onConnect();
      var dbo = DB.db("chatwork");
      dbo
        .collection("users")
        .aggregate([
          {
            $match: {
              //$match chon document mong muon truy van
              socketId: { $ne: socketId }, //$ne chon cac document co cac gia tri cua truong khong bang gia tri chi dinh
            },
          },
          {
            $project: {
              //$project chi dinh cac file mong muon truy van
              name: true,
              status: true,
              _id: false,
              id: "$_id",
            },
          },
        ])
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

exports.getMessages = function ({ sender, receiver }) {
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



// Handle view users info
// exports.getUserInfo = function (socketId) {
//   // let queryProjection = null;
//   // if (socketId = false) {
//   //   queryProjection = {
//   //     socketId: true,
//   //   };
//   // } else {
//   var userInfo = [];
//   let queryProjection = {
//     name: true,
//     status: true,
//     _id: false,
//     id: "$_id",
//   };
//   // }
//     MongoClient.connect(url, function (err, db) {

//       if (err) throw err;
//       var dbo = db.db("chatwork");
//       dbo
//         .collection("users")
//         .aggregate([
//           {
//             $match: {
//               socketId: socketId,
//             },
//           },
//           {
//             $project: queryProjection,
//           },
//         ])
//         .toArray((err, result) => {

//           db.close();
//           if (err) {
//             throw err;
//           } else {
//             // console.log(result);
//             userInfo = result;
//           }
//           // socketId ? result[0]["socketId"] : result;
//         });
//     });

//   console.log(userInfo);
//   return userInfo;
// };

// exports.getChatlist = function (socketId) {
//   var chatlist = [];
//     MongoClient.connect(url, function (err, db) {
//       if (err) throw err;
//       var dbo = db.db("chatwork");
//       dbo
//         .collection("users")
//         .aggregate([
//           {
//             $match: {
//               //$match chon document mong muon truy van
//               socketId: { $ne: socketId }, //$ne chon cac document co cac gia tri cua truong khong bang gia tri chi dinh
//             },
//           },
//           {
//             $project: {
//               //$project chi dinh cac file mong muon truy van
//               name: true,
//               status: true,
//               _id: false,
//               id: "$_id",
//             },
//           },
//         ])
//         .toArray((err, result) => {
//           db.close();
//           if (err) {
//             throw err;
//           } else {
//             chatlist = result;
//           }
//           // console.log(chatlist);
//         });
//     });
//   console.log(chatlist);
//   return chatlist;
// };
