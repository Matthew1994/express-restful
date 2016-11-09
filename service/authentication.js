export function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		res.sendStatus(401);
	}
}

import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';

var User = {};
//定义身份验证策略
passport.use(new LocalStrategy( { passReqToCallback: true },
  function(request, username, password, done) {
  	User = request.models.User;
    User.one({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

// 设置session序列化和反序列化规则
passport.serializeUser(function(user, cb) {
  cb(null, user.username);
});

passport.deserializeUser(function(username, cb) {
  User.one({username: username}, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

export default passport;

