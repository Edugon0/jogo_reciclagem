const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o pacote cors
const app = express();
const port = 3000;

// Use o middleware cors
app.use(cors());

// Middleware para analisar o corpo das requisições em formato JSON
app.use(bodyParser.json());

let scores = [];

// Rota para obter as pontuações
app.get('/api/scores', (req, res) => {
    res.json(scores);
});

// Rota para adicionar uma nova pontuação
app.post('/api/scores', (req, res) => {
    const { name, score } = req.body;
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score); // Ordenar por pontuação decrescente
    scores = scores.slice(0, 5); // Manter apenas as 5 melhores pontuações
    res.status(201).json({ message: 'Pontuação adicionada com sucesso!' });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
