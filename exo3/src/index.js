const express = require('express');
require('./exo4/Auth')
const sequelize = require("./config/exo5/database");
const expressFileUpload = require('express-fileupload');
const app = express();
app.use(expressFileUpload());
const port = 3000;
app.use(express.json());

/*///////// Exo 4*/////////// 
const bodyParser = require('body-parser'); 
const passport = require('passport'); 
const routes = require('./exo4/routes');
const secureRoute = require('./exo4/secure-routes');
/* /////////////////////////////////////////////*/ 

const heyRoute = require('./exo3/service/Hey');
const { router: ajoutRouter } = require('./exo3/service/Ajout');
const calculeRoute = require('./exo3/service/Calcule');
const constanteRoute = require('./exo3/service/Constante');
const deleteRoute = require('./exo3/service/Delete');
const fileRoute = require('./exo3/service/File');


app.use('/Hey', heyRoute);
app.use('/Ajout', ajoutRouter);
app.use('/Calcule', calculeRoute);
app.use('/Constante', constanteRoute);
app.use('/Delete', deleteRoute);
app.use('/File', fileRoute);

/*/////////EXo 4 suite//////*/
const Admin = (req, res, next) => {
  console.log("Utilisateur authentifié :", req.user);
  if (!req.user) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }
  if (req.user.role === "admin") {
      return next();
  }
  return res.status(403).json({ message: "Accès refusé. Vous devez être administrateur." });
};

app.use (bodyParser.urlencoded({ extended: false}));

app.use('/', routes);

app.use("/Delete", passport.authenticate('jwt', { session: false }), Admin, secureRoute);
app.use("/File", passport.authenticate('jwt', { session: false }), Admin, secureRoute)

app.use (function (err, res, next) {
  res.status(err.status || 500);
  res.json({ error: err});
});
/*/////////////////////////////////////////////////////*/


app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port} et est donc started`);
});