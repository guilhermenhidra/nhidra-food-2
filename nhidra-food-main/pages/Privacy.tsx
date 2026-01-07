
import React from 'react';

const Privacy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 bg-[#111] border border-[#1a1a1a] rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-[#666] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>
                Voltar
            </button>

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-3xl font-bold tracking-tight">Política de Privacidade</h1>
                    <p className="text-[#666] text-sm font-medium">Última atualização: Janeiro de 2026</p>
                </div>

                <div className="flex flex-col gap-6 text-[#999] text-sm leading-relaxed">
                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">1. Coleta de Informações</h2>
                        <p>
                            Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados do seu estabelecimento, ao criar uma conta ou utilizar nossas funcionalidades de gestão.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">2. Uso dos Dados</h2>
                        <p>
                            Os dados coletados são utilizados exclusivamente para fornecer, manter e melhorar nossos serviços, processar transações e enviar comunicações administrativas importantes.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">3. Segurança dos Dados</h2>
                        <p>
                            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">4. Compartilhamento com Terceiros</h2>
                        <p>
                            Não vendemos suas informações pessoais. Podemos compartilhar dados com fornecedores de serviços que nos auxiliam na operação da plataforma, sempre sob estritas obrigações de confidencialidade.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">5. Seus Direitos</h2>
                        <p>
                            Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento através das configurações da sua conta ou entrando em contato com nosso suporte.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
