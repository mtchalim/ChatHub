module.exports = function(req, res, next) {
		if (req.body.owner == req.session.passport.user) {
			return next();
		} else {
			return res.forbidden('You are not permitted to perform this action.');
		}
}