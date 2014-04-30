/**
 * AuthController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {
	
	login: function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) return next(err);
			if (!user) return res.redirect('/user/login');

			req.login(user, function (err) {
				if (err) return next(err);

				req.session.authenticated = true;
				req.session.displayName = user.firstName + " " + user.lastName;
				sails.sockets.blast('online', {msg: req.session.displayName + " is online."}, req.socket);
				return res.redirect('/user/show/' + user.id);
			});
		})(req, res, next);
	},

	logout: function (req, res) {
		req.session.authenticated = false;
		sails.sockets.blast('offline', {msg: req.session.displayName + " is offline."}, req.socket);
		req.logout();
  	res.redirect('/');
	}
};