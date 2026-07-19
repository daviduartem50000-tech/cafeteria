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
    categoria VARCHAR(50),    -- Ex: Quente, Gelada
    tamanho VARCHAR(50),      -- Ex: Pequeno, Médio, Grande
    imagem VARCHAR(500)       -- URL ou caminho da imagem usada no card
);

-- Tabela de comidas
CREATE TABLE IF NOT EXISTS comidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),    -- Ex: Doce, Salgado
    tamanho VARCHAR(50),      -- Ex: Único, Fatia, Porção
    imagem VARCHAR(500)       -- URL ou caminho da imagem usada no card
);

-- Inserts de bebidas (mesmos itens já usados no cardápio do site)
INSERT INTO bebidas (nome, descricao, preco, categoria, tamanho, imagem) VALUES
('Espresso Clássico', 'Intenso, encorpado e aromático.', 8.50, 'Quente', 'Único', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=500&q=60'),
('Cappuccino Real', 'Leite cremoso com toque de cacau.', 14.00, 'Quente', 'Médio', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=60'),
('Caramel Macchiato', 'Café gelado com caramelo e baunilha.', 16.50, 'Gelada', 'Grande', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=60'),
('Chocolate Belga', 'Quente, cremoso e com raspas de chocolate.', 15.00, 'Quente', 'Médio', '1.jpg'),
('Suco de Laranja', '100% natural, espremido na hora.', 11.00, 'Gelada', 'Médio', 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=60');

-- Inserts de comidas (mesmos itens já usados no cardápio do site)
INSERT INTO comidas (nome, descricao, preco, categoria, tamanho, imagem) VALUES
('Croissant Francês', 'Manteiga pura e massa folhada.', 12.00, 'Salgado', 'Único', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=60'),
('Red Velvet', 'Fatia fofinha com cream cheese.', 18.00, 'Doce', 'Fatia', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=500&q=60'),
('Pão de Queijo Mineiro', 'Porção com 5 unidades quentinhas.', 9.00, 'Salgado', 'Porção', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60'),
('Quiche de Alho Poró', 'Massa leve e recheio cremoso.', 14.50, 'Salgado', 'Fatia', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=500&q=60'),
('Cheesecake Berry', 'Com calda artesanal de frutas vermelhas.', 19.50, 'Doce', 'Fatia', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=60');
