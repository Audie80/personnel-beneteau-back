const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const employeesRoutes = require('./express/routes/employees.routes');
const leavesRoutes = require('./express/routes/leaves.routes');

// create express app
const app = express();

//Définition du port de l'application. Par défaut : port 3000.
const port = process.env.PORT || 3000;

//Environnement de déploiement
const ENV = process.env.NODE_APP_INSTANCE || config.get("env");

// Database connection
if (ENV === 'production' || ENV === 'development') {
    var bddsql = require('./config/database.config');
    var message = 'Successfully connected to the database.';
} else if (ENV === 'test') {
    var bddsql = require('./config/databaseTest.config');
    var message = 'Successfully connected to the testdatabase.';
}
bddsql.BDDSQL.connect(function(err) {
  if (err) throw err;
  console.log(message);
});

// enable CORS (autorise requête multiorigines (Cross-Origin Request))
app.use(function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', 'http://localhost')
    res.header('Access-Control-Allow-Origin', 'https://app-68a07762-5ead-4cd7-b368-9f26ecac6c86.cleverapps.io');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Origin, Accept, Content-type');
    next();
});

// permet de poster des objets JSON
app.use(express.json())

// parse requests of content-type - application/json
app.use(bodyParser.json())

//Démarrage de l'API
employeesRoutes(app);
leavesRoutes(app);

//Démarrage du serveur
const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port} `);
});

module.exports = server;
