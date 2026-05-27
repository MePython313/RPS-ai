let analyticsAllowed =
    localStorage.getItem("analyticsConsent");

function showConsentPopup() {

    if (analyticsAllowed !== null) {
        return;
    }

    let popup = document.createElement("div");

    popup.id = "cookiePopup";

    popup.innerHTML = `
        <div class="popup-content">
            <h2>🍪 Analytics Cookies</h2>

            <p>
                This AI studies player behavior
                to improve its mind-reading powers 💀
            </p>

            <button id="allowBtn">
                Allow
            </button>

            <button id="denyBtn">
                Deny
            </button>
        </div>
    `;

    document.body.appendChild(popup);

    document
        .getElementById("allowBtn")
        .onclick = () => {

            localStorage.setItem(
                "analyticsConsent",
                "true"
            );

            location.reload();
        };

    document
        .getElementById("denyBtn")
        .onclick = () => {

            localStorage.setItem(
                "analyticsConsent",
                "false"
            );

            location.reload();
        };
}

showConsentPopup();
