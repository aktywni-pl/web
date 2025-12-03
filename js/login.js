document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorP = document.getElementById("loginError");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            errorP.textContent = "Podaj email i hasło.";
            return;
        }

        // Na razie udajemy logowanie – zapisujemy token i lecimy na listę
        localStorage.setItem("authToken", "DUMMY_TOKEN");
        window.location.href = "activities.html";
    });
});
