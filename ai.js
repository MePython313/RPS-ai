import { stats } from "./storage.js";

const MOVES = ["rock", "paper", "scissors"];
const COUNTERS = { rock: "paper", paper: "scissors", scissors: "rock" };
const INPUT_SIZE = 15;
const HIDDEN_SIZE = 10;
const OUTPUT_SIZE = 3;
const L2_LAMBDA = 0.001;
const COLD_START_THRESHOLD = 10;
const REPLAY_BUFFER_SIZE = 100;
const REPLAY_BATCH_SIZE = 8;

function getRandomMove() {
    return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function argmax(arr) {
    let best = 0;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[best]) best = i;
    }
    return best;
}

function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function softmax(arr) {
    const max = Math.max(...arr);
    const exps = arr.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(v => v / sum);
}

function oneHot(idx, size) {
    const arr = new Array(size).fill(0);
    arr[idx] = 1;
    return arr;
}

function encodeHistory(history) {
    const encoded = [];
    const start = Math.max(0, history.length - 6);
    const recent = history.slice(start, history.length - 1);
    for (let i = 0; i < 5; i++) {
        const move = recent[i];
        encoded.push(move === "rock" ? 1 : 0);
        encoded.push(move === "paper" ? 1 : 0);
        encoded.push(move === "scissors" ? 1 : 0);
    }
    return encoded;
}

function getEnsemblePrediction(history) {
    const count = { rock: 0, paper: 0, scissors: 0 };
    for (const move of history) {
        if (count[move] !== undefined) count[move]++;
    }
    let predicted = "rock";
    for (const m in count) {
        if (count[m] > count[predicted]) predicted = m;
    }
    return predicted;
}

function getLearningRate() {
    const total = Math.max(0, stats.games - COLD_START_THRESHOLD);
    const warmupGames = 20;
    const totalScheduleGames = 500;

    let lr;
    if (total < warmupGames) {
        lr = 0.001 + (0.01 - 0.001) * (total / warmupGames);
    } else {
        const progress = (total - warmupGames) / (totalScheduleGames - warmupGames);
        const cosine = 0.5 * (1 + Math.cos(Math.PI * Math.min(progress, 1)));
        lr = 0.0001 + (0.01 - 0.0001) * cosine;
    }
    return lr;
}

class NeuralNetwork {
    constructor() {
        this.w1 = [];
        this.b1 = [];
        this.w2 = [];
        this.b2 = [];
    }

    initWeights() {
        const scale1 = Math.sqrt(2 / INPUT_SIZE);
        for (let i = 0; i < HIDDEN_SIZE; i++) {
            this.w1[i] = [];
            for (let j = 0; j < INPUT_SIZE; j++) {
                this.w1[i][j] = randn() * scale1;
            }
            this.b1[i] = 0.01;
        }

        const scale2 = Math.sqrt(2 / HIDDEN_SIZE);
        for (let i = 0; i < OUTPUT_SIZE; i++) {
            this.w2[i] = [];
            for (let j = 0; j < HIDDEN_SIZE; j++) {
                this.w2[i][j] = randn() * scale2;
            }
            this.b2[i] = 0;
        }
    }

    forward(input) {
        this.lastInput = input;

        this.z1 = new Array(HIDDEN_SIZE);
        this.a1 = new Array(HIDDEN_SIZE);
        for (let i = 0; i < HIDDEN_SIZE; i++) {
            let sum = this.b1[i];
            for (let j = 0; j < INPUT_SIZE; j++) {
                sum += this.w1[i][j] * input[j];
            }
            this.z1[i] = sum;
            this.a1[i] = sum > 0 ? sum : 0.01 * sum;
        }

        this.z2 = new Array(OUTPUT_SIZE);
        for (let i = 0; i < OUTPUT_SIZE; i++) {
            let sum = this.b2[i];
            for (let j = 0; j < HIDDEN_SIZE; j++) {
                sum += this.w2[i][j] * this.a1[j];
            }
            this.z2[i] = sum;
        }

        this.output = softmax(this.z2);
        return this.output;
    }

    backward(target, lr, l2Lambda) {
        const dz2 = new Array(OUTPUT_SIZE);
        for (let i = 0; i < OUTPUT_SIZE; i++) {
            dz2[i] = this.output[i] - target[i];
        }

        for (let i = 0; i < OUTPUT_SIZE; i++) {
            for (let j = 0; j < HIDDEN_SIZE; j++) {
                const grad = dz2[i] * this.a1[j] + l2Lambda * this.w2[i][j];
                this.w2[i][j] -= lr * grad;
            }
            this.b2[i] -= lr * dz2[i];
        }

        const da1 = new Array(HIDDEN_SIZE).fill(0);
        for (let j = 0; j < HIDDEN_SIZE; j++) {
            for (let i = 0; i < OUTPUT_SIZE; i++) {
                da1[j] += this.w2[i][j] * dz2[i];
            }
        }

        for (let i = 0; i < HIDDEN_SIZE; i++) {
            const leakGrad = this.z1[i] > 0 ? 1 : 0.01;
            const dz1 = da1[i] * leakGrad;
            for (let j = 0; j < INPUT_SIZE; j++) {
                const grad = dz1 * this.lastInput[j] + l2Lambda * this.w1[i][j];
                this.w1[i][j] -= lr * grad;
            }
            this.b1[i] -= lr * dz1;
        }
    }

    toJSON() {
        return {
            w1: this.w1, b1: this.b1,
            w2: this.w2, b2: this.b2
        };
    }

    fromJSON(data) {
        this.w1 = data.w1; this.b1 = data.b1;
        this.w2 = data.w2; this.b2 = data.b2;
    }
}

class ReplayBuffer {
    constructor(capacity) {
        this.capacity = capacity;
        this.buffer = [];
        this.pos = 0;
    }

    add(sample) {
        if (this.buffer.length < this.capacity) {
            this.buffer.push(sample);
        } else {
            this.buffer[this.pos] = sample;
        }
        this.pos = (this.pos + 1) % this.capacity;
    }

    sample(n) {
        const result = [];
        const len = this.buffer.length;
        for (let i = 0; i < n; i++) {
            result.push(this.buffer[Math.floor(Math.random() * len)]);
        }
        return result;
    }

    size() {
        return this.buffer.length;
    }
}

let nn = null;
let replayBuffer = null;
let totalTrainSteps = 0;

function loadWeights() {
    try {
        const saved = localStorage.getItem("rpsNNWeights");
        if (saved) {
            const data = JSON.parse(saved);
            nn = new NeuralNetwork();
            nn.fromJSON(data);
            return true;
        }
    } catch (e) {
        console.warn("Failed to load NN weights:", e);
    }
    return false;
}

function saveWeights() {
    try {
        localStorage.setItem("rpsNNWeights", JSON.stringify(nn.toJSON()));
    } catch (e) {
        console.warn("Failed to save NN weights:", e);
    }
}

export function getAIMove() {
    const history = stats.history;

    if (!history || history.length < 5) {
        return getRandomMove();
    }

    if (history.length < COLD_START_THRESHOLD) {
        const predicted = getEnsemblePrediction(history);
        stats.lastPrediction = predicted;
        stats.lastConfidence = 0.5;
        return COUNTERS[predicted];
    }

    if (!nn) {
        if (!loadWeights()) {
            nn = new NeuralNetwork();
            nn.initWeights();
        }
    }
    if (!replayBuffer) {
        replayBuffer = new ReplayBuffer(REPLAY_BUFFER_SIZE);
    }

    const input = encodeHistory(history);
    const probs = nn.forward(input);

    const predictedIdx = argmax(probs);
    const predictedMove = MOVES[predictedIdx];
    const confidence = probs[predictedIdx];

    stats.lastPrediction = predictedMove;
    stats.lastConfidence = confidence;

    return COUNTERS[predictedMove];
}

export function updateAI(playerMove) {
    if (stats.history.length < COLD_START_THRESHOLD) return;
    if (!nn || !replayBuffer) return;

    const input = encodeHistory(stats.history);
    const targetIdx = MOVES.indexOf(playerMove);
    const target = oneHot(targetIdx, OUTPUT_SIZE);

    replayBuffer.add({ input, target });

    const lr = getLearningRate();
    nn.forward(input);
    nn.backward(target, lr, L2_LAMBDA);

    if (replayBuffer.size() >= REPLAY_BATCH_SIZE) {
        const batch = replayBuffer.sample(REPLAY_BATCH_SIZE);
        for (const sample of batch) {
            nn.forward(sample.input);
            nn.backward(sample.target, lr * 0.5, L2_LAMBDA);
        }
    }

    totalTrainSteps++;
    if (totalTrainSteps % 10 === 0) {
        saveWeights();
    }
}
