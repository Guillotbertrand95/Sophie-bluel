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
		cacherFiltres(); //  Ajoute cette ligne pour cacher les filtres après connexion
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

			console.log(data);
			// Afficher les projets dans la modale
			displayDelete(data);
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
function displayDelete(works) {
	const galleryContainerModal = document.querySelector("#liste-projets");
	galleryContainerModal.innerHTML = ""; // Nettoyage de la modale

	works.forEach((work) => {
		const workElement = document.createElement("div");
		workElement.classList.add("work");
		workElement.id = `work-${work.id}`; // Assurez-vous que chaque élément a un id unique basé sur l'ID du projet.

		const img = document.createElement("img");
		img.src = work.imageUrl;
		img.alt = work.title;

		// Création du bouton de suppression
		const deleteBtn = document.createElement("buttonT");
		deleteBtn.classList.add("delete-Trash");

		const icon = document.createElement("i");
		icon.classList.add("fas", "fa-trash-alt"); // icône de suppression
		deleteBtn.appendChild(icon);

		// Ajout de l'événement click pour supprimer
		deleteBtn.addEventListener("click", () => {
			deleteWork(work.id); // Supprimer l'image avec l'ID du projet
		});

		// Ajout du bouton de suppression et de l'image à l'élément de travail
		workElement.appendChild(img);
		workElement.appendChild(deleteBtn);

		// Ajout de l'élément de travail à la modale
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
			// Suppression réussie, retirer l'élément du DOM
			const workElement = document.querySelector(`#work-${id}`);
			if (workElement) {
				workElement.remove();
			}
		})
		.catch((error) => {
			console.error("Erreur lors de la suppression :", error);
		});
}

function ouvrirModale2(modaleId) {
	// Vérifier si la modale existe déjà
	if (document.querySelector(`#${modaleId}`)) return;

	// Créer la modale d'ajout de photo
	const modal2 = document.createElement("div");
	modal2.id = modaleId;
	modal2.classList.add("modale");

	// Créer l'overlay
	const overlay = document.createElement("div");
	overlay.classList.add("overlay");

	// Contenu de la modale d'ajout
	const modalContent = document.createElement("div");
	modalContent.classList.add("modale-contenu");

	// Créer la croix de fermeture
	const closeButton = document.createElement("span");
	closeButton.classList.add("modale-fermer");
	closeButton.innerHTML = "&times;";
	modalContent.appendChild(closeButton);

	// Titre de la modale
	const title = document.createElement("h2");
	title.textContent = "Ajouter un nouveau projet";
	modalContent.appendChild(title);

	// Formulaire d'ajout d'image et d'autres informations
	const form = document.createElement("form");
	form.id = "uploadForm"; // Ajout de l'ID au formulaire
	// Titre du projet
	const inputTitle = document.createElement("input");
	inputTitle.type = "text";
	inputTitle.placeholder = "Titre du projet";
	inputTitle.name = "title";
	inputTitle.required = true;

	// Catégorie du projet
	const inputCategory = document.createElement("input");
	inputCategory.type = "text";
	inputCategory.placeholder = "Catégorie du projet";
	inputCategory.name = "category";
	inputCategory.required = true;

	// Sélectionner une image
	const inputImage = document.createElement("input");
	inputImage.type = "file";
	inputImage.accept = "image/*";
	inputImage.name = "image";
	inputImage.required = true;

	// Bouton de soumission
	const submitBtn = document.createElement("button");
	submitBtn.type = "submit";
	submitBtn.textContent = "Ajouter le projet";

	// Ajouter les champs au formulaire
	form.appendChild(inputTitle);
	form.appendChild(inputCategory);
	form.appendChild(inputImage);
	form.appendChild(submitBtn);

	// Ajouter le formulaire au contenu de la modale
	modalContent.appendChild(form);

	// Ajouter le contenu à la modale
	modal2.appendChild(modalContent);

	// Ajouter l'overlay et la modale au body
	document.body.appendChild(overlay);
	document.body.appendChild(modal2);

	// Fermer la modale au clic sur la croix ou l'overlay
	closeButton.addEventListener("click", () => fermerModale2(modaleId));
	overlay.addEventListener("click", () => fermerModale2(modaleId));

	// Événement de soumission du formulaire
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const titleValue = inputTitle.value;
		const categoryValue = inputCategory.value;
		const imageFile = inputImage.files[0];

		const form = document.querySelector("#uploadForm");
		if (form) {
			form.addEventListener("submit", (e) => {
				e.preventDefault();
				const titleValue = inputTitle.value;
				const categoryValue = inputCategory.value;
				const imageFile = inputImage.files[0];

				ajouterProjet(titleValue, categoryValue, imageFile);
			});
		}

		ajouterProjet(titleValue, categoryValue, imageFile);
	});
}

// Fonction pour fermer la modale
function fermerModale2(modaleId) {
	const modal2 = document.querySelector(`#${modaleId}`);
	const overlay = document.querySelector(".overlay");
	if (modal2) {
		modal2.remove();
	}
	if (overlay) {
		overlay.remove();
	}
}

// Fonction pour ajouter un projet
function ajouterProjet(title, category, imageFile) {
	const formData = new FormData();
	formData.append("title", title);
	formData.append("category", category);
	formData.append("image", imageFile);

	const token = localStorage.getItem("token");
	console.log("Token :", token);
	fetch(apiUrl, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	})
		.then((response) => {
			if (!response.ok) {
				console.error("Erreur lors de l'ajout du projet", response);
				throw new Error("Erreur lors de l'ajout du projet");
			}
			return response.json();
		})
		.then((data) => {
			console.log("Projet ajouté avec succès", data); // Vérifie la réponse de l'API ici
			// Après ajout, mettre à jour la galerie
			chargerGalerie();
			// Fermer la modale
			fermerModale2("modale2");
		})
		.catch((error) => {
			console.error("Erreur :", error);
		});
}
document
	.getElementById("uploadForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();

		const formData = new FormData();
		formData.append("title", document.getElementById("title").value);
		formData.append("category", document.getElementById("category").value);
		formData.append("image", document.getElementById("image").files[0]);

		fetch("http://localhost:5678/api/works", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Success:", data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	});
