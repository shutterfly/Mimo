var persist = require('persist');
var Application = require("./application");
var type = persist.type;

module.exports = User = GLOBAL.persist.define("users", {
    "id": {type: type.INTEGER, 'primaryKey': true},
	"username": type.STRING,
	"email": type.STRING,
	"name": type.STRING,
    "password": type.STRING,
    "created_at": { type: type.DATETIME, defaultValue: function ()
    {
        return new Date().toISOString();
    } },
    "updated_at": type.DATETIME
});
//        .hasOne(Application);
// .hasMany(Keyword, { through: "blogs_keywords" });

User.onSave = function (obj, connection, callback)
{
    obj.updated_at = new Date().toISOString();
    callback();
}