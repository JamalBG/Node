const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const { User } = require("../config/exo5/database"); // Import correct

passport.use(
    "signup",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true, 
        },
        async (req, email, password, done) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return done(null, false, { message: "Email already exists" });
                }

                const role = req.body.role && ["admin", "user"].includes(req.body.role) 
                ? req.body.role 
                : "user";

                const user = await User.create({ email, password: hashedPassword, role });

                return done(null, user, { message: "OK" });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email } });

                if (!user) {
                    return done(null, false, { message: "Incorect user" });
                }

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return done(null, false, { message: "Bad credential" });
                }
                const safeUser = {
                    id: user.id,
                    email: user.email,
                    role: user.role
                };

                return done(null, safeUser, { message: "Logged in Successfully" });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            secretOrKey: "TOP_SECRET",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (payload, done) => {
            console.log("Payload extrait du token :", payload); 
            try {
                return done(null, payload); 
            } catch (error) {
                return done(error);
            }
        }
    )
);

/*  
 http://localhost:3000/login 
{
  "email": "test@example.com",
  "password": "123456"
}*/

