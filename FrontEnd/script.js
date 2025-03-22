async function getWorks() {
	try {
		// Récupération des données depuis l'API
		const response = await fetch("http://localhost:5678/api/works", {
			method: "GET",
			headers: {
				Authorization:
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4",
			},
		});

		// Vérification de la réponse
		if (!response.ok) {
			throw new Error(`Erreur HTTP : ${response.status}`);
		}

		// Récupération des données JSON
		const data = await response.json();
		console.log(data); // Affiche les données reçues dans la console

		// Sélectionne l'élément où afficher les projets
		const gallery = document.querySelector(".gallery");
		gallery.innerHTML = ""; // Vide la galerie avant de l'actualiser

		// Parcours les projets et ajoute chaque projet dans la galerie
		data.forEach((project) => {
			// Crée un élément pour chaque projet
			const projectElement = document.createElement("div");
			projectElement.classList.add("project"); // Classe CSS pour le style

			// Ajoute le contenu du projet (image, titre et catégorie)
			projectElement.innerHTML = `
				<img src="${project.imageUrl}" alt="${project.title}" />
				<h3>${project.title}</h3>
				<p>Catégorie : ${project.category.name}</p>
			`;

			// Ajoute l'élément à la galerie
			gallery.appendChild(projectElement);
		});
	} catch (error) {
		// Affichage de l'erreur en cas de problème
		console.error("Erreur :", error);
	}
}

// Appel de la fonction pour récupérer et afficher les projets
getWorks();
