const express = require('express');
const router = express.Router();
const passport = require('passport');
router.use(passport.authenticate('jwt', { session: false }));

router.get('/:num1/:operation/:num2', (req, res) => {
    const { num1, operation, num2 } = req.params;

  
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

   
    if (isNaN(number1) || isNaN(number2)) {
        return res.status(400).json({ error: "Les paramètres doivent être des nombres valides." });
    }

    let result;

   
    switch (operation.toLowerCase()) { 
        case 'addition':
            result = number1 + number2;
            break;
        case 'soustraction':
            result = number1 - number2;
            break;
        case 'multiplication':
            result = number1 * number2;
            break;
        case 'division':
            if (number2 === 0) {
                return res.status(400).json({ error: "Division par zéro impossible." });
            }
            result = number1 / number2;
            break;
        default:
            return res.status(400).json({ error: "Opération non valide. Utilisez 'addition', 'soustraction', 'multiplication' ou 'division'." });
    }

   
    res.json({ num1: number1, operation, num2: number2, resultat: result });
});

module.exports = router;
