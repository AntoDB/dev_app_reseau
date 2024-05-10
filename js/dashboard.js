/* This script is for the admin option on the dashboard */

// Fonction pour récupérer les données par leur ID via la REST API
async function getDataByIdFromAPI(id) {
    try {
        const response = await fetch(`/api/data/${id}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Erreur lors de la récupération des données avec l'identifiant ${id}`);
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des données depuis l\'API :', error);
        throw error;
    }
}

// Fonction pour afficher le modal de modification de valeur via l'API REST
async function displayEditModal(index,id) {
    try {
        // Récupérer les données correspondant à l'ID via l'API REST
        const data = await getDataByIdFromAPI(id);
        // Mettre à jour les champs du modal avec les données récupérées
        document.getElementById('index').value = index;
        document.getElementById('edit_id').value = data._id;
        document.getElementById('edit_line').value = data.lineid;
        document.getElementById('edit_direction').value = data.directionId;
        document.getElementById('edit_distance').value = data.distanceFromPoint;
        document.getElementById('edit_point').value = data.pointId;
        // Afficher le modal
        $('#editDataModal').modal('show');
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'affichage du modal de modification de valeur :', error);
        // Gérer l'erreur
    }
}

// Fonction pour supprimer les données dans MongoDB
async function deleteThisDataLine(id) {
    try {
        const response = await fetch(`/api/data/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log(`Donnée avec l'identifiant ${id} supprimée avec succès.`);
            alert(`✅ Donnée avec l'identifiant ${id} supprimée avec succès.`); // Prévenir le client (de manière visible) que la donnée à bien été suprimée
            // Rafraîchir la page ou mettre à jour la vue si nécessaire
            window.location.reload(); // Cette ligne actualisera la page après la suppression
        } else {
            console.error(`Erreur lors de la suppression des données avec l'identifiant ${id}.`);
            alert(`❌ Erreur lors de la suppression des données avec l'identifiant ${id}.`); // Prévenir le client (de manière visible) que la donnée n'a pas su être suprimée
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de la suppression des données :', error);
        alert(`❌ Une erreur est survenue lors de la suppression des données :`, error); // Prévenir le client (de manière visible) que la donnée n'a pas su être suprimée
    }
}
