const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post(
    "/signup",
    passport.authenticate("signup", { session: false }),
    async (req, res) => {
        if (!req.user) {
            return res.status(500).json({ message: "Signup failed" });
        }

        return res.json({
            message: "Signup successful",
            user: req.user
        });
    }
);

router.post(
    "/login",
    (req, res, next) => {
        passport.authenticate("login", (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error", error: err.message });
            }
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(user, "TOP_SECRET", { expiresIn: "1h" });

            return res.json({ message: "Login successful", token });
        })(req, res, next);
    }
);

module.exports = router;