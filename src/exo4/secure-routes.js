const express = require("express");
const passport = require("passport");

const router = express.Router();

// Pour afficher un profil
router.get(
    "/profil",
    passport.authenticate("jwt", { session: false }), 
    (req, res) => {
        console.log("Utilisateur authentifié :", req.user);
        res.json({
            message: "Mettre infos utilisateurs ici",
        });
    }
);

module.exports = router;
