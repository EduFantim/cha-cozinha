const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Caminho para o arquivo JSON
const FILE = path.join(__dirname, 'lista.json');

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos do frontend (HTML, JS, CSS na pasta "public")
app.use(express.static(path.join(__dirname, 'public')));

// Função para carregar a lista do arquivo
function loadList() {
    if (!fs.existsSync(FILE)) {
        return []; // Retorna lista vazia se o arquivo não existe
    }
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

// Função para salvar a lista no arquivo
function saveList(lista) {
    fs.writeFileSync(FILE, JSON.stringify(lista, null, 2));
}

// Endpoint para pegar a lista
app.get('/api/lista', (req, res) => {
    const lista = loadList();
    res.json(lista);
});

// Endpoint para reservar item
app.post('/api/reservar', (req, res) => {
    const { id } = req.body;
    let lista = loadList();
    let item = lista.find(i => i.id === id);

    if (item && item.disponivel) {
        item.disponivel = false;
        saveList(lista);
        return res.json({ sucesso: true });
    } else {
        return res.status(400).json({ erro: "Item já reservado" });
    }
});

// Start do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
