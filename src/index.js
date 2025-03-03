const express = require('express');
require('./exo4/Auth'); // Assurez-vous que ce fichier initialise bien Passport
const sequelize = require("./config/exo5/database");
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressFileUpload());
app.use(passport.initialize()); // 🔹 Initialisation de Passport

/*///////// Exo 4 //////////*/ 
const routes = require('./exo4/routes');
const secureRoute = require('./exo4/secure-routes');

/* /////////////////////////////////////////////*/ 
const testRoute = require('./exo3/service/test');
const { router: ajoutRouter } = require('./exo3/service/Ajout');
const calculeRoute = require('./exo3/service/Calcul');
const constanteRoute = require('./exo3/service/Constante');
const deleteRoute = require('./exo3/service/Delete');
const fileRoute = require('./exo3/service/File');

app.use('/test', testRoute);
app.use('/ajout', ajoutRouter);
app.use('/calcule', calculeRoute);
app.use('/constante', constanteRoute);
app.use('/delete', deleteRoute);
app.use('/file', fileRoute);

/*///////// Middleware d'accès admin //////*/
const Admin = (req, res, next) => {
  console.log("Utilisateur authentifié :", req.user);
  
  if (!req.user) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }

  // Assurer que req.user ne contient pas de références circulaires
  if (typeof req.user.toJSON === "function") {
    req.user = req.user.toJSON();
  }

  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Accès refusé, vous devez être administrateur." });
};

app.use('/', routes);

// 🔹 Protection avec JWT
app.use("/delete", passport.authenticate('jwt', { session: false }), Admin, secureRoute);
app.use("/file", passport.authenticate('jwt', { session: false }), Admin, secureRoute);

/*/////////// Middleware de gestion des erreurs /////////*/
app.use((err, req, res, next) => {
  console.error(err); // 🔹 Pour debug
  res.status(err.status || 500).json({ error: err.message || "Erreur serveur" });
});

/*/////////////////////////////////////////////////////*/
app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port} et est donc started`);
});
