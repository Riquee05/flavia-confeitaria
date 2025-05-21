// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

const pedidos = [];
const usuarios = [{ email: 'admin@admin.com', senha: '123456' }];

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

app.post('/', (req, res) => {
  const { nome, email, mensagem } = req.body;
  const pedido = { id: Date.now(), nome, email, mensagem };
  pedidos.push(pedido);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: ['flavia_fernandesaraujo@outlook.com', 'henriquetech.83@gmail.com'],
    subject: 'Novo Pedido da Confeitaria',
    text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erro ao enviar email');
    } else {
      res.status(200).send('Pedido enviado com sucesso');
    }
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  if (!usuario) return res.status(401).send('Credenciais inválidas');
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/pedidos', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json(pedidos);
  } catch {
    res.status(403).send('Token inválido');
  }
});

app.delete('/pedido/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const id = parseInt(req.params.id);
    const index = pedidos.findIndex(p => p.id === id);
    if (index !== -1) pedidos.splice(index, 1);
    res.sendStatus(204);
  } catch {
    res.status(403).send('Token inválido');
  }
});

app.listen(3000, () => console.log('Backend rodando na porta 3000'));
