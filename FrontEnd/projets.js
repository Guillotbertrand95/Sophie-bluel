fetch("http://localhost:5678/api/works").then((response) => {
	if (!response.ok) {
		throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
	}
	return response.json();
});

then((data) => {
	const container = document.getElementById("projets-container");
	container.innerHTML = ""; //vide le container avant les nouvelles images

	data.forEach((projet) => {
		const div = document.createElement("div");
		div.classList.add("projet"); // ajoute si besoin une classe css

		div.innerHTML = `
<img src="${projet.imageUrl}" alt="${projet.title}">
<h3>${projet.title}</h3> `;
		container.appendChild(div);
	});
}).catch((error) => {
	console.error("Erreur lors de la recuperation des données :", error);
});
