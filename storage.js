let stats = JSON.parse(localStorage.getItem("rpsStats"));

if (!stats) {
    stats = {
        wins: 0,
        losses: 0,
        draws: 0,

        // AI memory (important)
        history: []
    };
}

function saveStats() {
    localStorage.setItem(
        "rpsStats",
        JSON.stringify(stats)
    );
}
function addMoveToHistory(move) {

    stats.history.push(move);

    // 🧹 FORGET OLD MOVES (limit 100)
    if (stats.history.length > 100) {
        stats.history.shift(); // removes oldest
    }
}
