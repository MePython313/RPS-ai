// Firebase function (from firebase.js)
import { uploadAnalytics } from "./firebase.js";

/* =========================
   GAME CORE
========================= */

function play(playerMove) {

    const aiMove = getAIMove();

    stats.games++;
    stats[playerMove]++;

    let result = "";

    // win logic
    if (playerMove === aiMove) {
        result = "🤝 Draw!";
    }
    else if (
        (playerMove === "rock" && aiMove === "scissors") ||
        (playerMove === "paper" && aiMove === "rock") ||
        (playerMove === "scissors" && aiMove === "paper")
    ) {
        result = "🎉 You Win!";
    }
    else {
        result = "💀 AI Wins!";
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
   AI LOGIC
========================= */

function getAIMove() {

    const favorite = getFavoriteMove();

    if (favorite === "rock") return "paper";
    if (favorite === "paper") return "scissors";
    return "rock";
}

/* =========================
   FAVORITE MOVE DETECTOR
========================= */

function getFavoriteMove() {

    const moves = {
        rock: stats.rock,
        paper: stats.paper,
        scissors: stats.scissors
    };

    let best = "rock";

    for (let m in moves) {
        if (moves[m] > moves[best]) {
            best = m;
        }
    }

    return best;
}

/* =========================
   INITIAL LOAD
========================= */

updateUI();
window.play = play;
