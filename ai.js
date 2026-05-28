import { stats } from "./storage.js";
import { getFavoriteMove } from "./analytics.js";

export function getAIMove() {
    const history = stats.history;
    const moves = ["rock", "paper", "scissors"];

    // 🧠 Not enough data yet → play random
    if (!history || history.length < 5) {
        return moves[Math.floor(Math.random() * 3)];
    }

    // 📊 Count occurrences in recent history (last 100 moves)
    const count = { rock: 0, paper: 0, scissors: 0 };
    for (const move of history) {
        if (count[move] !== undefined) count[move]++;
    }

    // 🔍 Find player's most frequent recent move
    let predicted = "rock";
    for (const m in count) {
        if (count[m] > count[predicted]) {
            predicted = m;
        }
    }

    // 🎯 Counter strategy: play what beats their most common move
    if (predicted === "rock")     return "paper";
    if (predicted === "paper")    return "scissors";
    return "rock"; // counters scissors
}
