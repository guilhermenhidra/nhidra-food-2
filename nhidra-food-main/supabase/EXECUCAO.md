# 🚀 Guia de Execução das Migrations - Briez

## ⚠️ IMPORTANTE: Leia antes de executar!

As migrations devem ser executadas **UMA VEZ** e **NA ORDEM CORRETA**.

Se você já executou alguma migration e teve erro, siga o **Passo 0** primeiro.

---

## 📋 Passo 0: Limpar Banco (Se necessário)

**Execute APENAS se você já tentou rodar as migrations antes e teve erro.**

1. Vá no **SQL Editor** do Supabase Dashboard
2. Copie e cole o conteúdo de `000_rollback.sql`
3. Clique em **Run**
4. Aguarde a mensagem de sucesso

---

## 📋 Passo 1: Executar Migrations na Ordem

Execute **uma por vez** no SQL Editor do Supabase:

### 1️⃣ Migration 001 - Base Schema
```
Arquivo: 001_base_schema.sql
Cria: extensões, função de timestamp, restaurantes, usuarios
```

### 2️⃣ Migration 002 - Cardápio
```
Arquivo: 002_cardapio.sql
Cria: categorias, produtos, banners
```

### 3️⃣ Migration 003 - Mesas e Pedidos
```
Arquivo: 003_mesas_pedidos.sql
Cria: mesas, pedidos, itens_pedido
Habilita: Realtime em mesas e pedidos
```

### 4️⃣ Migration 004 - Praças
```
Arquivo: 004_pracas.sql
Cria: pedidos_praca, triggers automáticos
Habilita: Realtime em pedidos_praca
```

### 5️⃣ Migration 005 - Caixa
```
Arquivo: 005_caixa.sql
Cria: caixa, transacoes_caixa, triggers de saldo
Habilita: Realtime em caixa e transacoes
```

### 6️⃣ Migration 006 - Views
```
Arquivo: 006_views.sql
Cria: views materializadas, agendamentos
```

### 7️⃣ Migration 007 - Seed
```
Arquivo: 007_seed.sql
Insere: dados iniciais (restaurante, mesas, produtos)
```

---

## ✅ Checklist de Execução

- [ ] Executei 000_rollback.sql (se necessário)
- [ ] Executei 001_base_schema.sql
- [ ] Executei 002_cardapio.sql
- [ ] Executei 003_mesas_pedidos.sql
- [ ] Executei 004_pracas.sql
- [ ] Executei 005_caixa.sql
- [ ] Executei 006_views.sql
- [ ] Executei 007_seed.sql

---

## 🔍 Como Verificar se Funcionou

Após executar todas as migrations, rode este SQL:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar dados seed
SELECT COUNT(*) as total_mesas FROM mesas;
SELECT COUNT(*) as total_produtos FROM produtos;
SELECT COUNT(*) as total_categorias FROM categorias;

-- Deve retornar:
-- total_mesas: 50
-- total_produtos: 20+
-- total_categorias: 6
```

---

## ❌ Se Tiver Erro

### Erro: "relation already exists"
**Solução:** Execute `000_rollback.sql` e comece do zero.

### Erro: "function does not exist"
**Solução:** Você pulou uma migration. Execute na ordem correta.

### Erro: "permission denied"
**Solução:** Use a Service Role Key, não a Anon Key.

---

## 🎯 Próximos Passos

Após executar todas as migrations com sucesso:

1. ✅ Deploy das Edge Functions
2. ✅ Configurar secrets (NFE_API_KEY)
3. ✅ Conectar frontend ao Supabase
4. ✅ Testar Realtime

---

## 📞 Suporte

Se tiver problemas:
1. Verifique se executou na ordem correta
2. Verifique se usou Service Role Key
3. Execute 000_rollback.sql e tente novamente
