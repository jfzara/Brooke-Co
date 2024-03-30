
// Déclaration de la variable url
var url = 'coursJS.json';


localStorage.clear();




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





async function recupererEtAfficherCours(selectedMonth, isAsynchrone) {
    try {
        const data = await recupererDonneesJSON();
        console.log('Données récupérées:', data); // Ajout d'un log pour afficher les données récupérées

        // Récupération du prix unique pour tous les cours synchrones
        const prixSynchrone = data[1].prixSynchrone;

        // Vider le conteneur des cours
        const containerId = isAsynchrone ? 'coursAsynchronesContainer' : 'coursSynchronesContainer';
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        // Rechercher et afficher les cours correspondants au mois sélectionné
        const cours = isAsynchrone ? data[0].coursAsynchrones : data[1].coursSynchrones;
        console.log('Cours trouvés:', cours); // Ajout d'un log pour afficher les cours trouvés
        if (cours) {
            const coursMois = cours.find(mois => mois.mois.toLowerCase() === selectedMonth.toLowerCase());
            console.log('Cours du mois sélectionné:', coursMois); // Ajout d'un log pour afficher les cours du mois sélectionné
            if (coursMois) {
                coursMois.cours.forEach(c => {
                    // Passer prixSynchrone à la fonction creerVignetteCoursSynchrone
                    const vignetteCours = isAsynchrone ? creerVignetteCoursAsynchrone(c) : creerVignetteCoursSynchrone(c, prixSynchrone);
                    container.appendChild(vignetteCours);

                    // Faire défiler la page vers le bas pour afficher la vignette synchrone
                    vignetteCours.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            } else {
                console.error('Aucun cours disponible pour le mois sélectionné.');
            }
        } else {
            console.error('Aucun cours disponible pour le type sélectionné.');
        }
    } catch (error) {
        console.error('Erreur lors du traitement des données:', error);
    }
}

function createOrResetModal(cours, isSynchrone) {
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



    // Bouton "Ajouter au panier"
    var addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Acheter';
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

function searchInJSON(searchTerm) {
    if (!coursData) {
        console.error('Le fichier JSON n\'a pas été chargé.');
        return;
    }
 
    const searchTermLowercase = searchTerm.toLowerCase();
    

    const searchResults = [];
    for (const mois of coursData) {
        for (const cours of mois.coursAsynchrones) {
            for (const coursAsynchrone of cours.cours) {
                if (coursAsynchrone.titre.toLowerCase().includes(searchTermLowercase)) {
                    searchResults.push(coursAsynchrone);
                }
            }
        }
        for (const cours of mois.coursSynchrones) {
            for (const coursSynchrones of cours.cours) {
                if (coursSynchrones.titre.toLowerCase().includes(searchTermLowercase)) {
                    searchResults.push(coursSynchrones);
                }
            }
        }
    }

    if (searchResults.length > 0) {
        console.log('Résultats de la recherche :', searchResults);
       
    } else {
        console.log('Aucun résultat trouvé pour la recherche :', searchTerm);
        alert('Aucun résultat trouvé pour la recherche : ' + searchTerm);
    }
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

function creerVignetteCoursSynchrone(cours, prixSynchrone) {
    var article = document.createElement('article');
    article.classList.add('vignette_synchrone');

    // Créer les éléments pour l'icône et le texte en fonction du lieu
    if (cours.lieu) {
        var lieuIcone = document.createElement('img');
        lieuIcone.src = "/public/images/free-location-icon-2955-thumb.png";
        lieuIcone.alt = "Icône Géolocolisation";
        lieuIcone.classList.add('geolocolisation');
        article.appendChild(lieuIcone);

        var lieuTexte = document.createElement('p');
        lieuTexte.textContent = cours.lieu;
        article.appendChild(lieuTexte);
    } else {
        // Afficher l'icône et le texte pour les cours en ligne
        var zoomEnLigne = document.createElement('div');
        zoomEnLigne.classList.add('zoom_en_ligne');

        var imageZoom = document.createElement('img');
        imageZoom.src = "/public/images/zoom-svgrepo-com.svg";
        imageZoom.alt = "Icône Zoom";
        imageZoom.classList.add('zoom');
        zoomEnLigne.appendChild(imageZoom);

        var enLigne = document.createElement('p');
        enLigne.textContent = "En ligne";
        zoomEnLigne.appendChild(enLigne);

        article.appendChild(zoomEnLigne);
    }

    // Ajouter les autres informations du cours
    var nomCours = document.createElement('p');
    nomCours.classList.add('nom_cours');
    nomCours.textContent = cours.titre;
    article.appendChild(nomCours);

    var infosCoursSynchrone = document.createElement('div');
    infosCoursSynchrone.classList.add('infos_cours_synchrone');

    var formateur = document.createElement('p');
    formateur.classList.add('formateur');
    formateur.textContent = cours.formateur;
    infosCoursSynchrone.appendChild(formateur);

    var datesSessions = document.createElement('div');
    datesSessions.classList.add('dates_sessions');
    cours.sessions.forEach(session => {
        var dateHeure = document.createElement('p');
        dateHeure.textContent = `${session.date} ${session.heureDebut}-${session.heureFin}`;
        datesSessions.appendChild(dateHeure);
    });
    infosCoursSynchrone.appendChild(datesSessions);



    var prixSynchroneElement = document.createElement('p');
    prixSynchroneElement.classList.add('prix_synchrone');
    prixSynchroneElement.innerHTML = 'Prix: <strong>' + prixSynchrone + '</strong> CA$'; // Mettre le prix en balise strong
    infosCoursSynchrone.appendChild(prixSynchroneElement);

    article.appendChild(infosCoursSynchrone);

    var savoirPlus = document.createElement('p');
    savoirPlus.classList.add('savoir_plus');
    savoirPlus.textContent = 'En savoir plus';
    savoirPlus.onclick = function () {
        createOrResetModal(cours);
    };
    article.appendChild(savoirPlus);

    var imageCoursSynchrone = document.createElement('div');
    imageCoursSynchrone.classList.add('image_cours_synchrone');

    var image = document.createElement('img');
    image.src = cours.image;
    image.alt = 'image javascript';
    imageCoursSynchrone.appendChild(image);

    article.appendChild(imageCoursSynchrone);

    return article;
}

// Gestionnaire d'événements pour la liste déroulante des mois des cours asynchrones
document.getElementById('moisListeAsynchrone').addEventListener('change', function () {
    var selectedMonth = this.value.toLowerCase(); // Récupérer la valeur et la convertir en minuscules
    console.log('Mois sélectionné (asynchrone) :', selectedMonth);

    // Appeler la fonction pour afficher les cours asynchrones correspondants pour le mois sélectionné
    recupererEtAfficherCours(selectedMonth, true);
});

// Gestionnaire d'événements pour la liste déroulante des mois des cours synchrones
document.getElementById('moisListeSynchrone').addEventListener('change', function () {
    var selectedMonth = this.value.toLowerCase(); // Récupérer la valeur et la convertir en minuscules
    console.log('Mois sélectionné (synchrone) :', selectedMonth);

    // Appeler la fonction pour afficher les cours synchrones correspondants pour le mois sélectionné
    recupererEtAfficherCours(selectedMonth, false);
});



async function test() {
    try {
        const data = await recupererDonneesJSON(); // Récupération des données JSON
        console.log('Données récupérées:', data); // Affichage des données récupérées dans la console

        // Vérification si des cours asynchrones sont disponibles
        if (data && data[0] && data[0].coursAsynchrones && data[0].coursAsynchrones.length > 0) {
            const premierCoursAsynchrone = data[0].coursAsynchrones[0].cours[0];
            const titrePremierCoursAsynchrone = premierCoursAsynchrone.titre;
            const idPremierCoursAsynchrone = premierCoursAsynchrone.id; // Ajout du console log de l'ID du cours
            console.log('Titre du premier cours asynchrone:', titrePremierCoursAsynchrone);
            console.log('ID du premier cours asynchrone:', idPremierCoursAsynchrone);

            // Récupérer le terme de recherche saisi par l'utilisateur et le normaliser
            const termeRecherche = document.getElementById('searchInput').value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            console.log('Terme de recherche saisi:', termeRecherche);

            // Normaliser le titre du premier cours asynchrone
            const titreNormalise = titrePremierCoursAsynchrone.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

            // Vérifier si le terme de recherche est présent dans le titre du premier cours
            if (titreNormalise.includes(termeRecherche)) {
                const dropdownMenu = document.getElementById('dropdownMenu');

                // Créer le lien correspondant
                const lienElement = document.createElement('a');
                lienElement.href = 'javascript.html'; // Remplacer par le lien approprié
                lienElement.textContent = titrePremierCoursAsynchrone;
                lienElement.classList.add('visible-link'); // Ajout de la classe visible-link

                // Ajouter l'élément lien au menu déroulant
                dropdownMenu.appendChild(lienElement);

                // Afficher le dropdown
                dropdownMenu.style.display = 'block'; // Assurez-vous que le dropdown soit en display block
            } else {
                console.log('Le terme de recherche n\'est pas présent dans le titre du premier cours.');
            }
        } else {
            console.error('Aucun cours asynchrone disponible.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}


// Gestionnaire d'événements pour l'événement click du bouton de recherche
document.getElementById('searchButton').addEventListener('click', function(event) {
    event.preventDefault(); // Pour empêcher le comportement par défaut du lien
    if (document.getElementById('searchInput').value.length >= 3) {
        test();
    } else {
        alert('Veuillez saisir au minimum 3 lettres.');
    }
});

// Gestionnaire d'événements pour l'événement keypress du champ de saisie pour détecter la touche Entrée
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        if (this.value.length >= 3) {
            test();
        } else {
            alert('Veuillez saisir au minimum 3 lettres.');
        }
    }
});