export let stats = JSON.parse(localStorage.getItem("rpsStats"));

if (!stats) {
    stats = {
        wins: 0,
        losses: 0,
        draws: 0,
        games: 0,
        rock: 0,
        paper: 0,
        scissors: 0,
        aiCorrect: 0,
        // AI memory (important)
        history: []
    };
} else {
    // Fallbacks for existing saved objects that may be missing newer fields
    if (stats.games === undefined)     stats.games = 0;
    if (stats.rock === undefined)      stats.rock = 0;
    if (stats.paper === undefined)     stats.paper = 0;
    if (stats.scissors === undefined)  stats.scissors = 0;
    if (stats.aiCorrect === undefined) stats.aiCorrect = 0;
    if (!stats.history)                stats.history = [];
}

export function saveStats() {
    localStorage.setItem("rpsStats", JSON.stringify(stats));
}

export function addMoveToHistory(move) {
    stats.history.push(move);

    // 🧹 FORGET OLD MOVES (keep last 100)
    if (stats.history.length > 100) {
        stats.history.shift(); // removes oldest
    }
}
