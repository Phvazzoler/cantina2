-- ==============================================================
-- Cantina SENAI - preparação inicial do banco
-- Execute este arquivo inteiro UMA VEZ no MySQL Workbench.
-- Ele pode ser executado novamente sem apagar os pedidos.
-- As credenciais são somente para o laboratório local.
-- ==============================================================

CREATE DATABASE IF NOT EXISTS cantina_senai_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'cantina'@'localhost'
    IDENTIFIED BY 'cantina123';

ALTER USER 'cantina'@'localhost'
    IDENTIFIED BY 'cantina123';

GRANT SELECT, INSERT, UPDATE
    ON cantina_senai_db.*
    TO 'cantina'@'localhost';

FLUSH PRIVILEGES;

USE cantina_senai_db;

CREATE TABLE IF NOT EXISTS produtos (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    categoria VARCHAR(40) NOT NULL,
    descricao VARCHAR(160) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    emoji VARCHAR(16) NOT NULL DEFAULT '🍽️',
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_produtos PRIMARY KEY (id),
    CONSTRAINT uk_produtos_nome UNIQUE (nome),
    CONSTRAINT ck_produtos_preco CHECK (preco >= 0)
);

CREATE TABLE IF NOT EXISTS cupons (
    id INT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(120) NOT NULL,
    percentual DECIMAL(5, 2) NOT NULL,
    data_cupom DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_cupons PRIMARY KEY (id),
    CONSTRAINT uk_cupons_data UNIQUE (data_cupom),
    CONSTRAINT ck_cupons_percentual CHECK (
        percentual >= 0 AND percentual <= 100
    )
);

CREATE TABLE IF NOT EXISTS pedidos (
    id INT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL,
    nome_aluno VARCHAR(100) NOT NULL,
    matricula VARCHAR(30) NOT NULL,
    periodo VARCHAR(20) NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL,
    valor_original DECIMAL(10, 2) NOT NULL,
    percentual_desconto DECIMAL(5, 2) NOT NULL DEFAULT 0,
    valor_final DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'RECEBIDO',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_pedidos PRIMARY KEY (id),
    CONSTRAINT uk_pedidos_codigo UNIQUE (codigo),
    CONSTRAINT fk_pedidos_produto FOREIGN KEY (produto_id)
        REFERENCES produtos (id),
    CONSTRAINT ck_pedidos_quantidade CHECK (
        quantidade BETWEEN 1 AND 10
    )
);

-- INSERT IGNORE não duplica os produtos se o script for executado novamente.
INSERT IGNORE INTO produtos
    (nome, categoria, descricao, preco, emoji, disponivel)
VALUES
    ('Coxinha de frango', 'Salgados',
     'Massa crocante e recheio cremoso de frango.', 8.50, '🍗', TRUE),
    ('Pão de queijo', 'Salgados',
     'Porção quentinha com três unidades.', 6.00, '🧀', TRUE),
    ('Misto quente', 'Salgados',
     'Pão, presunto e queijo preparados na hora.', 9.50, '🥪', TRUE),
    ('Brownie', 'Doces',
     'Chocolate intenso com casquinha crocante.', 7.00, '🍫', TRUE),
    ('Brigadeiro', 'Doces',
     'Brigadeiro tradicional coberto com granulado.', 3.50, '🍬', TRUE),
    ('Fatia de bolo', 'Doces',
     'Sabor do dia. Consulte a equipe da cantina.', 6.50, '🍰', TRUE),
    ('Prato do dia', 'Almoço',
     'Arroz, feijão, acompanhamento e proteína.', 24.90, '🍛', TRUE),
    ('Salada completa', 'Almoço',
     'Folhas, legumes, grãos e molho da casa.', 18.90, '🥗', TRUE),
    ('Refrigerante em lata', 'Refrigerantes',
     'Lata gelada de 350 ml.', 6.50, '🥤', TRUE),
    ('Suco da máquina', 'Sucos',
     'Copo de 300 ml. Escolha o sabor no balcão.', 5.00, '🧃', TRUE),
    ('Café expresso', 'Cafés',
     'Café curto e encorpado.', 4.50, '☕', TRUE),
    ('Café com leite', 'Cafés',
     'Café com leite cremoso.', 6.00, '🥛', TRUE);

-- Cria ou atualiza automaticamente o cupom da data em que o script for rodado.
INSERT INTO cupons (descricao, percentual, data_cupom, ativo)
VALUES ('Desconto especial do dia', 10.00, CURRENT_DATE(), TRUE)
ON DUPLICATE KEY UPDATE
    descricao = VALUES(descricao),
    percentual = VALUES(percentual),
    ativo = VALUES(ativo);

SELECT * FROM produtos ORDER BY categoria, nome;
SELECT * FROM cupons ORDER BY data_cupom DESC;
