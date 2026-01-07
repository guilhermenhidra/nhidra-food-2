import { useEffect, useState } from 'react'
import { supabase, RESTAURANTE_ID } from '../lib/supabase'

export interface Produto {
    id: string
    nome: string
    categoria_id: string
    preco: number
    descricao: string | null
    imagem_url: string | null
    area_preparo: string | null
    ativo: boolean
    destaque: boolean
}

export interface Categoria {
    id: string
    nome: string
    descricao: string | null
    ordem: number
    ativo: boolean
}

export const useProdutos = () => {
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)

            // Buscar categorias
            const { data: categoriasData, error: categoriasError } = await supabase
                .from('categorias')
                .select('*')
                .eq('restaurante_id', RESTAURANTE_ID)
                .eq('ativo', true)
                .is('deletado_em', null)
                .order('ordem', { ascending: true })

            if (categoriasError) throw categoriasError

            // Buscar produtos
            const { data: produtosData, error: produtosError } = await supabase
                .from('produtos')
                .select('*')
                .eq('restaurante_id', RESTAURANTE_ID)
                .eq('ativo', true)
                .is('deletado_em', null)
                .order('ordem', { ascending: true })

            if (produtosError) throw produtosError

            setCategorias(categoriasData || [])
            setProdutos(produtosData || [])
            setError(null)
        } catch (err: any) {
            console.error('Erro ao buscar produtos:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { produtos, categorias, loading, error, refetch: fetchData }
}

export const useBanners = () => {
    const [banners, setBanners] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBanners()
    }, [])

    const fetchBanners = async () => {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .eq('restaurante_id', RESTAURANTE_ID)
                .eq('ativo', true)
                .is('deletado_em', null)
                .order('ordem', { ascending: true })

            if (error) throw error
            setBanners(data || [])
        } catch (err) {
            console.error('Erro ao buscar banners:', err)
        } finally {
            setLoading(false)
        }
    }

    return { banners, loading, refetch: fetchBanners }
}
