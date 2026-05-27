import { uploadAnalytics } from "./firebase.js";

function play(playerMove) {

    stats.games++;

    stats[playerMove]++;

    let aiMove = getAIMove();

    // AI prediction tracking

    if (
        getFavoriteMove() === playerMove
    ) {

        stats.aiCorrect++;
    }

    let result = "";

    // WIN CONDITIONS

    if (playerMove === aiMove) {

        result = "🤝 Draw!";
    }

    else if (

        (playerMove === "rock" &&
        aiMove === "scissors")

        ||

        (playerMove === "paper" &&
        aiMove === "rock")

        ||

        (playerMove === "scissors" &&
        aiMove === "paper")

    ) {

        result = "🎉 You Win!";
    }

    else {

        result = "💀 AI Wins!";
    }

    document.getElementById("result")
        .innerHTML = `

        You picked:
        <b>${playerMove}</b>

        <br><br>

        AI picked:
        <b>${aiMove}</b>

        <br><br>

        ${result}
    `;

    saveStats();

    updateUI();
}

updateUI();
