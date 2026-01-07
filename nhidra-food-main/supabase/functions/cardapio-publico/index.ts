// =====================================================
// BRIEZ - Edge Function: Cardápio Público
// Endpoint: /cardapio-publico?restaurante_id=xxx
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
        const url = new URL(req.url)
        const restauranteId = url.searchParams.get('restaurante_id')

        if (!restauranteId) {
            return new Response(
                JSON.stringify({ error: 'restaurante_id é obrigatório' }),
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

        // Buscar informações do restaurante
        const { data: restaurante, error: restError } = await supabase
            .from('restaurantes')
            .select('id, nome, endereco, telefone, logo_url')
            .eq('id', restauranteId)
            .eq('ativo', true)
            .is('deletado_em', null)
            .single()

        if (restError || !restaurante) {
            return new Response(
                JSON.stringify({ error: 'Restaurante não encontrado' }),
                {
                    status: 404,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Buscar categorias com produtos
        const { data: categorias, error: catError } = await supabase
            .from('categorias')
            .select(`
        id,
        nome,
        descricao,
        ordem,
        produtos:produtos(
          id,
          nome,
          descricao,
          preco,
          imagem_url,
          destaque,
          ordem,
          ativo,
          deletado_em
        )
      `)
            .eq('restaurante_id', restauranteId)
            .eq('ativo', true)
            .is('deletado_em', null)
            .order('ordem', { ascending: true })

        if (catError) throw catError

        // Ordenar produtos dentro de cada categoria e filtrar inativos
        const resultado = categorias?.map(cat => ({
            ...cat,
            produtos: cat.produtos
                .filter((p: any) => p.ativo && !p.deletado_em)
                .sort((a: any, b: any) => a.ordem - b.ordem)
        })) || []

        // Buscar banners
        const { data: banners, error: bannersError } = await supabase
            .from('banners')
            .select('id, titulo, descricao, imagem_url, ordem')
            .eq('restaurante_id', restauranteId)
            .eq('ativo', true)
            .is('deletado_em', null)
            .order('ordem', { ascending: true })

        if (bannersError) throw bannersError

        return new Response(
            JSON.stringify({
                restaurante,
                categorias: resultado,
                banners: banners || []
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=300' // 5 minutos
                }
            }
        )

    } catch (error) {
        console.error('Erro:', error)
        return new Response(
            JSON.stringify({
                error: error.message || 'Erro interno do servidor'
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
