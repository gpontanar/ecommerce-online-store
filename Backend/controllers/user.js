//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../auth');

const { errorHandler } = auth;

//[SECTION] User registration
module.exports.registerUser = (req, res) => {
    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: "Email invalid" });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ message: "Mobile number invalid" });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: "Password must be at least 8 characters" });
    // If all needed requirements are achieved
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

    	return newUser.save()
    	.then((result) => res.status(201).send({ message: "Registered Successfully", user: result }))
        .catch(error => errorHandler(error, req, res));
    }
};

//[SECTION] User authentication

module.exports.loginUser = (req, res) => {
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ error: "Invalid email format" });
    }

    return User.findOne({ email: req.body.email })
        .then(result => {
            if (result == null) {
                return res.status(404).send({ error: "No Email Found" });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.send({ access: auth.createAccessToken(result) });
                } else {
                    return res.status(401).send({ error: "Email and password do not match" });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
};



// module.exports.getProfile = (req, res) => {

//     return User.findById(req.user.id)
//     .then(user => {
//         user.password = "";
//         res.send(user)
//     })
//     .catch(error => errorHandler(error, req, res));
// };

//[SECTION] Get profile
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
        .then(user => {
            if (user) {
                user.password = "";
                res.send(user);
            } else {
                res.status(404).send({ message: "User not found" });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


//[SECTION] Set user as admin
// module.exports.setUserAsAdmin = (req, res) => {
//     return User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true })
//     .then(user => res.send(user))
//     .catch(error => errorHandler(error, req, res));
// };

module.exports.setUserAsAdmin = (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).send({
            error: "Permission Denied, Only Admin user can change permission."
        });
    }

    return User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true })
        .then(user => {
            if (user) {
                res.send({ updatedUser: user });
            } else {
                const err = new Error('User not found');
                err.status = 404;
                err.kind = 'ObjectId';
                err.value = req.params.id;
                err.path = '_id';
                err.name = 'CastError';
                throw err;
            }
        })
        .catch(error => errorHandler(error, req, res));
};

//[SECTION] Update password
module.exports.updatePassword = (req, res) => {
    const newPassword = bcrypt.hashSync(req.body.newPassword, 10);
    return User.findByIdAndUpdate(req.user.id, { password: newPassword }, { new: true })
    .then(user => res.send({ message: "Password updated successfully" }))
    .catch(error => errorHandler(error, req, res));
};

