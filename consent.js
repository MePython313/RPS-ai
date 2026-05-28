// Module scripts are deferred, so the DOM is ready when this runs

const popup = document.getElementById("cookiePopup");
const consent = localStorage.getItem("analyticsConsent");

// if already answered → hide popup
if (consent !== null) {
    popup.style.display = "none";
} else {
    document.getElementById("allowBtn").onclick = () => {
        localStorage.setItem("analyticsConsent", "true");
        popup.style.display = "none";
        console.log("Analytics enabled 📊");
    };

    document.getElementById("denyBtn").onclick = () => {
        localStorage.setItem("analyticsConsent", "false");
        popup.style.display = "none";
        console.log("Analytics disabled 🚫");
    };
}
