
import React from 'react';

const Terms: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
                    <h1 className="text-white text-3xl font-bold tracking-tight">Termos de Uso</h1>
                    <p className="text-[#666] text-sm font-medium">Última atualização: Janeiro de 2026</p>
                </div>

                <div className="flex flex-col gap-6 text-[#999] text-sm leading-relaxed">
                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar e usar a plataforma briez, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">2. Descrição do Serviço</h2>
                        <p>
                            A briez fornece um sistema de gestão gastronômica baseado em nuvem, incluindo controle de mesas, comandas, cozinha, financeiro e cardápio digital. O serviço é oferecido na modalidade SaaS (Software as a Service).
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">3. Responsabilidades do Usuário</h2>
                        <p>
                            O usuário é responsável por manter a confidencialidade de sua conta e senha, bem como por todas as atividades que ocorrem sob sua conta. Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">4. Limitação de Responsabilidade</h2>
                        <p>
                            A briez não será responsável por quaisquer danos indiretos, incidentais, especiais ou consequentes resultantes do uso ou da incapacidade de usar o serviço, incluindo interrupções de negócios ou perda de dados.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4">
                        <h2 className="text-white text-lg font-bold">5. Modificações dos Termos</h2>
                        <p>
                            Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações entrarão em vigor imediatamente após a publicação na plataforma. O uso continuado do serviço após tais alterações constitui sua aceitação dos novos termos.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
