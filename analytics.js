function updateUI() {

    document.getElementById("games")
        .innerText = stats.games;

    document.getElementById("rock")
        .innerText = stats.rock;

    document.getElementById("paper")
        .innerText = stats.paper;

    document.getElementById("scissors")
        .innerText = stats.scissors;

    document.getElementById("favorite")
        .innerText = getFavoriteMove();

    let accuracy =
        stats.games === 0
        ? 0
        : Math.round(
            (stats.aiCorrect / stats.games) * 100
        );

    document.getElementById("accuracy")
        .innerText = accuracy + "%";
}

function getFavoriteMove() {

    let moves = {

        rock: stats.rock,

        paper: stats.paper,

        scissors: stats.scissors
    };

    let favorite = "rock";

    for (let move in moves) {

        if (
            moves[move] >
            moves[favorite]
        ) {

            favorite = move;
        }
    }

    return favorite;
}
