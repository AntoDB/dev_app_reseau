
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

const { MongoClient, ObjectId } = require('mongodb');

/* ==================== [function] Insert data into DB ==================== */
// Insert tout ce qui lui est donné
async function insertDataIntoMongoDB(data) {
    const client = new MongoClient('mongodb://localhost:27017/'); // URI (serv + user + login) de connexion MongoDB -> https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/

    try {
        await client.connect();
        const database = client.db('dev_app'); // Nom de la DB
        const collection = database.collection('real_time_stib'); // Nom de la collection (table)

        // Si data est un tableau, insérer chaque élément individuellement [Quand insert directement de la source (STIB-MIVB ici)]
        if (Array.isArray(data)) {
            for (const item of data) {
                const { lineid, vehiclepositions } = item;
                const vehiclePositionsArray = JSON.parse(vehiclepositions);
                const dataArray = vehiclePositionsArray.map(position => ({ lineid, ...position }));
                await collection.insertMany(dataArray);
            }
        } else { // Si data est un objet unique, insérer cet objet directement [Quand passe par la REST API de l'app]
            await collection.insertMany([data]);
        }
        console.log('Données insérées avec succès dans MongoDB.');
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données dans MongoDB :', error);
        throw error;
    } finally {
        await client.close();
    }
}

/* ==================== [function] Fetch data from MongoDB ==================== */
// Récupère TOUTES les données
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

// Fonction pour récupérer une donnée par son ID depuis MongoDB
async function getDataByIdFromMongoDB(id) {
    const client = new MongoClient('mongodb://localhost:27017/');
    try {
        await client.connect();
        const database = client.db('dev_app');
        const collection = database.collection('real_time_stib');
        const data = await collection.findOne({ _id: new ObjectId(id) });
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données depuis MongoDB :', error);
        throw error;
    } finally {
        await client.close();
    }
}

/* ==================== [function] Update data in MongoDB ==================== */
// Mise à jour de LA valeur uniquement spécifié par l'ID
async function updateDataInMongoDB(id, newData) {
    const client = new MongoClient('mongodb://localhost:27017/');

    try {
        await client.connect();
        const database = client.db('dev_app'); // Nom de la DB
        const collection = database.collection('real_time_stib'); // Nom de la collection (table)

        await collection.updateOne(
            { _id: new ObjectId(id) }, // Critère de recherche pour l'élément à mettre à jour
            { $set: newData } // Nouvelles données à mettre à jour
        );

        console.log(`Données avec l'identifiant ${id} mises à jour avec succès.`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour des données dans MongoDB :', error);
        throw error;
    } finally {
        await client.close();
    }
}

/* ==================== [function] Delete data from MongoDB ==================== */
// Delete de LA valeur uniquement spécifié par l'ID
async function deleteDataFromMongoDB(id) {
    const client = new MongoClient('mongodb://localhost:27017/');

    try {
        await client.connect();
        const database = client.db('dev_app'); // Nom de la DB
        const collection = database.collection('real_time_stib'); // Nom de la collection (table)

        await collection.deleteOne({ _id: new ObjectId(id) });

        console.log(`Données avec l'identifiant ${id} supprimées avec succès.`);
    } catch (error) {
        console.error('Erreur lors de la suppression des données dans MongoDB :', error);
        throw error;
    } finally {
        await client.close();
    }
}

/* ==================== [function] Delete all data from MongoDB ==================== */
// Supprime TOUTES les données (drop)
async function clearDatabase() {
    const client = new MongoClient('mongodb://localhost:27017/');

    try {
        await client.connect();
        const database = client.db('dev_app'); // Nom de la DB
        const collection = database.collection('real_time_stib'); // Nom de la collection (table)

        // Supprimer tous les documents de la collection
        await collection.deleteMany({});
        
        console.log('La base de données MongoDB a été vidée avec succès.');
    } catch (error) {
        console.error('Erreur lors de la suppression des documents dans MongoDB :', error);
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
app.use('/js', express.static(__dirname + '/js'));

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
        clearDatabase() // Flush la DB avant de réinsérer
        const dataFromSTIB = await fetchDataFromSTIBAPI();
        await insertDataIntoMongoDB(dataFromSTIB); // Insère les données dans la DB
        
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

//import bodyParser from 'body-parser'
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Ajout des routes pour l'API REST
// Route pour récupérer toutes les données
app.get('/api/data', async (req, res) => {
    try {
        const dataFromMongoDB = await getDataFromMongoDB();
        res.json(dataFromMongoDB);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

// Route pour récupérer une donnée spécifique par son ID
app.get('/api/data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getDataByIdFromMongoDB(id);
        if (!data) {
            return res.status(404).json({ error: `Aucune donnée avec l'identifiant ${id} n'a été trouvée.` });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

// Route pour créer de nouvelles données
app.post('/api/data', async (req, res) => {
    try {
        const newData = req.body;
        await insertDataIntoMongoDB(newData);
        res.status(201).json({ message: 'Données créées avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

// Route pour mettre à jour des données existantes
app.put('/api/data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        await updateDataInMongoDB(id, newData);
        res.json({ message: `Données avec l'identifiant ${id} mises à jour avec succès.` });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

// Route pour supprimer des données existantes
app.delete('/api/data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await deleteDataFromMongoDB(id);
        res.json({ message: `Données avec l'identifiant ${id} supprimées avec succès.` });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`);
});




