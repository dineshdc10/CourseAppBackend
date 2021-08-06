var config = require('../config/default.json');
exports.getDbURL = function () {
    var user = config.db.user;
    var pass = config.db.pass;
    var host = config.db.host;
    var dbname = config.db.name;
    var dbURL = "mongodb+srv://" + user + ':' + pass + host + "/" + dbname + "?retryWrites=true&w=majority";
    return dbURL;
}