const express = require('express');
const router = express.Router();
const passport = require('passport');
router.use(passport.authenticate('jwt', { session: false }));

const sharedData = { value: "teste" };

router.get('/:paramettre/', (req, res) => {
    const { paramettre } = req.params;

    let result 
    result= sharedData+" "+paramettre
    res.json({ Concatènation: result });
});

module.exports = { router, sharedData };
