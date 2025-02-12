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

// Função para salvar a pontuação
async function saveScore(name, score) {
    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, score }),
        });
        if (response.ok) {
            loadHighScores();
        }
    } catch (error) {
        console.error('Erro ao salvar pontuação:', error);
    }
}

// Função para carregar as melhores pontuações
async function loadHighScores() {
    try {
        const response = await fetch('/api/scores');
        const scores = await response.json();
        
        const scoresList = document.getElementById('scoresList');
        scoresList.innerHTML = '';
        
        scores.sort((a, b) => a.score - b.score)  // Ordenar por menor número de tentativas
             .slice(0, 5)  // Pegar apenas os 5 melhores
             .forEach(score => {
                 const li = document.createElement('li');
                 li.innerHTML = `<span>${score.name}</span> <span>${score.score} tentativas</span>`;
                 scoresList.appendChild(li);
             });
    } catch (error) {
        console.error('Erro ao carregar pontuações:', error);
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
        return {
            element: card,
            item: item
        };
    });
}

function flipCard() {
    const cardObj = cards.find(c => c.element === this);
    
    if (
        flippedCards.length === 2 ||
        flippedCards.includes(cardObj) ||
        this.classList.contains('matched')
    ) {
        return;
    }

    this.textContent = cardObj.item.emoji;
    this.classList.add('flipped', cardObj.item.classe);
    flippedCards.push(cardObj);

    if (flippedCards.length === 2) {
        attempts++;
        document.getElementById('attempts').textContent = attempts;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.item.cor === card2.item.cor;

    if (match) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;

        if (matchedPairs === items.length / 2) {
            setTimeout(() => {
                document.getElementById('finalScore').textContent = attempts;
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

    flippedCards = [];
}

function resetGame() {
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('nameModal').style.display = 'none';
    document.getElementById('playerName').value = '';
    createBoard();
}

function goToMenu() {
    // Aqui você pode definir a lógica para voltar ao menu principal.
    // Por exemplo, redirecionar para outra página ou mostrar/ocultar elementos.
    window.location.href = 'menu.html'; // Exemplo de redirecionamento para outra página
}

// Event listener para o formulário de nome
document.getElementById('nameForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('playerName').value;
    await saveScore(name, attempts);
    document.getElementById('nameModal').style.display = 'none';
    resetGame();
});



// Carregar pontuações ao iniciar o jogo
loadHighScores();

// Iniciar o jogo
createBoard();