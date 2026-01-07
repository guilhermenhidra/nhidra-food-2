
import React, { useState, useEffect, useRef } from 'react';

// Tipagem para itens na comanda
interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  printedQuantity: number;
  kitchenArea: string;
}

interface Bill {
  id: string;
  name: string;
  startedAt: number;
  items: BillItem[];
}

interface TableSession {
  id: number;
  status: 'occupied' | 'free';
  waiterName: string;
  waiterColor: string;
  bills: Bill[];
}

const MENU_PRODUCTS = [
  { id: 'p1', name: 'Hambúrguer Artesanal', price: 32.90, category: 'Pratos', kitchenArea: 'Cozinha Principal', hasTwoFlavors: false, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'p2', name: 'Batata Rústica', price: 18.50, category: 'Acompanhamentos', kitchenArea: 'Cozinha Principal', hasTwoFlavors: false, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'p3', name: 'Pizza Calabresa', price: 45.00, category: 'Pizzas', kitchenArea: 'Pizzaria', hasTwoFlavors: true, imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'p4', name: 'Pizza Quatro Queijos', price: 48.00, category: 'Pizzas', kitchenArea: 'Pizzaria', hasTwoFlavors: true, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'p5', name: 'Pizza Portuguesa', price: 52.00, category: 'Pizzas', kitchenArea: 'Pizzaria', hasTwoFlavors: true, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'p6', name: 'Suco de Laranja 500ml', price: 12.00, category: 'Bebidas', kitchenArea: 'Bar', hasTwoFlavors: false, imageUrl: 'https://images.unsplash.com/photo-1600271886342-ad92c39b9546?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'p7', name: 'Refrigerante Lata', price: 6.50, category: 'Bebidas', kitchenArea: 'Bar', hasTwoFlavors: false, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'p8', name: 'Pudim de Leite', price: 14.00, category: 'Sobremesas', kitchenArea: 'Sobremesas', hasTwoFlavors: false, imageUrl: 'https://images.unsplash.com/photo-1590080874088-eec64895b423?auto=format&fit=crop&q=80&w=300&h=300' },
  { id: 'p9', name: 'Petit Gâteau', price: 24.90, category: 'Sobremesas', kitchenArea: 'Sobremesas', hasTwoFlavors: true, imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62ffff51?auto=format&fit=crop&q=80&w=300&h=300' },
];

const CATEGORIES = ['Todos', 'Pratos', 'Acompanhamentos', 'Pizzas', 'Bebidas', 'Sobremesas'];

const formatDuration = (startedAt: number, currentTime: number) => {
  const diffInSeconds = Math.floor((currentTime - startedAt) / 1000);
  if (diffInSeconds < 0) return "00:00:00";
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;
  return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
};

const Waiter: React.FC<{ totalTables: number; setTotalTables: (val: number) => void }> = ({ totalTables, setTotalTables }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [localTables, setLocalTables] = useState<TableSession[]>([]);
  const [counterBills, setCounterBills] = useState<Bill[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);

  const [showNewBillModal, setShowNewBillModal] = useState(false);
  const [showTableConfig, setShowTableConfig] = useState(false);
  const [selectedTableForBill, setSelectedTableForBill] = useState<number | null>(null);
  const [newBillName, setNewBillName] = useState('');

  const [activeBillDetail, setActiveBillDetail] = useState<{ type: 'table' | 'counter', id: string | number, index: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const [showTwoFlavorChoice, setShowTwoFlavorChoice] = useState(false);
  const [pendingFirstFlavor, setPendingFirstFlavor] = useState<typeof MENU_PRODUCTS[0] | null>(null);
  const [isAwaitingSecondFlavor, setIsAwaitingSecondFlavor] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedNameValue, setEditedNameValue] = useState('');

  const [configInputValue, setConfigInputValue] = useState<string>(totalTables.toString());
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const waiterColors = ['#f2800d', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#ef4444'];
    const waiterNames = ['Carlos Silva', 'Ana Souza', 'Marcos Oliveira', 'Juliana Lima', 'Roberto Santos', 'Fernanda Costa'];

    setLocalTables(prev => {
      const newData: TableSession[] = Array.from({ length: totalTables }, (_, i) => {
        const existing = prev.find(t => t.id === i + 1);
        if (existing) return existing;

        const waiterIdx = i % waiterNames.length;
        return {
          id: i + 1,
          status: 'free',
          waiterName: waiterNames[waiterIdx],
          waiterColor: waiterColors[waiterIdx],
          bills: []
        };
      });
      return newData.slice(0, totalTables);
    });
    setConfigInputValue(totalTables.toString());
  }, [totalTables]);

  const handleConfigInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setConfigInputValue(val);
      const numeric = parseInt(val);
      if (!isNaN(numeric)) {
        setTotalTables(numeric);
      }
    }
  };

  const handleAddBill = () => {
    const finalName = newBillName.trim() || (selectedTableForBill === null ? `Balcão ${counterBills.length + 1}` : 'Consumidor');

    if (selectedTableForBill === null) {
      const newBill: Bill = {
        id: `bill-c-${Date.now()}`,
        name: finalName,
        startedAt: Date.now(),
        items: []
      };
      setCounterBills(prev => [newBill, ...prev]);
      setActiveBillDetail({ type: 'counter', id: newBill.id, index: 0 });
    } else {
      let billIndex = 0;
      setLocalTables(prev => prev.map(t => {
        if (t.id === selectedTableForBill) {
          const newBill: Bill = {
            id: `bill-t-${t.id}-${t.bills.length}-${Date.now()}`,
            name: finalName,
            startedAt: Date.now(),
            items: []
          };
          billIndex = t.bills.length;
          return {
            ...t,
            status: 'occupied',
            bills: [...t.bills, newBill]
          };
        }
        return t;
      }));
      setActiveBillDetail({ type: 'table', id: selectedTableForBill, index: billIndex });
    }
    setShowNewBillModal(false);
    setNewBillName('');
    setSelectedTableForBill(null);
  };

  const handleUpdateBillName = () => {
    if (!activeBillDetail) return;
    const newName = editedNameValue.trim() || 'Consumidor';

    if (activeBillDetail.type === 'counter') {
      setCounterBills(prev => prev.map(b => b.id === activeBillDetail.id ? { ...b, name: newName } : b));
    } else {
      setLocalTables(prev => prev.map(t => {
        if (t.id === activeBillDetail.id) {
          const bills = [...t.bills];
          bills[activeBillDetail.index].name = newName;
          return { ...t, bills };
        }
        return t;
      }));
    }
    setIsEditingName(false);
  };

  const handleSelectItemOnExistingTable = (tableId: number, billIndex: number) => {
    setActiveBillDetail({ type: 'table', id: tableId, index: billIndex });
    setShowNewBillModal(false);
  };

  const finalizeAddItem = (itemToAdd: Omit<BillItem, 'quantity' | 'printedQuantity'>) => {
    if (!activeBillDetail) return;

    const updateItems = (items: BillItem[]): BillItem[] => {
      const existing = items.find(i => i.id === itemToAdd.id);
      if (existing) {
        return items.map(i => i.id === itemToAdd.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { ...itemToAdd, quantity: 1, printedQuantity: 0 }];
    };

    if (activeBillDetail.type === 'counter') {
      setCounterBills(prev => prev.map(bill =>
        bill.id === activeBillDetail.id ? { ...bill, items: updateItems(bill.items) } : bill
      ));
    } else {
      setLocalTables(prev => prev.map(t => {
        if (t.id === activeBillDetail.id) {
          const bills = [...t.bills];
          bills[activeBillDetail.index].items = updateItems(bills[activeBillDetail.index].items);
          return { ...t, bills };
        }
        return t;
      }));
    }
    setIsAwaitingSecondFlavor(false);
    setPendingFirstFlavor(null);
  };

  const handleAddItem = (product: typeof MENU_PRODUCTS[0]) => {
    if (!activeBillDetail) return;

    if (isAwaitingSecondFlavor && pendingFirstFlavor) {
      const finalPrice = Math.max(pendingFirstFlavor.price, product.price);
      finalizeAddItem({
        id: `comp-${pendingFirstFlavor.id}-${product.id}`,
        name: `1/2 ${pendingFirstFlavor.name} + 1/2 ${product.name}`,
        price: finalPrice,
        kitchenArea: pendingFirstFlavor.kitchenArea
      });
      return;
    }

    if (product.hasTwoFlavors) {
      setPendingFirstFlavor(product);
      setShowTwoFlavorChoice(true);
      return;
    }

    finalizeAddItem({ id: product.id, name: product.name, price: product.price, kitchenArea: product.kitchenArea });
  };

  const updateItemQuantity = (productId: string, delta: number) => {
    if (!activeBillDetail) return;
    const updateItems = (items: BillItem[]): BillItem[] => {
      return items.map(i => {
        if (i.id === productId) {
          const newQty = Math.max(0, i.quantity + delta);
          const newPrintedQty = Math.min(i.printedQuantity, newQty);
          return { ...i, quantity: newQty, printedQuantity: newPrintedQty };
        }
        return i;
      }).filter(i => i.quantity > 0);
    };
    if (activeBillDetail.type === 'counter') {
      setCounterBills(prev => prev.map(bill => bill.id === activeBillDetail.id ? { ...bill, items: updateItems(bill.items) } : bill));
    } else {
      setLocalTables(prev => prev.map(t => t.id === activeBillDetail.id ? { ...t, bills: t.bills.map((b, idx) => idx === activeBillDetail.index ? { ...b, items: updateItems(b.items) } : b) } : t));
    }
  };

  const triggerKitchenPrint = async () => {
    const bill = getCurrentActiveBill();
    if (!bill || bill.items.length === 0 || isPrinting) return;
    const itemsToPrint = bill.items.map(item => ({ ...item, unprintedQty: item.quantity - item.printedQuantity })).filter(item => item.unprintedQty > 0);
    if (itemsToPrint.length === 0) return;
    setIsPrinting(true);
    const areas: string[] = Array.from(new Set<string>(itemsToPrint.map(item => item.kitchenArea)));

    try {
      for (const area of areas) {
        const areaItems = itemsToPrint.filter(item => item.kitchenArea === area);
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0'; iframe.style.height = '0';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);

        const itemsHtml = areaItems.map(item => `<div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold;"><span>${item.unprintedQty.toString().padStart(2, '0')}x ${item.name}</span></div>`).join('');
        const ticketContent = `<html><head><style>@page { size: 80mm auto; margin: 0; } body { width: 72mm; margin: 0; padding: 10px; font-family: sans-serif; } .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; } h1 { margin: 0; font-size: 24px; font-weight: 900; } .area-tag { background: #000; color: #fff; padding: 4px; font-weight: bold; display: inline-block; margin: 5px 0; }</style></head><body><div class="header"><h1>${activeBillDetail?.type === 'counter' ? 'BALCÃO' : `MESA ${activeBillDetail?.id}`}</h1><div class="area-tag">${area.toUpperCase()}</div><div>CLIENTE: ${bill.name}</div></div><div class="content">${itemsHtml}</div></body></html>`;

        const doc = iframe.contentWindow?.document;
        if (doc) {
          doc.open(); doc.write(ticketContent); doc.close();
          // Aguarda um pouco mais para garantir renderização e foco
          await new Promise(r => setTimeout(r, 600));
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          // Remove o iframe após o diálogo fechar ou passar algum tempo
          setTimeout(() => { if (document.body.contains(iframe)) document.body.removeChild(iframe); }, 1500);
        }
      }
      if (activeBillDetail) {
        const updateP = (b: Bill) => ({ ...b, items: b.items.map(i => ({ ...i, printedQuantity: i.quantity })) });
        if (activeBillDetail.type === 'counter') setCounterBills(prev => prev.map(b => b.id === activeBillDetail.id ? updateP(b) : b));
        else setLocalTables(prev => prev.map(t => t.id === activeBillDetail.id ? { ...t, bills: t.bills.map((b, idx) => idx === activeBillDetail.index ? updateP(b) : b) } : t));
      }
    } catch (err) { console.error(err); } finally { setIsPrinting(false); }
  };

  const triggerBillPrint = async (bill: Bill, tableId: number | string) => {
    if (!bill || bill.items.length === 0 || isPrinting) return;
    setIsPrinting(true);
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.width = '0'; iframe.style.height = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const total = bill.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const itemsHtml = bill.items.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-family: monospace; font-size: 12px;">
          <span style="flex: 1;">${item.quantity}x ${item.name}</span>
          <span style="width: 80px; text-align: right;">R$ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('');

      const ticketContent = `
        <html>
          <head>
            <style>
              @page { size: 80mm auto; margin: 0; }
              body { width: 72mm; margin: 0; padding: 15px; font-family: sans-serif; color: #000; }
              .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
              .title { font-size: 18px; font-weight: bold; margin: 0; }
              .info { font-size: 10px; margin-top: 5px; }
              .table-info { font-size: 14px; font-weight: bold; margin: 10px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 5px 0; }
              .total-row { border-top: 1px solid #000; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; }
              .footer { margin-top: 20px; text-align: center; font-size: 10px; border-top: 1px dashed #ccc; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">briez</div>
              <div class="info">EXTRATO DE CONFERÊNCIA</div>
              <div class="info">Não é Documento Fiscal</div>
            </div>
            <div class="table-info">
              ${tableId === 'counter' ? 'BALCÃO' : `MESA ${tableId}`} - ${bill.name}
            </div>
            <div class="content">
              ${itemsHtml}
            </div>
            <div class="total-row">
              <span>TOTAL</span>
              <span>R$ ${total.toFixed(2)}</span>
            </div>
            <div class="footer">
              Agradecemos a preferência!<br/>
              Impresso em: ${new Date().toLocaleString()}<br/>
              briez | Food Manager
            </div>
          </body>
        </html>
      `;

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open(); doc.write(ticketContent); doc.close();
        // Delay para garantir carregamento e permitir que o navegador abra a janela de impressão
        await new Promise(r => setTimeout(r, 600));
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        // Remove o iframe após a tentativa de impressão
        setTimeout(() => { if (document.body.contains(iframe)) document.body.removeChild(iframe); }, 1500);
      }
    } catch (err) {
      console.error("Erro na impressão:", err);
    } finally {
      setIsPrinting(false);
    }
  };

  const getCurrentActiveBill = () => {
    if (!activeBillDetail) return null;
    if (activeBillDetail.type === 'counter') return counterBills.find(b => b.id === activeBillDetail.id);
    return localTables.find(t => t.id === activeBillDetail.id)?.bills[activeBillDetail.index];
  };

  const currentBill = getCurrentActiveBill();
  const billTotal = currentBill?.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
  const hasUnprintedItems = currentBill?.items.some(item => item.quantity > item.printedQuantity) || false;

  const filteredProducts = MENU_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (isAwaitingSecondFlavor && pendingFirstFlavor) {
      return matchesSearch && p.category === pendingFirstFlavor.category;
    }
    return matchesSearch && (activeCategory === 'Todos' || p.category === activeCategory);
  });

  const activeTableBills = localTables.flatMap(t => t.bills.map((bill, index) => ({ table: t, bill, index })));
  const freeTables = localTables.filter(t => t.bills.length === 0);

  const activeTableData = activeBillDetail?.type === 'table' ? localTables.find(t => t.id === activeBillDetail.id) : null;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-white text-3xl font-bold tracking-tight">Área do Garçom</h1>
          <p className="text-[#666] text-sm font-medium">Gestão inteligente de atendimento.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedTableForBill(null); setNewBillName(''); setShowNewBillModal(true); }} className="bg-[#1a1a1a] border border-[#333] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#222] transition-all flex items-center gap-2 active:scale-95">Novo Balcão</button>
          <button onClick={() => { setSelectedTableForBill(null); setNewBillName(''); setShowNewBillModal(true); }} className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#f0f0f0] transition-all flex items-center gap-2 shadow-lg active:scale-95">Nova Comanda</button>
          <button onClick={() => setShowTableConfig(true)} className="p-3 bg-[#111] border border-[#333] text-[#666] hover:text-white rounded-xl transition-all" title="Capacidade do Salão">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33-1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
          </button>
        </div>
      </div>

      {counterBills.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">Pedidos no Balcão <span className="bg-[#1a1a1a] text-white border border-[#333] px-2 py-0.5 rounded text-[9px]">{counterBills.length}</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {counterBills.map((bill, index) => (
              <div key={bill.id} className="relative group">
                <div
                  onClick={() => setActiveBillDetail({ type: 'counter', id: bill.id, index })}
                  className="flex flex-col gap-3 p-6 rounded-2xl border border-[#f2800d]/30 bg-[#1a1a1a] cursor-pointer hover:scale-105 transition-all shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-3xl font-black text-white">#{(counterBills.length - index).toString().padStart(2, '0')}</span>
                    <span className="text-[8px] font-black text-white px-2 py-0.5 rounded uppercase bg-[#f2800d]">Balcão</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-white truncate">{bill.name}</span>
                  <span className="text-[10px] font-mono text-[#f2800d]">{formatDuration(bill.startedAt, currentTime)}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); triggerBillPrint(bill, 'counter'); }}
                  className="absolute -top-2 -right-2 p-2 bg-white text-black rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 active:scale-95"
                  title="Imprimir Comanda"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                    <path d="M18 14H6v8h12v-8z"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-6">
        <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">Mesas em Atendimento <span className="bg-[#1a1a1a] text-white border border-[#333] px-2 py-0.5 rounded text-[9px]">{activeTableBills.length}</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {activeTableBills.map(item => (
            <div key={item.bill.id} className="relative group">
              <div
                onClick={() => setActiveBillDetail({ type: 'table', id: item.table.id, index: item.index })}
                className="flex flex-col gap-3 p-6 rounded-2xl border bg-[#1a1a1a] cursor-pointer hover:scale-105 transition-all shadow-xl"
                style={{ borderColor: item.table.waiterColor }}
              >
                <div className="flex justify-between items-start">
                  <span className="text-3xl font-black text-white">{item.table.id.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] font-black text-white px-2 py-0.5 rounded uppercase" style={{ backgroundColor: item.table.waiterColor }}>{item.table.waiterName.split(' ')[0]}</span>
                </div>
                <span className="text-[10px] font-black uppercase text-white truncate">{item.bill.name}</span>
                <span className="text-[10px] font-mono" style={{ color: item.table.waiterColor }}>{formatDuration(item.bill.startedAt, currentTime)}</span>
              </div>
              {/* Botão de Impressão Rápida */}
              <button
                onClick={(e) => { e.stopPropagation(); triggerBillPrint(item.bill, item.table.id); }}
                className="absolute -top-2 -right-2 p-2 bg-white text-black rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 active:scale-95"
                title="Imprimir Comanda"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                  <path d="M18 14H6v8h12v-8z"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-[11px] font-black text-[#666] uppercase tracking-[0.3em] flex items-center gap-3">Mesas Livres <span className="bg-[#1a1a1a] text-[#666] px-2 py-0.5 rounded text-[9px] border border-[#333]">{freeTables.length}</span></h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {freeTables.map(table => (
            <div key={table.id} onClick={() => { setSelectedTableForBill(table.id); setNewBillName(''); setShowNewBillModal(true); }} className="flex flex-col gap-4 p-6 rounded-2xl border border-[#1a1a1a] bg-[#111] opacity-60 hover:opacity-100 transition-all cursor-pointer">
              <span className="text-3xl font-black text-white">{table.id.toString().padStart(2, '0')}</span>
              <span className="text-[10px] font-black uppercase text-[#333]">Vazia</span>
            </div>
          ))}
        </div>
      </section>

      {/* PDV Fullscreen Modal */}
      {activeBillDetail && currentBill && (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="flex-1 flex flex-col min-h-0 border-r border-white/5">
            <header className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]">
              <div className="flex items-center gap-4">
                <button onClick={() => { setActiveBillDetail(null); setIsAwaitingSecondFlavor(false); setPendingFirstFlavor(null); setIsEditingName(false); }} className="p-2 hover:bg-white/5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5m0 0l7 7m-7-7l7-7"></path></svg></button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-black text-xl">{activeBillDetail.type === 'counter' ? 'Balcão' : `Mesa ${activeBillDetail.id}`}</h3>
                    {activeTableData && (
                      <span className="text-[9px] font-black text-white px-2 py-0.5 rounded uppercase" style={{ backgroundColor: activeTableData.waiterColor }}>{activeTableData.waiterName}</span>
                    )}
                  </div>

                  {isEditingName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        autoFocus
                        type="text"
                        value={editedNameValue}
                        onChange={e => setEditedNameValue(e.target.value)}
                        onBlur={handleUpdateBillName}
                        onKeyDown={e => e.key === 'Enter' && handleUpdateBillName()}
                        className="bg-[#111] border border-[#f2800d] rounded-lg px-2 py-1 text-[10px] font-bold text-white outline-none w-48"
                      />
                      <button onClick={handleUpdateBillName} className="text-[#10b981] hover:text-[#10b981]/80">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => { setEditedNameValue(currentBill.name); setIsEditingName(true); }}
                      className="flex items-center gap-2 group cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest group-hover:text-white transition-colors">{currentBill.name}</span>
                      <svg className="size-3 text-[#333] group-hover:text-[#f2800d] transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                    </div>
                  )}
                </div>
              </div>
              <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none w-64" />
            </header>

            {isAwaitingSecondFlavor && pendingFirstFlavor && (
              <div className="bg-[#f2800d] px-6 py-3 flex items-center justify-between animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-xs">1/2</div>
                  <span className="text-white text-xs font-bold uppercase tracking-tight">Selecione o segundo sabor de <span className="underline">{pendingFirstFlavor.category}</span></span>
                </div>
                <button onClick={() => { setIsAwaitingSecondFlavor(false); setPendingFirstFlavor(null); }} className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors">Cancelar</button>
              </div>
            )}

            <div className="p-4 flex gap-2 overflow-x-auto bg-[#0d0d0d] border-b border-white/5 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  disabled={isAwaitingSecondFlavor}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-white text-black' : 'bg-[#111] text-[#666]'} ${isAwaitingSecondFlavor ? 'opacity-30' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-[#0a0a0a] content-start">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleAddItem(p)}
                  className="bg-[#111] border border-white/5 rounded-xl p-4 text-left hover:bg-[#161616] transition-all relative overflow-hidden flex flex-col justify-between group h-28"
                >
                  <span className="text-[11px] font-black text-white line-clamp-2 leading-tight">{p.name}</span>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs font-black text-white">R$ {p.price.toFixed(2)}</span>
                    {p.hasTwoFlavors && !isAwaitingSecondFlavor && (
                      <span className="text-[7px] font-black text-[#f2800d] uppercase border border-[#f2800d]/30 px-1 rounded shrink-0">2 Sabores</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[400px] bg-[#0d0d0d] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h4 className="text-[10px] font-black text-[#666] uppercase tracking-[0.3em]">Resumo do Pedido</h4>
              <span className="bg-[#111] text-[#666] px-2 py-1 rounded text-[9px] font-bold border border-white/5">{currentBill.items.length} ITENS</span>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {currentBill.items.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      {item.printedQuantity > 0 && (
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" stroke={item.printedQuantity === item.quantity ? "#10b981" : "#f2800d"} strokeWidth="3" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path><path d="M18 14H6v8h12v-8z"></path></svg>
                          <span className={`text-[8px] font-black uppercase ${item.printedQuantity === item.quantity ? 'text-[#10b981]' : 'text-[#f2800d]'}`}>{item.printedQuantity === item.quantity ? 'OK' : `${item.printedQuantity}/${item.quantity}`}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-[#666]">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-xl p-1 border border-white/5">
                    <button onClick={() => updateItemQuantity(item.id, -1)} className="size-8 text-white hover:bg-white/5 rounded-lg">-</button>
                    <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateItemQuantity(item.id, 1)} className="size-8 text-white hover:bg-white/5 rounded-lg">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-[#111] border-t border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2"><span className="text-[#666] text-xs font-bold uppercase tracking-widest">Total Geral</span><span className="text-white text-xl font-black">R$ {billTotal.toFixed(2)}</span></div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => triggerBillPrint(currentBill, activeBillDetail.type === 'counter' ? 'counter' : activeBillDetail.id)}
                  className="bg-[#1a1a1a] border border-[#333] text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-[#222] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                    <path d="M18 14H6v8h12v-8z"></path>
                  </svg>
                  Imprimir Comanda
                </button>
                <button onClick={triggerKitchenPrint} disabled={!hasUnprintedItems || isPrinting} className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${!hasUnprintedItems || isPrinting ? 'bg-[#1a1a1a] text-[#444] border border-[#222]' : 'bg-white text-black shadow-lg hover:bg-[#f0f0f0]'}`}>
                  {isPrinting ? 'PROCESSANDO...' : (hasUnprintedItems ? 'ENVIAR COZINHA' : 'PEDIDO ENVIADO')}
                </button>
              </div>

              <button onClick={() => setActiveBillDetail(null)} className="w-full text-[#444] hover:text-white text-[10px] uppercase font-black py-2 tracking-widest transition-colors">Fechar Painel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Escolha: Sabor Inteiro ou Meio a Meio */}
      {showTwoFlavorChoice && pendingFirstFlavor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[150] p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-sm rounded-[32px] p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="text-center">
              <h3 className="text-white text-xl font-black italic">{pendingFirstFlavor.name}</h3>
              <p className="text-[#666] text-[10px] font-bold uppercase tracking-widest mt-1">Este item permite combinar 2 sabores</p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => {
                  finalizeAddItem({ id: pendingFirstFlavor.id, name: pendingFirstFlavor.name, price: pendingFirstFlavor.price, kitchenArea: pendingFirstFlavor.kitchenArea });
                  setShowTwoFlavorChoice(false);
                }}
                className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase text-xs tracking-widest shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                Sabor Inteiro
              </button>

              <button
                onClick={() => {
                  setIsAwaitingSecondFlavor(true);
                  setShowTwoFlavorChoice(false);
                }}
                className="w-full bg-[#1a1a1a] border border-[#333] text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest active:scale-95 flex items-center justify-center gap-3"
              >
                <span className="text-[#f2800d]">Meio a Meio</span>
              </button>
            </div>

            <button onClick={() => { setShowTwoFlavorChoice(false); setPendingFirstFlavor(null); }} className="text-[#444] font-black text-[10px] uppercase hover:text-white transition-colors text-center">Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal: Nova Comanda / Selecionar Mesa */}
      {showNewBillModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] p-4 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-[500px] rounded-[32px] p-8 flex flex-col gap-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-white text-2xl font-black italic tracking-tight">Novo Atendimento</h3>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-[#666] uppercase tracking-widest">Nome do Cliente / Identificação</label>
                <input
                  ref={nameInputRef}
                  autoFocus
                  type="text"
                  placeholder="Ex: João Silva ou Mesa 05"
                  value={newBillName}
                  onChange={e => setNewBillName(e.target.value)}
                  className="w-full bg-[#111] border border-white/5 rounded-2xl h-14 px-5 text-white outline-none focus:ring-1 focus:ring-white transition-all text-sm font-bold"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-[#666] uppercase tracking-widest">Vincular a uma Mesa ou Balcão</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[260px] overflow-y-auto p-1 scrollbar-hide">
                  <button
                    onClick={() => { setSelectedTableForBill(null); nameInputRef.current?.focus(); }}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedTableForBill === null ? 'bg-white text-black border-white shadow-lg' : 'bg-[#111] border-white/5 text-[#444] hover:border-white/20'}`}
                  >
                    <span className="text-[10px] font-black uppercase">Balcão</span>
                  </button>
                  {localTables.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTableForBill(t.id); nameInputRef.current?.focus(); }}
                      className={`relative p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedTableForBill === t.id ? 'bg-[#f2800d] text-white border-white shadow-lg scale-105' : t.status === 'occupied' ? 'bg-[#1a1a1a] border-[#f2800d]/40 text-[#f2800d]/80' : 'bg-[#111] border-white/5 text-[#444] hover:border-white/20'}`}
                    >
                      <span className="text-xl font-black">{t.id.toString().padStart(2, '0')}</span>
                      {t.status === 'occupied' && (
                        <div className="absolute top-1 right-1 size-1.5 rounded-full bg-[#f2800d]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={handleAddBill} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all hover:bg-[#f0f0f0]">
                Abrir Atendimento
              </button>
              <button onClick={() => setShowNewBillModal(false)} className="text-[#444] font-black text-[10px] uppercase hover:text-white transition-colors py-2">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Capacidade do Salão (Ajuste rápido) */}
      {showTableConfig && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[120] p-4 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-[400px] rounded-[32px] p-10 flex flex-col gap-8 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-white text-2xl font-black tracking-tight text-center italic">Capacidade do Salão</h3>
            <div className="flex items-center justify-center gap-6">
              <button onClick={() => setTotalTables(Math.max(0, totalTables - 1))} className="size-16 flex items-center justify-center bg-[#111] border border-white/10 text-white rounded-2xl hover:bg-[#1a1a1a] font-black text-2xl">-</button>
              <input
                type="text"
                inputMode="numeric"
                value={configInputValue}
                onChange={handleConfigInputChange}
                className="flex-1 bg-transparent text-center font-black text-8xl text-white border-none focus:ring-0 outline-none w-full p-0 m-0"
              />
              <button onClick={() => setTotalTables(totalTables + 1)} className="size-16 flex items-center justify-center bg-[#111] border border-white/10 text-white rounded-2xl hover:bg-[#1a1a1a] font-black text-2xl">+</button>
            </div>
            <button onClick={() => setShowTableConfig(false)} className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-xl text-xs uppercase tracking-[0.2em] active:scale-95">Fechar</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }` }} />
    </div>
  );
};

export default Waiter;
