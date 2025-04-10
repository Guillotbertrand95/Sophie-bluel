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
		contenuModale(); // Fonction qui affichera ta modale
	});
}
function contenuModale() {
	//vérifier si la modale existe déjà
	if (document.querySelector("#modale-projets")) return;

	// création de l'éléments principal modale
	const modal = document.createElement("div");
	modal.id = "modal-projets";
	modal.classList.add("modale");

	// Créer l'overlay
	const overlay = document.createElement("div");
	overlay.classList.add("overlay");

	//création du contenu de la modale
	const modalContent = document.createElement("div");
	modalContent.classList.add("modale-contenu");

	//création de la croix fermeture
	const closeButton = document.createElement("span");
	closeButton.classList.add("modale-fermer");
	closeButton.innerHTML = "&times;";
	modalContent.appendChild(closeButton);

	//titre

	const title = document.createElement("h2");
	title.textContent = "Galerie photo";
	modalContent.appendChild(title);

	//conteneur projets
	const listeProjets = document.createElement("div");
	listeProjets.id = "liste-projets";
	modalContent.appendChild(listeProjets);

	//bouton ajout photo
	const ajouterBtn = document.createElement("button");
	ajouterBtn.textContent = "Ajouter une photo";
	ajouterBtn.addEventListener("click", () => {
		ouvrirModale2("modale2");
	});
	modalContent.appendChild(ajouterBtn);

	//ajout du de la modale au body
	modal.appendChild(modalContent);

	//ajout de la modale au body
	document.body.appendChild(overlay);
	document.body.appendChild(modal);

	// fermer la modale au clic

	closeButton.addEventListener("click", fermerModale);
	overlay.addEventListener("click", fermerModale);
	chargerGalerie();
}

function fermerModale() {
	const modal = document.querySelector("#modal-projets");
	const overlay = document.querySelector(".overlay");
	if (modal) {
		modal.remove(); // Supprime la modale du DOM
	}
	// Si l'overlay existe, on le supprime aussi
	if (overlay) {
		overlay.remove();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("token");

	if (token) {
		const boutonModale = modifierBoutonModale(); // Crée le bouton
		ajouterEvenementModale(); // Ajoute l'événement au clic
	}
});

// Fonction pour récupérer et afficher les projets
function chargerGalerie() {
	fetch(apiUrl)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Erreur lors de la récupération des projets");
			}
			return response.json();
		})
		.then((data) => {
			const galleryContainerModal =
				document.querySelector("#liste-projets");

			if (!galleryContainerModal) {
				throw new Error(
					"L'élément #liste-projets n'existe pas dans le DOM"
				);
			}

			// Afficher les projets dans la modale
			displayWorks(data);
		})
		.catch((error) => {
			console.error("Erreur :", error);
		});
}

// Fonction d'affichage des projets
function displayWorks(works) {
	const galleryContainerModal = document.querySelector("#liste-projets");
	galleryContainerModal.innerHTML = ""; // On vide d'abord le conteneur

	works.forEach((work) => {
		const workElement = document.createElement("div");
		workElement.classList.add("work");

		const workImage = document.createElement("img");
		workImage.src = work.imageUrl;

		workElement.appendChild(workImage);

		galleryContainerModal.appendChild(workElement);
	});
}

function deleteWork(id) {
	const token = localStorage.getItem("token");

	fetch(`${apiUrl}/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Échec de la suppression");
			}
			// Recharger la galerie après suppression
			return fetch(apiUrl);
		})
		.then((res) => res.json())
		.then((data) => {
			displayDelete(data); // On recharge la modale avec les nouveaux éléments
		})
		.catch((error) => {
			console.error("Erreur lors de la suppression :", error);
		});
}

function displayDelete(works) {
	const galleryContainerModal = document.querySelector(".liste-projets");
	galleryContainerModal.innerHTML = ""; // Nettoyage de la modale

	works.forEach((work) => {
		const workElement = document.createElement("div");
		workElement.classList.add("work");

		const img = document.createElement("img");
		img.src = work.imageUrl;
		img.alt = work.title;

		const deleteBtn = document.createElement("button");
		deleteBtn.classList.add("delete-button");

		const icon = document.createElement("i");
		icon.classList.add("fas", "fa-trash-alt"); // ou juste "fa-trash"
		deleteBtn.appendChild(icon);
		// Quand on clique dessus, on supprime
		deleteBtn.addEventListener("click", () => {
			deleteWork(work.id);
		});

		workElement.appendChild(img);
		workElement.appendChild(deleteBtn);
		galleryContainerModal.appendChild(workElement);
	});
}
