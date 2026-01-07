// =====================================================
// BRIEZ - Edge Function: Emitir Nota Fiscal
// Endpoint: POST /emitir-nota-fiscal
// Body: { pedido_id: string }
// =====================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { pedido_id } = await req.json()

        if (!pedido_id) {
            return new Response(
                JSON.stringify({ error: 'pedido_id é obrigatório' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Buscar dados completos do pedido
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select(`
        *,
        restaurante:restaurantes(*),
        itens:itens_pedido(*)
      `)
            .eq('id', pedido_id)
            .single()

        if (pedidoError || !pedido) {
            return new Response(
                JSON.stringify({ error: 'Pedido não encontrado' }),
                {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Verificar se já foi emitida
        if (pedido.nota_emitida) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Nota fiscal já foi emitida',
                    nota_url: pedido.nota_fiscal_url
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // 2. Chamar API externa de nota fiscal
        // SUBSTITUA pela sua API real de NF-e (exemplo: Focus NFe, Bling, etc)
        const nfeApiKey = Deno.env.get('NFE_API_KEY')

        if (!nfeApiKey) {
            throw new Error('NFE_API_KEY não configurada')
        }

        // Exemplo de chamada (adapte para sua API)
        const notaResponse = await fetch('https://api-nfe-exemplo.com.br/emitir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${nfeApiKey}`
            },
            body: JSON.stringify({
                cnpj: pedido.restaurante.cnpj,
                numero_pedido: pedido.numero_pedido,
                cliente: {
                    nome: pedido.cliente_nome,
                    telefone: pedido.cliente_telefone
                },
                valor_total: pedido.total,
                desconto: pedido.desconto,
                itens: pedido.itens.map((item: any) => ({
                    descricao: item.produto_nome,
                    quantidade: item.quantidade,
                    valor_unitario: item.preco_unitario,
                    valor_total: item.subtotal
                }))
            })
        })

        if (!notaResponse.ok) {
            throw new Error(`Erro na API de NF-e: ${notaResponse.statusText}`)
        }

        const notaData = await notaResponse.json()

        // 3. Atualizar pedido com dados da nota
        const { error: updateError } = await supabase
            .from('pedidos')
            .update({
                nota_fiscal_url: notaData.url_pdf || notaData.link_pdf,
                nota_fiscal_chave: notaData.chave_acesso || notaData.chave,
                nota_emitida: true,
                nota_emitida_em: new Date().toISOString()
            })
            .eq('id', pedido_id)

        if (updateError) throw updateError

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Nota fiscal emitida com sucesso',
                nota_url: notaData.url_pdf || notaData.link_pdf,
                chave_acesso: notaData.chave_acesso || notaData.chave
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Erro ao emitir nota fiscal:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message || 'Erro ao emitir nota fiscal'
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
