







// Fonction pour afficher les éléments du panier
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return; // S'assurer que l'élément existe avant de continuer
    
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    let htmlContent = "";
    let subtotal = 0;
  
    if (panier.length > 0) {
        panier.forEach(item => {
            htmlContent += `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.titre}</h5>
                    <p class="card-text">${item.description}</p>
                    <img src="${item.image}" alt="${item.titre}" style="width: 100px; height: auto;">
                    <p class="card-text">Prix: ${item.cout} CA$</p>
                    <button class="btn btn-danger remove-course" data-course-id="${item.id}">Retirer du panier</button>
                </div>
            </div>`;
            subtotal += item.cout;
        });
    } else {
        htmlContent = "<p>Votre panier est vide.</p>";
    }
  
    cartItemsContainer.innerHTML = htmlContent;
    document.getElementById("subtotal").textContent = `${subtotal} CA$`;
    updateCartCounter();
}

// Fonction pour mettre à jour le compteur de panier
function updateCartCounter() {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const cartCounterElement = document.getElementById('cart-counter');
    if (cartCounterElement) {
        cartCounterElement.textContent = panier.length;
    }
}

// Fonction pour supprimer un cours du panier
function removeFromCart(courseId) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier = panier.filter(item => item.id !== courseId);
    localStorage.setItem('panier', JSON.stringify(panier));
    displayCartItems(); // Rafraîchir l'affichage des articles dans le panier
    updateCartCounter(); // Mise à jour du compteur du panier
}

// Écouteur d'événements pour la suppression des cours du panier
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-course')) {
        const courseId = event.target.getAttribute('data-course-id');
        removeFromCart(courseId);
    }
});

// Attendre que le DOM soit entièrement chargé
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems(); // Initialiser l'affichage des éléments du panier
});
