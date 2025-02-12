const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Substitui bodyParser.json()

let scores = [];

// Rota para obter as pontuações
app.get('/api/scores', (req, res) => {
    res.json(scores);
});

// Rota para adicionar uma nova pontuação
app.post('/api/scores', (req, res) => {
    const { name, score } = req.body;

    // Validação da entrada
    if (!name || typeof name !== 'string' || !score || typeof score !== 'number') {
        return res.status(400).json({ error: 'Nome ou pontuação inválidos' });
    }

    // Sanitização dos dados
    const sanitizedScore = Math.max(0, score);
    const sanitizedName = name.trim();

    scores.push({ name: sanitizedName, score: sanitizedScore });
    scores.sort((a, b) => b.score - a.score); // Ordenar por pontuação decrescente
    scores = scores.slice(0, 5); // Manter apenas as 5 melhores pontuações

    res.sendStatus(201); // Responde apenas com o status
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
