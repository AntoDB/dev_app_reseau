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

module.exports = { insertDataIntoMongoDB, getDataFromMongoDB, getDataByIdFromMongoDB, updateDataInMongoDB, deleteDataFromMongoDB, clearDatabase };
