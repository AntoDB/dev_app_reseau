
/* ==================== [function] Fetch data ==================== */
const axios = require('axios');

async function fetchDataFromSTIBAPI() {
    try {
        const response = await axios.get('https://stibmivb.opendatasoft.com/api/explore/v2.1/catalog/datasets/vehicle-position-rt-production/records?limit=-1&lang=fr', {
            headers: {
                'Authorization': 'Apikey 8351f946e8d149daf4ed2778963c30b4b9706c7944a1a9118bb023aa'
            }
        });
        console.log('Données récupérées depuis l\'API STIB :', response.data);
        return response.data.results; // Les données de la réponse de l'API
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis l\'API STIB :', error);
        throw error;
    }
}


/* ==================== [function] Insert data into DB ==================== */
const { MongoClient } = require('mongodb');

async function insertDataIntoMongoDB(data) {
    const client = new MongoClient('mongodb://localhost:27017/'); // URI (serv + user + login) de connexion MongoDB -> https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/

    try {
        await client.connect();
        const database = client.db('dev_app'); // Nom de la DB
        const collection = database.collection('real_time_stib'); // Nom de la collection (table)

        // Vérifier si data est un tableau, sinon le convertir en un tableau contenant un seul élément
        const dataArray = Array.isArray(data) ? data : [data];

        await collection.insertMany(dataArray); // Insertion des données dans la collection MongoDB
        console.log('Données insérées avec succès dans MongoDB.');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données dans MongoDB :', error);
        throw error;
    } finally {
        await client.close();
    }
}

/* ==================== [function] Fetch data from MongoDB ==================== */
async function getDataFromMongoDB() {
    const client = new MongoClient('mongodb://localhost:27017/');

    try {
        await client.connect();
        
        const database = client.db('dev_app'); // Nom de la DB
        const collection = database.collection('real_time_stib'); // Nom de la collection (table)

        // Récupérer toutes les données de la collection
        const data = await collection.find({}).toArray();

        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis MongoDB :', error);
        throw error;
    } finally {
        await client.close();
    }
}

/* ==================== Web server ==================== */  
const express = require('express');
const app = express();
const path = require('path');

// Configuration du moteur de modèle EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use('/css', express.static(__dirname + '/css'));

// Middleware pour le multilinguisme
app.use((req, res, next) => {
    const lang = req.url.split('/')[1];
    if (lang === 'fr') {
        res.locals.lang = require('./locales/fr.json'); // Répertoire avec le fichier de traduction fr.json
    } else {
        res.locals.lang = require('./locales/en.json'); // Répertoire avec le fichier de traduction en.json
    }
    next();
});

// Routes
app.get('/', (req, res) => {
    try {
        res.render('index', { lang: res.locals.lang });
    } catch (error) {
        res.status(500).send('Une erreur est survenue.');
        console.error('Erreur :', error);
        throw error;
    }
});

app.get('/:lang', (req, res) => {
    try {
        res.render('index', { lang: res.locals.lang });
    } catch (error) {
        res.status(500).send('Une erreur est survenue.');
        console.error('Erreur :', error);
        throw error;
    }
});

app.get('/:lang/vehicle_positions', async (req, res) => {
    try {
        //const lang = req.params.lang; // Récupérer la langue à partir de req.params.lang
        const dataFromSTIB = await fetchDataFromSTIBAPI();
        await insertDataIntoMongoDB(dataFromSTIB);
        
        // Récupérer les données de MongoDB
        const dataFromMongoDB = await getDataFromMongoDB();

        res.render('vehicle_positions', {
            lang: res.locals.lang, // Transmettre la langue au template EJS
            mongoData: dataFromMongoDB // Transmettre les données au template EJS
        });
    } catch (error) {
        res.status(500).send('Une erreur est survenue.');
        console.error('Erreur :', error);
        throw error;
    }
});

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});




