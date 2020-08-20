const Users = require("../models/users");

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

