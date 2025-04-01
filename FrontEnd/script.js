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

		// Nettoyage des conteneurs avant d'ajouter les nouveaux éléments
		galleryContainer.innerHTML = "";
		filterContainer.innerHTML = "";

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

// Fonction pour ajouter le bandeau "mode édition"
function ajouterBandeau() {
	if (!document.querySelector("#bandeau-connexion")) {
		const bandeau = document.createElement("div");
		bandeau.id = "bandeau-connexion";
		bandeau.textContent = "Mode édition";
		bandeau.classList.add("bandeau-connecte"); // Ajouter la classe CSS
		document.body.prepend(bandeau); // Ajouter au début du body
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

// Code exécuté au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("token"); // Vérification du token dans le localStorage

	// Si le token existe, l'utilisateur est connecté
	if (token) {
		ajouterBandeau(); // Ajouter le bandeau "mode édition"
		modifierBoutonLogin(); // Modifier le bouton Login en Logout
	} else {
		supprimerBandeau(); // Si l'utilisateur n'est pas connecté, on supprime le bandeau
		console.log("Pas de token, utilisateur non connecté");
	}
});
