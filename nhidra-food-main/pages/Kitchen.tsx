
import React, { useState, useEffect } from 'react';
import { Order } from '../types';

const INITIAL_KITCHEN_AREAS = ['Todas', 'Cozinha Principal', 'Bar', 'Pizzaria'];

const INITIAL_KITCHEN_ORDERS: Order[] = [
  { id: 'k1', table: 'Mesa 04', client: 'Roberto Carlos', status: 'Em preparo', total: 'R$ 0,00', date: '10:15', items: [{ name: 'Salmão Grelhado', quantity: 2, kitchenArea: 'Cozinha Principal', isPrinted: true }, { name: 'Suco de Laranja', quantity: 1, kitchenArea: 'Bar', isPrinted: true }] },
  { id: 'k2', table: 'Balcão 02', client: 'Ana Paula', status: 'Em preparo', total: 'R$ 0,00', date: '10:20', items: [{ name: 'Hambúrguer Artesanal', quantity: 1, kitchenArea: 'Cozinha Principal', isPrinted: true }, { name: 'Refrigerante Lata', quantity: 1, kitchenArea: 'Bar', isPrinted: false }] },
  { id: 'k3', table: 'Mesa 12', client: 'Marcos Braz', status: 'Em preparo', total: 'R$ 0,00', date: '10:25', items: [{ name: 'Pizza Calabresa', quantity: 1, kitchenArea: 'Pizzaria', isPrinted: true }] },
  { id: 'k4', table: 'Mesa 01', client: 'Juliana Lima', status: 'Em preparo', total: 'R$ 0,00', date: '10:32', items: [{ name: 'Petit Gâteau', quantity: 2, kitchenArea: 'Sobremesas', isPrinted: false }] },
];

const Kitchen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_KITCHEN_ORDERS);
  const [kitchenAreas, setKitchenAreas] = useState<string[]>(INITIAL_KITCHEN_AREAS);
  const [activeArea, setActiveArea] = useState('Todas');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNewAreaModalOpen, setIsNewAreaModalOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');

  // Configurações padrão para o ticket
  const [paperSize] = useState('80mm');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSetReady = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const getFilteredOrders = () => {
    if (activeArea === 'Todas') return orders;
    return orders.filter(order => order.items?.some(item => item.kitchenArea === activeArea));
  };

  const handleAddNewArea = () => {
    if (newAreaName.trim() && !kitchenAreas.includes(newAreaName.trim())) {
      setKitchenAreas(prev => [...prev, newAreaName.trim()]);
      setNewAreaName('');
      setIsNewAreaModalOpen(false);
    }
  };

  const filteredOrders = getFilteredOrders();

  const triggerNativePrint = (order?: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let title = "Ticket de Pedido";
    let bodyContent = "";

    if (order) {
      title = `Pedido ${order.table}`;
      bodyContent = `
        <div class="header">
          <h2>briez</h2>
          <div style="font-size: 12px;">ID: ${order.id} | ÁREA: ${activeArea}</div>
          <div style="font-size: 18px; font-weight: bold; margin-top: 5px;">${order.table}</div>
          <div style="font-size: 12px;">CLIENTE: ${order.client}</div>
        </div>
        <div class="content">
          ${order.items?.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-family: monospace; border-bottom: 1px dashed #eee; padding-bottom: 2px;">
              <span>${item.quantity}x ${item.name}</span>
              <span style="font-size: 10px;">[${item.kitchenArea}]</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      title = `Página de Teste`;
      bodyContent = `
        <div class="header">
          <h2>PÁGINA DE TESTE</h2>
          <div style="font-size: 14px; font-weight: bold;">SETOR: ${activeArea}</div>
          <div style="font-size: 11px; margin-top: 10px;">SE VOCÊ ESTÁ VENDO ESTA MENSAGEM, A IMPRESSORA ESTÁ CONFIGURADA CORRETAMENTE NO SEU NAVEGADOR.</div>
        </div>
        <div class="content" style="border: 2px dashed #000; padding: 15px; text-align: center;">
           <h3 style="margin: 0;">TESTE DE CONEXÃO OK</h3>
           <p style="font-size: 10px; margin-top: 10px;">TAMANHO DO PAPEL: ${paperSize}</p>
        </div>
      `;
    }

    const content = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { size: auto; margin: 0mm; }
            body { 
              width: ${paperSize === '80mm' ? '72mm' : '50mm'}; 
              margin: 0 auto; 
              padding: 10px; 
              font-family: 'Inter', sans-serif;
              color: #000;
              background: #fff;
            }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
            .footer { text-align: center; border-top: 1px solid #000; padding-top: 10px; margin-top: 10px; font-size: 10px; }
            h2 { margin: 5px 0; font-size: 18px; text-transform: uppercase; }
            .content { margin-top: 10px; }
          </style>
        </head>
        <body>
          ${bodyContent}
          <div class="footer">
            IMPRESSO EM: ${new Date().toLocaleString()}<br/>
            SISTEMA briez
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header com Título e Ações */}
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl font-bold tracking-tight">Painel de Praças</h1>
            <p className="text-[#666] text-sm font-medium">Acompanhamento em tempo real das praças de preparo.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerNativePrint()}
              className="p-2.5 bg-[#111] border border-[#1a1a1a] text-[#666] hover:text-white hover:border-[#333] rounded-xl transition-all shadow-lg active:scale-95 group"
              title="Imprimir Resumo da Praça"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                <path d="M18 14H6v8h12v-8z"></path>
              </svg>
            </button>
            <button
              onClick={() => triggerNativePrint()}
              className="px-4 py-2.5 bg-transparent border border-[#333] text-[#666] hover:text-white hover:border-[#444] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Página Teste
            </button>
            <button
              onClick={() => setIsNewAreaModalOpen(true)}
              className="px-4 py-2.5 bg-[#f2800d] hover:bg-[#ff8c1a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
              title="Adicionar Nova Praça"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M12 5v14m-7-7h14"></path>
              </svg>
              Nova Praça
            </button>
          </div>
        </div>

        {/* Filtros de Praças */}
        <div className="flex gap-2 p-1.5 bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-[#111] hover:[&::-webkit-scrollbar-thumb]:bg-[#f2800d] [&::-webkit-scrollbar-thumb]:transition-colors">
          {kitchenAreas.map(area => (
            <button
              key={area}
              onClick={() => setActiveArea(area)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeArea === area
                ? 'bg-white text-black shadow-lg scale-105'
                : 'text-[#444] hover:text-white'
                }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-[#111] border border-[#1a1a1a] rounded-[24px] flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-start bg-[#161616]">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{order.table}</span>
                  <span className="text-[10px] font-bold text-[#666] uppercase tracking-[0.2em]">{order.client}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-[#10b981]/10 text-[#10b981] text-[9px] font-black px-2 py-0.5 rounded uppercase">{order.status}</div>
                  <span className="text-[11px] font-mono text-[#444]">{order.date}</span>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-4">
                {order.items?.filter(i => activeArea === 'Todas' || i.kitchenArea === activeArea).map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 w-full">
                      <div className="size-8 bg-[#1a1a1a] border border-[#333] rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0">
                        {item.quantity}x
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white leading-tight">{item.name}</span>
                          {item.isPrinted && (
                            <div className="flex items-center gap-1 text-[8px] font-black text-[#10b981] uppercase bg-[#10b981]/10 px-1.5 py-0.5 rounded border border-[#10b981]/20 animate-pulse" title="Este item já foi impresso na cozinha">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                                <path d="M18 14H6v8h12v-8z"></path>
                              </svg>
                              Impresso
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-[#444] font-black uppercase tracking-widest">{item.kitchenArea}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 pt-0 flex gap-2">
                <button
                  onClick={() => triggerNativePrint(order)}
                  className="p-4 bg-[#1a1a1a] border border-[#333] text-[#666] hover:text-white rounded-2xl transition-all active:scale-95"
                  title="Reimprimir Ticket do Pedido"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                    <path d="M18 14H6v8h12v-8z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => handleSetReady(order.id)}
                  className="flex-1 bg-[#10b981] hover:bg-[#0da06f] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>
                  Pronto
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center opacity-20 gap-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"></path>
            <path d="M7 2v11"></path>
            <path d="M15 14v7a2 2 0 002 2h2a2 2 0 002-2v-7"></path>
            <path d="M18 20V2"></path>
          </svg>
          <span className="text-sm font-black uppercase tracking-[0.4em]">Fila Limpa</span>
        </div>
      )}

      {/* Modal Nova Praça */}
      {isNewAreaModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#1a1a1a] rounded-3xl max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-[#1a1a1a]">
              <h2 className="text-white text-2xl font-bold tracking-tight">Nova Praça</h2>
              <p className="text-[#666] text-sm mt-1">Adicione uma nova área de preparo</p>
            </div>

            <div className="p-6">
              <label className="text-[#666] text-xs font-bold uppercase tracking-widest block mb-2">
                Nome da Praça
              </label>
              <input
                type="text"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNewArea()}
                placeholder="Ex: Sushi Bar, Grill, Confeitaria..."
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#f2800d] transition-colors"
                autoFocus
              />
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => {
                  setIsNewAreaModalOpen(false);
                  setNewAreaName('');
                }}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-widest transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewArea}
                disabled={!newAreaName.trim()}
                className="flex-1 bg-[#f2800d] hover:bg-[#ff8c1a] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M12 5v14m-7-7h14"></path>
                </svg>
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kitchen;
