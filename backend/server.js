
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'segredo123';

let pedidos = [];
let usuarios = [{ email: "admin@admin.com", senha: "123456" }];

app.use(cors());
app.use(bodyParser.json());

app.post("/", (req, res) => {
  const { nome, email, mensagem } = req.body;
  const novoPedido = { id: Date.now(), nome, email, mensagem };
  pedidos.push(novoPedido);
  res.status(200).json({ sucesso: true });
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  if (usuario) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ erro: "Credenciais inválidas" });
  }
});

function autenticar(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(403).end();
  const token = auth.split(" ")[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).end();
    req.usuario = decoded;
    next();
  });
}

app.get("/pedidos", autenticar, (req, res) => {
  res.json(pedidos);
});

app.delete("/pedido/:id", autenticar, (req, res) => {
  pedidos = pedidos.filter(p => p.id != req.params.id);
  res.status(204).end();
});

app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
