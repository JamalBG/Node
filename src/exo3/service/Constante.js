const express = require('express');
const router = express.Router();
const passport = require('passport');
router.use(passport.authenticate('jwt', { session: false }));

const constante = "Constante bien constante"

router.get('/', (req, res) => {
    res.json({ valeur: constante });
});

module.exports = router;