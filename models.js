var persist = require("persist");
var type = persist.type;

persist.connect({
    driver: 'sqlite3',
    filename: './data/mimo.sqlite',
    trace: true
}, function (err, connection)
{
    if (err) {
        throw new Error("unable to connect to db");
    }
    GLOBAL.connection = connection;
});


var self = module.exports = {
//    'db': persist,

    User: persist.define("users", {
        "username": type.STRING,
        "password": type.STRING,
        "created_at": { type: type.DATETIME, defaultValue: function() { return new Date() } },
        "updated_at": type.DATETIME
    })



//    Application: db.define('applications',
//            {
//                name: {
//                    type: Sequelize.STRING,
//                    allowNull: false,
//                    unique: true,
////                    validate: {
////                        notEmpty: true,
////                        notNull: true,
////                    }
//                },
//                short_name: {
//                    type: Sequelize.STRING,
//                    allowNull: false,
//                    unique: true
//                }
//            },
//            {
//                timestamps: true,
//                freezeTableName: true,
//
//                classMethods: {
//                    staticExample: function ()
//                    {
//                        this.name
//                    }
//                },
//                instanceMethods: {
//                    mapAttributes: map_attributes
//                }
//            }
//    ),
//
//    Resource: db.define('resources',
//            {
////				name: {
////					type: Sequelize.STRING,
////					allowNull: false
////				}
//            },
//            {
//                timestamps: true,
//                freezeTableName: true,
//
//                classMethods: {
//                    staticExample: function ()
//                    {
//                        this.name
//                    }
//                },
//                instanceMethods: {
//                    mapAttributes: map_attributes
//                }
//            }
//    )

};
