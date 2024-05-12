/* This script is for the admin option on the dashboard */
let current_edit_id;

// Fonction pour récupérer les données par leur ID via la REST API
async function getDataByIdFromAPI(id) {
    try {
        const response = await fetch(`/api/vehicle_positions_stib/${id}`);
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

// Fonction pour insérer une nouvelle donnée via l'API REST
async function insertNewData() {
    try {
        // Récupérer les valeurs depuis les champs du modal
        const line = document.getElementById('edit_line').value;
        const direction = document.getElementById('edit_direction').value;
        const distance = document.getElementById('edit_distance').value;
        const point = document.getElementById('edit_point').value;

        // Créer un objet contenant les valeurs pour la nouvelle donnée
        const newData = {
            lineid: line,
            directionId: direction,
            distanceFromPoint: distance,
            pointId: point
        };

        // Envoyer les nouvelles données via l'API REST
        const response = await fetch(`/api/vehicle_positions_stib`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });

        if (response.ok) {
            console.log(`Nouvelle donnée insérée avec succès.`);
            alert(`✅ Nouvelle donnée insérée avec succès.`);
            // Rafraîchir la page ou mettre à jour la vue si nécessaire
            window.location.reload(); // Cette ligne actualisera la page après l'insertion
        } else {
            throw new Error(`Erreur lors de l'insertion de la nouvelle donnée.`);
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'insertion de la nouvelle donnée :', error);
        alert(`❌ Une erreur est survenue lors de l'insertion de la nouvelle donnée :`, error);
        // Gérer l'erreur
    }
}

// Fonction pour sauvegarder les modifications des données via l'API REST
//async function saveChanges(id) {
async function saveChanges() {
    let id = current_edit_id;
    try {
        // Récupérer les nouvelles valeurs depuis les champs du modal
        const line = document.getElementById('edit_line').value;
        const direction = document.getElementById('edit_direction').value;
        const distance = document.getElementById('edit_distance').value;
        const point = document.getElementById('edit_point').value;

        // Créer un objet contenant les nouvelles valeurs
        const newData = {
            lineid: line,
            directionId: direction,
            distanceFromPoint: distance,
            pointId: point
        };

        // Envoyer les modifications via l'API REST
        const response = await fetch(`/api/vehicle_positions_stib/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });

        if (response.ok) {
            console.log(`Modifications des données avec l'identifiant ${id} sauvegardées avec succès.`);
            alert(`✅ Modifications des données avec l'identifiant ${id} sauvegardées avec succès.`);
            // Rafraîchir la page ou mettre à jour la vue si nécessaire
            window.location.reload(); // Cette ligne actualisera la page après la modification
        } else {
            throw new Error(`Erreur lors de la sauvegarde des modifications des données avec l'identifiant ${id}.`);
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de la sauvegarde des modifications des données :', error);
        alert(`❌ Une erreur est survenue lors de la sauvegarde des modifications des données :`, error);
        // Gérer l'erreur
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
        //document.getElementById('save_change_btn').addEventListener('click', function() { saveChanges(data._id); });
        current_edit_id = data._id;

        document.getElementById('save_change_btn').style.display = "block";

        // Afficher le modal
        $('#editDataModal').modal('show');
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'affichage du modal de modification de valeur :', error);
        // Gérer l'erreur
    }
}

// Fonction pour supprimer les données dans MongoDB
async function deleteThisDataLine(id, alert_flag = true) {
    try {
        const response = await fetch(`/api/vehicle_positions_stib/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log(`Donnée avec l'identifiant ${id} supprimée avec succès.`);
            if (alert_flag) {
                alert(`✅ Donnée avec l'identifiant ${id} supprimée avec succès.`); // Prévenir le client (de manière visible) que la donnée à bien été suprimée
            }
            // Rafraîchir la page ou mettre à jour la vue si nécessaire
            window.location.reload(); // Cette ligne actualisera la page après la suppression
        } else {
            console.error(`Erreur lors de la suppression des données avec l'identifiant ${id}.`);
            if (alert_flag) {
                alert(`❌ Erreur lors de la suppression des données avec l'identifiant ${id}.`); // Prévenir le client (de manière visible) que la donnée n'a pas su être suprimée
            }
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de la suppression des données :', error);
        if (alert_flag) {
            alert(`❌ Une erreur est survenue lors de la suppression des données :`, error); // Prévenir le client (de manière visible) que la donnée n'a pas su être suprimée
        }
    }
}

/* ==================== General buttons ==================== */
/* ----- [function] Insert new data/row from MongoDB ----- */
// Fonction pour afficher le modal de modification de valeur pour insérer de nouvelle (récupération du modal)
async function displayInsertModal(edit_id_value) {
    try {
        // Mettre à jour les champs du modal par défaut
        document.getElementById('index').value = "#";
        document.getElementById('edit_id').value = edit_id_value;

        document.getElementById('save_change_btn').style.display = "none";

        // Afficher le modal
        $('#editDataModal').modal('show');
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'affichage du modal de modification de valeur :', error);
        // Gérer l'erreur
    }
}

/* ----- [function] Delete all data from MongoDB ----- */
// Fonction pour supprimer toutes les données avec confirmation
async function deleteAllData() {
    // Afficher une alerte de confirmation
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer toutes les données ?");
    
    // Vérifier si l'utilisateur a confirmé la suppression
    if (confirmation) {
        // Si l'utilisateur a confirmé, envoyer une demande de suppression à l'API REST
        /*fetch('/api/vehicle_positions_stib', {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log('Toutes les données ont été supprimées avec succès.');
                alert('✅ Toutes les données ont été supprimées avec succès.');
                // Rafraîchir la page ou mettre à jour la vue si nécessaire
                window.location.reload(); // Actualiser la page après la suppression
            } else {
                throw new Error('Erreur lors de la suppression de toutes les données.');
            }
        })
        .catch(error => {
            console.error('Une erreur est survenue lors de la suppression de toutes les données :', error);
            alert('❌ Une erreur est survenue lors de la suppression de toutes les données :', error);
            // Gérer l'erreur
        });*/

        try {
            // Effectuer une requête GET pour obtenir toutes les données
            const response = await fetch('/api/vehicle_positions_stib');
            const data = await response.json();

            // Parcourir les données et supprimer chaque élément
            for (const item of data) {
                deleteThisDataLine(item._id, false); // Supposons que deleteThisDataLine accepte l'ID de l'élément à supprimer
            }

            // Actualiser la page ou effectuer d'autres actions après la suppression réussie
            location.reload(); // Recharger la page après la suppression
        } catch (error) {
            console.error('Erreur lors de la suppression des données :', error);
        }
        
    }
}
