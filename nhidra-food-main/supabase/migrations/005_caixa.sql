-- =====================================================
-- BRIEZ - Migration 005: Caixa e Transações
-- =====================================================

-- =====================================================
-- TABELA: caixa
-- =====================================================
CREATE TABLE caixa (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id uuid NOT NULL REFERENCES restaurantes(id),
  data date NOT NULL DEFAULT CURRENT_DATE,
  
  -- Responsável
  usuario_abertura_id uuid REFERENCES usuarios(id),
  usuario_fechamento_id uuid REFERENCES usuarios(id),
  
  -- Saldo
  saldo_inicial numeric(10,2) DEFAULT 0,
  saldo_atual numeric(10,2) DEFAULT 0,
  saldo_final numeric(10,2),
  
  -- Status
  aberto boolean DEFAULT true,
  
  -- Timestamps
  aberto_em timestamptz DEFAULT now(),
  fechado_em timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(restaurante_id, data)
);

-- Índices
CREATE INDEX idx_caixa_restaurante_data ON caixa(restaurante_id, data);
CREATE INDEX idx_caixa_aberto ON caixa(restaurante_id, aberto) WHERE aberto = true;

-- Trigger
CREATE TRIGGER set_timestamp_caixa
BEFORE UPDATE ON caixa
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE caixa ENABLE ROW LEVEL SECURITY;

CREATE POLICY caixa_policy ON caixa
FOR ALL USING (
  restaurante_id::text = current_setting('app.current_restaurante_id', true)
);

-- Habilitar Realtime (para atualizar saldo em tempo real)
ALTER PUBLICATION supabase_realtime ADD TABLE caixa;

-- =====================================================
-- TABELA: transacoes_caixa
-- =====================================================
CREATE TABLE transacoes_caixa (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  caixa_id uuid NOT NULL REFERENCES caixa(id),
  pedido_id uuid REFERENCES pedidos(id),
  usuario_id uuid REFERENCES usuarios(id),
  
  -- Tipo de transação
  tipo text NOT NULL, -- 'venda', 'sangria', 'reforco', 'devolucao'
  
  -- Método de pagamento (apenas para vendas)
  metodo_pagamento text, -- 'dinheiro', 'cartao_credito', 'cartao_debito', 'pix'
  
  -- Valor
  valor numeric(10,2) NOT NULL,
  
  -- Detalhes
  descricao text,
  observacoes text,
  
  created_at timestamptz DEFAULT now()
);

-- Índices CRÍTICOS
CREATE INDEX idx_transacoes_caixa ON transacoes_caixa(caixa_id, created_at);
CREATE INDEX idx_transacoes_tipo ON transacoes_caixa(tipo, created_at);
CREATE INDEX idx_transacoes_pedido ON transacoes_caixa(pedido_id);
CREATE INDEX idx_transacoes_metodo ON transacoes_caixa(metodo_pagamento, created_at) WHERE tipo = 'venda';

-- RLS
ALTER TABLE transacoes_caixa ENABLE ROW LEVEL SECURITY;

CREATE POLICY transacoes_caixa_policy ON transacoes_caixa
FOR ALL USING (
  caixa_id IN (
    SELECT id FROM caixa 
    WHERE restaurante_id::text = current_setting('app.current_restaurante_id', true)
  )
);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE transacoes_caixa;

-- =====================================================
-- TRIGGER CRÍTICO: Atualiza saldo automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION atualizar_saldo_caixa()
RETURNS TRIGGER AS $$
BEGIN
  -- Venda ou Reforço: adiciona ao saldo
  IF NEW.tipo IN ('venda', 'reforco') THEN
    UPDATE caixa 
    SET saldo_atual = saldo_atual + NEW.valor,
        updated_at = now()
    WHERE id = NEW.caixa_id;
  
  -- Sangria ou Devolução: subtrai do saldo
  ELSIF NEW.tipo IN ('sangria', 'devolucao') THEN
    UPDATE caixa 
    SET saldo_atual = saldo_atual - NEW.valor,
        updated_at = now()
    WHERE id = NEW.caixa_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_saldo_caixa
AFTER INSERT ON transacoes_caixa
FOR EACH ROW
EXECUTE FUNCTION atualizar_saldo_caixa();

-- =====================================================
-- TRIGGER: Registrar transação no caixa ao finalizar pedido
-- =====================================================
CREATE OR REPLACE FUNCTION registrar_transacao_pedido()
RETURNS TRIGGER AS $$
DECLARE
  v_caixa_id uuid;
BEGIN
  -- Verifica se o pedido foi pago
  IF NEW.pago = true AND (OLD.pago = false OR OLD.pago IS NULL) THEN
    
    -- Busca o caixa aberto do dia
    SELECT id INTO v_caixa_id
    FROM caixa
    WHERE restaurante_id = NEW.restaurante_id
      AND data = CURRENT_DATE
      AND aberto = true
    LIMIT 1;
    
    -- Se existe caixa aberto, registra a transação
    IF v_caixa_id IS NOT NULL THEN
      INSERT INTO transacoes_caixa (
        caixa_id,
        pedido_id,
        usuario_id,
        tipo,
        metodo_pagamento,
        valor,
        descricao
      ) VALUES (
        v_caixa_id,
        NEW.id,
        NEW.caixa_id,
        'venda',
        NEW.metodo_pagamento,
        NEW.total,
        'Pedido #' || NEW.numero_pedido
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_registrar_transacao_pedido
AFTER UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION registrar_transacao_pedido();
