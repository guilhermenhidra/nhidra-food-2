import React, { useState } from 'react';
import { supabase, RESTAURANTE_ID } from '../lib/supabase';

const TestSupabase: React.FC = () => {
    const [resultado, setResultado] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const testarConexao = async () => {
        setLoading(true);
        setErro(null);
        setResultado(null);

        try {
            // Teste 1: Buscar produtos
            const { data: produtos, error: errorProdutos } = await supabase
                .from('produtos')
                .select('*')
                .eq('restaurante_id', RESTAURANTE_ID)
                .limit(5);

            if (errorProdutos) throw errorProdutos;

            // Teste 2: Buscar categorias
            const { data: categorias, error: errorCategorias } = await supabase
                .from('categorias')
                .select('*')
                .eq('restaurante_id', RESTAURANTE_ID);

            if (errorCategorias) throw errorCategorias;

            // Teste 3: Buscar mesas
            const { data: mesas, error: errorMesas } = await supabase
                .from('mesas')
                .select('*')
                .eq('restaurante_id', RESTAURANTE_ID)
                .limit(10);

            if (errorMesas) throw errorMesas;

            setResultado({
                produtos: produtos?.length || 0,
                categorias: categorias?.length || 0,
                mesas: mesas?.length || 0,
                exemploProduto: produtos?.[0] || null,
                exemploCategoria: categorias?.[0] || null,
                exemploMesa: mesas?.[0] || null
            });
        } catch (err: any) {
            setErro(err.message || 'Erro desconhecido');
            console.error('Erro ao testar Supabase:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-white text-3xl font-black mb-8">🧪 Teste Supabase</h1>

                <button
                    onClick={testarConexao}
                    disabled={loading}
                    className="bg-[#10b981] text-black px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-[#0ea472] transition-all disabled:opacity-50"
                >
                    {loading ? 'Testando...' : '🚀 Testar Conexão'}
                </button>

                {erro && (
                    <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                        <h2 className="text-red-500 font-black text-lg mb-2">❌ Erro</h2>
                        <p className="text-red-400 text-sm font-mono">{erro}</p>
                    </div>
                )}

                {resultado && (
                    <div className="mt-6 space-y-4">
                        <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-6">
                            <h2 className="text-[#10b981] font-black text-lg mb-4">✅ Conexão Funcionando!</h2>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="text-white/50 text-xs font-bold mb-1">Produtos</div>
                                    <div className="text-white text-2xl font-black">{resultado.produtos}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="text-white/50 text-xs font-bold mb-1">Categorias</div>
                                    <div className="text-white text-2xl font-black">{resultado.categorias}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="text-white/50 text-xs font-bold mb-1">Mesas</div>
                                    <div className="text-white text-2xl font-black">{resultado.mesas}</div>
                                </div>
                            </div>

                            {resultado.exemploProduto && (
                                <div className="bg-white/5 rounded-lg p-4 mb-4">
                                    <h3 className="text-white font-bold text-sm mb-2">📦 Exemplo de Produto:</h3>
                                    <div className="text-white/70 text-xs font-mono">
                                        <div>Nome: {resultado.exemploProduto.nome}</div>
                                        <div>Preço: R$ {resultado.exemploProduto.preco}</div>
                                        <div>ID: {resultado.exemploProduto.id}</div>
                                    </div>
                                </div>
                            )}

                            {resultado.exemploCategoria && (
                                <div className="bg-white/5 rounded-lg p-4 mb-4">
                                    <h3 className="text-white font-bold text-sm mb-2">📁 Exemplo de Categoria:</h3>
                                    <div className="text-white/70 text-xs font-mono">
                                        <div>Nome: {resultado.exemploCategoria.nome}</div>
                                        <div>ID: {resultado.exemploCategoria.id}</div>
                                    </div>
                                </div>
                            )}

                            {resultado.exemploMesa && (
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h3 className="text-white font-bold text-sm mb-2">🪑 Exemplo de Mesa:</h3>
                                    <div className="text-white/70 text-xs font-mono">
                                        <div>Número: {resultado.exemploMesa.numero}</div>
                                        <div>Capacidade: {resultado.exemploMesa.capacidade} pessoas</div>
                                        <div>Status: {resultado.exemploMesa.status}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                            <h3 className="text-blue-400 font-black text-sm mb-2">ℹ️ Próximo Passo</h3>
                            <p className="text-blue-300 text-sm">
                                Se você viu os dados acima, significa que o Supabase está funcionando perfeitamente!
                                Agora posso integrar o Menu para salvar produtos direto no banco de dados.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestSupabase;
