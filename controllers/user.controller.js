var Utilities = require('../utils/utils');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var dbURL = Utilities.getDbURL();
var config = require('../config/default.json');

exports.login = function (req, res) {
    try {
        if (this.validateLogin(req.body)) {
            MongoClient.connect(dbURL)
                .then(client => {
                    const db = client.db(config.db.name);
                    const userCollection = db.collection('users')
                    var query = { userid: req.body.userId, password: req.body.password };
                    userCollection.find(query).toArray(function (err, result) {
                        if (err) throw err;
                        if (result.length > 0) {
                            req.session.userId = result[0].userid;
                            req.session.isAuth = true;
                            res.json({
                                isAuth: true,
                                userid: result[0].userid,
                                message: "Logged in successfully!!"
                            });
                        }
                        else {
                            res.json({
                                isAuth: false,
                                message: "Invalid user ID or Password!!"
                            });
                        }

                    });
                });
        }
        else {
            res.json({
                isAuth: false,
                message: "Invalid user ID or Password!!"
            });
        }
    } catch (err) {
        res.status(500);
        res.json({ error: err });
    }
};

exports.logout = function (req, res) {
    try {
        req.session.destroy(function (err) {
            if (err) {
                res.status(500);
                res.json({ message: "Error in logout!!" });
            } else {
                res.json({ message: "Logout succesful!!" });
            }
        });
    } catch (err) {
        res.status(500);
        res.json({ error: err });
    }
};

exports.register = function (req, res) {
    var errors = {
        userId: "",
        password: "",
        repassword: ""
    };
    try {
        if (this.validateAddUserForm(req.body, errors)) {
            MongoClient.connect(dbURL)
                .then(client => {
                    const db = client.db(config.db.name);
                    const userCollection = db.collection('users')
                    var userdata = req.body;
                    var data = {
                        userid: userdata.userId,
                        password: userdata.password,
                        createdon: new Date()
                    }
                    var query = { userid: req.body.userId };
                    userCollection.find(query).toArray(function (err, result) {
                        if (err) throw err;
                        if (result.length > 0) {
                            errors.userId = "User ID already exists, Please use a differnt user ID!!";
                            res.json({
                                success: false,
                                errors: errors,
                                message: "User ID already exists, Please use a differnt user ID!!"
                            });
                        }
                        else {
                            userCollection.insertOne(data, function (err, result) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        errors: errors,
                                        message: "Signup failed!!"
                                    });
                                } else {
                                    res.json({
                                        success: true,
                                        message: "Signed up successfully!!"
                                    });
                                }
                            });
                        }
                    });

                });
        } else {
            res.json({
                success: false,
                errors: errors,
                message: "Signup failed!!"
            });
        }
    } catch (err) {
        res.json({ success: false, errors: errors, message: "Signup failed!!" });
    }
};

trimAddUserForm = function (user) {
    user.userId = user.userId.trim();
    user.password = user.password.trim();
    return user;
};

validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

validateAddUserForm = function (user, errors) {
    user = this.trimAddUserForm(user);
    var isValid = true;
    var val_Pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (
        user.userId === "" ||
        user.userId.length < 4 || user.userId.length > 500 ||
        !validateEmail(user.userId)
    ) {
        errors.userId = "Please enter a valid email ID!!";
        isValid = false;
    }
    if (user.password === "" || !user.password.match(val_Pass)) {
        errors.password =
            "Password must be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character(_ @ # &)";
        isValid = false;
    }
    return isValid;
};

trimLoginData = function (user) {
    user.userId = user.userId.trim();
    user.password = user.password.trim();
    return user;
};

validateLogin = function (user) {
    user = this.trimLoginData(user);
    var isValid = true;
    var val_Pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (
        user.userId === "" ||
        user.userId.length < 4 || user.userId.length > 500 ||
        !validateEmail(user.userId)
    ) {
        isValid = false;
    }
    if (user.password === "" || !user.password.match(val_Pass)) {
        isValid = false;
    }
    return isValid;
};