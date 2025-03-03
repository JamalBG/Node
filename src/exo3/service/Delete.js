const express = require('express');
const router = express.Router();

const { sharedData } = require('./Ajout'); 
router.get('/', (req, res) => {
    sharedData.value = ''; 
    res.json({ message: "Valeur supprimée", nouvelleValeur: data.valeur });
});

module.exports = router;
