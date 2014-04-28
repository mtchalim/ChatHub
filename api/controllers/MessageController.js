/**
 * MessageController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	
	create: function(req, res, next) {
		Message.create(req.params.all(), function messageCreated(err, message) {
			if (err) return next(err);

			res.redirect('/chatroom/show/' + req.body.room);
		});
	}
};
