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
	},

	grantRoomAccess: function(req, res, next) {
		User.findOne(req.body.userId)
		.populate('allowedRooms')
		.exec(function (err, user) {
			if (err) return next(err);

			user.allowedRooms.add(req.body.chatroom);
			user.save(function (err) {});
			sails.sockets.broadcast(user.id, 'grant', {msg: "You've been granted access to a new room.", room: req.body.chatroom, roomName: req.body.chatroomName }, req.socket);
			res.redirect('/chatroom/invite/' + req.body.chatroom + '/user/' + req.session.passport.user + '/roomName/' + req.body.chatroomName);
		});
	},

	revokeRoomAccess: function(req, res, next) {
		User.findOne(req.body.userId)
		.populate('allowedRooms')
		.exec(function (err, user) {
			if (err) return next(err);

			user.allowedRooms.remove(req.body.chatroom);
			user.save(function (err) {});
			sails.sockets.broadcast(user.id, 'revoke', {msg: "You've been denied access to a room.", room: req.body.chatroom }, req.socket);
			res.redirect('/chatroom/invite/' + req.body.chatroom + '/user/' + req.session.passport.user + '/roomName/' + req.body.chatroomName);
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
				chatroom: req.param('id'),
				chatroomName: req.param('roomName')
			});
		});
	}

};
