function updateUI() {

    document.getElementById("wins")
        .innerText = stats.wins;

    document.getElementById("losses")
        .innerText = stats.losses;

    document.getElementById("draws")
        .innerText = stats.draws;
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
