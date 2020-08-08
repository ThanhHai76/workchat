const apiRouter = require("express").Router();
const userController = require("../../controllers/userController");
const authController = require("../../controllers/authController");

apiRouter.get("/", function (req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to RESTHub",
  });
});

apiRouter.route("/signup").post(userController.new);

apiRouter.route("/login").post(userController.login);

// apiRouter.post('/logout', authController.isAuthenticated, userController.logout);

apiRouter
  .route("/logout/:id")
  .post(authController.isAuthenticated, userController.logout);

apiRouter
  .route("/profile")
  .get(authController.isAuthenticated, userController.getUserByEmail);

apiRouter
  .route("/update")
  .post(authController.isAuthenticated, userController.update);

apiRouter
  .route("/usersP")
  .post(authController.isAuthenticated, userController.getUsersProfile);

apiRouter
  .route("/user")
  .get(authController.isAuthenticated, userController.index)
  .post(userController.new);

apiRouter
  .route("/user/:id")
  // .get(authController.isAuthenticated, userController.view)
  .patch(authController.isAuthenticated, userController.update)
  .put(authController.isAuthenticated, userController.update);
// .delete(authController.isAuthenticated, userController.delete);

apiRouter
  .route("/getMessages")
  .post(authController.isAuthenticated, userController.getMessagesHandler);

module.exports = apiRouter;
