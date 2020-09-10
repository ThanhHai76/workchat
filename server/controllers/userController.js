// Import Users model
const Users = require("../models/users");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

// Handle index actions
exports.index = function (req, res) {
  Users.find({ _id: { $ne: req.user._id } }, function (err, users) {
    if (err) {
      res.json({
        status: 500,
        message: err,
      });
    }
    res.json({
      status: 200,
      message: "Users retrieved successfully",
      data: users,
    });
  });
};

// Handle create users actions
exports.new = function (req, res) {
  Users.findOne({ email: req.body.email }, function (err, user) {
    if (err) res.status(500).send(err);
    if (!user) {
      let users = new Users();
      users.name = req.body.name;
      users.email = req.body.email;
      users.password = req.body.password;
      users.gender = "";
      users.phone = "";
      users.date_of_birth = "";
      users.address = "";
      users.avatar = "https://localhost:8888/static/uploads/users.jpg";
      users.website = "";
      users.about = "";
      users.socketId = "";
      users.status = "";
      // save the users and check for errors
      users.save(function (err) {
        if (err) res.json(err);
        res.json({
          message: "New users created!",
          status: 200,
          data: users,
        });
      });
    } else {
      res.json({
        status: 500,
        message: "Opps! The email was available",
      });
    }
  });
};

// Handle view users info
exports.view = function (req, res) {
  Users.findById(req.body.id, function (err, users) {
    if (err) res.send(err);
    res.json({
      message: "Users details loading..",
      data: users,
    });
  });
};

// Handle view users info
exports.getUserProfile = function (req, res) {
  Users.findOne(req.user._id, function (err, users) {
    // console.log(req.user.email);
    if (err) res.send(err);
    if (!users) {
      return res.status(500).send(err);
    } else {
      res.json({
        message: "User Profile",
        data: users,
      });
    }
  });
};

// Handle update users info for normal users
exports.update = function (req, res) {
  Users.findById(req.body.id, function (err, users) {
    // console.log(req.body.id);
    if (err) {
      res.status(500).send(err);
    } else {
      // console.log(req.body.facebook);
      users.name = req.body.name ? req.body.name : users.name;
      users.email = req.body.email ? req.body.email : users.email;
      users.password = req.body.password ? req.body.password : users.password;
      users.gender = req.body.gender ? req.body.gender : users.gender;
      users.phone = req.body.phone ? req.body.phone : users.phone;
      users.date_of_birth = req.body.date_of_birth
        ? req.body.date_of_birth
        : users.date_of_birth;
      users.address = req.body.address ? req.body.address : users.address;
      users.avatar = req.body.avatar ? req.body.avatar : users.avatar;
      users.website = req.body.website ? req.body.website : users.website;
      users.about = req.body.about ? req.body.about : users.about;
      users.socketId = req.body.socketId ? req.body.socketId : users.socketId;
      users.status = req.body.status ? req.body.status : users.status;

      // save the users and check for errors
      users.save(function (err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({
            status: 200,
            message: "User Info updated",
            data: users,
          });
        }
      });
    }
  });
};

//--------------- Social ----------------------------
const { ObjectId } = require("bson");
var MongoClient = require("mongodb").MongoClient;
var url = config.dbUri;
//Update Social Link for normal users ---------------
exports.updateSocialLink = function (req, res) {
  const data_SocialLink = {
    $set: {
      social_link: {
        facebook: req.body.facebook,
        youtube: req.body.youtube,
        google: req.body.google,
        instagram: req.body.instagram,
        twitter: req.body.twitter,
        linkedin: req.body.linkedin,
        globe: req.body.globe,
        whatsapp: req.body.whatsapp,
      },
    },
  };
  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("chatwork");
    let query = { _id: ObjectId(req.body.id) };
    dbo.collection("users").updateOne(query, data_SocialLink, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          status: 200,
          message: "User Social Link updated",
        });
      }
    });
  });
};

//Update Info for Social Accounts
exports.updateSocialUser = function (req, res) {
  Users.findById(req.body.id, function (err, users) {
    // console.log(req.body.id);
    const data = {
      $set: {
        date_of_birth: req.body.date_of_birth
          ? req.body.date_of_birth
          : users.date_of_birth,
        gender: req.body.gender ? req.body.gender : users.gender,
        address: req.body.address ? req.body.address : users.address,
        phone: req.body.phone ? req.body.phone : users.phone,
        website: req.body.website ? req.body.website : users.website,
        about: req.body.about ? req.body.about : users.about,
      },
    };
    // console.log(users);
    MongoClient.connect(url, function (err, db) {
      var dbo = db.db("chatwork");
      let query = { _id: ObjectId(req.body.id) };
      dbo.collection("users").updateOne(query, data, (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          Users.findById(req.body.id, function (err, users) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.json({
                status: 200,
                message: "User Info updated",
                data: users,
              });
            }
          });
        }
      });
    });
  });
};
//--------------------------------------------------

// Handle delete users
exports.delete = function (req, res) {
  Users.remove(
    {
      _id: req.params.id,
    },
    function (err, users) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          status: 200,
          message: "Users deleted",
        });
      }
    }
  );
};

// Login
exports.login = function (req, res) {
  Users.findOne({ email: req.body.email }, function (err, user) {
    if (err) res.status(500).send(err);
    // test a matching password
    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) res.status(500).send(err);
        if (isMatch) {
          const payload = { email: user.email };
          const jwtToken = jwt.sign(payload, config.jwtSecret, {
            expiresIn: 1 * 1200,
          });
          const jsonResponse = { status: 200, token: jwtToken };
          user.token = jwtToken;
          user.save(function (err) {
            if (err) console.error(err);
          });
          res.json(jsonResponse);
        } else {
          res.json({
            status: 500,
            message: "Login fail",
          });
        }
      });
    } else {
      res.json({
        status: 500,
        message: "Login fail",
      });
    }
  });
};

// Social networklogin
exports.socialSignin = function (req, res) {
  if (!req.user) {
    res.send(401, "User not authenticated");
  } else {
    var payload = { email: req.user.email };
    var jwtToken = jwt.sign(payload, config.jwtSecret, { expiresIn: 1 * 600 });
    req.user.token = jwtToken;
    req.user.save(function (err) {
      if (err) console.error(err);
    });
    var jsonResponse = { status: 200, token: jwtToken };
    res.json(jsonResponse);
  }
};

// Logout
exports.logout = function (req, res) {
  try {
    Users.findOne({ _id: req.user._id }, function (err, user) {
      if (err) res.status(500).send(err);
      if (user) {
        user.token = "";
        user.save(function (err) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.json({ status: 200 });
          }
        });
      } else {
        res.json({ status: 500 });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.uploadFile = (req, res, next) => {
  const file = req.file;
  // console.log(file.filename);
  if (!file) {
    const err = new Error("No File");
    res.status(500).send(err);
    return next(err);
  } else {
    res.json({
      status: 200,
      message: "Avatar updated",
    });
  }
};

exports.insertNewestMessages = function (message) {
  const data = {
    $set: {
      senderId: message.senderId,
      newestMessage: message.message,
      sendtime: message.sendtime,
    },
  };
  MongoClient.connect(url, function (err, db) {
    try {
      var dbo = db.db("chatwork");
      let query = { _id: ObjectId(message.receiverId) };
      dbo.collection("users").updateOne(query, data, (err, result) => {
        db.close();
        if (err) {
          console.log(err);
        }
      });
      // let query2 = { _id: ObjectId(message.senderId) };
      // dbo.collection("users").updateOne(query2, data, (err, result) => {
      //   db.close();
      //   if (err) {
      //     console.log(err);
      //   }
      // });
    } catch (error) {
      console.log(error);
    }
  });
};
