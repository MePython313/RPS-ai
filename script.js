// Firebase function (from firebase.js)
import { uploadAnalytics } from "./firebase.js";

// Import game modules
import { stats, saveStats, addMoveToHistory } from "./storage.js";
import { updateUI, getFavoriteMove } from "./analytics.js";
import { getAIMove } from "./ai.js";

/* =========================
   GAME CORE
========================= */

function play(playerMove) {
    addMoveToHistory(playerMove);
    const aiMove = getAIMove();

    stats.games++;
    stats[playerMove]++;

    let result = "";

    if (playerMove === aiMove) {
        result = "🤝 Draw!";
        stats.draws++;
    }
    else if (
        (playerMove === "rock" && aiMove === "scissors") ||
        (playerMove === "paper" && aiMove === "rock") ||
        (playerMove === "scissors" && aiMove === "paper")
    ) {
        result = "🎉 You Win!";
        stats.wins++;
    }
    else {
        result = "💀 AI Wins!";
        stats.losses++;
    }

    // AI tracking (simple learning bias)
    if (getFavoriteMove() === playerMove) {
        stats.aiCorrect++;
    }

    // UI update
    document.getElementById("result").innerHTML = `
        You: <b>${playerMove}</b><br>
        AI: <b>${aiMove}</b><br><br>
        ${result}
    `;

    saveStats();
    updateUI();

    /* =========================
       FIREBASE ANALYTICS
    ========================= */

    const consent = localStorage.getItem("analyticsConsent");

    if (consent === "true") {

        uploadAnalytics({
            move: playerMove,
            aiMove: aiMove,
            result: result,
            favoriteMove: getFavoriteMove(),
            timestamp: Date.now()
        });
    }
}

/* =========================
   INITIAL LOAD
========================= */

updateUI();

// Expose play() to inline onclick handlers in HTML
window.play = play;
