-- Classe usada no app My.sql
DROP DATABASE IF EXISTS nightflow_db;

CREATE DATABASE nightflow_db;

USE nightflow_db;

ALTER TABLE eventos MODIFY COLUMN imagem_url TEXT;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    area VARCHAR(20) DEFAULT 'cliente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    artista VARCHAR(200),
    data DATE NOT NULL,
    horario TIME NOT NULL,
    local VARCHAR(200) NOT NULL,
    endereco TEXT,
    imagem_url VARCHAR(500),
    categoria VARCHAR(50),
    status ENUM('ativo', 'vencido') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE ingressos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    lote VARCHAR(50) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade_total INT NOT NULL,
    quantidade_vendida INT DEFAULT 0,
    disponivel BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);

CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ingresso_id INT NOT NULL,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    preco_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    qr_code VARCHAR(500),
    data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (ingresso_id) REFERENCES ingressos(id)
);

INSERT INTO usuarios (nome, email, telefone, senha, area) VALUES 
('João Silva', 'joao@email.com', '(11) 99999-9999', '123456', 'cliente'),
('Maria Santos', 'maria@email.com', '(11) 88888-8888', '123456', 'organizador');

INSERT INTO eventos (usuario_id, nome, descricao, artista, data, horario, local, endereco, imagem_url, categoria) VALUES 
(2, 'Ultra Music Festival', 'O maior festival de música eletrônica do mundo', 'DJ Alok', '2026-12-15', '22:00:00', 'Palácio Sunset', 'Av. Principal, 1000 - SP', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop', 'eletronica'),
(2, 'Rock in Rio', 'O maior festival de rock do mundo', 'Foo Fighters', '2027-09-20', '20:00:00', 'Parque Sunset', 'Av. das Nações, 500 - RJ', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&h=300&fit=crop', 'rock'),
(2, 'Funk Invasion', 'O maior evento de funk do Brasil', 'MC Kevinho', '2027-10-05', '21:00:00', 'Arena Night', 'Rua Funk, 200 - BH', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop', 'funk'),
(2, 'Trap Nation', 'O melhor do trap nacional e internacional', 'Travis Scott', '2026-11-18', '23:00:00', 'Club 338', 'Rua do Trap, 50 - SP', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', 'rap/trap');

INSERT INTO ingressos (evento_id, tipo, lote, preco, quantidade_total, quantidade_vendida) VALUES 
(1, 'Pista', 'Lote 1', 150.00, 500, 120),
(1, 'Pista', 'Lote 2', 200.00, 500, 0),
(1, 'VIP', 'Lote 1', 500.00, 100, 30),
(2, 'Pista', 'Lote 1', 200.00, 1000, 450),
(2, 'VIP', 'Lote 1', 600.00, 200, 50),
(3, 'Pista', 'Lote 1', 80.00, 800, 300),
(3, 'Pista', 'Lote 2', 120.00, 500, 0),
(4, 'Pista', 'Lote 1', 120.00, 600, 200),
(4, 'VIP', 'Lote 1', 300.00, 150, 40);

SELECT 'Usuários:' as '';
SELECT * FROM usuarios;

SELECT 'Eventos:' as '';
SELECT * FROM eventos;

SELECT 'Ingressos:' as '';
SELECT * FROM ingressos;