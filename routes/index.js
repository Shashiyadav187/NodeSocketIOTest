
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Socket.IO Test' });
};

exports.skeleton_test = function(req, res){
  res.render('skeleton_test', { title: 'Socket.IO Test' });
};
