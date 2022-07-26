var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
var adminAuth = require("../middlewares/adminAuth");

router.get('/', HomeController.index);
router.get("/user", adminAuth, UserController.index);
router.get("/user/:id", adminAuth, UserController.findUser);

router.post('/user',  UserController.create);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

router.put("/user", adminAuth,  UserController.edit);

router.delete("/user/:id", adminAuth,  UserController.remove);



module.exports = router;