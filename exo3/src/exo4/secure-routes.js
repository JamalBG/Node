const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
    "/profil",
    passport.authenticate("jwt", { session: false }), 
    (req, res) => {
        console.log("Utilisateur authentifié :", req.user);
        res.json({
            message: "You made it to the secure route",
        });
    }
);

module.exports = router;
