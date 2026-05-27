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
