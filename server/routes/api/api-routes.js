let apiRouter = require("express").Router();
const userController = require("../../controllers/userController");
const authController = require("../../controllers/authController");
const chatController = require("../../controllers/chatController");
const passport = require("passport");
const path = require("path");
var passportConfig = require("../../config/passport");
passportConfig();

apiRouter.get("/", function (req, res) {
  res.json({
    status: "API Its Working",
    message: "Welcome to RESTfull API",
  });
});

//Upload File ---------
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
//---------------------

apiRouter.route("/login").post(userController.login);
apiRouter.route("/signup").post(userController.new);

apiRouter
  .route("/profile")
  .get(authController.isAuthenticated, userController.getUserProfile);
apiRouter
  .route("/users")
  .post(authController.isAuthenticated, userController.view); //Profile users
apiRouter
  .route("/update")
  .post(authController.isAuthenticated, userController.update);
apiRouter
  .route("/updateSocialLink")
  .post(authController.isAuthenticated, userController.updateSocialLink);
apiRouter
  .route("/updateSocialUser")
  .post(authController.isAuthenticated, userController.updateSocialUser);

apiRouter
  .route("/upload")
  .post(
    authController.isAuthenticated,
    upload.single("file"),
    userController.uploadFile
  );
// apiRouter.route("/getAvatar").post(authController.isAuthenticated, (req,res)=>{
//   filepath = path.join(__dirname,'./../../public/uploads/') + req.body.filename;
//   res.sendFile(filepath);
//   console.log(filepath);
// })

apiRouter.post(
  "/logout",
  authController.isAuthenticated,
  userController.logout
);

//List users
apiRouter
  .route("/userList")
  .get(authController.isAuthenticated, userController.index);
// .post(userController.new);

apiRouter
  .route("/user/:id")
  .get(authController.isAuthenticated, userController.view)
  .patch(authController.isAuthenticated, userController.update)
  .put(authController.isAuthenticated, userController.update)
  .delete(authController.isAuthenticated, userController.delete);

apiRouter
  .route("/social-signin/facebook")
  .post(
    passport.authenticate("facebookToken", { session: false }),
    userController.socialSignin
  );

apiRouter
  .route("/social-signin/google")
  .post(
    passport.authenticate("googleToken", { session: false }),
    userController.socialSignin
  );

apiRouter
  .route("/getMessages")
  .post(authController.isAuthenticated, chatController.getMessagesHandler);

module.exports = apiRouter;
