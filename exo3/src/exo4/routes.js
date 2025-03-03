const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post(
    "/signup",
    passport.authenticate("signup", { session: false }),
    async (req, res) => {
        res.json({
            message: "Signup successful",
            user: { 
                id: req.user.id, 
                email: req.user.email, 
                password: req.user.password, 
                role: req.user.role 
            },
        });
    }
);

router.post(
    "/login",
    (req, res, next) => {
        passport.authenticate("login", (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            req.login(user, { session: false }, (error) => {
                if (error) return next(error);

                const safeUser = {
                    id: user.id,
                    email: user.email,
                    role: user.role
                };

                const token = jwt.sign(safeUser , "TOP_SECRET");

                return res.json({ token });
            });
        })(req, res, next);
    }
);


module.exports = router;
