# 🔐 Como Configurar o .env.local

## Passo a Passo:

### 1️⃣ Criar o arquivo .env.local

**No Windows (PowerShell):**
```powershell
# Navegue até a pasta do projeto
cd C:\Users\andra\.gemini\antigravity\scratch\nhidra-food

# Copie o arquivo de exemplo
copy .env.example .env.local
```

**OU crie manualmente:**
1. Abra o VS Code
2. Clique com botão direito na raiz do projeto
3. Selecione "New File"
4. Nomeie como `.env.local`

---

### 2️⃣ Pegar suas Credenciais do Supabase

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá em:** Settings → API
4. **Copie:**
   - `Project URL` (exemplo: `https://abcdefgh.supabase.co`)
   - `anon public` key (uma chave longa começando com `eyJ...`)

---

### 3️⃣ Colar no arquivo .env.local

Abra o arquivo `.env.local` e cole:

```env
# Variáveis de Ambiente - Supabase

# Supabase
VITE_SUPABASE_URL=https://SEU_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Edge Functions (opcional)
VITE_SUPABASE_FUNCTIONS_URL=https://SEU_PROJECT.supabase.co/functions/v1
```

**Substitua:**
- `https://SEU_PROJECT.supabase.co` → Seu Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → Sua anon key

---

### 4️⃣ Salvar e Reiniciar o Servidor

1. **Salve o arquivo** `.env.local`
2. **Pare o servidor** (Ctrl+C no terminal)
3. **Inicie novamente:**
   ```bash
   npm run dev
   ```

---

## ✅ Como Verificar se Funcionou

No console do navegador (F12), você deve ver as variáveis carregadas:

```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
// Deve mostrar: https://seu_project.supabase.co
```

---

## 🔒 Segurança

- ✅ O arquivo `.env.local` está no `.gitignore`
- ✅ Nunca será commitado no Git
- ✅ Suas credenciais estão seguras

---

## 🆘 Problemas Comuns

### Variáveis não carregam
**Solução:** Reinicie o servidor (`npm run dev`)

### Erro "Invalid API key"
**Solução:** Verifique se copiou a `anon public` key, não a `service_role`

### Arquivo não aparece no VS Code
**Solução:** É normal, arquivos `.env.local` ficam ocultos. Use Ctrl+P e digite `.env.local`

---

## 📝 Exemplo Completo

```env
VITE_SUPABASE_URL=https://xyzabcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiY2RlZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1MjQwMDAsImV4cCI6MjAwNTA5MDAwMH0.abcdefghijklmnopqrstuvwxyz1234567890
VITE_SUPABASE_FUNCTIONS_URL=https://xyzabcdefgh.supabase.co/functions/v1
```

---

Pronto! Agora você pode usar o Supabase no frontend! 🚀
