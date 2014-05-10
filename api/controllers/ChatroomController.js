/**
 * ChatroomController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	create: function(req, res, next) {
		Chatroom.create(req.params.all(), function (err, chatroom) {
			if (err) return next(err);

			res.redirect('/chatroom/show/' + chatroom.id);
		});
	},

	show: function(req, res, next) {
		var user = req.session.passport.user;

		Chatroom.findOne(req.param('id'))
			.populate('messages')
			.populate('allowedUsers')
			.exec(function (err, chatroom) {
				if (err) return next(err);
				if (!chatroom) return next();

			var allowed = [chatroom.owner];

			_.each(chatroom.allowedUsers, function(usr) {
				if(usr.id) allowed.push(usr.id);
			});

			if (!_.contains(allowed, user)) {
				return res.forbidden('You are not permitted to perform this action.');
			}

			res.view({
				chatroom: chatroom,
				currentUser: req.session.passport.user,
				currentUserName: req.session.displayName
			});
		});
	},

	joinRoom: function (req, res, next) {
		var room = req.param('room');

		sails.sockets.join(req.socket, room);
		sails.sockets.broadcast(room, 'join', {msg: req.session.displayName + ' has joined the room.'}, req.socket);
		res.ok();
	},

	leaveRoom: function (req, res, next) {
		var room = req.param('room');

		sails.sockets.broadcast(room, 'leave', {msg: req.session.displayName + ' has left the room.'}, req.socket);
		sails.sockets.leave(req.socket, room);
	},

	grantRoomAccess: function(req, res, next) {
		var chatRoomName = "";

		Chatroom.findOne(req.param('room'), function (err, chatroom) {
			if (err) return next(err);
			chatRoomName = chatroom.name;
		});

		User.findOne(req.param('user'))
		.populate('allowedRooms')
		.exec(function (err, user) {
			if (err) return next(err);

			user.allowedRooms.add(req.param('room'));
			user.save(function (err) {});
			sails.sockets.broadcast(user.id, 'grant', {msg: "You've been granted access to a new room.", room: req.param('room'), roomName: chatRoomName }, req.socket);
		});
		return res.send({ action: "added", status: 200 });
	},

	revokeRoomAccess: function(req, res, next) {
		User.findOne(req.param('user'))
		.populate('allowedRooms')
		.exec(function (err, user) {
			if (err) return next(err);

			user.allowedRooms.remove(req.param('room'));
			user.save(function (err) {});
			sails.sockets.broadcast(user.id, 'revoke', {msg: "You've been denied access to a room.", room: req.param('room') }, req.socket);
		});
		return res.send({ action: "removed", status: 200 });
	},

	permissions: function (req, res, next) {
		User.find()
		.populate('allowedRooms')
		.exec(function (err, users) {
			if (err) return next(err);
			if (!users) return next();

			var userList = _.reject(users, function (usr) {
				return usr.id == req.session.passport.user;
			});

			res.render('chatroom/permissions', {
				users: userList,
				chatroom: req.param('id')
			});
		});
	}
	
};
