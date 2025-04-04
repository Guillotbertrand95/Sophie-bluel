const apiUrl = "http://localhost:5678/api/works";

fetch(apiUrl)
	.then((response) => {
		if (!response.ok) {
			throw new Error("Erreur lors de la récupération des projets");
		}
		return response.json();
	})
	.then((data) => {
		// Sélection des conteneurs
		const galleryContainer = document.querySelector(".gallery");
		const filterContainer = document.querySelector(".filters");

		if (!galleryContainer || !filterContainer) {
			throw new Error(
				"Les éléments .gallery ou .filters n'existent pas dans le DOM"
			);
		}

		//  EXTRAIRE LES CATÉGORIES UNIQUES AVEC SET
		const categoryIds = new Set(data.map((work) => work.category.id)); // Un set des IDs uniques
		const categories = [{ id: "all", name: "Tous" }];

		// On récupère les noms correspondants
		categoryIds.forEach((id) => {
			const category = data.find(
				(work) => work.category.id === id
			).category;
			categories.push(category);
		});

		//  CRÉER LES BOUTONS DE FILTRE
		categories.forEach((category) => {
			const button = document.createElement("button");
			button.textContent = category.name;
			button.dataset.categoryId = category.id;
			button.classList.add("filter-button");

			button.addEventListener("click", () => {
				//   FILTRER LES PROJETS AU CLIC
				const filteredWorks =
					category.id === "all"
						? data
						: data.filter(
								(work) => work.category.id === category.id
						  );

				displayWorks(filteredWorks);
			});

			filterContainer.appendChild(button);
		});

		//  FONCTION POUR AFFICHER LES PROJETS
		function displayWorks(works) {
			galleryContainer.innerHTML = ""; // Nettoyage

			works.forEach((work) => {
				const workElement = document.createElement("div");
				workElement.classList.add("work");

				const workImage = document.createElement("img");
				workImage.src = work.imageUrl;
				workImage.alt = work.title;

				const workTitle = document.createElement("h3");
				workTitle.textContent = work.title;

				workElement.appendChild(workImage);
				workElement.appendChild(workTitle);
				galleryContainer.appendChild(workElement);
			});
		}

		//  AFFICHER TOUS LES PROJETS AU CHARGEMENT
		displayWorks(data);
	});

function cacherFiltres() {
	const filterContainer = document.querySelector(".filters");
	if (filterContainer) {
		filterContainer.style.display = "none"; // Masquer les filtres
	}
}

function ajouterBandeau() {
	if (!document.querySelector("#bandeau-connexion")) {
		// Création du bandeau
		const bandeau = document.createElement("div");
		bandeau.id = "bandeau-connexion";
		bandeau.classList.add("bandeau-connecte"); // Ajouter la classe CSS

		// Création de l'icône
		const icon = document.createElement("i");
		icon.classList.add("fa-regular", "fa-pen-to-square");

		// Création du texte
		const texte = document.createElement("span");
		texte.textContent = "                      Mode édition ";

		// Ajout du texte et de l'icône au bandeau
		bandeau.appendChild(icon);
		bandeau.appendChild(texte);

		// Ajouter le bandeau au début du body
		document.body.prepend(bandeau);
		console.log("Bandeau ajouté !");
	}
}

// Fonction pour modifier le bouton Login en Logout
function modifierBoutonLogin() {
	const loginButton = document.querySelector("#login-button"); // Sélectionne le bouton Login
	if (loginButton) {
		loginButton.textContent = "Logout"; // Change le texte du bouton
		loginButton.addEventListener("click", () => {
			localStorage.removeItem("token"); // Supprimer le token du localStorage
			window.location.href = "login.html"; // Rediriger vers la page de login
		});
	}
}

// Fonction pour supprimer le bandeau "mode édition" si l'utilisateur n'est pas connecté
function supprimerBandeau() {
	const bandeau = document.querySelector("#bandeau-connexion");
	if (bandeau) {
		bandeau.remove();
	}
}

function modifierBoutonModale() {
	// Sélectionner le conteneur modal
	const modalContainer = document.querySelector(".modal");

	if (!modalContainer) {
		console.error("L'élément .modal est introuvable !");
		return;
	}

	// Vérifier si le bouton existe déjà pour éviter les doublons
	if (document.querySelector("#edit-modal")) return;

	// Création du bouton
	const modalButton = document.createElement("div");
	modalButton.id = "edit-modal";

	// Création de l'icône
	const icon = document.createElement("i");
	icon.classList.add("fa-regular", "fa-pen-to-square");

	// Création du texte
	const texte = document.createElement("span");
	texte.textContent = "          modifier";

	// Ajout de l'icône et du texte au bouton
	modalButton.appendChild(icon);
	modalButton.appendChild(texte);

	// Insérer le bouton dans .modal, juste après le titre
	const titre = modalContainer.querySelector("h2");
	if (titre) {
		titre.insertAdjacentElement("afterend", modalButton);
	} else {
		console.error("Le titre h2 est introuvable dans .modal !");
	}
}

// Code exécuté au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("token"); // Vérification du token dans le localStorage

	// Si le token existe, l'utilisateur est connecté
	if (token) {
		ajouterBandeau(); // Ajouter le bandeau "mode édition"
		modifierBoutonLogin(); // Modifier le bouton Login en Logout
		cacherFiltres(); // 👈 Ajoute cette ligne pour cacher les filtres après connexion
		modifierBoutonModale();
	} else {
		supprimerBandeau(); // Si l'utilisateur n'est pas connecté, on supprime le bandeau
		console.log("Pas de token, utilisateur non connecté");
	}
});

function ajouterEvenementModale() {
	const modalButton = document.querySelector("#edit-modal");

	if (!modalButton) return; // Sécurité si le bouton n'existe pas

	modalButton.addEventListener("click", () => {
		console.log("Bouton Modifier cliqué !");
		ouvrirModale(); // Fonction qui affichera ta modale
	});
}

function ouvrirModale() {
	// Vérifier si la modale existe déjà
	if (document.querySelector("#modal-projets")) return;

	// Création de l'élément principal de la modale
	const modal = document.createElement("div");
	modal.id = "modal-projets";
	modal.classList.add("modale");

	// Contenu de la modale
	modal.innerHTML = `
        <div class="modale-contenu">
            <span class="modale-fermer">&times;</span>
            <h2>Gérer les projets</h2>
            <div id="liste-projets">
                <p>Chargement des projets...</p>
            </div>
        </div>
    `;
	// Ajout de la modale au body
	document.body.appendChild(modal);

	// Fermer la modale au clic sur la croix
	document
		.querySelector(".modale-fermer")
		.addEventListener("click", fermerModale);
	modalButton.addEventListener("click", ouvrirModale);
}

function fermerModale() {
	const modal = document.querySelector("#modal-projets");
	if (modal) {
		modal.remove(); // Supprime la modale du DOM
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("token");

	if (token) {
		const boutonModale = modifierBoutonModale(); // Crée le bouton
		ajouterEvenementModale(); // Ajoute l'événement au clic
	}
});
