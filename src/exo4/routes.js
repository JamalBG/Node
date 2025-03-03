const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const sequelize = require("../config/exo5/database");

const users = []; // Pour stockage en mémoire des utilisateurs

const bannedUsersFile = path.join(__dirname, "bannedUsers.json");
const router = express.Router();

// Fonction pour lire la liste des utilisateurs bannis
const getBannedUsers = () => {
    if (!fs.existsSync(bannedUsersFile)) return [];
    return JSON.parse(fs.readFileSync(bannedUsersFile, "utf8"));
};

// Fonction pour sauvegarder la liste mise à jour
const saveBannedUsers = (bannedUsers) => {
    fs.writeFileSync(bannedUsersFile, JSON.stringify(bannedUsers, null, 2), "utf8");
};

router.post(
    "/register",
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

// Route pour supprimer un utilisateur
router.post(
    "/users/rm",
    passport.authenticate("jwt", { session: false }), // Authentification requise
    async (req, res) => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé. Seuls les administrateurs peuvent bannir." });
        }
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email demandé" });
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            await user.destroy(); // Supprime l'utilisateur

            return res.json({ message: "User supprimé " });
        } catch (error) {
            return res.status(500).json({ message: "Error de supprésion du user", error: error.message });
        }
    }
);

// Route pour bannir un utilisateur
router.post("/users/ban", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé. Seuls les administrateurs peuvent bannir." });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email requis." });
    }

    let bannedUsers = getBannedUsers();
    
    if (bannedUsers.includes(email)) {
        return res.status(400).json({ message: "Cet utilisateur est déjà banni." });
    }

    bannedUsers.push(email);
    saveBannedUsers(bannedUsers);

    return res.json({ message: `L'utilisateur ${email} a été banni avec succès.` });
});

// Route pour lister tout les utilisateur de la base de donnée
router.get("/users/list", passport.authenticate("jwt", { session: false }),  (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé. Seuls les administrateurs peuvent voir la liste." });
        }
        const [users] =  sequelize.query("SELECT id, email, role, created_at FROM users");

        return res.json({
            message: "Liste des utilisateurs",
            users
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: error.message });
    }
});

module.exports = router;