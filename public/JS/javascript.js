
	
	// Déclaration de la variable url
var url = 'coursJS.json';




// Fonction pour récupérer les données JSON
async function recupererDonneesJSON() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur de récupération des données.');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
}

async function recupererEtAfficherCours(selectedMonth) {
    try {
        const data = await recupererDonneesJSON();

        let coursPourMoisSelectionne;
        // Recherche du mois sélectionné dans les cours asynchrones
        if (data[0].coursAsynchrones) {
            coursPourMoisSelectionne = data[0].coursAsynchrones.find(mois => mois.mois.toLowerCase() === selectedMonth.toLowerCase());
        }
        // Si le mois n'est pas trouvé dans les cours asynchrones, rechercher dans les cours synchrones
        if (!coursPourMoisSelectionne && data[0].coursSynchrones) {
            coursPourMoisSelectionne = data[0].coursSynchrones.find(mois => mois.mois.toLowerCase() === selectedMonth.toLowerCase());
        }

        if (!coursPourMoisSelectionne) {
            console.error('Aucun cours disponible pour le mois sélectionné.');
            return;
        }

        // Vider le conteneur avant d'ajouter de nouvelles vignettes
        document.getElementById('container').innerHTML = '';

        // Générer les vignettes des cours pour le mois sélectionné
        coursPourMoisSelectionne.cours.forEach(cours => {
            const vignetteCours = creerVignetteCoursAsynchrone(cours);
            // Ajouter la vignette au conteneur approprié (par exemple, div#container)
            document.getElementById('container').appendChild(vignetteCours);

            // Ajouter un gestionnaire d'événements au clic sur "En savoir plus"
            vignetteCours.querySelector('.savoir_plus').addEventListener('click', function () {
                createOrResetModal(cours);
            });
        });
    } catch (error) {
        console.error('Erreur lors du traitement des données:', error);
    }
}


function createOrResetModal(cours) {
    var modal = document.querySelector('.modal');
    var modalContent = modal.querySelector('.modal-content');

    // Effacement du contenu précédent du modal
    modalContent.innerHTML = '';

    // Ajout du titre du cours dans le modal
    var titreCours = document.createElement('h2');
    titreCours.classList.add('titre_cours');
    titreCours.textContent = cours.titre;
    titreCours.style.fontWeight = 'bold';

    // Ajout de la description du cours dans le modal
    var descriptionCours = document.createElement('p');
    descriptionCours.classList.add('description_cours');
    descriptionCours.textContent = cours.description;

    // Ajout des éléments au contenu du modal
    modalContent.appendChild(titreCours);
    modalContent.appendChild(descriptionCours);

    // Calcul du nombre de sous-cours et leur durée respective
    var totalHours = cours.nombreHeures;
    var numberOfSubcourses = Math.floor(Math.random() * (6 - 3 + 1)) + 3; // Génère un nombre aléatoire entre 3 et 6
    var subcourseDurations = [];
    var remainingHours = totalHours;

    for (var i = 0; i < numberOfSubcourses - 1; i++) {
        var maxDuration = remainingHours - (numberOfSubcourses - i - 1) * 2; // Durée maximale compte tenu du nombre restant de sous-cours et du minimum de 2 heures par cours
        var randomDuration = Math.floor(Math.random() * (maxDuration - 2 + 1)) + 2; // Durée aléatoire entre 2 et la durée maximale
        subcourseDurations.push(randomDuration);
        remainingHours -= randomDuration;
    }
    subcourseDurations.push(remainingHours);

    // Création et ajout des divs pour chaque sous-cours
    for (var j = 0; j < numberOfSubcourses; j++) {
        var subcourseDiv = document.createElement('div');
        subcourseDiv.textContent = 'Cours ' + (j + 1) + ': ' + subcourseDurations[j] + 'h';
        modalContent.appendChild(subcourseDiv);
    }

    // Bouton "Ajouter au panier"
    var addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Ajouter au panier';
    addToCartButton.classList.add('add-to-cart');
    addToCartButton.addEventListener('click', function () {
        addToCart(cours, addToCartButton, panierMessage); // Passez la référence du message de panier
    });
    modalContent.appendChild(addToCartButton);

    // Message du panier (initialisé mais caché)
    var panierMessage = document.createElement('div');
    panierMessage.classList.add('panier-message');

    // Création d'un élément strong pour mettre en gras le titre du cours
    var strongElement = document.createElement('strong');
    strongElement.textContent = cours.titre; // Contenu est le titre du cours
    panierMessage.appendChild(document.createTextNode('Le cours "'));
    panierMessage.appendChild(strongElement);
    panierMessage.appendChild(document.createTextNode('" a été ajouté au panier!'));

    modalContent.appendChild(panierMessage);
    panierMessage.style.display = 'none';

    // Ajout du bouton de fermeture du modal
    var closeButton = document.createElement('div');
    closeButton.classList.add('close');
    closeButton.textContent = 'X';
    modalContent.appendChild(closeButton);

    // Gestionnaire d'événements pour le bouton de fermeture du modal
    closeButton.addEventListener('click', function () {
        modal.style.display = 'none'; // Masquer le modal lorsque l'utilisateur clique sur le bouton de fermeture
    });

    // Affichage du modal
    modal.style.display = 'block';
}

// Fonction pour ajouter un cours au panier
function addToCart(cours, addToCartButton, panierMessage) {
    // Vérifier si le cours a déjà été acheté
    if (isCourseAlreadyInCart(cours.titre)) {
        // Afficher un message indiquant que le cours a déjà été acheté
        displayAlreadyPurchasedMessage(addToCartButton);
    } else {
        // Ajouter le cours au panier 
        console.log('Cours ajouté au panier:', cours.titre);
        // Animation lors du clic
        addToCartButton.classList.add('blink');
        setTimeout(function () {
            addToCartButton.classList.remove('blink');
        }, 500); // Supprime la classe d'animation après 500 ms

        // Affichage du message de panier et positionnement sous le bouton "Ajouter au panier"
        panierMessage.style.display = 'block'; // Affiche le message de panier
        addToCartButton.parentNode.insertBefore(panierMessage, addToCartButton.nextSibling);

        // Disparition du message après quelques secondes
        setTimeout(function () {
            panierMessage.style.display = 'none'; // Masquer le message de panier après 3 secondes
        }, 3000);

        // Ajouter le cours au Local Storage
        addToCartLocalStorage(cours.titre);
    }
}

// Fonction pour vérifier si le cours est déjà dans le panier
function isCourseAlreadyInCart(courseName) {
    const cartItems = localStorage.getItem('coursAchetes');
    if (cartItems) {
        const cart = JSON.parse(cartItems);
        return cart.hasOwnProperty(courseName);
    }
    return false;
}

// Fonction pour afficher le message indiquant que le cours a déjà été acheté
function displayAlreadyPurchasedMessage(addToCartButton) {
    const alreadyPurchasedMessage = document.createElement('div');
    alreadyPurchasedMessage.textContent = 'Vous avez déjà acheté ce cours';
    alreadyPurchasedMessage.classList.add('already-purchased-message');
    addToCartButton.parentNode.insertBefore(alreadyPurchasedMessage, addToCartButton.nextSibling);
    setTimeout(function () {
        alreadyPurchasedMessage.remove(); // Supprime le message après quelques secondes
    }, 3000);
}

// Fonction pour ajouter un article au panier dans le Local Storage
function addToCartLocalStorage(courseName) {
    // Vérifier si le panier existe déjà dans le Local Storage
    let cartItems = localStorage.getItem('coursAchetes');
    cartItems = cartItems ? JSON.parse(cartItems) : {};

    // Vérifier si l'article est déjà dans le panier
    if (cartItems[courseName]) {
        // Si l'article existe, incrémenter sa quantité
        cartItems[courseName]++;
    } else {
        // Sinon, ajouter l'article au panier avec une quantité de 1
        cartItems[courseName] = 1;
    }

    // Mettre à jour le Local Storage avec les articles ajoutés
    localStorage.setItem('coursAchetes', JSON.stringify(cartItems));

    // Mettre à jour le nombre d'articles affiché dans la div du panier
    updateCartItemCount();
}

// Fonction pour mettre à jour le nombre d'articles affiché dans la div du panier
function updateCartItemCount() {
    // Récupérer le nombre d'articles depuis le Local Storage
    const cartItems = localStorage.getItem('coursAchetes');
    const itemCount = cartItems ? Object.values(JSON.parse(cartItems)).reduce((acc, val) => acc + val, 0) : 0;

    // Mettre à jour le contenu de la div count du panier avec le nombre d'articles
    document.getElementById('cartItemCount').innerText = itemCount;
}


// Fonction pour récupérer l'URL de l'image du cours
function getImageUrl(cours) {
    return cours.image; // Retourne simplement l'URL de l'image du cours
}

function creerVignetteCoursAsynchrone(cours) {
    // Création de l'élément <article> représentant la vignette du cours
    var article = document.createElement('article');
    article.classList.add('vignette_asynchrone');

    // Création de l'élément <div> pour la photo de fond
    var fondPhoto = document.createElement('div');
    fondPhoto.classList.add('fond_photo');

    // Création de l'élément <img> pour afficher l'image du cours
    var image = document.createElement('img');
    image.src = getImageUrl(cours); // Utilisation de la fonction pour récupérer l'URL de l'image
    image.alt = cours.titre; // Ajout d'un attribut alt avec le titre du cours

    // Ajout de l'élément <img> à la div fondPhoto
    fondPhoto.appendChild(image);

    // Création de l'élément <div> pour l'icône "Play"
    var photoPlay = document.createElement('div');
    photoPlay.classList.add('photo_play');
    // Ajout de l'icône "Play" au div photoPlay
    photoPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                <path d="M8 5v14l11-7z" />
                <path d="M0 0h24v24H0z" fill="none" />
            </svg>
        `;
    fondPhoto.appendChild(photoPlay);

    // Ajout du div fondPhoto à l'article
    article.appendChild(fondPhoto);

    // Création de l'élément <div> pour les informations du cours
    var infosCours = document.createElement('div');
    infosCours.classList.add('infos_cours');

    // Ajout du titre du cours
    var nomCours = document.createElement('p');
    nomCours.classList.add('nom_cours');
    nomCours.textContent = cours.titre;
    infosCours.appendChild(nomCours);

    // Ajout du nom du formateur
    var formateur = document.createElement('p');
    formateur.classList.add('formateur');
    formateur.textContent = 'Formateur: ' + cours.formateur; // Modifiez le texte en conséquence
    infosCours.appendChild(formateur);

    // Ajout de la durée du cours
    var duree = document.createElement('p');
    duree.classList.add('duree');
    duree.textContent = 'Durée: ' + cours.nombreHeures + 'h'; // Modifiez le texte en conséquence
    infosCours.appendChild(duree);

    // Ajout du prix du cours
    var prixAsynchrone = document.createElement('p');
    prixAsynchrone.classList.add('prix_asynchrone');
    prixAsynchrone.textContent = 'Prix: ' + cours.cout + ' CA$'; // Modifiez le texte en conséquence
    infosCours.appendChild(prixAsynchrone);

    // Ajout du div infosCours à l'article
    article.appendChild(infosCours);

    // Création de l'élément <p> pour "En savoir plus"
    var savoirPlus = document.createElement('p');
    savoirPlus.classList.add('savoir_plus');
    savoirPlus.textContent = 'En savoir plus';
    // Ajout d'un événement onclick pour afficher le contenu du cours
    savoirPlus.onclick = function () {
        createOrResetModal(cours);
    };
    // Ajout de l'élément "En savoir plus" à l'article
    article.appendChild(savoirPlus);

    // Retour de l'article contenant la vignette du cours
    return article;
}

// Gestionnaire d'événements pour la liste déroulante des mois
document.getElementById('moisListe').addEventListener('change', function () {
    var selectedMonth = this.value.toLowerCase(); // Convertir en minuscules
    console.log('Mois sélectionné :', selectedMonth);

    // Appeler la fonction pour afficher les cours correspondants pour le mois sélectionné
    recupererEtAfficherCours(selectedMonth);
});




// Gestionnaire d'événements pour la liste déroulante des mois
document.getElementById('moisListe').addEventListener('change', function () {
    var selectedMonth = this.value.toLowerCase(); // Convertir en minuscules
    console.log('Mois sélectionné :', selectedMonth);



    // Appeler la fonction pour afficher les cours correspondants pour le mois sélectionné
    recupererEtAfficherCours(selectedMonth);


});


// Appeler la fonction pour récupérer les données JSON
recupererDonneesJSON()
    .then(data => {
        console.log(data); // Afficher les données récupérées dans la console
    })
    .catch(error => console.error(error));