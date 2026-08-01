import { stats } from "./storage.js";

export function updateUI() {
    document.getElementById("wins").innerText   = stats.wins;
    document.getElementById("losses").innerText = stats.losses;
    document.getElementById("draws").innerText  = stats.draws;

    const modeEl = document.getElementById("aiMode");
    const confEl = document.getElementById("aiConfidence");
    if (modeEl && confEl) {
        const histLen = stats.history ? stats.history.length : 0;
        if (histLen < 10) {
            modeEl.textContent = "ensemble";
            modeEl.style.color = "#ff9800";
            confEl.textContent = Math.round((stats.aiCorrect / Math.max(1, stats.games)) * 100) + "%";
            confEl.style.color = "#ff9800";
        } else {
            modeEl.textContent = "neural net";
            modeEl.style.color = "#3dff8b";
            const conf = stats.lastConfidence || 0;
            confEl.textContent = Math.round(conf * 100) + "%";
            confEl.style.color = conf > 0.6 ? "#3dff8b" : conf > 0.4 ? "#ff9800" : "#ff4444";
        }
    }
}

export function getFavoriteMove() {
    const moves = {
        rock:     stats.rock,
        paper:    stats.paper,
        scissors: stats.scissors
    };

    let favorite = "rock";

    for (let move in moves) {
        if (moves[move] > moves[favorite]) {
            favorite = move;
        }
    }

    return favorite;
}
