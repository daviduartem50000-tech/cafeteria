-- =========================================================
-- Banco de dados: cafeteria
-- =========================================================

CREATE DATABASE IF NOT EXISTS cafeteria;
USE cafeteria;

-- Tabela de bebidas
CREATE TABLE IF NOT EXISTS bebidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),   -- Ex: Quente, Gelada
    tamanho VARCHAR(50)      -- Ex: Pequeno, Médio, Grande
);

-- Tabela de comidas
CREATE TABLE IF NOT EXISTS comidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),   -- Ex: Doce, Salgado
    tamanho VARCHAR(50)      -- Ex: Único, Fatia, Porção
);

-- Inserts de bebidas (mesmos itens já usados no cardápio do site)
INSERT INTO bebidas (nome, descricao, preco, categoria, tamanho) VALUES
('Espresso Clássico', 'Intenso, encorpado e aromático.', 8.50, 'Quente', 'Único'),
('Cappuccino Real', 'Leite cremoso com toque de cacau.', 14.00, 'Quente', 'Médio'),
('Caramel Macchiato', 'Café gelado com caramelo e baunilha.', 16.50, 'Gelada', 'Grande'),
('Chocolate Belga', 'Quente, cremoso e com raspas de chocolate.', 15.00, 'Quente', 'Médio'),
('Suco de Laranja', '100% natural, espremido na hora.', 11.00, 'Gelada', 'Médio');

-- Inserts de comidas (mesmos itens já usados no cardápio do site)
INSERT INTO comidas (nome, descricao, preco, categoria, tamanho) VALUES
('Croissant Francês', 'Manteiga pura e massa folhada.', 12.00, 'Salgado', 'Único'),
('Red Velvet', 'Fatia fofinha com cream cheese.', 18.00, 'Doce', 'Fatia'),
('Pão de Queijo Mineiro', 'Porção com 5 unidades quentinhas.', 9.00, 'Salgado', 'Porção'),
('Quiche de Alho Poró', 'Massa leve e recheio cremoso.', 14.50, 'Salgado', 'Fatia'),
('Cheesecake Berry', 'Com calda artesanal de frutas vermelhas.', 19.50, 'Doce', 'Fatia');
