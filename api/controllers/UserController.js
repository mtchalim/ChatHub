/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	signup: function(req, res, next) {
		res.view();
	},

	create: function(req, res, next) {
		User.create(req.params.all(), function (err, user) {
			if (err) return next(err);
			
			req.login(user, function (err) {
				if (err) return next(err);

				req.session.authenticated = true;
				req.session.displayName = user.firstName + " " + user.lastName;
				return res.redirect('/user/show/' + user.id);
			});
		})
	},

	login: function(req, res, next) {
		res.view();
	},

	show: function(req, res, next) {
		User.findOne(req.param('id'))
			.populate('rooms')
			.populate('allowedRooms')
			.exec(function (err, user) {
				if (err) return next(err);
				if (!user) return next();
				res.view({
					user: user
				});
		});
	},

	listen: function (req, res, next) {
		sails.sockets.join(req.socket, req.session.passport.user);
	}

};
