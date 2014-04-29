/**
 * MessageController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	
	create: function(req, res, next) {
		Message.create(req.params.all(), function (err, message) {
			if (err) return next(err);

			sails.sockets.broadcast(message.room, 'created', 
				{ msg: message.message, poster:message.posterName });
			res.ok();
		});
	}
};
