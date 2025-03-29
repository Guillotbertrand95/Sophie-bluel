document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("#login-form");

	form.addEventListener("submit", async (event) => {
		event.preventDefault(); // Empêche le rechargement de la page

		const email = document.querySelector("#email").value;
		const password = document.querySelector("#password").value;

		try {
			const response = await fetch(
				"http://localhost:5678/api/users/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }), // Convertir en JSON
				}
			);

			const data = await response.json();

			if (response.ok) {
				// ✅ Connexion réussie : on stocke le token et on redirige
				localStorage.setItem("token", data.token); // Sauvegarde du token
				window.location.href = "index.html"; // Redirection vers l'accueil
			} else {
				// ❌ Connexion échouée : on affiche un message d'erreur
				alert("Email ou mot de passe incorrect.");
			}
		} catch (error) {
			console.error("Erreur de connexion :", error);
			alert("Un problème est survenu. Vérifiez votre connexion.");
		}
	});
});
