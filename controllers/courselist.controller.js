var Utilities = require('../utils/utils');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var dbURL = Utilities.getDbURL();
var config = require('../config/default.json');

exports.addCourse = function (req, res) {
    try {
        let otp = req.body.otp;
        if (otp == "123456") {
            let userid = req.session.userId;
            let courseid = req.body.courseid;
            let createdon = new Date();
            MongoClient.connect(dbURL)
                .then(client => {
                    const db = client.db(config.db.name);
                    const taskCollection = db.collection('subscribedcourses');
                    var insertQuery = { userid: userid, courseid: courseid, createdon: createdon, isactive: true }
                    taskCollection.insertOne(insertQuery, function (err, result) {
                        if (err) throw err;
                        res.json({
                            success: true
                        });
                    });
                });
        }
        else {
            res.json({
                success: false
            });
        }

    } catch (err) {
        res.status(500);
        res.json({ error: err, success: false });
    }
};

exports.getPaidCourseList = function (req, res) {
    try {
        var userId = req.session.userId;
        MongoClient.connect(dbURL)
            .then(client => {
                const db = client.db(config.db.name);
                const taskCollection = db.collection('subscribedcourses')
                var query = { userid: userId, isactive: true };
                taskCollection.find(query).toArray(function (err, result) {
                    if (err) throw err;
                    res.json({
                        courselist: result
                    });
                });
            });
    } catch (err) {
        res.status(500);
        res.json({ error: err });
    }
};

exports.verifyPaidCourse = function (req, res) {
    try {
        var userId = req.session.userId;
        let courseid = req.body.courseid;
        MongoClient.connect(dbURL)
            .then(client => {
                const db = client.db(config.db.name);
                const taskCollection = db.collection('subscribedcourses')
                var query = { userid: userId, courseid: courseid, isactive: true };
                taskCollection.find(query).toArray(function (err, result) {
                    if (err) throw err;
                    if (result) {
                        if (result.length > 0) {
                            res.json({
                                success: true
                            });
                        }
                        else {
                            res.json({
                                success: false
                            });
                        }
                    }
                    else {
                        res.json({
                            success: false
                        });
                    }

                });
            });
    } catch (err) {
        res.status(500);
        res.json({ error: err, success: false });
    }
};
