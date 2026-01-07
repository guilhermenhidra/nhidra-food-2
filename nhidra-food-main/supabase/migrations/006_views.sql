-- =====================================================
-- BRIEZ - Migration 006: Views Materializadas (Performance)
-- =====================================================

-- =====================================================
-- VIEW MATERIALIZADA: ranking_produtos
-- Atualiza a cada 15 minutos
-- =====================================================
CREATE MATERIALIZED VIEW ranking_produtos AS
SELECT 
  p.restaurante_id,
  p.id as produto_id,
  p.nome as produto_nome,
  c.nome as categoria,
  p.preco,
  p.custo,
  COUNT(ip.id) as total_vendas,
  SUM(ip.quantidade) as quantidade_total,
  SUM(ip.subtotal) as receita_total,
  SUM(ip.subtotal) - (SUM(ip.quantidade) * COALESCE(p.custo, 0)) as lucro_total,
  ROUND(AVG(ip.quantidade), 2) as media_quantidade
FROM produtos p
JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN itens_pedido ip ON p.id = ip.produto_id
LEFT JOIN pedidos ped ON ip.pedido_id = ped.id
WHERE ip.created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND p.deletado_em IS NULL
  AND ped.status IN ('entregue', 'pronto')
GROUP BY p.restaurante_id, p.id, p.nome, c.nome, p.preco, p.custo
ORDER BY quantidade_total DESC NULLS LAST;

-- Índice
CREATE UNIQUE INDEX idx_ranking_produtos_unique ON ranking_produtos(restaurante_id, produto_id);
CREATE INDEX idx_ranking_produtos_quantidade ON ranking_produtos(restaurante_id, quantidade_total);

-- =====================================================
-- VIEW MATERIALIZADA: metricas_dashboard
-- Atualiza a cada 5 minutos
-- =====================================================
CREATE MATERIALIZED VIEW metricas_dashboard AS
SELECT 
  p.restaurante_id,
  (p.created_at::date) as data,
  COUNT(DISTINCT p.id) as total_pedidos,
  COUNT(DISTINCT p.cliente_nome) FILTER (WHERE p.cliente_nome IS NOT NULL) as total_clientes,
  SUM(p.total) as receita_total,
  ROUND(AVG(p.total), 2) as ticket_medio,
  SUM(CASE WHEN p.tipo = 'mesa' THEN p.total ELSE 0 END) as receita_mesa,
  SUM(CASE WHEN p.tipo = 'delivery' THEN p.total ELSE 0 END) as receita_delivery,
  SUM(CASE WHEN p.tipo = 'balcao' THEN p.total ELSE 0 END) as receita_balcao,
  COUNT(*) FILTER (WHERE p.tipo = 'mesa') as pedidos_mesa,
  COUNT(*) FILTER (WHERE p.tipo = 'delivery') as pedidos_delivery,
  COUNT(*) FILTER (WHERE p.tipo = 'balcao') as pedidos_balcao,
  SUM(p.desconto) as total_descontos,
  SUM(p.taxa_servico) as total_taxa_servico
FROM pedidos p
WHERE p.status IN ('entregue', 'pronto')
  AND p.deletado_em IS NULL
  AND p.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY p.restaurante_id, (p.created_at::date);

-- Índice
CREATE UNIQUE INDEX idx_metricas_dashboard_unique ON metricas_dashboard(restaurante_id, data);
CREATE INDEX idx_metricas_dashboard_data ON metricas_dashboard(restaurante_id, data);

-- =====================================================
-- VIEW: metodos_pagamento_hoje (VIEW normal, não materializada)
-- =====================================================
CREATE OR REPLACE VIEW metodos_pagamento_hoje AS
SELECT 
  c.restaurante_id,
  tc.metodo_pagamento,
  SUM(tc.valor) as total,
  COUNT(*) as quantidade,
  ROUND(
    (SUM(tc.valor) * 100.0 / NULLIF(SUM(SUM(tc.valor)) OVER (PARTITION BY c.restaurante_id), 0)),
    2
  ) as percentual
FROM transacoes_caixa tc
JOIN caixa c ON tc.caixa_id = c.id
WHERE tc.tipo = 'venda'
  AND (tc.created_at::date) = CURRENT_DATE
GROUP BY c.restaurante_id, tc.metodo_pagamento;

-- =====================================================
-- VIEW: pedidos_em_andamento (VIEW normal para tempo real)
-- =====================================================
CREATE OR REPLACE VIEW pedidos_em_andamento AS
SELECT 
  p.id,
  p.restaurante_id,
  p.numero_pedido,
  p.tipo,
  p.status,
  p.total,
  m.numero as mesa_numero,
  u.nome || ' ' || u.sobrenome as garcom_nome,
  u.cor_identificacao as garcom_cor,
  p.created_at,
  EXTRACT(EPOCH FROM (now() - p.created_at))/60 as tempo_decorrido_minutos,
  COUNT(ip.id) as total_itens,
  SUM(ip.quantidade) as quantidade_total
FROM pedidos p
LEFT JOIN mesas m ON p.mesa_id = m.id
LEFT JOIN usuarios u ON p.garcom_id = u.id
LEFT JOIN itens_pedido ip ON p.id = ip.pedido_id
WHERE p.status IN ('aberto', 'em_preparo', 'pronto')
  AND p.deletado_em IS NULL
GROUP BY p.id, p.restaurante_id, p.numero_pedido, p.tipo, p.status, p.total, m.numero, u.nome, u.sobrenome, u.cor_identificacao, p.created_at;

-- =====================================================
-- AGENDAMENTO: Atualizar views materializadas
-- Requer pg_cron extension
-- =====================================================

-- Atualizar ranking_produtos a cada 15 minutos
SELECT cron.schedule(
  'refresh-ranking-produtos',
  '*/15 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY ranking_produtos$$
);

-- Atualizar metricas_dashboard a cada 5 minutos
SELECT cron.schedule(
  'refresh-metricas-dashboard',
  '*/5 * * * *',
  $$REFRESH MATERIALIZED VIEW CONCURRENTLY metricas_dashboard$$
);
