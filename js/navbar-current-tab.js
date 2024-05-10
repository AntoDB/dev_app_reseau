/* This script is for focus/hover the current open page */

document.addEventListener("DOMContentLoaded", function () {
    // Récupérer le titre de la division title_division
    const pageTitle = document.querySelector('.title_division h1').textContent.trim();
    
    // Définir quel class d'élément de la barre de navigation est à chercher
    var tab_name;
    if (pageTitle.toLowerCase() === "position des véhicules" || pageTitle.toLowerCase() === "vehicle positions") {tab_name = 'vehicle_positions';}
    else if (pageTitle.toLowerCase() === "tableau de bord" || pageTitle.toLowerCase() === "dashboard") {tab_name = 'dashboard';}
    else {tab_name = 'home';}

    // Rechercher l'élément correspondant dans la barre de navigation et lui ajouter la classe active
    const navItem = document.querySelector('.header li.'+tab_name+' a');
    navItem.classList.toggle("active");
});
