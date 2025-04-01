document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("#login-form"); // Correction ici !

	if (!form) {
		console.error("Formulaire non trouvé !");
		return;
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const email = document.querySelector("#email").value;
		const password = document.querySelector("#password").value;

		try {
			const response = await fetch(
				"http://localhost:5678/api/users/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				}
			);

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("token", data.token);
				window.location.href = "index.html";
			} else {
				alert("Email ou mot de passe incorrect.");
			}
		} catch (error) {
			console.error("Erreur de connexion :", error);
			alert("Un problème est survenu. Vérifiez votre connexion.");
		}
	});
});
