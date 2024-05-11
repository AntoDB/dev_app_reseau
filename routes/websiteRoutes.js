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
        clearDatabase('vehicle_positions_stib') // Flush la DB avant de réinsérer
        const dataFromSTIB = await fetchDataFromSTIBAPI('https://stibmivb.opendatasoft.com/api/explore/v2.1/catalog/datasets/vehicle-position-rt-production/records?limit=-1&lang=fr');
        await insertDataIntoMongoDB('vehicle_positions_stib', dataFromSTIB); // Insère les données dans la DB
        
        // Récupérer les données de MongoDB
        const dataFromMongoDB = await getDataFromMongoDB('vehicle_positions_stib');

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

router.get('/:lang/waiting_time', async (req, res) => {
    try {
        clearDatabase('waiting_time_stib') // Flush la DB avant de réinsérer
        const dataFromSTIB = await fetchDataFromSTIBAPI('https://stibmivb.opendatasoft.com/api/explore/v2.1/catalog/datasets/waiting-time-rt-production/records?limit=-1&lang=fr');
        await insertDataIntoMongoDB('waiting_time_stib', dataFromSTIB); // Insère les données dans la DB
        
        // Récupérer les données de MongoDB
        const dataFromMongoDB = await getDataFromMongoDB('waiting_time_stib');
        console.log(dataFromMongoDB);

        res.render('waiting_time', {
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
