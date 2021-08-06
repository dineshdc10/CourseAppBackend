const express = require('express'),
    session = require("express-session"),
    FileStore = require("session-file-store")(session);
const usersRouter = require('./routes/user.route');
const courseRouter = require('./routes/courselist.route');
const config = require('./config/default.json');
const port = config.appsys.port;
const app = express()
app.use(express.urlencoded({ extend: false }));
app.use(express.json());


var fileStoreOptions = { secret: "we live" };
//use sessions for tracking logins
app.use(
    session({
        secret: "work hard",
        cookie: { maxAge: 3600000 },
        store: new FileStore(fileStoreOptions),
        resave: true,
        saveUninitialized: false
    })
);

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.status(401);
        res.send({ message: "You must be logged in to view this page." });
    }
}

app.use("/courses", requiresLogin, courseRouter);
app.use("/user", usersRouter);
app.listen(port);