
/*
 * GET users listing.
 */
exports.index = function(req, res){
  res.render('user/index', { title: '/ My Apps'});
};