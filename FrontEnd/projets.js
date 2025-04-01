const token = localStorage.getItem("token");

console.log("Token stocké :", token);

fetch("http://localhost:5678/api/works", {
	method: "GET",
	headers: {
		Authorization: `Bearer ${token}`,
	},
})
	.then((response) => response.json())
	.then((data) => {
		console.log("Réponse API :", data); // Regarde ce que l'API répond
	})
	.catch((error) => console.error("Erreur API :", error));
