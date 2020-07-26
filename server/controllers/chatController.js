const Users = require("../models/users");
const Message = require("../models/messages");
const config = require("../config/config");
const { Result } = require("express-validator");

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

// Handle view users info
exports.getUserInfo = function (userId, socketId = false) {
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
  try {
    Users.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $project: { $objectToArray: queryProjection },
      },
    ]);
  } catch (error) {
    throw error;
  }
};



exports.getChatlist = function (socketId) {
  try {
    // console.log(socketId);
    Users.aggregate([
      {
        $match: {
          //$match chon document mong muon truy van
          socketId: { $ne: socketId }, //$ne chon cac document co cac gia tri cua truong khong bang gia tri chi dinh
        },
      },
      {
        $project: {
          $objectToArray: {
            //$project chi dinh cac file mong muon truy van
            name: true,
            status: true,
            _id: false,
            id: "$_id",
          },
        },
      },
    ])
  } catch (error) {
    throw error;
  }
};




exports.insertMessages = function (messagePacket) {
  Message.insertOne(messagePacket, (err, res) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({
        status: 200,
        message: "message inserted",
      });
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
  Message.find(data)
    .sort({ timestamp: 1 })
    .toArray((err, res) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          status: 200,
          message: "got message",
        });
      }
    });
};
