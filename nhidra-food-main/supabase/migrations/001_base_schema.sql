-- =====================================================
-- BRIEZ - SISTEMA DE GESTÃO PARA RESTAURANTES
-- Migration 001: Base Schema e Extensões
-- =====================================================

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- =====================================================
-- FUNÇÃO GLOBAL: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABELA: restaurantes
-- =====================================================
CREATE TABLE restaurantes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome text NOT NULL,
  cnpj text UNIQUE NOT NULL,
  endereco text,
  numero text,
  bairro text,
  cidade text,
  estado text,
  cep text,
  telefone text,
  email text,
  logo_url text,
  ativo boolean DEFAULT true,
  plano text DEFAULT 'premium', -- 'basico', 'premium', 'enterprise'
  total_mesas integer DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deletado_em timestamptz
);

-- Índices
CREATE INDEX idx_restaurantes_cnpj ON restaurantes(cnpj) WHERE deletado_em IS NULL;
CREATE INDEX idx_restaurantes_ativo ON restaurantes(id) WHERE ativo = true AND deletado_em IS NULL;

-- Trigger para updated_at
CREATE TRIGGER set_timestamp_restaurantes
BEFORE UPDATE ON restaurantes
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE restaurantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY restaurantes_policy ON restaurantes
FOR ALL USING (
  id::text = current_setting('app.current_restaurante_id', true)
);

-- =====================================================
-- TABELA: usuarios
-- =====================================================
CREATE TABLE usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurante_id uuid NOT NULL REFERENCES restaurantes(id),
  nome text NOT NULL,
  sobrenome text NOT NULL,
  email text UNIQUE NOT NULL,
  funcao text NOT NULL, -- 'dono', 'gerente', 'garcom', 'caixa', 'cozinha'
  status text DEFAULT 'ativo', -- 'ativo', 'pendente', 'inativo'
  foto_url text,
  cor_identificacao text, -- Para identificar garçom na praça
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deletado_em timestamptz
);

-- Índices
CREATE INDEX idx_usuarios_restaurante ON usuarios(restaurante_id) WHERE deletado_em IS NULL;
CREATE INDEX idx_usuarios_funcao ON usuarios(funcao) WHERE deletado_em IS NULL;
CREATE INDEX idx_usuarios_email ON usuarios(email) WHERE deletado_em IS NULL;

-- Trigger
CREATE TRIGGER set_timestamp_usuarios
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY usuarios_policy ON usuarios
FOR ALL USING (
  restaurante_id::text = current_setting('app.current_restaurante_id', true)
);
