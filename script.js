// Firebase function (from firebase.js)
import { uploadAnalytics } from "./firebase.js";

// Import game modules
import { stats, saveStats, addMoveToHistory } from "./storage.js";
import { updateUI, getFavoriteMove } from "./analytics.js";
import { getAIMove, updateAI } from "./ai.js";

/* =========================
   GAME CORE
========================= */

function play(playerMove) {
    addMoveToHistory(playerMove);
    const aiMove = getAIMove();
    const predictedMove = stats.lastPrediction;

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

    // AI tracking - was the AI's prediction correct?
    if (predictedMove === playerMove) {
        stats.aiCorrect++;
    }
    updateAI(playerMove);

    // 🎬 ANIMATION — shake 3 times, then reveal
    const emojis = { rock: "✊", paper: "✋", scissors: "✌️" };
    const container = document.getElementById("hands-container");
    const playerEl = document.getElementById("playerHand");
    const aiEl = document.getElementById("aiHand");
    const resultEl = document.getElementById("result");

    // Hide moves, show countdown
    playerEl.textContent = "❓";
    aiEl.textContent = "❓";
    aiEl.classList.remove("show");
    resultEl.innerHTML = "⏳";

    // Shake !
    container.classList.add("shaking");

    // Cycle AI hand like a slot machine during shake
    let cycle = 0;
    const aiMoves = ["✊", "✋", "✌️"];
    const cycleInterval = setInterval(() => {
        aiEl.textContent = aiMoves[cycle % 3];
        cycle++;
    }, 100);

    // Reveal after shake ends
    setTimeout(() => {
        clearInterval(cycleInterval);
        container.classList.remove("shaking");
        playerEl.textContent = emojis[playerMove];
        aiEl.textContent = emojis[aiMove];
        aiEl.classList.add("show");
        resultEl.innerHTML = result;
    }, 650);

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
            predictedMove: predictedMove,
            confidence: stats.lastConfidence,
            nnActive: (stats.history ? stats.history.length >= 10 : false),
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
