let stats = JSON.parse(
    localStorage.getItem("rpsStats")
) || {
    wins: 0,
    losses: 0,
    draws: 0
};

function saveStats() {
    localStorage.setItem(
        "rpsStats",
        JSON.stringify(stats)
    );
}

function saveStats() {

    localStorage.setItem(
        "rpsStats",
        JSON.stringify(stats)
    );
}
