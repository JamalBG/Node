const express = require('express');
require('./exo4/Auth');
const sequelize = require("./config/exo5/database");
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressFileUpload());
app.use(passport.initialize());

const routes = require('./exo4/routes');
const secureRoute = require('./exo4/secure-routes');

/* /////////////////////////////////////////////*/ 
const testRoute = require('./exo3/service/test');
const fileRoute = require('./exo3/service/File');

app.use('/test', testRoute);
app.use('/file', fileRoute);

app.use('/', routes);

// Protection avec JWT
app.use("/file", passport.authenticate('jwt', { session: false }), secureRoute);

/*/////////// Middleware de gestion des erreurs /////////*/
app.use((err, req, res, next) => {
  console.error(err); // 🔹 Pour debug
  res.status(err.status || 500).json({ error: err.message || "Erreur serveur" });
});
/*/////////////////////////////////////////////////////*/

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port} et est donc started`);
});
