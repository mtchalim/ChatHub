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

	grantRoomAccess: function(req, res, next) {
		User.findOne(req.body.userId)
		.populate('allowedRooms')
		.exec(function (err, user) {
			if (err) return next(err);

			user.allowedRooms.add(req.body.chatroom);
			user.save(function (err) {});
			return res.redirect('/chatroom/show/' + req.body.chatroom);
		});
	},

	revokeRoomAccess: function(req, res, next) {
		User.findOne(req.body.userId)
		.populate('allowedRooms')
		.exec(function (err, user) {
			if (err) return next(err);

			user.allowedRooms.remove(req.body.chatroom);
			user.save(function (err) {});
			return res.redirect('/chatroom/show/' + req.body.chatroom);
		});
	},

	invite: function (req, res, next) {
		User.find()
		.populate('allowedRooms')
		.exec(function (err, users) {
			if (err) return next(err);
			if (!users) return next();

			var userList = _.reject(users, function (usr) {
				return usr.id == req.session.passport.user;
			});

			res.view({
				users: userList,
				chatroom: req.param('id')
			});
		});
	}

};
