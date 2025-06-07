const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verify, isLoggedIn } = require("../auth");


//[SECTION] Route for User Registration
router.post("/register", userController.registerUser);

//[SECTION] Route for User Login
router.post("/login", userController.loginUser);

//[Section] Activity: Route for retrieving user details
router.get("/details", verify, isLoggedIn, userController.getProfile);

//[SECTION] Route for setting user as admin
router.patch("/:id/set-as-admin", verify, isLoggedIn, userController.setUserAsAdmin);

//[SECTION] Route for updating password
router.patch("/update-password", verify, userController.updatePassword);

module.exports = router;