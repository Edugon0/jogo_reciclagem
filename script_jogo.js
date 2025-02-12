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

function saveScore(name, score) {
    atualizarRanking(name, score);
    displayFinalScore(score);
}

function displayFinalScore(score) {
    document.getElementById('finalScore').textContent = score;
    document.getElementById('nameModal').style.display = 'block';
}

document.getElementById('nameForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('playerName').value;
    await saveScore(name, score);
    document.getElementById('nameModal').style.display = 'none';
    resetGame();
});

function resetGame() {
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    score = matchedPairs * 10;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('score').textContent = score;
    document.getElementById('nameModal').style.display = 'none';
    document.getElementById('playerName').value = '';
    createBoard();
}

function atualizarRanking(nome, pontuacao) {
    let dadosRanking = JSON.parse(localStorage.getItem('dadosRanking')) || [];
    dadosRanking.push({ nome: nome, pontuacao: pontuacao });
    dadosRanking.sort((a, b) => b.pontuacao - a.pontuacao);
    if (dadosRanking.length > 5) {
        dadosRanking = dadosRanking.slice(0, 5);
    }
    localStorage.setItem('dadosRanking', JSON.stringify(dadosRanking));
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
        if (matchedPairs === items.length / 2) {
            setTimeout(() => {
                displayFinalScore(score);
            }, 500);
        }
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


// A cada 3 tentativas, desconta 0,5 pontos da pontuação
function updateScore() {
    // A cada 3 tentativas, desconta 0,5 pontos
    if (attempts % 3 === 0 && attempts !== 0) {
        score -= 0.5;
    }

    // Atualiza a pontuação na tela
    document.getElementById('score').textContent = score;
}

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
        updateScore(); // Atualiza a pontuação
        setTimeout(checkMatch, 800); // Espera 800ms para verificar correspondência
    }
}



function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.item.cor === card2.item.cor) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;

        // Adiciona pontos ao score
        score += 10;
        document.getElementById('score').textContent = score;

        // Se todos os pares foram encontrados, exibe o modal de pontuação final
        if (matchedPairs === items.length / 2) {
            setTimeout(() => {
                document.getElementById('finalScore').textContent = score;
                document.getElementById('nameModal').style.display = 'block';
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.element.textContent = '';
            card2.element.textContent = '';
            card1.element.classList.remove('flipped', card1.item.classe);
            card2.element.classList.remove('flipped', card2.item.classe);
        }, 1000);
    }

    flippedCards = []; // Reseta a lista de cartas viradas
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
}


function goToMenu() {
    // Aqui você pode definir a lógica para voltar ao menu principal.
    // Por exemplo, redirecionar para outra página ou mostrar/ocultar elementos.
    window.location.href = 'index.html'; // Exemplo de redirecionamento para outra página
}

// Event listener para o formulário de nome
document.getElementById('nameForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('playerName').value;
    await saveScore(name, score); // Envia a pontuação final
    document.getElementById('nameModal').style.display = 'none';
    resetGame();
});

// Carregar pontuações ao iniciar o jogo
loadHighScores();

// Iniciar o jogo
createBoard();
 
