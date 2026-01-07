
import React, { useState } from 'react';

interface OpenTable {
    id: string;
    table: string;
    client: string;
    items: { id: string; name: string; quantity: number; price: number; kitchenArea?: string; printedQuantity?: number }[];
    total: number;
    openedAt: string;
}

const MENU_PRODUCTS = [
    { id: 'p1', name: 'Hambúrguer Artesanal', price: 32.90, category: 'Pratos', kitchenArea: 'Cozinha Principal', hasTwoFlavors: false },
    { id: 'p2', name: 'Batata Rústica', price: 18.50, category: 'Acompanhamentos', kitchenArea: 'Cozinha Principal', hasTwoFlavors: false },
    { id: 'p3', name: 'Pizza Calabresa', price: 45.00, category: 'Pizzas', kitchenArea: 'Pizzaria', hasTwoFlavors: true },
    { id: 'p4', name: 'Pizza Quatro Queijos', price: 48.00, category: 'Pizzas', kitchenArea: 'Pizzaria', hasTwoFlavors: true },
    { id: 'p5', name: 'Pizza Portuguesa', price: 52.00, category: 'Pizzas', kitchenArea: 'Pizzaria', hasTwoFlavors: true },
    { id: 'p6', name: 'Suco de Laranja 500ml', price: 12.00, category: 'Bebidas', kitchenArea: 'Bar', hasTwoFlavors: false },
    { id: 'p7', name: 'Refrigerante Lata', price: 6.50, category: 'Bebidas', kitchenArea: 'Bar', hasTwoFlavors: false },
    { id: 'p8', name: 'Pudim de Leite', price: 14.00, category: 'Sobremesas', kitchenArea: 'Sobremesas', hasTwoFlavors: false },
    { id: 'p9', name: 'Petit Gâteau', price: 24.90, category: 'Sobremesas', kitchenArea: 'Sobremesas', hasTwoFlavors: true },
];

const CATEGORIES = ['Todos', 'Pratos', 'Acompanhamentos', 'Pizzas', 'Bebidas', 'Sobremesas'];

const Cashier: React.FC = () => {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [todaySales, setTodaySales] = useState(0);
    const [cashTransactions, setCashTransactions] = useState(0);
    const [cardTransactions, setCardTransactions] = useState(0);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [closureHistory, setClosureHistory] = useState<{
        id: string;
        date: string;
        time: string;
        totalSales: number;
        totalTransactions: number;
        balance: number;
    }[]>([
        { id: '1', date: '04/01/2026', time: '23:45', totalSales: 3120.50, totalTransactions: 65, balance: 1150.00 },
        { id: '2', date: '03/01/2026', time: '23:30', totalSales: 2850.00, totalTransactions: 58, balance: 980.00 },
    ]);
    const [historyFilter, setHistoryFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const [isCloseCashierModalOpen, setIsCloseCashierModalOpen] = useState(false);
    const [isCashierOpen, setIsCashierOpen] = useState(false);
    const [isOpeningCashierModalOpen, setIsOpeningCashierModalOpen] = useState(false);
    const [openingAmount, setOpeningAmount] = useState('');

    const [isTransactionDropdownOpen, setIsTransactionDropdownOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [tempBill, setTempBill] = useState<OpenTable | null>(null);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [showTwoFlavorChoice, setShowTwoFlavorChoice] = useState(false);
    const [pendingFirstFlavor, setPendingFirstFlavor] = useState<any | null>(null);
    const [isAwaitingSecondFlavor, setIsAwaitingSecondFlavor] = useState(false);

    const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
    const [correctionType, setCorrectionType] = useState<'sangria' | 'reforço'>('sangria');
    const [correctionAmount, setCorrectionAmount] = useState('');
    const [correctionReason, setCorrectionReason] = useState('');

    const [openTables, setOpenTables] = useState<OpenTable[]>([]);

    const [selectedTable, setSelectedTable] = useState<OpenTable | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPayments, setSelectedPayments] = useState<{ method: string; amount: number }[]>([]);
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState('');
    const [currentPaymentAmount, setCurrentPaymentAmount] = useState('');

    const paymentMethods = [
        { id: 'cash', name: 'Dinheiro', icon: '💵' },
        { id: 'credit', name: 'Cartão Crédito', icon: '💳' },
        { id: 'debit', name: 'Cartão Débito', icon: '💳' },
        { id: 'pix', name: 'PIX', icon: '📱' }
    ];

    const [recentTransactions, setRecentTransactions] = useState([]);

    const paymentMethodsStats = [
        { name: 'Dinheiro', amount: 850.50, percentage: 24.6, color: '#10b981' },
        { name: 'Cartão Crédito', amount: 1450.00, percentage: 42.0, color: '#f2800d' },
        { name: 'Cartão Débito', amount: 750.00, percentage: 21.7, color: '#3b82f6' },
        { name: 'PIX', amount: 399.50, percentage: 11.6, color: '#8b5cf6' },
    ];

    const [historyCorrections, setHistoryCorrections] = useState<{
        id: string;
        type: 'sangria' | 'reforço';
        amount: number;
        reason: string;
        time: string;
    }[]>([]);

    const handleSelectTable = (table: OpenTable) => {
        setSelectedTable(table);
        setIsPaymentModalOpen(true);
        setSelectedPayments([]);
    };

    const handleIssueInvoice = (transactionId: string) => {
        setRecentTransactions(prev => prev.map(t =>
            t.id === transactionId ? { ...t, invoiceIssued: true } : t
        ));
        alert('Nota fiscal emitida com sucesso!');
    };

    const handleAddPayment = () => {
        if (!currentPaymentMethod || !currentPaymentAmount) {
            alert('Selecione o método e digite o valor!');
            return;
        }

        const amount = parseFloat(currentPaymentAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Digite um valor válido!');
            return;
        }

        const totalPaid = selectedPayments.reduce((sum, p) => sum + p.amount, 0);
        const remaining = selectedTable!.total - totalPaid;

        if (amount > remaining) {
            alert(`O valor excede o restante (R$ ${remaining.toFixed(2)})`);
            return;
        }

        setSelectedPayments([...selectedPayments, { method: currentPaymentMethod, amount }]);
        setCurrentPaymentMethod('');
        setCurrentPaymentAmount('');
    };

    const handleRemovePayment = (index: number) => {
        setSelectedPayments(selectedPayments.filter((_, i) => i !== index));
    };

    const handleCloseTable = () => {
        if (!selectedTable) return;

        const totalPaid = selectedPayments.reduce((sum, p) => sum + p.amount, 0);

        if (totalPaid < selectedTable.total) {
            alert(`Falta pagar R$ ${(selectedTable.total - totalPaid).toFixed(2)}`);
            return;
        }

        const now = new Date();
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const newTransaction = {
            id: `t-${Date.now()}`,
            table: selectedTable.table,
            type: selectedPayments.map(p => p.method).join(' + '),
            amount: selectedTable.total,
            time: time,
            status: 'Concluído',
            invoiceIssued: false,
            waiter: 'Balcão',
            cashier: 'Operador'
        };

        setRecentTransactions([newTransaction, ...recentTransactions]);

        // Remove a mesa da lista de abertas
        setOpenTables(openTables.filter(t => t.id !== selectedTable.id));

        // Atualiza vendas do dia
        setTodaySales(prev => prev + selectedTable.total);

        alert(`${selectedTable.table} fechada com sucesso!\nTotal: R$ ${selectedTable.total.toFixed(2)}`);

        setIsPaymentModalOpen(false);
        setSelectedTable(null);
        setSelectedPayments([]);
    };

    const handleNewOrder = () => {
        const newOrder: OpenTable = {
            id: `counter-${Date.now()}`,
            table: 'Balcão',
            client: `Atendimento #${openTables.length + 1}`,
            items: [],
            total: 0,
            openedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setTempBill(newOrder);
        setIsProductModalOpen(true);
        setIsTransactionDropdownOpen(false);
    };

    const handleEditCounterOrder = (e: React.MouseEvent, table: OpenTable) => {
        e.stopPropagation();
        setTempBill({ ...table });
        setIsProductModalOpen(true);
    };

    const handleAddItem = (product: any) => {
        if (!tempBill) return;

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

    const finalizeAddItem = (itemToAdd: any) => {
        if (!tempBill) return;

        setTempBill(prev => {
            if (!prev) return null;
            const existing = prev.items.find(i => i.id === itemToAdd.id);
            let newItems;
            if (existing) {
                newItems = prev.items.map(i => i.id === itemToAdd.id ? { ...i, quantity: i.quantity + 1 } : i);
            } else {
                newItems = [...prev.items, { ...itemToAdd, quantity: 1, printedQuantity: 0 }];
            }
            const newTotal = newItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
            return { ...prev, items: newItems, total: newTotal };
        });

        setIsAwaitingSecondFlavor(false);
        setPendingFirstFlavor(null);
    };

    const updateItemQuantity = (productId: string, delta: number) => {
        if (!tempBill) return;
        setTempBill(prev => {
            if (!prev) return null;
            const newItems = prev.items.map(i => {
                if (i.id === productId) {
                    const newQty = Math.max(0, i.quantity + delta);
                    return { ...i, quantity: newQty };
                }
                return i;
            }).filter(i => i.quantity > 0);
            const newTotal = newItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
            return { ...prev, items: newItems, total: newTotal };
        });
    };

    const confirmNewOrder = () => {
        if (!tempBill || tempBill.items.length === 0) return;

        setOpenTables(prev => {
            const index = prev.findIndex(t => t.id === tempBill.id);
            if (index >= 0) {
                const newTables = [...prev];
                newTables[index] = tempBill;
                return newTables;
            }
            return [tempBill, ...prev];
        });

        setIsProductModalOpen(false);
        setTempBill(null);
    };

    const handleCorrection = () => {
        const amount = parseFloat(correctionAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Digite um valor válido!');
            return;
        }

        if (correctionType === 'sangria') {
            if (amount > currentBalance) {
                alert('Saldo insuficiente para sangria!');
                return;
            }
            setCurrentBalance(prev => prev - amount);
        } else {
            setCurrentBalance(prev => prev + amount);
        }

        const newCorrection = {
            id: `corr-${Date.now()}`,
            type: correctionType,
            amount: amount,
            reason: correctionReason,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        setHistoryCorrections([newCorrection, ...historyCorrections]);

        const now = new Date();
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const newTransaction = {
            id: `corr-${Date.now()}`,
            table: correctionType === 'sangria' ? 'Sangria' : 'Reforço',
            type: correctionReason || (correctionType === 'sangria' ? 'Retirada de Caixa' : 'Entrada de Caixa'),
            amount: amount,
            time: time,
            status: 'Concluído',
            invoiceIssued: false,
            waiter: 'Administrativo',
            cashier: 'Operador'
        };
        setRecentTransactions([newTransaction, ...recentTransactions]);

        setIsCorrectionModalOpen(false);
        setCorrectionAmount('');
        setCorrectionReason('');
        setIsTransactionDropdownOpen(false);
    };

    const handleCloseCashier = () => {
        setIsCloseCashierModalOpen(true);
    };

    const finalizeCloseCashier = () => {
        const now = new Date();
        const newClosure = {
            id: Math.random().toString(36).substr(2, 9),
            date: now.toLocaleDateString('pt-BR'),
            time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            totalSales: todaySales,
            totalTransactions: cashTransactions + cardTransactions,
            balance: currentBalance
        };

        setClosureHistory([newClosure, ...closureHistory]);
        setTodaySales(0);
        setCashTransactions(0);
        setCardTransactions(0);
        setCurrentBalance(0);
        setRecentTransactions([]);
        setOpenTables([]);
        setHistoryCorrections([]);
        setIsCloseCashierModalOpen(false);
        setIsCashierOpen(false);
        alert('Caixa encerrado com sucesso!');
    };

    const handleOpenCashier = () => {
        const amount = parseFloat(openingAmount);
        if (isNaN(amount) || amount < 0) {
            alert('Digite um valor de abertura válido!');
            return;
        }

        setCurrentBalance(amount);
        setIsCashierOpen(true);
        setIsOpeningCashierModalOpen(false);
        setOpeningAmount('');
        alert(`Caixa aberto com R$ ${amount.toFixed(2)}`);
    };

    const getFilteredHistory = () => {
        const now = new Date();
        const today = now.toLocaleDateString('pt-BR');

        return closureHistory.filter(c => {
            if (historyFilter === 'all') return true;
            if (historyFilter === 'today') return c.date === today;

            const [day, month, year] = c.date.split('/').map(Number);
            const closureDate = new Date(year, month - 1, day);
            const diffTime = Math.abs(now.getTime() - closureDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (historyFilter === 'week') return diffDays <= 7;
            if (historyFilter === 'month') return diffDays <= 30;
            return true;
        });
    };

    const handlePrintReport = () => {
        const filteredHistory = getFilteredHistory();
        const totalSales = filteredHistory.reduce((sum, c) => sum + c.totalSales, 0);
        const totalTransactions = filteredHistory.reduce((sum, c) => sum + c.totalTransactions, 0);

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const content = `
            <html>
                <head>
                    <title>Relatório de Fechamentos - briez</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; color: #333; }
                        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #EEE; padding-bottom: 20px; }
                        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
                        .summary-card { padding: 20px; border: 1px solid #EEE; border-radius: 8px; text-align: center; }
                        .summary-card h3 { margin: 0; font-size: 12px; text-transform: uppercase; color: #666; }
                        .summary-card p { margin: 10px 0 0 0; font-size: 24px; font-weight: bold; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th { text-align: left; padding: 12px; border-bottom: 2px solid #EEE; color: #666; font-size: 13px; }
                        td { padding: 12px; border-bottom: 1px solid #EEE; font-size: 14px; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>briez</h1>
                        <p>Relatório Consolidado de Fechamentos de Caixa</p>
                        <p>Período: ${historyFilter === 'all' ? 'Todo o histórico' : historyFilter.toUpperCase()}</p>
                        <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
                    </div>
                    <div class="summary">
                        <div class="summary-card">
                            <h3>Total de Vendas</h3>
                            <p>R$ ${totalSales.toFixed(2)}</p>
                        </div>
                        <div class="summary-card">
                            <h3>Total Transações</h3>
                            <p>${totalTransactions}</p>
                        </div>
                        <div class="summary-card">
                            <h3>Qtd. Fechamentos</h3>
                            <p>${filteredHistory.length}</p>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Total Vendas</th>
                                <th>Transações</th>
                                <th>Saldo Final</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredHistory.map(c => `
                                <tr>
                                    <td>${c.date} às ${c.time}</td>
                                    <td>R$ ${c.totalSales.toFixed(2)}</td>
                                    <td>${c.totalTransactions}</td>
                                    <td>R$ ${c.balance.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} briez - Sistema de Gestão Gastronômica</p>
                    </div>
                </body>
            </html>
        `;

        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    const totalPaid = selectedPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = selectedTable ? selectedTable.total - totalPaid : 0;

    return (
        <div className="flex flex-col gap-8 relative">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
                <div className={`flex flex-col gap-2 ${!isCashierOpen ? 'blur-sm pointer-events-none' : ''}`}>
                    <h1 className="text-white text-3xl font-bold tracking-tight">Caixa</h1>
                    <p className="text-[#666] text-sm font-medium">Gestão financeira e controle de pagamentos.</p>
                </div>

                <div className="relative">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsHistoryModalOpen(true)}
                            className={`px-4 py-2.5 bg-transparent border border-[#333] text-[#666] hover:text-white hover:border-[#444] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 ${!isCashierOpen ? 'blur-sm pointer-events-none' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Histórico
                        </button>
                        {isCashierOpen && (
                            <button
                                onClick={handleCloseCashier}
                                className="px-4 py-2.5 bg-transparent border border-[#333] text-[#666] hover:text-white hover:border-[#444] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                Fechar Caixa
                            </button>
                        )}
                        {isCashierOpen && (
                            <button
                                onClick={() => setIsTransactionDropdownOpen(!isTransactionDropdownOpen)}
                                className="px-4 py-2.5 bg-[#10b981] hover:bg-[#0da06f] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path d="M12 5v14m-7-7h14"></path>
                                </svg>
                                Opções
                            </button>
                        )}
                    </div>

                    {isTransactionDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setIsTransactionDropdownOpen(false)}></div>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-[#1a1a1a] rounded-xl shadow-2xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={handleNewOrder}
                                    className="w-full px-4 py-3 text-left text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center gap-3"
                                >
                                    <span className="text-[#10b981]">🛍️</span>
                                    Novo Pedido
                                </button>
                                <button
                                    onClick={() => {
                                        setCorrectionType('reforço');
                                        setIsCorrectionModalOpen(true);
                                        setIsTransactionDropdownOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center gap-3"
                                >
                                    <span className="text-[#3b82f6]">📥</span>
                                    Reforço
                                </button>
                                <button
                                    onClick={() => {
                                        setCorrectionType('sangria');
                                        setIsCorrectionModalOpen(true);
                                        setIsTransactionDropdownOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center gap-3"
                                >
                                    <span className="text-[#ef4444]">📤</span>
                                    Sangria
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Cards de Resumo */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 ${!isCashierOpen ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[#666] text-xs font-bold uppercase tracking-widest">Saldo Atual</span>
                        <div className="size-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
                            </svg>
                        </div>
                    </div>
                    <span className="text-white text-2xl font-black">R$ {currentBalance.toFixed(2)}</span>
                </div>

                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[#666] text-xs font-bold uppercase tracking-widest">Vendas Hoje</span>
                        <div className="size-10 bg-[#f2800d]/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#f2800d" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                            </svg>
                        </div>
                    </div>
                    <span className="text-white text-2xl font-black">R$ {todaySales.toFixed(2)}</span>
                </div>

                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[#666] text-xs font-bold uppercase tracking-widest">Sangrias</span>
                        <div className="size-10 bg-[#ef4444]/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M18 15l-6-6-6 6"></path>
                            </svg>
                        </div>
                    </div>
                    <span className="text-white text-2xl font-black">R$ {historyCorrections.filter(c => c.type === 'sangria').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</span>
                </div>

                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[#666] text-xs font-bold uppercase tracking-widest">Reforços</span>
                        <div className="size-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 9l6 6 6-6"></path>
                            </svg>
                        </div>
                    </div>
                    <span className="text-white text-2xl font-black">R$ {historyCorrections.filter(c => c.type === 'reforço').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</span>
                </div>

                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[#666] text-xs font-bold uppercase tracking-widest">Transações Dinheiro</span>
                        <div className="size-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                <path d="M1 10h22"></path>
                            </svg>
                        </div>
                    </div>
                    <span className="text-white text-2xl font-black">{cashTransactions}</span>
                </div>

                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[#666] text-xs font-bold uppercase tracking-widest">Transações Cartão</span>
                        <div className="size-10 bg-[#8b5cf6]/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#8b5cf6" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                                <path d="M2 10h20"></path>
                            </svg>
                        </div>
                    </div>
                    <span className="text-white text-2xl font-black">{cardTransactions}</span>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${!isCashierOpen ? 'blur-sm pointer-events-none' : ''}`}>
                {/* Mesas Abertas */}
                <div className="lg:col-span-2 bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-[#1a1a1a]">
                        <h2 className="text-white text-xl font-bold tracking-tight">Mesas Abertas ({openTables.length})</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {openTables.map(table => (
                                <div
                                    key={table.id}
                                    onClick={() => handleSelectTable(table)}
                                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 cursor-pointer transition-all hover:border-[#10b981] hover:scale-[1.02] group relative"
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-white text-lg font-black">{table.table}</span>
                                                <span className="text-[#666] text-xs font-medium">{table.client}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-white text-lg font-black">R$ {table.total.toFixed(2)}</span>
                                                {table.table === 'Balcão' && (
                                                    <button
                                                        onClick={(e) => handleEditCounterOrder(e, table)}
                                                        className="mt-1 text-[9px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        Editar Pedido
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[#666]">{table.items.length} itens</span>
                                            <span className="text-[#666]">{table.openedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Métodos de Pagamento */}
                <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-[#1a1a1a]">
                        <h2 className="text-white text-xl font-bold tracking-tight">Métodos de Pagamento</h2>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                        {paymentMethodsStats.map(method => (
                            <div key={method.name} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-white text-sm font-bold">{method.name}</span>
                                    <span className="text-white text-sm font-black">R$ {method.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${method.percentage}% `, backgroundColor: method.color }}
                                        ></div>
                                    </div>
                                    <span className="text-[#666] text-xs font-bold">{method.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transações Recentes */}
            <div className={`bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden ${!isCashierOpen ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="p-6 border-b border-[#1a1a1a]">
                    <h2 className="text-white text-xl font-bold tracking-tight">Transações Recentes</h2>
                </div>
                <div className="divide-y divide-[#1a1a1a]">
                    {recentTransactions.map(transaction => (
                        <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-[#1a1a1a]/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-[#10b981]">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-sm font-bold">{transaction.table}</span>
                                    <span className="text-[#666] text-xs font-medium">{transaction.type} • {transaction.time}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[#666] text-[10px]">👨‍🍳 {transaction.waiter}</span>
                                        <span className="text-[#666] text-[10px]">•</span>
                                        <span className="text-[#666] text-[10px]">💰 {transaction.cashier}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-white text-lg font-black">R$ {transaction.amount.toFixed(2)}</span>
                                <div className="bg-[#10b981]/10 text-[#10b981] text-[9px] font-black px-2 py-1 rounded uppercase">
                                    {transaction.status}
                                </div>
                                {transaction.invoiceIssued ? (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-[#10b981]/10 text-[#10b981] rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M20 6L9 17l-5-5"></path>
                                        </svg>
                                        <span className="text-xs font-bold">Nota Emitida</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleIssueInvoice(transaction.id);
                                        }}
                                        className="p-2 bg-[#f2800d]/10 hover:bg-[#f2800d]/20 text-[#f2800d] rounded-lg transition-all active:scale-95"
                                        title="Emitir Nota Fiscal"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                            <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Sangrias e Reforços */}
                    {historyCorrections.length > 0 && (
                        <div className="p-6 bg-[#0d0d0d] border-t border-[#1a1a1a]">
                            <h3 className="text-[#666] text-[10px] font-black uppercase tracking-[0.2em] mb-6">Moviementações de Caixa (Dia)</h3>
                            <div className="flex flex-col gap-4">
                                {historyCorrections.map(corr => (
                                    <div key={corr.id} className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-10 rounded-xl flex items-center justify-center ${corr.type === 'sangria' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>
                                                {corr.type === 'sangria' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"></path></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white text-xs font-black uppercase tracking-wider">{corr.type === 'sangria' ? 'Sangria' : 'Reforço'}</span>
                                                <span className="text-[#666] text-[10px] font-medium leading-tight mt-0.5">{corr.reason} • {corr.time}</span>
                                            </div>
                                        </div>
                                        <span className={`text-sm font-black ${corr.type === 'sangria' ? 'text-[#ef4444]' : 'text-[#3b82f6]'}`}>
                                            {corr.type === 'sangria' ? '-' : '+'} R$ {corr.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Pagamento */}
            {isPaymentModalOpen && selectedTable && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111] border border-[#1a1a1a] rounded-3xl max-w-2xl w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-[#1a1a1a] sticky top-0 bg-[#111] z-10">
                            <h2 className="text-white text-2xl font-bold tracking-tight">Fechar {selectedTable.table}</h2>
                            <p className="text-[#666] text-sm mt-1">{selectedTable.client}</p>
                        </div>

                        {/* Itens da Mesa */}
                        <div className="p-6 border-b border-[#1a1a1a]">
                            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Itens do Pedido</h3>
                            <div className="flex flex-col gap-2">
                                {selectedTable.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <span className="text-[#666]">{item.quantity}x {item.name}</span>
                                        <span className="text-white font-bold">R$ {(item.quantity * item.price).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex items-center justify-between">
                                <span className="text-white font-bold uppercase tracking-widest">Total</span>
                                <span className="text-white text-2xl font-black">R$ {selectedTable.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Adicionar Pagamento */}
                        <div className="p-6 border-b border-[#1a1a1a]">
                            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Adicionar Pagamento</h3>
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {paymentMethods.map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setCurrentPaymentMethod(method.name)}
                                            className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${currentPaymentMethod === method.name
                                                ? 'border-[#10b981] bg-[#10b981]/10'
                                                : 'border-[#1a1a1a] hover:border-[#333]'
                                                }`}
                                        >
                                            <span className="text-2xl">{method.icon}</span>
                                            <span className="text-white text-sm font-bold">{method.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={currentPaymentAmount}
                                        onChange={(e) => setCurrentPaymentAmount(e.target.value)}
                                        placeholder="Valor (R$)"
                                        className="flex-1 bg-[#0a0a0a] border border-[#1a1a1a] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#10b981] transition-colors"
                                    />
                                    <button
                                        onClick={handleAddPayment}
                                        className="px-6 py-3 bg-[#10b981] hover:bg-[#0da06f] text-white font-bold rounded-xl transition-all"
                                    >
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Pagamentos Adicionados */}
                        {selectedPayments.length > 0 && (
                            <div className="p-6 border-b border-[#1a1a1a]">
                                <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Pagamentos</h3>
                                <div className="flex flex-col gap-2">
                                    {selectedPayments.map((payment, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-[#0a0a0a] p-3 rounded-xl">
                                            <span className="text-white text-sm font-bold">{payment.method}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-white font-black">R$ {payment.amount.toFixed(2)}</span>
                                                <button
                                                    onClick={() => handleRemovePayment(idx)}
                                                    className="text-red-500 hover:text-red-400 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M18 6L6 18M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex items-center justify-between">
                                    <span className="text-[#666] text-sm font-bold">Restante</span>
                                    <span className={`text-xl font-black ${remaining > 0 ? 'text-[#f2800d]' : 'text-[#10b981]'}`}>
                                        R$ {remaining.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Botões */}
                        <div className="p-6 flex gap-3">
                            <button
                                onClick={() => {
                                    setIsPaymentModalOpen(false);
                                    setSelectedPayments([]);
                                    setCurrentPaymentMethod('');
                                    setCurrentPaymentAmount('');
                                }}
                                className="flex-1 bg-[#1a1a1a] hover:bg-[#222] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-widest transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCloseTable}
                                disabled={remaining > 0}
                                className="flex-1 bg-[#10b981] hover:bg-[#0da06f] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                    <path d="M20 6L9 17l-5-5"></path>
                                </svg>
                                Confirmar Fechamento
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Histórico */}
            {isHistoryModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#111] border border-[#1a1a1a] rounded-3xl max-w-3xl w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between">
                            <div>
                                <h2 className="text-white text-2xl font-bold tracking-tight">Histórico de Fechamentos</h2>
                                <p className="text-[#666] text-sm mt-1">Registros de encerramento de caixa anteriores.</p>
                            </div>
                            <button
                                onClick={() => setIsHistoryModalOpen(false)}
                                className="size-10 bg-[#1a1a1a] hover:bg-[#222] text-white rounded-xl flex items-center justify-center transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 border-b border-[#1a1a1a] flex items-center justify-between bg-[#141414]">
                            <div className="flex items-center gap-4">
                                <select
                                    value={historyFilter}
                                    onChange={(e) => setHistoryFilter(e.target.value as any)}
                                    className="bg-[#0a0a0a] border border-[#333] text-white text-xs font-bold px-4 py-2 rounded-xl focus:outline-none focus:border-[#10b981] transition-all"
                                >
                                    <option value="all">Todo o Histórico</option>
                                    <option value="today">Hoje</option>
                                    <option value="week">Últimos 7 dias</option>
                                    <option value="month">Últimos 30 dias</option>
                                </select>
                                <button
                                    onClick={handlePrintReport}
                                    className="px-4 py-2 bg-[#f2800d]/10 hover:bg-[#f2800d]/20 text-[#f2800d] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 border border-[#f2800d]/20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                        <rect x="6" y="14" width="12" height="8"></rect>
                                    </svg>
                                    Imprimir Relatório
                                </button>
                            </div>
                            <div className="text-right">
                                <span className="text-[#666] text-[10px] font-bold uppercase tracking-widest block">Total do Período</span>
                                <span className="text-white text-lg font-black">
                                    R$ {getFilteredHistory().reduce((sum, c) => sum + c.totalSales, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="flex flex-col gap-4">
                                {getFilteredHistory().length === 0 ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-[#666] gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <p className="font-bold">Nenhum registro para este período</p>
                                    </div>
                                ) : (
                                    getFilteredHistory().map(closure => (
                                        <div key={closure.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M20 6L9 17l-5-5"></path>
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{closure.date}</span>
                                                    <span className="text-[#666] text-xs font-medium">Encerrado às {closure.time}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Total Vendas</span>
                                                    <span className="text-white font-black">R$ {closure.totalSales.toFixed(2)}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Transações</span>
                                                    <span className="text-white font-black">{closure.totalTransactions}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Saldo</span>
                                                    <span className="text-white font-black">R$ {closure.balance.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-[#1a1a1a]">
                            <button
                                onClick={() => setIsHistoryModalOpen(false)}
                                className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white font-bold py-3 rounded-xl text-sm uppercase tracking-widest transition-all"
                            >
                                Fechar Janela
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Novo Pedido (POS) */}
            {isProductModalOpen && tempBill && (
                <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-10 duration-300">
                    <div className="flex-1 flex flex-col min-h-0 border-r border-white/5">
                        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d]">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5m0 0l7 7m-7-7l7-7"></path></svg></button>
                                <div className="flex flex-col">
                                    <h3 className="text-white font-black text-xl">Novo Pedido Balcão</h3>
                                    <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest">{tempBill.client}</span>
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar produto..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none w-64 focus:border-[#10b981] transition-all"
                            />
                        </header>

                        {isAwaitingSecondFlavor && pendingFirstFlavor && (
                            <div className="bg-[#f2800d] px-6 py-3 flex items-center justify-between animate-in slide-in-from-top duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-xs">1/2</div>
                                    <span className="text-white text-xs font-bold uppercase">Selecione o segundo sabor de {pendingFirstFlavor.category}</span>
                                </div>
                                <button onClick={() => { setIsAwaitingSecondFlavor(false); setPendingFirstFlavor(null); }} className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg">Cancelar</button>
                            </div>
                        )}

                        <div className="p-4 flex gap-2 overflow-x-auto bg-[#0d0d0d] border-b border-white/5 no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all ${activeCategory === cat ? 'bg-white text-black' : 'bg-[#111] text-[#666]'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 bg-[#0a0a0a] content-start">
                            {MENU_PRODUCTS.filter(p => {
                                const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
                                if (isAwaitingSecondFlavor && pendingFirstFlavor) return matchesSearch && p.category === pendingFirstFlavor.category;
                                return matchesSearch && (activeCategory === 'Todos' || p.category === activeCategory);
                            }).map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleAddItem(p)}
                                    className="bg-[#111] border border-white/5 rounded-xl p-4 text-left hover:bg-[#161616] transition-all flex flex-col justify-between h-28"
                                >
                                    <span className="text-[11px] font-black text-white line-clamp-2 leading-tight">{p.name}</span>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xs font-black text-white">R$ {p.price.toFixed(2)}</span>
                                        {p.hasTwoFlavors && !isAwaitingSecondFlavor && (
                                            <span className="text-[7px] font-black text-[#f2800d] uppercase border border-[#f2800d]/30 px-1 rounded">2 Sabores</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full md:w-[400px] bg-[#0d0d0d] flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center text-white">
                            <h4 className="text-[10px] font-black text-[#666] uppercase tracking-[0.3em]">Resumo do Pedido</h4>
                            <span className="bg-[#111] px-2 py-1 rounded text-[9px] font-bold">{tempBill.items.length} ITENS</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                            {tempBill.items.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-white/5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-white">{item.name}</span>
                                        <span className="text-[10px] font-bold text-[#666]">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-xl p-1">
                                        <button onClick={() => updateItemQuantity(item.id, -1)} className="size-8 text-white hover:bg-white/5 rounded-lg">-</button>
                                        <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateItemQuantity(item.id, 1)} className="size-8 text-white hover:bg-white/5 rounded-lg">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-[#111] border-t border-white/5 flex flex-col gap-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[#666] text-xs font-bold uppercase">Total</span>
                                <span className="text-white text-xl font-black">R$ {tempBill.total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={confirmNewOrder}
                                disabled={tempBill.items.length === 0}
                                className="w-full bg-[#10b981] hover:bg-[#0da06f] text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:grayscale"
                            >
                                Lançar Pedido no Caixa
                            </button>
                            <button onClick={() => setIsProductModalOpen(false)} className="w-full text-[#444] hover:text-white text-[10px] uppercase font-black py-1 tracking-widest">Descartar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Escolha: Sabor Inteiro ou Meio a Meio (POS) */}
            {showTwoFlavorChoice && pendingFirstFlavor && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[150] p-4 backdrop-blur-sm">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-sm rounded-[32px] p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="text-center">
                            <h3 className="text-white text-xl font-black italic">{pendingFirstFlavor.name}</h3>
                            <p className="text-[#666] text-[10px] font-bold uppercase mt-1">Combine até 2 sabores</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    finalizeAddItem({ id: pendingFirstFlavor.id, name: pendingFirstFlavor.name, price: pendingFirstFlavor.price, kitchenArea: pendingFirstFlavor.kitchenArea });
                                    setShowTwoFlavorChoice(false);
                                }}
                                className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase text-xs"
                            >
                                Sabor Inteiro
                            </button>
                            <button
                                onClick={() => {
                                    setIsAwaitingSecondFlavor(true);
                                    setShowTwoFlavorChoice(false);
                                }}
                                className="w-full bg-[#1a1a1a] border border-[#333] text-white font-black py-5 rounded-2xl uppercase text-xs"
                            >
                                <span className="text-[#f2800d]">Meio a Meio</span>
                            </button>
                        </div>
                        <button onClick={() => { setShowTwoFlavorChoice(false); setPendingFirstFlavor(null); }} className="text-[#444] font-black text-[10px] uppercase hover:text-white text-center">Cancelar</button>
                    </div>
                </div>
            )}
            {/* Modal de Sangria / Reforço */}
            {isCorrectionModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
                    <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-[32px] p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="text-center">
                            <h3 className="text-white text-2xl font-black uppercase tracking-tight">
                                {correctionType === 'sangria' ? 'Realizar Sangria' : 'Realizar Reforço'}
                            </h3>
                            <p className="text-[#666] text-xs font-bold uppercase mt-1">
                                {correctionType === 'sangria' ? 'Retirada de valores do caixa' : 'Entrada de valores no caixa'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-[#666] uppercase tracking-widest ml-1">Valor do Lançamento</label>
                                <input
                                    type="number"
                                    placeholder="0,00"
                                    value={correctionAmount}
                                    onChange={e => setCorrectionAmount(e.target.value)}
                                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-black focus:border-[#10b981] outline-none transition-all placeholder:text-white/10"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-[#666] uppercase tracking-widest ml-1">Motivo / Observação</label>
                                <textarea
                                    placeholder="Descreva o motivo..."
                                    value={correctionReason}
                                    onChange={e => setCorrectionReason(e.target.value)}
                                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-[#10b981] outline-none transition-all placeholder:text-white/10 min-h-[100px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleCorrection}
                                className={`w-full font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest transition-all ${correctionType === 'sangria' ? 'bg-[#ef4444] hover:bg-[#dc2626]' : 'bg-[#3b82f6] hover:bg-[#2563eb]'
                                    } text-white`}
                            >
                                Confirmar {correctionType}
                            </button>
                            <button
                                onClick={() => {
                                    setIsCorrectionModalOpen(false);
                                    setCorrectionAmount('');
                                    setCorrectionReason('');
                                }}
                                className="text-[#444] font-black text-[10px] uppercase hover:text-white text-center py-2"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Fechamento de Caixa */}
            {isCloseCashierModalOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[200] p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                            <div className="size-20 bg-[#ef4444]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#ef4444]/20 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="#ef4444" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                            <h3 className="text-white text-2xl font-black italic">Encerrar Caixa?</h3>
                            <p className="text-[#666] text-xs font-bold uppercase tracking-widest mt-2">Esta ação não pode ser desfeita</p>
                        </div>

                        <div className="p-8 flex flex-col gap-6">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#666] text-[10px] font-black uppercase tracking-widest">Vendas Totais</span>
                                        <span className="text-white font-black">R$ {todaySales.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#666] text-[10px] font-black uppercase tracking-widest">Transações</span>
                                        <span className="text-white font-black">{cashTransactions + cardTransactions}</span>
                                    </div>
                                    {openTables.length > 0 && (
                                        <div className="pt-4 mt-4 border-t border-white/5 flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-[#f2800d]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                                </svg>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Aviso Importante</span>
                                            </div>
                                            <p className="text-[#f2800d] text-[11px] font-medium leading-relaxed">
                                                Existem {openTables.length} mesas abertas que serão fechadas automaticamente.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={finalizeCloseCashier}
                                    className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-red-500/10"
                                >
                                    Confirmar Fechamento
                                </button>
                                <button
                                    onClick={() => setIsCloseCashierModalOpen(false)}
                                    className="w-full text-[#444] hover:text-white font-black py-2 rounded-xl uppercase text-[10px] tracking-widest transition-all"
                                >
                                    Voltar ao Sistema
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Abertura de Caixa */}
            {!isCashierOpen && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[30] p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 -translate-y-28">
                        <div className="p-8 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                            <div className="size-20 bg-[#10b981]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-[#10b981]/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="#10b981" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
                                </svg>
                            </div>
                            <h3 className="text-white text-2xl font-black italic">Abrir Caixa</h3>
                            <p className="text-[#666] text-xs font-bold uppercase tracking-widest mt-2">Informe o valor inicial em caixa</p>
                        </div>

                        <div className="p-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-[#666] uppercase tracking-widest ml-1">Valor de Abertura (R$)</label>
                                <input
                                    type="number"
                                    placeholder="0,00"
                                    value={openingAmount}
                                    onChange={e => setOpeningAmount(e.target.value)}
                                    autoFocus
                                    className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-2xl font-black focus:border-[#10b981] outline-none transition-all placeholder:text-white/10"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleOpenCashier}
                                    className="w-full bg-[#10b981] hover:bg-[#0da06f] text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-green-500/10"
                                >
                                    Abrir Caixa Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cashier;
