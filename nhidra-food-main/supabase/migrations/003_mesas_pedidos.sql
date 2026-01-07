-- =====================================================
-- BRIEZ - Migration 003: Mesas e Pedidos
-- =====================================================

-- =====================================================
-- TABELA: mesas
-- =====================================================
CREATE TABLE mesas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id uuid NOT NULL REFERENCES restaurantes(id),
  numero integer NOT NULL,
  capacidade integer DEFAULT 4,
  status text DEFAULT 'livre', -- 'livre', 'ocupada', 'reservada'
  pedido_atual_id uuid,
  garcom_id uuid REFERENCES usuarios(id),
  ocupada_em timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deletado_em timestamptz,
  UNIQUE(restaurante_id, numero)
);

-- Índices CRÍTICOS para consulta rápida em tempo real
CREATE INDEX idx_mesas_restaurante_status ON mesas(restaurante_id, status) WHERE deletado_em IS NULL;
CREATE INDEX idx_mesas_garcom ON mesas(garcom_id) WHERE status = 'ocupada' AND deletado_em IS NULL;
CREATE INDEX idx_mesas_numero ON mesas(restaurante_id, numero) WHERE deletado_em IS NULL;

-- Trigger
CREATE TRIGGER set_timestamp_mesas
BEFORE UPDATE ON mesas
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE mesas ENABLE ROW LEVEL SECURITY;

CREATE POLICY mesas_policy ON mesas
FOR ALL USING (
  restaurante_id::text = current_setting('app.current_restaurante_id', true)
);

-- CRÍTICO: Habilitar Realtime para mesas
ALTER PUBLICATION supabase_realtime ADD TABLE mesas;

-- =====================================================
-- TABELA: pedidos
-- =====================================================
CREATE TABLE pedidos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id uuid NOT NULL REFERENCES restaurantes(id),
  numero_pedido serial,
  tipo text NOT NULL, -- 'mesa', 'balcao', 'delivery'
  
  -- Relacionamentos
  mesa_id uuid REFERENCES mesas(id),
  garcom_id uuid REFERENCES usuarios(id),
  caixa_id uuid REFERENCES usuarios(id),
  
  -- Dados do cliente
  cliente_nome text,
  cliente_telefone text,
  cliente_endereco text,
  
  -- Status e controle
  status text DEFAULT 'aberto', -- 'aberto', 'em_preparo', 'pronto', 'entregue', 'cancelado'
  
  -- Valores
  subtotal numeric(10,2) DEFAULT 0,
  desconto numeric(10,2) DEFAULT 0,
  taxa_servico numeric(10,2) DEFAULT 0,
  taxa_entrega numeric(10,2) DEFAULT 0,
  total numeric(10,2) NOT NULL,
  
  -- Pagamento
  metodo_pagamento text, -- 'dinheiro', 'cartao_credito', 'cartao_debito', 'pix'
  pago boolean DEFAULT false,
  pago_em timestamptz,
  
  -- Nota Fiscal
  nota_fiscal_url text,
  nota_fiscal_chave text,
  nota_emitida boolean DEFAULT false,
  nota_emitida_em timestamptz,
  
  -- Timestamps
  aberto_em timestamptz DEFAULT now(),
  em_preparo_em timestamptz,
  pronto_em timestamptz,
  entregue_em timestamptz,
  cancelado_em timestamptz,
  
  observacoes text,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deletado_em timestamptz
);

-- Índices CRÍTICOS para performance
CREATE INDEX idx_pedidos_restaurante_status ON pedidos(restaurante_id, status, created_at) WHERE deletado_em IS NULL;
CREATE INDEX idx_pedidos_tipo ON pedidos(tipo, status) WHERE deletado_em IS NULL;
CREATE INDEX idx_pedidos_mesa ON pedidos(mesa_id) WHERE status IN ('aberto', 'em_preparo') AND deletado_em IS NULL;
CREATE INDEX idx_pedidos_garcom ON pedidos(garcom_id, status) WHERE deletado_em IS NULL;
CREATE INDEX idx_pedidos_numero ON pedidos(restaurante_id, numero_pedido);

-- Trigger
CREATE TRIGGER set_timestamp_pedidos
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY pedidos_policy ON pedidos
FOR ALL USING (
  restaurante_id::text = current_setting('app.current_restaurante_id', true)
);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;

-- =====================================================
-- TABELA: itens_pedido
-- =====================================================
CREATE TABLE itens_pedido (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id uuid NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id uuid REFERENCES produtos(id),
  
  -- Dados do produto (snapshot no momento do pedido)
  produto_nome text NOT NULL,
  produto_categoria text,
  area_preparo text,
  
  -- Valores
  quantidade integer NOT NULL DEFAULT 1,
  preco_unitario numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  
  -- Customizações
  observacoes text,
  
  -- Status específico do item
  status text DEFAULT 'pendente', -- 'pendente', 'em_preparo', 'pronto', 'entregue', 'cancelado'
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX idx_itens_pedido ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_produto ON itens_pedido(produto_id, created_at);
CREATE INDEX idx_itens_area ON itens_pedido(area_preparo, status) WHERE status IN ('pendente', 'em_preparo');

-- Trigger
CREATE TRIGGER set_timestamp_itens_pedido
BEFORE UPDATE ON itens_pedido
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;

CREATE POLICY itens_pedido_policy ON itens_pedido
FOR ALL USING (
  pedido_id IN (
    SELECT id FROM pedidos 
    WHERE restaurante_id::text = current_setting('app.current_restaurante_id', true)
  )
);
