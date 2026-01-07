-- =====================================================
-- BRIEZ - Fix: Corrigir RLS para permitir acesso público
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Remover políticas restritivas antigas
DROP POLICY IF EXISTS mesas_policy ON mesas;
DROP POLICY IF EXISTS produtos_policy ON produtos;
DROP POLICY IF EXISTS categorias_policy ON categorias;
DROP POLICY IF EXISTS pedidos_policy ON pedidos;

-- Criar políticas públicas temporárias (para desenvolvimento)
-- IMPORTANTE: Em produção, você deve usar RLS adequado com autenticação

-- Mesas: Acesso total
CREATE POLICY mesas_public_policy ON mesas
FOR ALL USING (true);

-- Produtos: Acesso total  
CREATE POLICY produtos_public_policy ON produtos
FOR ALL USING (true);

-- Categorias: Acesso total
CREATE POLICY categorias_public_policy ON categorias
FOR ALL USING (true);

-- Pedidos: Acesso total
CREATE POLICY pedidos_public_policy ON pedidos
FOR ALL USING (true);

-- Itens de Pedido: Acesso total
DROP POLICY IF EXISTS itens_pedido_policy ON itens_pedido;
CREATE POLICY itens_pedido_public_policy ON itens_pedido
FOR ALL USING (true);

-- Banners: Já tem política pública, manter
-- Caixa e transações: Manter como está por enquanto

-- Verificar se funcionou
SELECT 'Mesas:', COUNT(*) FROM mesas;
SELECT 'Produtos:', COUNT(*) FROM produtos;
SELECT 'Categorias:', COUNT(*) FROM categorias;
