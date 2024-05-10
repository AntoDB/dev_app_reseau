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

module.exports = fetchDataFromSTIBAPI;
