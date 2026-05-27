let stats = JSON.parse(
    localStorage.getItem("rpsStats")
) || {

    games: 0,

    rock: 0,

    paper: 0,

    scissors: 0,

    aiCorrect: 0
};

function saveStats() {

    localStorage.setItem(
        "rpsStats",
        JSON.stringify(stats)
    );
}
