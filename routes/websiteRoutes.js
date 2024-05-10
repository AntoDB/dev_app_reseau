const express = require('express');
const router = express.Router();

// Importe les modules sur mesure
const fetchDataFromSTIBAPI = require('../modules/fetchData');
const { insertDataIntoMongoDB, getDataFromMongoDB, getDataByIdFromMongoDB, updateDataInMongoDB, deleteDataFromMongoDB, clearDatabase } = require('../modules/mongoDB_CRUD');

/* ----- Routes WEBSITE ----- */
router.get('/', (req, res) => {
    try {
        res.render('index', { lang: res.locals.lang });
    } catch (error) {
        res.status(500).send('Une erreur est survenue.');
        console.error('Erreur :', error);
        throw error;
    }
});

router.get('/:lang', (req, res) => {
    try {
        res.render('index', { lang: res.locals.lang });
    } catch (error) {
        res.status(500).send('Une erreur est survenue.');
        console.error('Erreur :', error);
        throw error;
    }
});

router.get('/:lang/vehicle_positions', async (req, res) => {
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

module.exports = router;
