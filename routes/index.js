/*
 * GET home page.
 */

exports.index = function (req, res)
{
    var data = {};

    res.render('index', data);
};