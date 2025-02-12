const items = [
    { tipo: 'lixeira', cor: 'verde', emoji: '🗑️', classe: 'verde' },
    { tipo: 'item', cor: 'verde', emoji: '🍾', classe: 'verde' },
    { tipo: 'lixeira', cor: 'vermelho', emoji: '🗑️', classe: 'vermelho' },
    { tipo: 'item', cor: 'vermelho', emoji: '🥤', classe: 'vermelho' },
    { tipo: 'lixeira', cor: 'amarelo', emoji: '🗑️', classe: 'amarelo' },
    { tipo: 'item', cor: 'amarelo', emoji: '🥫', classe: 'amarelo' },
    { tipo: 'lixeira', cor: 'azul', emoji: '🗑️', classe: 'azul' },
    { tipo: 'item', cor: 'azul', emoji: '📰', classe: 'azul' },
    { tipo: 'lixeira', cor: 'marrom', emoji: '🗑️', classe: 'marrom' },
    { tipo: 'item', cor: 'marrom', emoji: '🍎', classe: 'marrom' },
    { tipo: 'lixeira', cor: 'laranja', emoji: '🗑️', classe: 'laranja' },
    { tipo: 'item', cor: 'laranja', emoji: '🔋', classe: 'laranja' }
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let score = 0;

// Funções de áudio
function startBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.play().catch(error => {
        console.log("Erro ao tocar música:", error);
    });
}

function stopBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

// Funções do jogo
function createBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    cards = shuffledItems.map((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.color = item.cor;
        card.dataset.tipo = item.tipo;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        return { element: card, item: item };
    });
}

function flipCard() {
    if (flippedCards.length === 2) return;

    const cardIndex = this.dataset.index;
    const cardObj = cards[cardIndex];

    if (flippedCards.includes(cardObj) || this.classList.contains('matched')) return;

    this.textContent = cardObj.item.emoji;
    this.classList.add('flipped', cardObj.item.classe);
    flippedCards.push(cardObj);

    if (flippedCards.length === 2) {
        attempts++;
        document.getElementById('attempts').textContent = attempts;
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.item.cor === card2.item.cor;

    if (match) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        score += 10;
        document.getElementById('score').textContent = score;
        checkGameCompletion();
    } else {
        setTimeout(() => {
            card1.element.textContent = '';
            card2.element.textContent = '';
            card1.element.classList.remove('flipped', card1.item.classe);
            card2.element.classList.remove('flipped', card2.item.classe);
        }, 1000);
    }
    flippedCards = [];
}

// Funções de finalização e pontuação
function showConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function gameCompleted() {
    console.log("Função gameCompleted chamada");
    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = score;
    document.getElementById('nameModal').style.display = 'block';
    showConfetti();
}

function checkGameCompletion() {
    if (matchedPairs === items.length / 2) {
        gameCompleted();
    }
}

// Funções de salvamento e carregamento de pontuações
function saveScore(name, score) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    
    const newScore = {
        name: name,
        score: score,
        date: new Date().toISOString()
    };
    
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    const top10Scores = highScores.slice(0, 10);
    localStorage.setItem('highScores', JSON.stringify(top10Scores));
}

function loadHighScores() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '<li>Carregando ranking...</li>';
    
    try {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        rankingList.innerHTML = '';
        
        if (highScores.length === 0) {
            rankingList.innerHTML = '<li>Nenhuma pontuação disponível.</li>';
            return;
        }
        
        highScores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${score.name} - ${score.score} pontos`;
            rankingList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao carregar ranking:', error);
        rankingList.innerHTML = '<li>Erro ao carregar ranking.</li>';
    }
}

// Funções de controle do jogo
function resetGame() {
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    score = 0;

    document.getElementById('attempts').textContent = attempts;
    document.getElementById('score').textContent = score;
    document.getElementById('nameModal').style.display = 'none';
    document.getElementById('playerName').value = '';
    setTimeout(createBoard, 300);
    stopBackgroundMusic();
}

function goToMenu() {
    window.location.href = 'index.html';
}

// Inicialização e Event Listeners
function initGame() {
    createBoard();
    document.addEventListener('click', function initAudio() {
        startBackgroundMusic();
        document.removeEventListener('click', initAudio);
    }, { once: true });
}

// Event Listeners
document.getElementById('nameForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('playerName').value;
    saveScore(name, score);
    document.getElementById('nameModal').style.display = 'none';
    resetGame();
});

document.querySelector('.button.voltar a').addEventListener('click', goToMenu);

// Iniciar o jogo
initGame();