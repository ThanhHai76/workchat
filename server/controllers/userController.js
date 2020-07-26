// Import Users model
const Users = require("../models/users");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

// Handle index actions
exports.index = function (req, res) {
  Users.get(function (err, users) {
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

// Handle create users actions (signup)
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
      users.avatar = "";
      users.website = "";
      users.socketId = "";
      users.status = ""; 
      // save the users and check for errors
      users.save(function (err) {
        if (err) res.json(err);
        res.json({
          message: "New users created!",
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

// Login
exports.login = function (req, res) {
  // console.log(req.body);
  Users.findOne({ email: req.body.email }, function (err, user) {
    if (err) res.status(500).send(err);
    // test a matching password
    if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) res.status(500).send(err);
        if (isMatch) {
          const payload = { username: user.email };
          const jwtToken = jwt.sign(payload, config.jwtSecret, {
            expiresIn: 1 * 30,
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

// Logout
exports.logout = function (req, res) {
  try {
    Users.findOne({ email: req.user.email }, function (err, user) {
      // console.log(req.user.email);
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

// Handle view users info
exports.getUserByEmail = function (req, res) {
  Users.findOne({ email: req.user.email }, function (err, users) {
    // console.log(req.user.email);
    if (err) res.send(err);
    if (!users) {
      return res.status(500).send(err);
    } else {
      res.json({
        message: "Users details loading..",
        id: users._id,
        name: users.name,
        email: users.email,
        gender: users.gender,
        phone: users.phone,
        address: users.address,
      });
    }
  });
};



// Handle view users info
exports.view = function (req, res) {
  Users.findById(req.params.id, function (err, users) {
    if (err) res.send(err);
    if (!users) {
      return res.status(500).send(err);
    } else {
      res.json({
        message: "Users details loading..",
        data: users,
      });
    }
  });
};

// Handle update users info
exports.update = function (req, res) {
  Users.findById(req.params.id, function (err, users) {
    console.log(req.params.id);
    if (err) {
      res.status(500).send(err);
    } else {
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
    }
  });
};

exports.updateInfo = function (req, res) {
  Users.findOne({ email: req.user.email }, function (err, users) {
    console.log( req.user.email);
    if (err) res.status(500).send(err);
    if (!users) {
      return res.status(500).send(err);
    } else {
      users.name = req.body.name ? req.body.name : users.name;

      // console.log(req.body.name);

      users.phone = req.body.phone ? req.body.phone : users.phone;

      users.address = req.body.address ? req.body.address : users.address;
      users.avatar = req.body.avatar ? req.body.avatar : users.avatar;
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
    }
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


