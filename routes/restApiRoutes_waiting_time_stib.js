const express = require('express');
const router = express.Router();

// Importe les modules sur mesure
const { insertDataIntoMongoDB, getDataFromMongoDB, getDataByIdFromMongoDB, updateDataInMongoDB, deleteDataFromMongoDB, clearDatabase } = require('../modules/mongoDB_CRUD');

/* ----- Routes API ----- */
// Ajout des routes pour l'API REST
// Route pour récupérer toutes les données
router.get('/', async (req, res) => {
    try {
        const dataFromMongoDB = await getDataFromMongoDB('waiting_time_stib');
        res.json(dataFromMongoDB);
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

// Route pour récupérer une donnée spécifique par son ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getDataByIdFromMongoDB('waiting_time_stib', id);
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
router.post('/', async (req, res) => {
    try {
        const newData = req.body;
        await insertDataIntoMongoDB('waiting_time_stib', newData);
        res.status(201).json({ message: 'Données créées avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

// Route pour mettre à jour des données existantes
router.put('/', async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        await updateDataInMongoDB('waiting_time_stib', id, newData);
        res.json({ message: `Données avec l'identifiant ${id} mises à jour avec succès.` });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

// Route pour supprimer des données existantes
router.delete('/', async (req, res) => {
    try {
        const id = req.params.id;
        await deleteDataFromMongoDB('waiting_time_stib', id);
        res.json({ message: `Données avec l'identifiant ${id} supprimées avec succès.` });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue.' });
        console.error('Erreur :', error);
    }
});

module.exports = router;
