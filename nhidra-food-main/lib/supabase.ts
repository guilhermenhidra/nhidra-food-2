// Configuração do Cliente Supabase
import { createClient } from '@supabase/supabase-js'

// Credenciais do Supabase (configuradas via .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oohkbczxlwvyuxjtpmlb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vaGtiY3p4bHd2eXV4anRwbWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NDUwNjgsImV4cCI6MjA4MzMyMTA2OH0.NG1FFPOJkDU4fEZumFMOUay0O9I2WXEMtdMing_CwRI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
})

// Configurar restaurante_id para RLS (Row Level Security)
export const setRestauranteContext = async (restauranteId: string) => {
    await supabase.rpc('set_config', {
        parameter: 'app.current_restaurante_id',
        value: restauranteId
    })
}

// ID do restaurante padrão (do seed)
export const RESTAURANTE_ID = '00000000-0000-0000-0000-000000000001'
