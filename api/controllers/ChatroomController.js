/**
 * ChatroomController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	create: function(req, res, next) {
		Chatroom.create(req.params.all(), function chatCreated(err, chatroom) {
			if (err) return next(err);

			res.redirect('/chatroom/show/' + chatroom.id);
		});
	}
	
};
