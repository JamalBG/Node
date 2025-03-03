const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post('/', (req, res) => {
    if (!req.files || !req.files.fichier) {
        return res.status(400).json({ error: "Aucun fichier envoyé" });
    }

    const fichier = req.files.fichier;
    const uploadPath = path.join(__dirname, './fichier', fichier.name);

    fichier.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors du téléchargement", details: err });
        }

        res.json({
            message: "Fichier uploadé avec succès",
            fichier: fichier.name,
            path: uploadPath
        });
    });
});

module.exports = router;
