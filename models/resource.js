var persist = require("persist");
var Application = require("./application");
//var User = require("./user");
var type = persist.type;

module.exports = Resource = GLOBAL.persist.define("resources", {
	"id": {type: type.INTEGER, 'primaryKey': true},
	"user_id": type.INTEGER,
	"application_id": type.INTEGER,
	"path": type.STRING,
	"type": type.STRING,
	"content_type": type.STRING,
	"http_code": type.STRING,
	"body": type.STRING,
	"created_at": { type: type.DATETIME, defaultValue: function ()
	{
		return new Date().toISOString();
	} },
	"updated_at": type.DATETIME
});
//.hasOne(Application);
//.hasMany(Keyword, { through: "blogs_keywords" });

Resource.onSave = function (obj, connection, callback)
{
	obj.updated_at = new Date().toISOString();;
	callback();
}