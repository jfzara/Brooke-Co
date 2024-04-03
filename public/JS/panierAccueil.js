document.addEventListener('DOMContentLoaded', () => {
       
	displayCartItems();
	updateCartCounter();
	updateSubtotal();
});

// le bouton de suppression d'un cours
document.addEventListener('click', function(e) {
	if (e.target && e.target.classList.contains('remove-course')) {
		const courseId = e.target.getAttribute('data-course-id');
		removeFromCart(courseId);
	}
});

// Affichage des éléments du panier
function displayCartItems() {
	const cartItemsContainer = document.getElementById('cart-items-container');
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	cartItemsContainer.innerHTML = cart.length > 0 ? cart.map(course => courseHTML(course)).join('') : "<p>Votre panier est vide.</p>";
	updateSubtotal(); // Mise à jour du sous-total après modification du contenu du panier
}

// Suppression d'un élément du panier
function removeFromCart(courseId) {
	let cart = JSON.parse(localStorage.getItem('cart')) || [];
	const filteredCart = cart.filter(course => course.id !== courseId);
	localStorage.setItem('cart', JSON.stringify(filteredCart));
	displayCartItems(); 
	updateCartCounter(); 
}

// Mise à jour du compteur de panier
function updateCartCounter() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	const cartCounterElement = document.getElementById('cart-counter');
	if (cartCounterElement) {
		cartCounterElement.textContent = cart.length; // Ajustement pour s'assurer de la présence de l'élément
	}
}

// Calcul et affichage du sous-total du panier
function updateSubtotal() {
	const cart = JSON.parse(localStorage.getItem('cart')) || [];
	let subtotal = cart.reduce((acc, item) => acc + parseFloat(item.price), 0);
	const subtotalElement = document.getElementById('subtotal');
	if (subtotalElement) {
		subtotalElement.textContent = `${subtotal.toFixed(2)} CA$`; // Formatage du sous-total
	}
}

// HTML pour un élément du panier
function courseHTML(course) {
	return `
	<div class="card mb-3">
		<div class="card-body d-flex justify-content-between align-items-center">
			<img src="${course.image}" alt="${course.title}" class="img-fluid" style="width: 120px; height: auto;">
			<div>
				<h5>${course.title}</h5>
				<p>${course.price} CA$</p>
				<button class="remove-course btn btn-danger" data-course-id="${course.id}">Retirer</button>
			</div>
		</div>
	</div>`;
}