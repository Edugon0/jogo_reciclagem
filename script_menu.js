// Função para exibir o modal de Ranking
async function showRanking() {
    await loadHighScores(); // Aguarda o carregamento antes de exibir
    document.getElementById('ranking-modal').style.display = 'block';
}

// Função para fechar o modal de Ranking
function closeRanking() {
    document.getElementById('ranking-modal').style.display = 'none';
}

// Função para carregar as melhores pontuações da API
async function loadHighScores() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '<li>Carregando ranking...</li>'; // Mensagem temporária

    try {
        const response = await fetch('http://localhost:3000/api/scores'); // Ajuste a URL conforme necessário
        if (!response.ok) throw new Error('Erro ao carregar ranking');

        const dadosRanking = await response.json();
        console.log("Dados recebidos da API:", dadosRanking);

        rankingList.innerHTML = ''; // Limpa a mensagem de carregamento

        if (dadosRanking.length === 0) {
            rankingList.innerHTML = '<li>Nenhuma pontuação disponível.</li>';
            return;
        }

        dadosRanking.forEach(score => {
            const li = document.createElement('li');
            li.textContent = `${score.name} - ${score.score} pontos`;
            rankingList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        rankingList.innerHTML = '<li>Erro ao carregar ranking.</li>';
    }
}

// Função para exibir o modal de Créditos
function showCredits() {
    document.getElementById('credits-modal').style.display = 'block';
}

// Função para fechar o modal de Créditos
function closeCredits() {
    document.getElementById('credits-modal').style.display = 'none';
}

// Fechar modal de créditos ou ranking ao clicar fora deles
window.onclick = function(event) {
    const rankingModal = document.getElementById('ranking-modal');
    const creditsModal = document.getElementById('credits-modal');

    if (event.target === rankingModal) closeRanking();
    if (event.target === creditsModal) closeCredits();
};
