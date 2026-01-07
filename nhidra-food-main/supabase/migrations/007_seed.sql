-- =====================================================
-- BRIEZ - Migration 007: Dados Iniciais (Seed)
-- =====================================================

-- =====================================================
-- RESTAURANTE DE EXEMPLO
-- =====================================================
INSERT INTO restaurantes (id, nome, cnpj, endereco, numero, bairro, cidade, estado, cep, telefone, email, total_mesas, plano) VALUES
('00000000-0000-0000-0000-000000000001', 'Restaurante Gourmet', '12.345.678/0001-90', 'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234-567', '(11) 98765-4321', 'contato@restaurantegourmet.com.br', 50, 'premium')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- MESAS (1 a 50)
-- =====================================================
INSERT INTO mesas (restaurante_id, numero, capacidade)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  n,
  CASE 
    WHEN n % 10 = 0 THEN 8  -- Mesas maiores
    WHEN n % 5 = 0 THEN 6   -- Mesas médias
    ELSE 4                   -- Mesas padrão
  END
FROM generate_series(1, 50) AS n
ON CONFLICT (restaurante_id, numero) DO NOTHING;

-- =====================================================
-- CATEGORIAS
-- =====================================================
INSERT INTO categorias (id, restaurante_id, nome, descricao, ordem) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Entradas', 'Deliciosas opções para começar sua refeição', 1),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Pratos Principais', 'Nossos pratos principais para satisfazer seu apetite', 2),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Massas', 'Massas artesanais preparadas com carinho', 3),
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Pizzas', 'Pizzas tradicionais e especiais', 4),
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Sobremesas', 'Doces e guloseimas para finalizar', 5),
('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Bebidas', 'Refrigerantes, sucos e outras bebidas', 6)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- PRODUTOS
-- =====================================================

-- ENTRADAS
INSERT INTO produtos (restaurante_id, categoria_id, nome, descricao, preco, custo, area_preparo, tempo_preparo_minutos, destaque, ordem) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Bruschetta', 'Pão italiano com tomate, manjericão e azeite', 18.00, 6.00, 'cozinha_principal', 10, true, 1),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Carpaccio', 'Finas fatias de carne com rúcula e parmesão', 32.00, 12.00, 'cozinha_principal', 15, false, 2),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Camarão ao Alho', 'Camarões salteados no alho e óleo', 42.00, 18.00, 'cozinha_principal', 20, true, 3);

-- PRATOS PRINCIPAIS
INSERT INTO produtos (restaurante_id, categoria_id, nome, descricao, preco, custo, area_preparo, tempo_preparo_minutos, destaque, ordem) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Salmão Grelhado', 'Salmão fresco com legumes e molho de maracujá', 58.00, 25.00, 'cozinha_principal', 25, true, 1),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Picanha na Brasa', 'Picanha argentina com arroz e farofa', 68.00, 30.00, 'cozinha_principal', 30, true, 2),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Frango à Parmegiana', 'Filé de frango empanado com molho e queijo', 42.00, 15.00, 'cozinha_principal', 25, false, 3);

-- MASSAS
INSERT INTO produtos (restaurante_id, categoria_id, nome, descricao, preco, custo, area_preparo, tempo_preparo_minutos, destaque, ordem) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Spaghetti Carbonara', 'Massa com bacon, ovos e parmesão', 38.00, 12.00, 'cozinha_principal', 20, false, 1),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Lasanha Bolonhesa', 'Lasanha tradicional com molho bolonhesa', 45.00, 15.00, 'cozinha_principal', 30, true, 2),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Ravioli de Queijo', 'Ravioli recheado com 4 queijos', 42.00, 14.00, 'cozinha_principal', 25, false, 3);

-- PIZZAS
INSERT INTO produtos (restaurante_id, categoria_id, nome, descricao, preco, custo, area_preparo, tempo_preparo_minutos, destaque, ordem) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Pizza Margherita', 'Molho de tomate, mussarela e manjericão', 45.00, 12.00, 'pizzaria', 20, true, 1),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Pizza Calabresa', 'Calabresa, cebola e azeitonas', 48.00, 13.00, 'pizzaria', 20, false, 2),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Pizza Quatro Queijos', 'Mussarela, parmesão, gorgonzola e provolone', 52.00, 16.00, 'pizzaria', 20, true, 3);

-- SOBREMESAS
INSERT INTO produtos (restaurante_id, categoria_id, nome, descricao, preco, custo, area_preparo, tempo_preparo_minutos, destaque, ordem) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'Torta de Limão', 'Torta cremosa de limão com merengue', 22.00, 7.00, 'sobremesas', 5, true, 1),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'Petit Gateau', 'Bolinho de chocolate com sorvete', 28.00, 9.00, 'sobremesas', 10, true, 2),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'Pudim de Leite', 'Pudim caseiro com calda de caramelo', 18.00, 5.00, 'sobremesas', 5, false, 3);

-- BEBIDAS
INSERT INTO produtos (restaurante_id, categoria_id, nome, descricao, preco, custo, area_preparo, tempo_preparo_minutos, destaque, ordem) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'Refrigerante Lata', 'Coca-Cola, Guaraná ou Fanta', 8.00, 3.00, 'bar', 2, false, 1),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'Suco Natural', 'Laranja, limão ou abacaxi', 12.00, 4.00, 'bar', 5, false, 2),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'Água Mineral', 'Água mineral sem gás 500ml', 5.00, 2.00, 'bar', 1, false, 3),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 'Cerveja Long Neck', 'Cerveja gelada 330ml', 10.00, 4.00, 'bar', 2, false, 4);

-- =====================================================
-- BANNERS
-- =====================================================
INSERT INTO banners (restaurante_id, titulo, descricao, imagem_url, ordem) VALUES
('00000000-0000-0000-0000-000000000001', 'Promoção de Verão', '50% de desconto em sucos naturais', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800', 1),
('00000000-0000-0000-0000-000000000001', 'Combo Familiar', '2 Pizzas G + Refrigerante 2L', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', 2);

-- =====================================================
-- CAIXA DO DIA (Abrir automaticamente)
-- =====================================================
INSERT INTO caixa (restaurante_id, data, saldo_inicial, saldo_atual, aberto)
VALUES ('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 200.00, 200.00, true)
ON CONFLICT (restaurante_id, data) DO NOTHING;
