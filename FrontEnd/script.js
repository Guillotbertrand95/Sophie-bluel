document.addEventListener("DOMContentLoaded", () => {
	const apiUrl = "http://localhost:5678/api/works";

	fetch(apiUrl)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Erreur lors de la récupération des projets");
			}
			return response.json();
		})
		.then((data) => {
			const galleryContainer = document.querySelector(".gallery");

			if (!galleryContainer) {
				throw new Error("L'élément .gallery n'existe pas dans le DOM");
			}

			data.forEach((project) => {
				const projectElement = document.createElement("div");
				projectElement.classList.add("project");

				projectElement.innerHTML = `
                <h3>${project.title}</h3>
                <img src="${project.imageUrl}" alt="${project.title}">
            `;

				galleryContainer.appendChild(projectElement);
			});
		});
});
