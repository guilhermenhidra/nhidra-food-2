-- =====================================================
-- BRIEZ - Migration 004: Praças (Cozinha em Tempo Real)
-- =====================================================

-- =====================================================
-- TABELA: pedidos_praca (Para a cozinha - Realtime)
-- =====================================================
CREATE TABLE pedidos_praca (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id uuid NOT NULL REFERENCES restaurantes(id),
  pedido_id uuid NOT NULL REFERENCES pedidos(id),
  
  -- Identificação
  numero_mesa text,
  numero_balcao text,
  tipo_pedido text NOT NULL, -- 'mesa', 'balcao', 'delivery'
  
  -- Área
  area text NOT NULL, -- 'cozinha_principal', 'bar', 'pizzaria', 'sobremesas'
  
  -- Responsáveis
  garcom_nome text,
  garcom_cor text,
  
  -- Status
  status text DEFAULT 'em_preparo', -- 'em_preparo', 'pronto'
  
  -- Itens (desnormalizado para performance)
  itens jsonb NOT NULL, -- [{ nome, quantidade, obs }]
  
  -- Tempo
  tempo_estimado integer, -- minutos
  criado_em timestamptz DEFAULT now(),
  pronto_em timestamptz,
  
  updated_at timestamptz DEFAULT now()
);

-- Índices CRÍTICOS para consulta em tempo real
CREATE INDEX idx_pedidos_praca_area_status ON pedidos_praca(restaurante_id, area, status) WHERE status = 'em_preparo';
CREATE INDEX idx_pedidos_praca_tempo ON pedidos_praca(area, criado_em) WHERE status = 'em_preparo';
CREATE INDEX idx_pedidos_praca_pedido ON pedidos_praca(pedido_id);

-- Trigger
CREATE TRIGGER set_timestamp_pedidos_praca
BEFORE UPDATE ON pedidos_praca
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE pedidos_praca ENABLE ROW LEVEL SECURITY;

CREATE POLICY pedidos_praca_policy ON pedidos_praca
FOR ALL USING (
  restaurante_id::text = current_setting('app.current_restaurante_id', true)
);

-- CRÍTICO: Habilitar Realtime para praças
ALTER PUBLICATION supabase_realtime ADD TABLE pedidos_praca;

-- =====================================================
-- TRIGGER: Criar pedido na praça automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION criar_pedido_praca()
RETURNS TRIGGER AS $$
DECLARE
  v_itens jsonb;
  v_areas text[];
  v_area text;
  v_garcom record;
  v_tempo_estimado integer;
BEGIN
  -- Buscar informações do garçom
  SELECT nome, cor_identificacao INTO v_garcom
  FROM usuarios
  WHERE id = NEW.garcom_id;
  
  -- Para cada área de preparo diferente
  FOR v_area IN 
    SELECT DISTINCT p.area_preparo 
    FROM itens_pedido ip
    JOIN produtos p ON ip.produto_id = p.id
    WHERE ip.pedido_id = NEW.id
      AND p.area_preparo IS NOT NULL
  LOOP
    -- Montar JSON dos itens dessa área
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'nome', ip.produto_nome,
          'quantidade', ip.quantidade,
          'observacoes', ip.observacoes
        )
      ),
      MAX(p.tempo_preparo_minutos)
    INTO v_itens, v_tempo_estimado
    FROM itens_pedido ip
    JOIN produtos p ON ip.produto_id = p.id
    WHERE ip.pedido_id = NEW.id
      AND p.area_preparo = v_area;
    
    -- Inserir na praça
    INSERT INTO pedidos_praca (
      restaurante_id,
      pedido_id,
      numero_mesa,
      numero_balcao,
      tipo_pedido,
      area,
      garcom_nome,
      garcom_cor,
      itens,
      tempo_estimado,
      status
    ) VALUES (
      NEW.restaurante_id,
      NEW.id,
      CASE WHEN NEW.tipo = 'mesa' THEN (SELECT numero::text FROM mesas WHERE id = NEW.mesa_id) END,
      CASE WHEN NEW.tipo = 'balcao' THEN 'BALCÃO ' || NEW.numero_pedido::text END,
      NEW.tipo,
      v_area,
      v_garcom.nome,
      v_garcom.cor_identificacao,
      v_itens,
      v_tempo_estimado,
      'em_preparo'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_criar_pedido_praca
AFTER INSERT ON pedidos
FOR EACH ROW
WHEN (NEW.status = 'em_preparo')
EXECUTE FUNCTION criar_pedido_praca();

-- =====================================================
-- TRIGGER: Atualizar status da mesa automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION atualizar_status_mesa()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando pedido é finalizado, libera a mesa
  IF NEW.status IN ('entregue', 'cancelado') AND OLD.status NOT IN ('entregue', 'cancelado') THEN
    IF NEW.mesa_id IS NOT NULL THEN
      UPDATE mesas
      SET status = 'livre',
          pedido_atual_id = NULL,
          garcom_id = NULL,
          ocupada_em = NULL,
          updated_at = now()
      WHERE id = NEW.mesa_id;
    END IF;
  
  -- Quando pedido é aberto, ocupa a mesa
  ELSIF NEW.status = 'aberto' AND NEW.mesa_id IS NOT NULL THEN
    UPDATE mesas
    SET status = 'ocupada',
        pedido_atual_id = NEW.id,
        garcom_id = NEW.garcom_id,
        ocupada_em = now(),
        updated_at = now()
    WHERE id = NEW.mesa_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_status_mesa
AFTER INSERT OR UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION atualizar_status_mesa();
