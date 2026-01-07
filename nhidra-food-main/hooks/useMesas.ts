import { useEffect, useState } from 'react'
import { supabase, RESTAURANTE_ID } from '../lib/supabase'

export interface Mesa {
    id: string
    numero: number
    capacidade: number
    status: 'livre' | 'ocupada' | 'reservada'
    pedido_atual_id: string | null
    garcom_id: string | null
    ocupada_em: string | null
}

export const useMesas = () => {
    const [mesas, setMesas] = useState<Mesa[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMesas()

        // Realtime - escutar mudanças nas mesas
        const channel = supabase
            .channel('mesas-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'mesas',
                    filter: `restaurante_id=eq.${RESTAURANTE_ID}`
                },
                (payload) => {
                    console.log('Mesa atualizada:', payload)
                    fetchMesas() // Recarregar mesas quando houver mudança
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchMesas = async () => {
        try {
            const { data, error } = await supabase
                .from('mesas')
                .select('*')
                .eq('restaurante_id', RESTAURANTE_ID)
                .is('deletado_em', null)
                .order('numero', { ascending: true })

            if (error) throw error
            setMesas(data || [])
        } catch (err) {
            console.error('Erro ao buscar mesas:', err)
        } finally {
            setLoading(false)
        }
    }

    const atualizarStatusMesa = async (mesaId: string, status: Mesa['status']) => {
        try {
            const { error } = await supabase
                .from('mesas')
                .update({ status })
                .eq('id', mesaId)

            if (error) throw error
            await fetchMesas()
        } catch (err) {
            console.error('Erro ao atualizar mesa:', err)
            throw err
        }
    }

    return { mesas, loading, refetch: fetchMesas, atualizarStatusMesa }
}
