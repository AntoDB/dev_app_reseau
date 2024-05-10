/* This script is for the admin option on the dashboard */


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
