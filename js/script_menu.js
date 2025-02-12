// Função para exibir o modal de Ranking
function showRanking() {
    loadHighScores(); // Carrega as pontuações do localStorage
    document.getElementById('ranking-modal').style.display = 'block';
}

// Função para fechar o modal de Ranking
function closeRanking() {
    document.getElementById('ranking-modal').style.display = 'none';
}

// Função para carregar as melhores pontuações do localStorage
function loadHighScores() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '<li>Carregando ranking...</li>';
    
    try {
        // Recupera as pontuações do localStorage
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        
        rankingList.innerHTML = ''; // Limpa a mensagem de carregamento
        
        if (highScores.length === 0) {
            rankingList.innerHTML = '<li class="ranking-item">Nenhuma pontuação disponível.</li>';
            return;
        }
        
        // Criar tabela de ranking
        const table = document.createElement('table');
        table.className = 'ranking-table';
        
        // Criar cabeçalho da tabela
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Posição</th>
                <th>Nome</th>
                <th>Pontuação</th>
                <th>Data</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Criar corpo da tabela
        const tbody = document.createElement('tbody');
        highScores.forEach((score, index) => {
            const row = document.createElement('tr');
            const date = new Date(score.date).toLocaleDateString();
            row.innerHTML = `
                <td>${index + 1}º</td>
                <td>${score.name}</td>
                <td>${score.score} pontos</td>
                <td>${date}</td>
            `;
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        rankingList.appendChild(table);
        
    } catch (error) {
        console.error('Erro ao carregar ranking:', error);
        rankingList.innerHTML = '<li class="ranking-item">Erro ao carregar ranking.</li>';
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

// Fechar modais ao clicar fora deles
window.onclick = function(event) {
    const rankingModal = document.getElementById('ranking-modal');
    const creditsModal = document.getElementById('credits-modal');
    if (event.target === rankingModal) closeRanking();
    if (event.target === creditsModal) closeCredits();
};