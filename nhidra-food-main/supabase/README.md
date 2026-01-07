# Briez - Backend Supabase

Backend completo do sistema Briez otimizado para performance em horário de pico.

## 📁 Estrutura

```
supabase/
├── migrations/           # Migrations SQL (executar em ordem)
│   ├── 001_base_schema.sql
│   ├── 002_cardapio.sql
│   ├── 003_mesas_pedidos.sql
│   ├── 004_pracas.sql
│   ├── 005_caixa.sql
│   ├── 006_views.sql
│   └── 007_seed.sql
└── functions/            # Edge Functions
    ├── cardapio-publico/
    └── emitir-nota-fiscal/
```

## 🚀 Como Executar

### 1. Criar Projeto no Supabase
```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Inicializar projeto
supabase init

# Linkar com projeto remoto
supabase link --project-ref SEU_PROJECT_REF
```

### 2. Executar Migrations
```bash
# Executar todas as migrations em ordem
supabase db push

# OU executar manualmente no SQL Editor do Supabase Dashboard
# Copie e cole cada arquivo .sql na ordem (001, 002, 003...)
```

### 3. Deploy das Edge Functions
```bash
# Deploy da função de cardápio público
supabase functions deploy cardapio-publico

# Deploy da função de nota fiscal
supabase functions deploy emitir-nota-fiscal

# Configurar secrets
supabase secrets set NFE_API_KEY=sua_chave_aqui
```

## 📊 Tabelas Principais

### Core
- `restaurantes` - Dados do restaurante
- `usuarios` - Usuários do sistema (auth)
- `mesas` - Mesas do restaurante (Realtime ✅)

### Cardápio
- `categorias` - Categorias de produtos
- `produtos` - Produtos do cardápio
- `banners` - Banners promocionais

### Operação
- `pedidos` - Pedidos (Realtime ✅)
- `itens_pedido` - Itens de cada pedido
- `pedidos_praca` - Pedidos na cozinha (Realtime ✅)

### Financeiro
- `caixa` - Caixa diário (Realtime ✅)
- `transacoes_caixa` - Transações (Realtime ✅)

## ⚡ Performance

### Realtime Habilitado
- ✅ `mesas` - Atualização instantânea de status
- ✅ `pedidos` - Novos pedidos em tempo real
- ✅ `pedidos_praca` - Cozinha atualiza em < 50ms
- ✅ `caixa` - Saldo atualiza automaticamente
- ✅ `transacoes_caixa` - Transações em tempo real

### Views Materializadas
- `ranking_produtos` - Atualiza a cada 15min
- `metricas_dashboard` - Atualiza a cada 5min

### Triggers Automáticos
- ✅ Criar pedido na praça ao mudar status
- ✅ Atualizar status da mesa automaticamente
- ✅ Registrar transação no caixa ao pagar pedido
- ✅ Atualizar saldo do caixa automaticamente

## 🔒 Segurança

### Row Level Security (RLS)
Todas as tabelas têm RLS habilitado com políticas baseadas em `restaurante_id`.

### Acesso Público
Apenas para cardápio digital:
- `categorias` (leitura)
- `produtos` (leitura)
- `banners` (leitura)

## 📱 Configuração do Frontend

### 1. Instalar Cliente Supabase
```bash
npm install @supabase/supabase-js
```

### 2. Configurar Cliente
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://SEU_PROJECT.supabase.co',
  'SUA_ANON_KEY'
)

// Configurar restaurante_id para RLS
await supabase.rpc('set_config', {
  parameter: 'app.current_restaurante_id',
  value: restauranteId
})
```

### 3. Realtime
```typescript
// Escutar mudanças nas mesas
supabase
  .channel('mesas')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'mesas'
  }, (payload) => {
    console.log('Mesa atualizada:', payload)
  })
  .subscribe()
```

## 🎯 Resultado Esperado

- ✅ Dashboard carrega em < 200ms
- ✅ Praças atualizam em < 50ms
- ✅ Mesas nunca travam
- ✅ Caixa sempre correto
- ✅ 100+ pedidos simultâneos sem degradação

## 📝 Notas

- Execute as migrations na ordem numérica
- Aguarde a conclusão de cada migration antes da próxima
- As views materializadas começam a atualizar automaticamente após deploy
- Configure os secrets das Edge Functions antes de usar
