import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/User.js";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
} from "./config.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;

export default function passportConfig(passport) {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/users/google/callback",
      },

      async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
          });
          if (newUser) {
            done(null, newUser);
          }
        } else {
          done(null, user);
        }
      }
    )
  );
}
