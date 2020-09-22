// Import Users model
Users = require("../models/users");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const mail = require("../config/mail");
const jwtHelper = require("../helpers/jwt.helper");

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
  let users = new Users();
  users.name = req.body.name;
  users.email = req.body.email;
  users.password = req.body.password;
  users.gender = req.body.gender;
  users.phone = req.body.phone;
  users.date_of_birth = req.body.date_of_birth;
  users.address = req.body.address;
  users.avatar = req.body.avatar;
  // save the users and check for errors
  users.save(function (err) {
    if (err) res.json(err);
    res.json({
      message: "New users created!",
      data: users,
    });
  });
};

// Handle view users info
exports.view = function (req, res) {
  Users.findById(req.params.id, function (err, users) {
    if (err) res.send(err);
    res.json({
      message: "Users details loading..",
      data: users,
    });
  });
};

// Handle update users info
exports.update = function (req, res) {
  Users.findById(req.body.id, function (err, users) {
    if (err) res.status(500).send(err);
    if (users) {
      // console.log(users);
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
      users.about = req.body.about ? req.body.about : users.about;
      users.website = req.body.website ? req.body.website : users.website;
      // save the users and check for errors
      users.save(function (err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({
            status: 200,
            message: "Users Info updated",
            data: users,
          });
        }
      });
    } else {
      res.json({
        status: 500,
        message: "Update fail",
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

    if (user) {
      user.comparePassword(req.body.password, async function (err, isMatch) {
        if (err) res.status(500).send(err);
        if (isMatch) {
          const jwtToken = await jwtHelper.generateToken(
            user,
            config.jwtSecret,
            config.tokenLife
          );
          const refreshToken = await jwtHelper.generateToken(
            user,
            config.refreshTokenSecret,
            config.refreshTokenLife
          );

          user.token = jwtToken;
          user.save(function (err) {
            if (err) console.error(err);
          });

          res.status(200).json({
            status: 200,
            token: jwtToken,
            refreshToken: refreshToken,
          });
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

// SignUp
exports.signup = function (req, res) {
  if (!req.body.email) {
    res.status(500).send(err);
  }

  Users.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(500).send(err);
    }

    if (user) {
      res.json({
        status: 500,
        message: "Email is existed!",
      });
    } else {
      let user = new Users();
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.gender = "";
      user.phone = "";
      user.date_of_birth = "";
      user.address = "";
      user.avatar = "https://localhost:8888/static/uploads/users.jpg";
      user.website = "";
      user.about = "";
      user.website = "";
      user.save(function (err) {
        if (err) res.status(500).send(err);
        res.json({
          message: "New users created!",
          status: 200,
        });
      });

      const mailOptions = {
        from: "ChatWorkServer",
        to: req.body.email,
        subject: "Welcome to ChatWork",
        text: "https://",
      };

      mail.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
};

// Social networklogin
exports.socialSignin = async function (req, res) {
  if (!req.user) {
    res.send(401, "User not authenticated");
  } else {
    // var payload = { email: req.user.email };
    // var jwtToken = jwt.sign(payload, config.jwtSecret, { expiresIn: 1 * 30 });
    const jwtToken = await jwtHelper.generateToken(
      req.user,
      config.jwtSecret,
      config.tokenLife
    );
    const refreshToken = await jwtHelper.generateToken(
      req.user,
      config.refreshTokenSecret,
      config.refreshTokenLife
    );
    req.user.token = jwtToken;
    req.user.save(function (err) {
      if (err) console.error(err);
    });
    var jsonResponse = {
      status: 200,
      token: jwtToken,
      refreshToken: refreshToken,
    };
    res.json(jsonResponse);
  }
};

// Logout
exports.logout = function (req, res) {
  try {
    Users.findOne({ email: req.user.email }, function (err, user) {
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

// Refresh token
exports.refreshToken = (req, res) => {
  if (req.body.refreshToken) {
    try {
      jwtHelper
        .verifyToken(req.body.refreshToken, config.refreshTokenSecret)
        .then((decoded) => {
          jwtHelper
            .generateToken(decoded.data, config.jwtSecret, config.tokenLife)
            .then((jwtToken) => {
              Users.findOne({ email: decoded.data.email }, function (
                err,
                user
              ) {
                if (err) res.status(500).send(err);
                if (user) {
                  user.token = jwtToken;
                  user.save(function (err) {
                    if (err) console.error(err);
                    res.status(200).json({ status: 200, token: jwtToken });
                  });
                } else {
                  res.json({
                    status: 500,
                    message: "Can not find user" + decoded.data.email,
                  });
                }
              });
            });
        });
    } catch (error) {
      res.status(401).json({ message: "Invalid refresh token." });
    }
  } else {
    res.status(401).send({ message: "No token provided." });
  }
};

// Get profile
exports.profile = (req, res) => {
  try {
    Users.findOne({ _id: req.user._id }, function (err, user) {
      if (err) res.status(500).send(err);
      if (user) {
        res.json({ status: 200, user: user });
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

// exports.insertNewestMessages = function (message) {
//   const data = {
//     $set: {
//       senderId: message.senderId,
//       newestMessage: message.message,
//       sendtime: message.sendtime,
//     },
//   };
//   MongoClient.connect(url, function (err, db) {
//     try {
//       var dbo = db.db("chatwork");
//       let query = { _id: ObjectId(message.receiverId) };
//       dbo.collection("users").updateOne(query, data, (err, result) => {
//         db.close();
//         if (err) {
//           console.log(err);
//         }
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   });
// };
