// Função para exibir o modal de Ranking
function showRanking() {
    // Exibe o modal de ranking
    const rankingModal = document.getElementById('ranking-modal');
    rankingModal.style.display = 'block';

    // Preenche o ranking (exemplo simples, você pode adaptar conforme necessário)
    const rankingList = document.getElementById('ranking-list');
    const rankings = [
        { nome: 'Jogador 1', pontos: 1500 },
        { nome: 'Jogador 2', pontos: 1200 },
        { nome: 'Jogador 3', pontos: 1000 },
    ];
    rankingList.innerHTML = ''; // Limpa a lista antes de preenchê-la
    rankings.forEach(ranking => {
        const listItem = document.createElement('li');
        listItem.textContent = `${ranking.nome} - ${ranking.pontos} pontos`;
        rankingList.appendChild(listItem);
    });
}

// Função para fechar o modal de Ranking
function closeRanking() {
    // Fecha o modal de ranking
    const rankingModal = document.getElementById('ranking-modal');
    rankingModal.style.display = 'none';
}

// Função para exibir o modal de Créditos
function showCredits() {
    // Exibe o modal de créditos
    const creditsModal = document.getElementById('credits-modal');
    creditsModal.style.display = 'block';
}

// Função para fechar o modal de Créditos
function closeCredits() {
    // Fecha o modal de créditos
    const creditsModal = document.getElementById('credits-modal');
    creditsModal.style.display = 'none';
}

// Fechar modal de créditos ou ranking ao clicar fora deles
window.onclick = function(event) {
    const rankingModal = document.getElementById('ranking-modal');
    const creditsModal = document.getElementById('credits-modal');

    if (event.target === rankingModal) {
        rankingModal.style.display = 'none';
    }

    if (event.target === creditsModal) {
        creditsModal.style.display = 'none';
    }
}
