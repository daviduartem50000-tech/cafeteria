require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('../db/db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota raiz - útil para verificar se a API está online (health check do Railway)
app.get('/', (req, res) => {
  res.json({ status: 'online', mensagem: 'API da Cafeteria Aroma & Arte está funcionando!' });
});

/* =========================================================
   ROTAS - BEBIDAS
   ========================================================= */

// GET /api/bebidas -> lista todas as bebidas
app.get('/api/bebidas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bebidas ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar bebidas:', err);
    res.status(500).json({ erro: 'Erro ao buscar bebidas' });
  }
});

// POST /api/bebidas -> cadastra uma nova bebida
app.post('/api/bebidas', async (req, res) => {
  try {
    const { nome, descricao, preco, categoria, tamanho } = req.body;

    if (!nome || preco === undefined) {
      return res.status(400).json({ erro: 'Os campos "nome" e "preco" são obrigatórios' });
    }

    const [result] = await pool.query(
      'INSERT INTO bebidas (nome, descricao, preco, categoria, tamanho) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao || null, preco, categoria || null, tamanho || null]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      descricao,
      preco,
      categoria,
      tamanho
    });
  } catch (err) {
    console.error('Erro ao cadastrar bebida:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar bebida' });
  }
});

// DELETE /api/bebidas/:id -> exclui uma bebida pelo id
app.delete('/api/bebidas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM bebidas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Bebida não encontrada' });
    }

    res.json({ mensagem: 'Bebida excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir bebida:', err);
    res.status(500).json({ erro: 'Erro ao excluir bebida' });
  }
});

/* =========================================================
   ROTAS - COMIDAS
   ========================================================= */

// GET /api/comidas -> lista todas as comidas
app.get('/api/comidas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM comidas ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar comidas:', err);
    res.status(500).json({ erro: 'Erro ao buscar comidas' });
  }
});

// POST /api/comidas -> cadastra uma nova comida
app.post('/api/comidas', async (req, res) => {
  try {
    const { nome, descricao, preco, categoria, tamanho } = req.body;

    if (!nome || preco === undefined) {
      return res.status(400).json({ erro: 'Os campos "nome" e "preco" são obrigatórios' });
    }

    const [result] = await pool.query(
      'INSERT INTO comidas (nome, descricao, preco, categoria, tamanho) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao || null, preco, categoria || null, tamanho || null]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      descricao,
      preco,
      categoria,
      tamanho
    });
  } catch (err) {
    console.error('Erro ao cadastrar comida:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar comida' });
  }
});

// DELETE /api/comidas/:id -> exclui uma comida pelo id
app.delete('/api/comidas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM comidas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Comida não encontrada' });
    }

    res.json({ mensagem: 'Comida excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir comida:', err);
    res.status(500).json({ erro: 'Erro ao excluir comida' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
