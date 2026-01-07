-- =====================================================
-- BRIEZ - Rollback: Limpar todas as tabelas
-- Execute este arquivo ANTES de rodar as migrations novamente
-- =====================================================

-- IMPORTANTE: Este script apaga TODOS os dados!
-- Use apenas em desenvolvimento ou para resetar o banco

-- Desabilitar triggers temporariamente
SET session_replication_role = 'replica';

-- Remover agendamentos do cron (ignorar se não existirem)
DO $$
BEGIN
  PERFORM cron.unschedule('refresh-ranking-produtos');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('refresh-metricas-dashboard');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Dropar views
DROP VIEW IF EXISTS pedidos_em_andamento CASCADE;
DROP VIEW IF EXISTS metodos_pagamento_hoje CASCADE;
DROP MATERIALIZED VIEW IF EXISTS metricas_dashboard CASCADE;
DROP MATERIALIZED VIEW IF EXISTS ranking_produtos CASCADE;

-- Dropar tabelas (ordem reversa das dependências)
DROP TABLE IF EXISTS transacoes_caixa CASCADE;
DROP TABLE IF EXISTS caixa CASCADE;
DROP TABLE IF EXISTS pedidos_praca CASCADE;
DROP TABLE IF EXISTS itens_pedido CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS mesas CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS restaurantes CASCADE;

-- Dropar funções
DROP FUNCTION IF EXISTS atualizar_saldo_caixa() CASCADE;
DROP FUNCTION IF EXISTS registrar_transacao_pedido() CASCADE;
DROP FUNCTION IF EXISTS atualizar_status_mesa() CASCADE;
DROP FUNCTION IF EXISTS criar_pedido_praca() CASCADE;
DROP FUNCTION IF EXISTS trigger_set_timestamp() CASCADE;

-- Reabilitar triggers
SET session_replication_role = 'origin';

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Banco de dados limpo com sucesso!';
  RAISE NOTICE 'Agora você pode executar as migrations na ordem (001, 002, 003...)';
END $$;
