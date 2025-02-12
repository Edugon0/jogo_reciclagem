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

// Função para tocar música de fundo
function startBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.play(); // Começa a música
}

// Função para parar música de fundo
function stopBackgroundMusic() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.pause(); // Para a música
    backgroundMusic.currentTime = 0; // Reseta a música para o início
}

// Função para exibir confetes
function showConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Função para quando o jogo for completado
function gameCompleted() {
    const score = document.getElementById('score').textContent; // Pontuação do jogador
    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = score; // Atualiza a pontuação no modal

    document.getElementById('nameModal').style.display = 'block';

    showConfetti(); // Confetes chamados junto com o modal
}


function checkGameCompletion() {
    if (matchedPairs === items.length / 2) { 
        gameCompleted();
    }
}


async function saveScore(name, score) {
    try {
        const response = await fetch('http://localhost:3000/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score }),
        });
        if (response.ok) {
            displayFinalScore(score);
        }
    } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
    }
}


function displayFinalScore(score) {
    document.getElementById('finalScore').textContent = score;
    document.getElementById('nameModal').style.display = 'block';
}


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

function resetGame() {
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    score = 0;

    document.getElementById('attempts').textContent = attempts;
    document.getElementById('score').textContent = score;
    document.getElementById('nameModal').style.display = 'none';
    document.getElementById('playerName').value = '';
    setTimeout(createBoard, 300); // Garante que a UI é resetada antes de criar novo tabuleiro
    stopBackgroundMusic(); // Para a música de fundo
    startBackgroundMusic(); // Reinicia a música de fundo
}

// Função para verificar se houve correspondência de cartas
function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.item.cor === card2.item.cor;

    if (match) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        score += 10;
        document.getElementById('score').textContent = score;
        checkGameCompletion(); // Verifica se o jogo foi completado após essa correspondência
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

// Função para virar as cartas
function flipCard() {
    if (flippedCards.length === 2) return; // Impede virar mais de 2 cartas ao mesmo tempo

    const cardIndex = this.dataset.index;
    const cardObj = cards[cardIndex];

    if (flippedCards.includes(cardObj) || this.classList.contains('matched')) return; // Evita virar cartas já combinadas

    this.textContent = cardObj.item.emoji;
    this.classList.add('flipped', cardObj.item.classe);
    flippedCards.push(cardObj);

    if (flippedCards.length === 2) {
        attempts++;
        document.getElementById('attempts').textContent = attempts;
        setTimeout(checkMatch, 800); // Espera 800ms para verificar correspondência
    }
}

// Event listener para o formulário de nome
document.getElementById('nameForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('playerName').value;
    await saveScore(name, score);
    document.getElementById('nameModal').style.display = 'none';
    resetGame();
});

// Função para voltar ao menu
function goToMenu() {
    // Aqui, você pode definir o comportamento do botão voltar. Por exemplo:
    window.location.href = 'index.html'; // Substitua 'menu.html' pela sua página de menu
}

// Event listener para o botão de voltar
document.querySelector('.button.voltar a').addEventListener('click', goToMenu);

// Iniciar o jogo e tocar música de fundo
startBackgroundMusic();
