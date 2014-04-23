var persist = require("persist");
//var User = require("./user");
var Resource = require("./resource");
var type = persist.type;

module.exports = Application = GLOBAL.persist.define("applications", {
	"id": {type: type.INTEGER, 'primaryKey': true},
	"name": type.STRING,
	"short_name": type.STRING,
	"description": type.STRING,
	"created_at": { type: type.DATETIME, defaultValue: function ()
	{
		return new Date().toISOString();
	}},
	"updated_at": type.DATETIME,
	"user_id": type.INTEGER,
	"active": type.INTEGER,
	"public": type.INTEGER
});//.hasMany(Resource);

Application.onSave = function (obj, connection, callback)
{
	obj.updated_at = new Date().toISOString();
	callback();
}