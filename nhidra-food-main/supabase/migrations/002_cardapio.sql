-- =====================================================
-- BRIEZ - Migration 002: Cardápio (Categorias e Produtos)
-- =====================================================

-- =====================================================
-- TABELA: categorias
-- =====================================================
CREATE TABLE categorias (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id uuid NOT NULL REFERENCES restaurantes(id),
  nome text NOT NULL,
  descricao text,
  ordem integer DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deletado_em timestamptz
);

-- Índices
CREATE INDEX idx_categorias_restaurante ON categorias(restaurante_id, ordem) WHERE deletado_em IS NULL AND ativo = true;
CREATE INDEX idx_categorias_ativo ON categorias(restaurante_id) WHERE ativo = true AND deletado_em IS NULL;

-- Trigger
CREATE TRIGGER set_timestamp_categorias
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY categorias_policy ON categorias
FOR ALL USING (
  restaurante_id::text = current_setting('app.current_restaurante_id', true)
);

-- Política de leitura pública (para cardápio digital)
CREATE POLICY categorias_public_read ON categorias
FOR SELECT USING (ativo = true AND deletado_em IS NULL);

-- =====================================================
-- TABELA: produtos
-- =====================================================
CREATE TABLE produtos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id uuid NOT NULL REFERENCES restaurantes(id),
  categoria_id uuid NOT NULL REFERENCES categorias(id),
  nome text NOT NULL,
  descricao text,
  preco numeric(10,2) NOT NULL,
  custo numeric(10,2),
  imagem_url text,
  area_preparo text, -- 'cozinha_principal', 'bar', 'pizzaria', 'sobremesas'
  tempo_preparo_minutos integer DEFAULT 15,
  ativo boolean DEFAULT true,
  destaque boolean DEFAULT false,
  ordem integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deletado_em timestamptz
);

-- Índices CRÍTICOS para performance
CREATE INDEX idx_produtos_restaurante ON produtos(restaurante_id) WHERE deletado_em IS NULL;
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id) WHERE deletado_em IS NULL AND ativo = true;
CREATE INDEX idx_produtos_area ON produtos(area_preparo) WHERE deletado_em IS NULL AND ativo = true;
CREATE INDEX idx_produtos_destaque ON produtos(restaurante_id, destaque) WHERE deletado_em IS NULL AND ativo = true AND destaque = true;

-- Trigger
CREATE TRIGGER set_timestamp_produtos
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY produtos_policy ON produtos
FOR ALL USING (
  restaurante_id::text = current_setting('app.current_restaurante_id', true)
);

-- Política de leitura pública (para cardápio digital)
CREATE POLICY produtos_public_read ON produtos
FOR SELECT USING (ativo = true AND deletado_em IS NULL);

-- =====================================================
-- TABELA: banners
-- =====================================================
CREATE TABLE banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurante_id uuid NOT NULL REFERENCES restaurantes(id),
  titulo text NOT NULL,
  descricao text,
  imagem_url text NOT NULL,
  ordem integer DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deletado_em timestamptz
);

-- Índices
CREATE INDEX idx_banners_restaurante ON banners(restaurante_id, ordem) WHERE ativo = true AND deletado_em IS NULL;

-- Trigger
CREATE TRIGGER set_timestamp_banners
BEFORE UPDATE ON banners
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY banners_policy ON banners
FOR ALL USING (
  restaurante_id::text = current_setting('app.current_restaurante_id', true)
);

-- Política de leitura pública (para cardápio digital)
CREATE POLICY banners_public_read ON banners
FOR SELECT USING (ativo = true AND deletado_em IS NULL);
