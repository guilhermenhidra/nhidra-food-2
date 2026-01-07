
import React from 'react';

interface PlansProps {
  currentPlan: string;
  onSelectPlan: (plan: string) => void;
}

const Plans: React.FC<PlansProps> = ({ currentPlan, onSelectPlan }) => {
  const plans = [
    {
      name: 'Plano Básico',
      price: 'R$ 99,90',
      period: '/mês',
      features: ['Até 5 mesas', 'Cardápio Digital', 'Gestão de Pedidos Básica', 'Suporte por E-mail'],
      color: 'border-[#333]',
      button: 'bg-[#1a1a1a] text-white hover:bg-[#222]'
    },
    {
      name: 'Plano Premium',
      price: 'R$ 199,90',
      period: '/mês',
      features: ['Mesas Ilimitadas', 'Gestão de Cozinhas (KDS)', 'Relatórios Avançados', 'Suporte Prioritário 24/7', 'Módulo Garçom Pro'],
      color: 'border-[#f2800d]',
      recommended: true,
      button: 'bg-[#f2800d] text-white hover:bg-[#e0750c]'
    },
    {
      name: 'Plano Enterprise',
      price: 'R$ 499,90',
      period: '/mês',
      features: ['Multi-unidades', 'API de Integração', 'Treinamento Presencial', 'Gerente de Conta Dedicado', 'Customização de Interface'],
      color: 'border-[#333]',
      button: 'bg-[#1a1a1a] text-white hover:bg-[#222]'
    }
  ];

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-white text-3xl font-bold tracking-tight">Escolha o plano ideal</h1>
        <p className="text-[#666] text-sm font-medium">Soluções escaláveis para o crescimento do seu restaurante.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`bg-[#111] border ${plan.color} rounded-[32px] p-8 flex flex-col gap-8 relative overflow-hidden transition-all hover:scale-[1.02] ${plan.recommended ? 'shadow-2xl shadow-[#f2800d]/10' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-[#f2800d] text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">
                Recomendado
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h3 className="text-[#666] text-[10px] font-black uppercase tracking-[0.2em]">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{plan.price}</span>
                <span className="text-[#444] text-xs font-bold">{plan.period}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <span className="text-[10px] font-bold text-[#444] uppercase tracking-widest border-b border-white/5 pb-2">O que está incluso:</span>
              <ul className="flex flex-col gap-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-[#999] font-medium leading-relaxed">
                    <svg className="size-4 text-[#10b981] shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => onSelectPlan(plan.name)}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${plan.name === currentPlan ? 'bg-[#10b981] text-white cursor-default' : plan.button}`}
            >
              {plan.name === currentPlan ? 'Plano Atual' : 'Selecionar Plano'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#1a1a1a] p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h4 className="text-white font-bold">Precisa de algo sob medida?</h4>
          <p className="text-[#666] text-xs">Para franquias e grandes redes, oferecemos condições especiais.</p>
        </div>
        <button className="bg-white text-black px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#e6e6e6] transition-all">
          Falar com Especialista
        </button>
      </div>
    </div>
  );
};

export default Plans;
