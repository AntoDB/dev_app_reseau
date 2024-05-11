const express = require('express');
const router = express.Router();

// Importe les modules sur mesure
const fetchDataFromSTIBAPI = require('../modules/fetchData');
const { insertDataIntoMongoDB, getDataFromMongoDB, getDataByIdFromMongoDB, updateDataInMongoDB, deleteDataFromMongoDB, clearDatabase } = require('../modules/mongoDB_CRUD');

/* ----- Routes ADMIN Dashboard ----- */
// Route pour afficher la page de connexion [index.ejs]
router.get('/', (req, res) => {
    res.render('admin/index', { lang: res.locals.lang, invalidPassword: false });
});

// Route pour gérer la soumission du formulaire de connexion
router.post('/login', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body; // Prend les arguments "name" du form
    // Si les informations d'identification sont correctes, définissez une session pour l'utilisateur
    if (username === "AntoDB" & password === "Hello") {
        req.session.loggedIn = true;

        let locales = res.locals.lang;
        res.redirect('/' + locales.lang +'/admin/vehicle_positions'); // Redirigez vers la page de tableau de bord après la connexion réussie
    }
    else {
        res.render('admin', { invalidPassword: true }); // Renvoyer à la page de connexion avec une indication que le mot de passe est incorrect
    }
});

// Middleware pour vérifier l'état de connexion de l'utilisateur sur les autres routes du dossier admin
router.use('/*', (req, res, next) => {
    if (req.session.loggedIn) {
        next(); // Laissez l'utilisateur accéder à la page s'il est connecté
    } else {
        let locales = res.locals.lang;
        res.redirect('/' + locales.lang +'/admin'); // Redirigez vers la page de connexion s'il n'est pas connecté
    }
});

// Route pour afficher le tableau de bord après la connexion réussie
/*app.get('/admin/dashboard', (req, res) => {
    res.render('admin/dashboard');
});*/

router.get('/vehicle_positions', async (req, res) => {
    try {
        /*clearDatabase() // Flush la DB avant de réinsérer
        const dataFromSTIB = await fetchDataFromSTIBAPI('https://stibmivb.opendatasoft.com/api/explore/v2.1/catalog/datasets/vehicle-position-rt-production/records?limit=-1&lang=fr');
        await insertDataIntoMongoDB(dataFromSTIB); // Insère les données dans la DB*/
        
        // Récupérer les données de MongoDB
        const dataFromMongoDB = await getDataFromMongoDB();

        res.render('admin/vehicle_positions', {
            lang: res.locals.lang, // Transmettre la langue au template EJS
            mongoData: dataFromMongoDB // Transmettre les données au template EJS
        });
    } catch (error) {
        res.status(500).send('Une erreur est survenue.');
        console.error('Erreur :', error);
        throw error;
    }
});

module.exports = router;
