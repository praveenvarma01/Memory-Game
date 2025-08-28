"use strict"; 

function startGame() {
    const SYMBOLS = [
        "🍎", "🍌", "🍇", "🍉", "🍒", "🍍", "🥝", "🥑",
        "🦊", "🐶", "🐱", "🐼", "🐵", "🦁", "🐸", "🦄",
        "🚗", "✈️"
    ];

    let NUM_PAIRS = 8;
    if (window.innerWidth >= 992) {
        NUM_PAIRS = 10;
    }

    const gridEl = document.getElementById("game-grid");
    const attemptsEl = document.getElementById("attemptsCount");
    const matchesEl = document.getElementById("matchesCount");
    const resetBtn = document.getElementById("resetBtn");
    const finalAttemptsEl = document.getElementById("finalAttempts");
    const playAgainBtn = document.getElementById("playAgainBtn");

    let deck = [];
    let flippedCards = [];
    let isBoardLocked = false;
    let attempts = 0;
    let matches = 0;
    let gameOverModalInstance = null;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function buildDeck() {
        const selected = SYMBOLS.slice(0, NUM_PAIRS);
        const pairDeck = selected.concat(selected).map((symbol, index) => ({ id: index, symbol }));
        return shuffle(pairDeck);
    }

    function renderGrid() {
        gridEl.innerHTML = "";
        const fragment = document.createDocumentFragment();

        deck.forEach((card, index) => {
            const tile = document.createElement("div");
            tile.className = "card-tile";
            tile.setAttribute("role", "gridcell");

            const inner = document.createElement("div");
            inner.className = "card-inner";

            const front = document.createElement("div");
            front.className = "card-face card-front";
            front.textContent = "?";

            const back = document.createElement("div");
            back.className = "card-face card-back";
            back.textContent = card.symbol;

            const button = document.createElement("button");
            button.className = "card-button";
            button.type = "button";
            button.addEventListener("click", () => onCardClick(tile, index));

            inner.appendChild(front);
            inner.appendChild(back);
            tile.appendChild(inner);
            tile.appendChild(button);
            fragment.appendChild(tile);
        });

        gridEl.appendChild(fragment);
    }

    function updateStats() {
        attemptsEl.textContent = String(attempts);
        matchesEl.textContent = String(matches);
    }

    function onCardClick(tile, index) {
        if (isBoardLocked) return;
        if (tile.classList.contains("matched")) return;
        if (flippedCards.some(fc => fc.index === index)) return;

        flipTile(tile, true);
        flippedCards.push({ tile, index });

        if (flippedCards.length === 2) {
            isBoardLocked = true;
            attempts += 1;
            updateStats();

            const [first, second] = flippedCards;
            const isMatch = deck[first.index].symbol === deck[second.index].symbol;

            setTimeout(() => {
                if (isMatch) {
                    first.tile.classList.add("matched");
                    second.tile.classList.add("matched");
                    matches += 1;
                    updateStats();
                    checkGameOver();
                } else {
                    flipTile(first.tile, false);
                    flipTile(second.tile, false);
                }
                flippedCards = [];
                isBoardLocked = false;
            }, isMatch ? 300 : 800);
        }
    }

    function flipTile(tile, showBack) {
        if (showBack) {
            tile.classList.add("flipped");
        } else {
            tile.classList.remove("flipped");
        }
    }

    function checkGameOver() {
        if (matches === NUM_PAIRS) {
            finalAttemptsEl.textContent = String(attempts);
            const modalEl = document.getElementById("gameOverModal");
            gameOverModalInstance = new bootstrap.Modal(modalEl);
            gameOverModalInstance.show();
        }
    }

    function resetGame() {
        attempts = 0;
        matches = 0;
        flippedCards = [];
        isBoardLocked = false;
        deck = buildDeck();
        updateStats();
        renderGrid();
    }

    resetBtn.addEventListener("click", resetGame);
    if (playAgainBtn) {
        playAgainBtn.addEventListener("click", () => {
            if (gameOverModalInstance) {
                gameOverModalInstance.hide();
            }
            resetGame();
        });
    }

    deck = buildDeck();
    updateStats();
    renderGrid();
}

startGame();



