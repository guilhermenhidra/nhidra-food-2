# 🔍 Teste Rápido - Supabase Funcionando?

## Teste no Console do Navegador

Abra o console (F12) e cole este código:

```javascript
// Importar o cliente Supabase
const { createClient } = await import('@supabase/supabase-js')

const supabase = createClient(
  'https://oohkbczxlwvyuxjtpmlb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGtiY3p4bHd2eXV4anRwbWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NDUwNjgsImV4cCI6MjA4MzMyMTA2OH0.NG1FFPOJkDU4fEZumFMOUay0O9I2WXEMtdMing_CwRI'
)

// Buscar produtos
const { data, error } = await supabase
  .from('produtos')
  .select('*')
  .eq('restaurante_id', '00000000-0000-0000-0000-000000000001')

console.log('✅ Produtos do banco:', data)
console.log('❌ Erro:', error)
```

## O que deve aparecer:

✅ **Se funcionar:** Vai mostrar 20 produtos
❌ **Se der erro:** Me mostre a mensagem de erro

---

## Por que localStorage não salva?

O localStorage **SALVA**, mas o React **RESETA** o estado quando você recarrega (F5).

**Solução:** Integrar Supabase para salvar no banco de dados real.

---

## Próximo Passo

Se o teste acima funcionar, posso integrar o Menu completo para salvar no Supabase.

**Funcionou o teste?**
