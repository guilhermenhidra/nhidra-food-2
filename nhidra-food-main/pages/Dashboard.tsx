
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Seg', value: 2500 },
  { name: 'Ter', value: 3500 },
  { name: 'Qua', value: 9500 },
  { name: 'Qui', value: 5000 },
  { name: 'Sex', value: 6500 },
  { name: 'Sáb', value: 5500 },
  { name: 'Dom', value: 7500 },
];

const bestSellers = [
  { name: 'Hambúrguer Artesanal', sales: '450 vendas', percentage: 90, category: 'Comida' },
  { name: 'Batata Rústica', sales: '320 vendas', percentage: 70, category: 'Acompanhamento' },
  { name: 'Pizza de Calabresa', sales: '280 vendas', percentage: 60, category: 'Comida' },
  { name: 'Suco Natural 500ml', sales: '210 vendas', percentage: 45, category: 'Bebida' },
  { name: 'Coca-Cola Lata', sales: '190 vendas', percentage: 40, category: 'Bebida' },
  { name: 'Pudim de Leite', sales: '150 vendas', percentage: 30, category: 'Sobremesa' },
];

const Dashboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Comida', 'Bebida', 'Acompanhamento', 'Sobremesa'];

  const filteredBestSellers = activeCategory === 'Todos' 
    ? bestSellers 
    : bestSellers.filter(item => item.category === activeCategory);

  const stats = [
    { 
      label: 'RECEITA MENSAL', 
      value: 'R$ 45.231,89', 
      change: '+12.5%', 
      isPositive: true,
      icon: <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-12v2m0 16v2"></path></svg>
    },
    { 
      label: 'TOTAL PEDIDOS', 
      value: '1.243', 
      change: '+5.2%', 
      isPositive: true,
      icon: <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    },
    { 
      label: 'TICKET MÉDIO', 
      value: 'R$ 82,40', 
      change: '-2.1%', 
      isPositive: false,
      icon: <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 3h18v18H3V3z"></path></svg>
    },
    { 
      label: 'CLIENTES', 
      value: '384', 
      change: '+18%', 
      isPositive: true,
      icon: <svg className="size-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
    },
  ];

  return (
    <div className="flex flex-col gap-8 text-white">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="text-[#666]">{stat.icon}</div>
              <span className={`text-xs font-bold ${stat.isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                {stat.change}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-[#666] text-[10px] font-bold tracking-widest uppercase mb-1">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[#111111] border border-[#1a1a1a] rounded-xl p-8 flex flex-col gap-6">
          <h2 className="text-sm font-bold">Faturamento Diário</h2>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 11 }} 
                  dy={15}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-8 flex flex-col gap-6 overflow-hidden">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold">Mais Vendidos</h2>
            
            {/* Filtro de Categorias com scroll sutil */}
            <div className="flex gap-2 overflow-x-auto pb-4 subtle-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                    activeCategory === cat 
                      ? 'bg-white text-black border-white' 
                      : 'bg-[#1a1a1a] text-[#666] border-[#333] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de itens com scroll sutil e altura limitada */}
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[300px] pr-2 subtle-scrollbar">
            {filteredBestSellers.length > 0 ? (
              filteredBestSellers.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-[7px] font-bold text-[#444] uppercase border border-[#222] px-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[#666] text-xs">{item.sales}</span>
                    </div>
                    <div className="w-16 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-[#333] text-xs uppercase font-bold">Nenhum dado</div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .subtle-scrollbar::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
        .subtle-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .subtle-scrollbar::-webkit-scrollbar-thumb {
          background: #161616;
          border-radius: 10px;
        }
        .subtle-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #222;
        }
        .subtle-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #161616 transparent;
        }
      `}} />
    </div>
  );
};

export default Dashboard;
