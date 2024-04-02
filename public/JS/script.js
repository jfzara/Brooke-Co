document.addEventListener("DOMContentLoaded", function() {
    const paymentMethodSelect = document.getElementById('method');
    const paypalContainer = document.getElementById('paypal-container');
  
    paymentMethodSelect.addEventListener('change', function() {
      if (this.value === 'paypal') {
        paypalContainer.style.display = 'block';
      } else {
        paypalContainer.style.display = 'none';
      }
    });
  });

// JavaScript pour initialiser la carte Google Maps
function initMap() {
  // Coordonnées du lieu à afficher sur la carte (exemple)
  var location = { lat: 48.8566, lng: 2.3522 };

  // Options de la carte
  var mapOptions = {
      center: location, // Centre de la carte
      zoom: 10 // Niveau de zoom initial
  };

  // Création de la carte
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // Création du marqueur pour marquer le lieu sur la carte (exemple)
  var marker = new google.maps.Marker({
      position: location, // Position du marqueur
      map: map, // La carte à laquelle attacher le marqueur
      title: "Lieu de contact" // Titre du marqueur
  });
}


   // Fonction pour ajouter un élément à la liste des achats
   function ajouterAchat(nomProduit, prixProduit) {
    var listeAchats = document.getElementById("items-list");
    var nouvelElement = document.createElement("li");
    nouvelElement.textContent = nomProduit + " - $" + prixProduit;
    listeAchats.appendChild(nouvelElement);
}

// Simulation de l'achat de cours
function acheterCours() {
    // Ajouter des éléments à la liste des achats
    ajouterAchat("Cours Mysql", 60.00);
    ajouterAchat("Cours Javascript", 75.00);
    ajouterAchat("Cours Python", 80.00);

    // Afficher la liste des achats
    document.getElementById("purchase-list").classList.remove("hidden");
}

// Appel de la fonction pour acheter les cours
acheterCours();

