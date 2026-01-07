
import React, { useState } from 'react';
import { Order } from '../types';

const INITIAL_ORDERS: Order[] = [
  { id: '1', table: 'Mesa 1', client: 'Carlos Silva', status: 'Em preparo', total: 'R$ 75,00', date: '15/07/2024 12:30', invoiceIssued: false, waiter: 'João Silva', cashier: 'Maria Santos' },
  { id: '2', table: 'Mesa 2', client: 'Ana Souza', status: 'Entregue', total: 'R$ 120,00', date: '15/07/2024 13:15', invoiceIssued: true, waiter: 'Pedro Costa', cashier: 'Ana Paula' },
  { id: '3', table: 'Mesa 3', client: 'Lucas Mendes', status: 'Em preparo', total: 'R$ 90,00', date: '15/07/2024 14:00', invoiceIssued: false, waiter: 'Carlos Mendes', cashier: 'Maria Santos' },
  { id: '4', table: 'Mesa 4', client: 'Mariana Costa', status: 'Entregue', total: 'R$ 60,00', date: '15/07/2024 14:45', invoiceIssued: true, waiter: 'João Silva', cashier: 'Ana Paula' },
  { id: '5', table: 'Mesa 5', client: 'Pedro Almeida', status: 'Em preparo', total: 'R$ 105,00', date: '15/07/2024 15:30', invoiceIssued: false, waiter: 'Pedro Costa', cashier: 'Maria Santos' },
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState('Mesa');
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Form states
  const [orderTable, setOrderTable] = useState('');
  const [orderClient, setOrderClient] = useState('');
  const [orderTotal, setOrderTotal] = useState('');

  const tabs = ['Mesa', 'Balcão', 'Delivery'];

  const toggleStatus = (id: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        return {
          ...order,
          status: order.status === 'Em preparo' ? 'Entregue' : 'Em preparo'
        };
      }
      return order;
    }));
  };

  const handleIssueInvoice = (orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, invoiceIssued: true } : order
    ));
    alert('Nota fiscal emitida com sucesso!');
  };

  const handleOpenModal = () => {
    setOrderTable(activeTab === 'Mesa' ? 'Mesa ' : activeTab);
    setOrderClient('');
    setOrderTotal('');
    setShowOrderModal(true);
  };

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderTable || !orderClient || !orderTotal) return;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      table: orderTable,
      client: orderClient,
      status: 'Em preparo',
      total: `R$ ${parseFloat(orderTotal).toFixed(2).replace('.', ',')}`,
      date: formattedDate
    };

    setOrders([newOrder, ...orders]);
    setShowOrderModal(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold tracking-tight">Pedidos</h1>
        <button
          onClick={handleOpenModal}
          className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#e6e6e6] transition-all shadow-md active:scale-[0.98]"
        >
          Novo Pedido
        </button>
      </div>

      <div className="flex gap-4 p-1 bg-[#111111] border border-[#1a1a1a] rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-xs font-bold tracking-wider transition-all ${activeTab === tab
              ? 'bg-[#1a1a1a] text-white shadow-sm'
              : 'text-[#666] hover:text-[#999]'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#1a1a1a] bg-[#111111]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Identificação</th>
              <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Cliente</th>
              <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Garçom</th>
              <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Caixa</th>
              <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Total</th>
              <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a]/30 transition-colors group">
                <td className="px-8 py-5 text-sm font-bold text-white">{order.table}</td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{order.client}</span>
                    <span className="text-[10px] text-[#666]">{order.date}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-[#999]">
                  👨‍🍳 {order.waiter}
                </td>
                <td className="px-8 py-5 text-sm font-medium text-[#999]">
                  💰 {order.cashier}
                </td>
                <td className="px-8 py-5">
                  <button
                    onClick={() => toggleStatus(order.id)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${order.status === 'Entregue'
                      ? 'bg-[#10b981]/10 text-[#10b981]'
                      : 'bg-white/10 text-white'
                      }`}
                  >
                    {order.status}
                  </button>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-white">{order.total}</td>
                <td className="px-8 py-5 text-right">
                  {order.invoiceIssued ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 text-[#10b981] rounded-lg ml-auto w-fit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      <span className="text-xs font-bold uppercase">Nota Emitida</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleIssueInvoice(order.id)}
                      className="px-4 py-2 bg-[#f2800d]/10 hover:bg-[#f2800d]/20 text-[#f2800d] rounded-lg transition-all active:scale-95 text-xs font-bold uppercase tracking-wider flex items-center gap-2 ml-auto"
                      title="Emitir Nota Fiscal"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                        <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8"></path>
                      </svg>
                      Emitir Nota
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4">
        <button className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-bold text-sm border border-[#333] hover:bg-[#222] transition-colors">
          Histórico
        </button>
        <button className="bg-[#f2800d] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#e0750c] transition-all active:scale-[0.98]">
          Gerar Nota Fiscal
        </button>
      </div>

      {/* New Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md rounded-2xl p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-xl font-bold">Lançar Novo Pedido</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-[#666] hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Identificação (Mesa/Balcão)</label>
                <input
                  autoFocus
                  required
                  value={orderTable}
                  onChange={e => setOrderTable(e.target.value)}
                  placeholder="Ex: Mesa 12, Balcão 02..."
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Nome do Cliente</label>
                <input
                  required
                  value={orderClient}
                  onChange={e => setOrderClient(e.target.value)}
                  placeholder="Nome do cliente"
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Valor Total (R$)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={orderTotal}
                  onChange={e => setOrderTotal(e.target.value)}
                  placeholder="0,00"
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-white outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 p-4 bg-[#1a1a1a]/50 rounded-xl border border-[#1a1a1a]">
                <p className="text-[10px] text-[#666] font-bold uppercase tracking-widest">Informações Adicionais</p>
                <p className="text-xs text-[#999]">O pedido será iniciado com status <span className="text-white font-bold">Em preparo</span>.</p>
              </div>

              <button
                type="submit"
                className="bg-[#f2800d] text-white font-bold py-4 rounded-xl hover:bg-[#e0750c] transition-all active:scale-[0.98] mt-2 shadow-lg"
              >
                Confirmar Pedido
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
