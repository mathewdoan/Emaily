const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: "/auth/google/callback",
			proxy: true
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ googleId: profile.id }).then(existingUser => {
				if (existingUser) {
					//we already have a record w the given profile ID.
					done(null, existingUser);
				} else {
					//we dont have a record w this ID. make a record
					new User({ googleId: profile.id })
						.save()
						.then(user => done(null, user));
				}
			});
		}
	)
);

passport.use(
	new FacebookStrategy(
		{
			clientID: keys.facebookClientID,
			clientSecret: keys.facebookClientSecret,
			callbackURL: "http://localhost:5000/auth/facebook/callback"
		},
		(accessToken, refreshToken, profile, done) => {
			User.findOne({ facebookId: profile.id }).then(existingUser => {
				if (existingUser) {
				done(null, existingUser);
			} else {
				new User ({ facebookId: profile.id })
					.save()
					.than(user => done(null, user))
				}
			});
		}
	)
);




