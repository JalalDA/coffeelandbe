const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJWT = passportJwt.ExtractJwt;
const Strategy = passportJwt.Strategy;
const { User } = require("../models/index")

passport.use(
    new Strategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken,
        secretOrKey: process.env.JWT_SECRET_KEY
    },
        (jwtPayload, done) => {
            return User.findOne({ where: { user_id: jwtPayload.id } })
                .then((user) => {
                    return done(null, user)
                })
                .catch((err) => {
                    return done(err)
                })
        })
)