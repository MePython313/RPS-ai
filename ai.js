function getAIMove() {

    let predictedMove =
        getFavoriteMove();

    // Counter logic

    if (predictedMove === "rock") {

        return "paper";
    }

    if (predictedMove === "paper") {

        return "scissors";
    }

    return "rock";
}
