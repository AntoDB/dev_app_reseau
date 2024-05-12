/* ==================== Web server ==================== */
const express = require('express');
const app = express();
const path = require('path');

const middleware = require('./middleware'); // Importer les middleware depuis le fichier middleware.js

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

// Utilisation des middleware multilinguisme & session
app.use(middleware.multilingual);
app.use(middleware.session);

// Importation des routes
const websiteRoutes = require('./routes/websiteRoutes'); // Importer les routes de la partie public du site web depuis le fichier websiteRoutes.js
const adminRoutes = require('./routes/adminRoutes'); // Importer les routes de la partie admin du site web depuis le fichier adminRoutes.js
const restApiRoutes_vehicle_positions_stib = require('./routes/restApiRoutes_vehicle_positions_stib'); // Importer les routes de la REST API pour la collection "vehicle_positions_stib" depuis le fichier restApiRoutes_vehicle_positions_stib.js
const restApiRoutes_waiting_time_stib = require('./routes/restApiRoutes_waiting_time_stib'); // Importer les routes de la REST API pour la collection "waiting_time_stib" depuis le fichier restApiRoutes_waiting_time_stib.js

// Importation de bodyParser depuis 'body-parser' - pour la partie admin (login)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Utilisation des routes
app.use('/', websiteRoutes); // Utiliser les routes website public pour les URL racines
app.use('/:lang/admin', adminRoutes); // Utiliser les routes admin pour les URL commençant par /:lang/admin
app.use('/api/vehicle_positions_stib/', restApiRoutes_vehicle_positions_stib); // Utiliser les routes website pour les URL racines [API]
app.use('/api/waiting_time_stib/', restApiRoutes_waiting_time_stib); // Utiliser les routes website pour les URL racines [API]

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});




