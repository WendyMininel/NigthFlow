const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limite
    fileFilter: fileFilter
});

app.use('/uploads', express.static('uploads'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fatec',
    database: 'nightflow_db'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

app.get('/', (req, res) => {
    res.json({ 
        mensagem: 'API NightFlow rodando!',
        endpoints: {
            eventos: '/api/eventos',
            evento_por_id: '/api/eventos/:id',
            ingressos_do_evento: '/api/eventos/:id/ingressos',
            usuarios: '/api/usuarios',
            compras: '/api/compras',
            upload: '/api/upload (POST - multipart/form-data)'
        }
    });
});

app.post('/api/upload', upload.single('imagem'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    const imagemUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ 
        success: true, 
        imagem_url: imagemUrl,
        filename: req.file.filename
    });
});


app.get('/api/eventos', (req, res) => {
    db.query('SELECT * FROM eventos ORDER BY data ASC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar eventos:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.get('/api/eventos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM eventos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar evento:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Evento não encontrado' });
            return;
        }
        res.json(results[0]);
    });
});

app.get('/api/eventos/:id/ingressos', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM ingressos WHERE evento_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar ingressos:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.get('/api/usuarios', (req, res) => {
    db.query('SELECT id, nome, email, telefone, area FROM usuarios', (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.get('/api/usuarios/:id/compras', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM compras WHERE usuario_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar compras:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT id, nome, email, telefone, area FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.json(results[0]);
    });
});


app.post('/api/eventos', (req, res) => {
    const { usuario_id, nome, descricao, artista, data, horario, local, endereco, imagem_url, categoria } = req.body;
    
    const query = `INSERT INTO eventos (usuario_id, nome, descricao, artista, data, horario, local, endereco, imagem_url, categoria) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [usuario_id, nome, descricao, artista, data, horario, local, endereco, imagem_url, categoria], (err, result) => {
        if (err) {
            console.error('Erro ao criar evento:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: result.insertId, message: 'Evento criado com sucesso!' });
    });
});

app.post('/api/usuarios', (req, res) => {
    const { nome, email, telefone, senha, area } = req.body;
    
    const query = `INSERT INTO usuarios (nome, email, telefone, senha, area) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [nome, email, telefone, senha, area || 'cliente'], (err, result) => {
        if (err) {
            console.error('Erro ao criar usuário:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: result.insertId, message: 'Usuário criado com sucesso!' });
    });
});

app.post('/api/ingressos', (req, res) => {
    const { evento_id, tipo, lote, preco, quantidade_total, quantidade_vendida } = req.body;
    
    const query = `INSERT INTO ingressos (evento_id, tipo, lote, preco, quantidade_total, quantidade_vendida) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [evento_id, tipo, lote, preco, quantidade_total, quantidade_vendida || 0], (err, result) => {
        if (err) {
            console.error('Erro ao criar ingresso:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: result.insertId, message: 'Ingresso criado com sucesso!' });
    });
});

app.post('/api/compras', (req, res) => {
    const { usuario_id, ingresso_id, quantidade, preco_unitario } = req.body;
    const preco_total = preco_unitario * quantidade;
    const qr_code = `QR-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const query = `INSERT INTO compras (usuario_id, ingresso_id, quantidade, preco_unitario, preco_total, qr_code) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [usuario_id, ingresso_id, quantidade, preco_unitario, preco_total, qr_code], (err, result) => {
        if (err) {
            console.error('Erro ao criar compra:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        db.query('UPDATE ingressos SET quantidade_vendida = quantidade_vendida + ? WHERE id = ?', [quantidade, ingresso_id]);
        
        res.status(201).json({ id: result.insertId, message: 'Compra realizada com sucesso!', qr_code });
    });
});


app.put('/api/eventos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, artista, data, horario, local, endereco, imagem_url, categoria } = req.body;
    
    const query = `UPDATE eventos SET nome = ?, descricao = ?, artista = ?, data = ?, horario = ?, 
                   local = ?, endereco = ?, imagem_url = ?, categoria = ? WHERE id = ?`;
    
    db.query(query, [nome, descricao, artista, data, horario, local, endereco, imagem_url, categoria, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar evento:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Evento não encontrado' });
            return;
        }
        res.json({ message: 'Evento atualizado com sucesso!' });
    });
});

app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, area } = req.body;
    
    const query = `UPDATE usuarios SET nome = ?, email = ?, telefone = ?, area = ? WHERE id = ?`;
    
    db.query(query, [nome, email, telefone, area, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.json({ message: 'Usuário atualizado com sucesso!' });
    });
});


app.delete('/api/eventos/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('SELECT imagem_url FROM eventos WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar evento:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (results.length > 0 && results[0].imagem_url) {
            const imagemPath = results[0].imagem_url.replace(`http://localhost:${PORT}/uploads/`, 'uploads/');
            if (fs.existsSync(imagemPath)) {
                fs.unlinkSync(imagemPath);
            }
        }
        
        db.query('DELETE FROM eventos WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error('Erro ao deletar evento:', err);
                res.status(500).json({ error: err.message });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Evento não encontrado' });
                return;
            }
            res.json({ message: 'Evento deletado com sucesso!' });
        });
    });
});

app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar usuário:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Usuário não encontrado' });
            return;
        }
        res.json({ message: 'Usuário deletado com sucesso!' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Uploads salvos em: ${__dirname}/uploads`);
});