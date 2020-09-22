let apiRouter = require('express').Router();
var userController = require('../../controllers/userController');
var authController = require('../../controllers/authController');
var chatController = require('../../controllers/chatController');
const passport = require('passport');
var passportConfig = require('../../config/passport');
    passportConfig();

apiRouter.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTfull API'
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

// Auth api
apiRouter.route('/login')
    .post(userController.login);
apiRouter.route('/refreshToken')
    .post(userController.refreshToken);
apiRouter.route('/social-signin/facebook')
    .post(passport.authenticate('facebookToken', { session: false }), userController.socialSignin);
apiRouter.route('/social-signin/google')   
    .post(passport.authenticate('googleToken', { session: false }), userController.socialSignin);
apiRouter.route('/signup')
    .post(userController.signup);
apiRouter.post('/logout', authController.isAuthenticated, userController.logout);

// User API
apiRouter.route('/user')
    .get(authController.isAuthenticated, userController.index)
    // .post(userController.new);
apiRouter.route('/user/:id')
    .get(authController.isAuthenticated, userController.view)
    .patch(authController.isAuthenticated, userController.update)
    .put(authController.isAuthenticated, userController.update)
    .delete(authController.isAuthenticated, userController.delete);
apiRouter.post('/profile', authController.isAuthenticated, userController.profile);
apiRouter
  .route("/update")
  .post(authController.isAuthenticated, userController.update);
apiRouter
  .route("/upload")
  .post(
    authController.isAuthenticated,
    upload.single("file"),
    userController.uploadFile
  );
apiRouter
  .route("/getMessages")
  .post(authController.isAuthenticated, chatController.getMessagesHandler);

module.exports = apiRouter;