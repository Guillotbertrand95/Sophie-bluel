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

		// 📌 1. EXTRAIRE LES CATÉGORIES UNIQUES AVEC SET
		const categoryIds = new Set(data.map((work) => work.category.id)); // Un set des IDs uniques
		const categories = [{ id: "all", name: "Tous" }];

		// On récupère les noms correspondants
		categoryIds.forEach((id) => {
			const category = data.find(
				(work) => work.category.id === id
			).category;
			categories.push(category);
		});

		// 📌 2. CRÉER LES BOUTONS DE FILTRE
		categories.forEach((category) => {
			const button = document.createElement("button");
			button.textContent = category.name;
			button.dataset.categoryId = category.id;
			button.classList.add("filter-button");

			button.addEventListener("click", () => {
				// 📌 3. FILTRER LES PROJETS AU CLIC
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

		// 📌 4. FONCTION POUR AFFICHER LES PROJETS
		function displayWorks(works) {
			galleryContainer.innerHTML = ""; // Nettoyage

			works.forEach((work) => {
				const workElement = document.createElement("div");
				workElement.classList.add("work");

				const workTitle = document.createElement("h3");
				workTitle.textContent = work.title;

				const workImage = document.createElement("img");
				workImage.src = work.imageUrl;
				workImage.alt = work.title;

				workElement.appendChild(workTitle);
				workElement.appendChild(workImage);
				galleryContainer.appendChild(workElement);
			});
		}

		// 📌 5. AFFICHER TOUS LES PROJETS AU CHARGEMENT
		displayWorks(data);
	});
