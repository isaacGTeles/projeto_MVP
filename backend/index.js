const express = require('express');
const pool = require('./src/database');
const cors = require('cors'); // 1. Importe o cors
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rota de teste para ver se o banco responde
app.get('/teste-banco', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: "Banco conectado com sucesso!", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para cadastrar um novo abrigo
app.post('/abrigos', async (req, res) => {
    const { nome, endereco, telefone, capacidade_total, vagas_disponiveis, aceita_pets, tem_cozinha } = req.body;

    // VALIDAÇÃO AQUI: impede cadastrar com vagas negativas ou maior que a capacidade
    if (vagas_disponiveis < 0) {
        return res.status(400).json({ error: "O número de vagas não pode ser negativo." });
    }
    if (vagas_disponiveis > capacidade_total) {
        return res.status(400).json({ error: "As vagas disponíveis não podem exceder a capacidade total." });
    }
    
    try {
        const novoAbrigo = await pool.query(
            `INSERT INTO abrigos (nome, endereco, telefone, capacidade_total, vagas_disponiveis, aceita_pets, tem_cozinha) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [nome, endereco, telefone, capacidade_total, vagas_disponiveis, aceita_pets, tem_cozinha]
        );
        res.status(201).json(novoAbrigo.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erro ao cadastrar abrigo" });
    }
});

// Rota para listar todos os abrigos
app.get('/abrigos', async (req, res) => {
    try {
        const todosAbrigos = await pool.query("SELECT * FROM abrigos ORDER BY id ASC");
        res.json(todosAbrigos.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erro ao buscar abrigos" });
    }
});

// Rota para atualizar apenas as vagas disponíveis de um abrigo
app.patch('/abrigos/:id/vagas', async (req, res) => {
    const { id } = req.params;
    const { vagas_disponiveis } = req.body;

    try {
        const atualizacao = await pool.query(
            "UPDATE abrigos SET vagas_disponiveis = $1 WHERE id = $2 RETURNING *",
            [vagas_disponiveis, id]
        );

        if (atualizacao.rows.length === 0) {
            return res.status(404).json({ error: "Abrigo não encontrado" });
        }

        res.json(atualizacao.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Erro ao atualizar vagas" });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});