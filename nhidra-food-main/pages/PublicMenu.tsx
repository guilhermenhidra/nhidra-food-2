
import React, { useState, useRef, useEffect } from 'react';
import { Category, Product } from '../types';
import CustomerAuth from '../components/CustomerAuth';

const INITIAL_CATEGORIES: Category[] = [
    { id: '1', name: 'Pratos Principais', description: 'Deliciosos pratos para satisfazer seu apetite.', productCount: 12 },
    { id: '2', name: 'Sobremesas', description: 'Doces e guloseimas para finalizar sua refeição.', productCount: 8 },
    { id: '3', name: 'Bebidas', description: 'Refrigerantes, sucos e outras bebidas refrescantes.', productCount: 15 },
];

const INITIAL_PRODUCTS: Product[] = [
    { id: '1', name: 'Salmão Grelhado', category: 'Pratos Principais', price: 'R$ 45,00', variations: 'Tamanho, Molho', imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=300&h=300', hasTwoFlavors: false, kitchenArea: 'Cozinha Principal' },
    { id: '2', name: 'Torta de Limão', category: 'Sobremesas', price: 'R$ 20,00', variations: 'Tamanho', imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=300&h=300', hasTwoFlavors: false, kitchenArea: 'Sobremesas' },
    { id: '3', name: 'Refrigerante de Cola', category: 'Bebidas', price: 'R$ 5,00', variations: 'Tamanho', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300&h=300', hasTwoFlavors: false, kitchenArea: 'Bar' },
];

interface PublicMenuProps {
    restaurantSlug?: string;
}

const PublicMenu: React.FC<PublicMenuProps> = ({ restaurantSlug = 'restaurante-gourmet' }) => {
    const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [products] = useState<Product[]>(INITIAL_PRODUCTS);
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showAuth, setShowAuth] = useState(false);
    const [customer, setCustomer] = useState<{ name: string; phone: string; email?: string } | null>(null);

    const bannerScrollRef = useRef<HTMLDivElement>(null);
    const banners = [
        { id: '1', title: 'Promoção de Verão', subtitle: '50% de desconto em sucos naturais', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800' },
        { id: '2', title: 'Combo Familiar', subtitle: '2 Pizzas G + Refrigerante 2L', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' }
    ];

    const restaurantName = 'Restaurante Gourmet';
    const storeStatus = true;

    // Bloquear scroll do body
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
        };
    }, []);

    // Auto-scroll banners
    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                if (bannerScrollRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = bannerScrollRef.current;
                    const maxScroll = scrollWidth - clientWidth;
                    if (scrollLeft >= maxScroll - 10) {
                        bannerScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        bannerScrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
                    }
                }
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [banners]);

    const handleCheckout = () => {
        if (!customer) {
            setShowAuth(true);
        } else {
            alert(`🚀 Pedido enviado com sucesso!\n\nCliente: ${customer.name}\nTelefone: ${customer.phone}`);
            setCart([]);
        }
    };

    const handleLogin = (customerData: { name: string; phone: string; email?: string }) => {
        setCustomer(customerData);
        setShowAuth(false);
        localStorage.setItem('customer', JSON.stringify(customerData));
    };

    // Carregar dados do cliente do localStorage
    useEffect(() => {
        const savedCustomer = localStorage.getItem('customer');
        if (savedCustomer) {
            setCustomer(JSON.parse(savedCustomer));
        }
    }, []);

    return (
        <div className="fixed inset-0 bg-[#050505] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="w-full max-w-[100vw] bg-[#0a0a0a]/80 border-b border-white/5 px-4 py-4 md:p-4 flex flex-col gap-4 sticky top-0 z-10 backdrop-blur-2xl">
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-1">
                        <img src="/briez-logo.png" alt="Logo" className="h-7 md:h-8 object-contain" />
                        <div className="flex items-center gap-1.5">
                            <div className={`size-1.5 rounded-full animate-pulse ${storeStatus ? 'bg-[#10b981]' : 'bg-red-500'}`}></div>
                            <span className={`text-[8px] md:text-[7px] font-black uppercase tracking-wide ${storeStatus ? 'text-[#10b981]' : 'text-red-500'}`}>
                                {storeStatus ? 'Aberto' : 'Fechado'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {customer ? (
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl">
                                <div className="size-7 bg-[#10b981] rounded-full flex items-center justify-center text-black font-black text-xs">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-white text-xs font-bold hidden sm:block">{customer.name.split(' ')[0]}</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAuth(true)}
                                className="bg-[#10b981] text-black px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide active:scale-95 transition-all"
                            >
                                Entrar
                            </button>
                        )}
                    </div>
                </div>

                {/* Busca */}
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="size-4 text-[#444]" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar no cardápio..."
                        className="w-full bg-white/5 border border-white/5 rounded-xl h-11 pl-11 pr-4 text-white text-sm font-bold outline-none focus:border-[#10b981]/50 transition-all"
                    />
                </div>

                {/* Filtros */}
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <button
                        onClick={() => setSelectedCategory('Todos')}
                        className={`flex-shrink-0 px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all ${selectedCategory === 'Todos' ? 'bg-[#10b981] text-white' : 'bg-white/5 text-[#666]'}`}
                    >
                        Ver Tudo
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`flex-shrink-0 px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all ${selectedCategory === cat.name ? 'bg-[#10b981] text-white' : 'bg-white/5 text-[#666]'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto w-full max-w-[100vw]" style={{ overflowX: 'hidden' }}>
                <div className="flex flex-col gap-6 pb-32">
                    {/* Banners */}
                    {banners.length > 0 && (
                        <div className="w-full overflow-x-auto pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <div ref={bannerScrollRef} className="flex gap-3 px-4 snap-x snap-mandatory">
                                {banners.map(banner => (
                                    <div key={banner.id} className="flex-shrink-0 w-[calc(100vw-32px)] max-w-[400px] h-44 rounded-3xl overflow-hidden relative snap-center shadow-lg border border-white/5">
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${banner.image}")`, backgroundColor: '#0a0a0a' }}></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 flex flex-col justify-end">
                                            <h4 className="text-white text-xl font-black italic tracking-tight leading-tight">{banner.title}</h4>
                                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-wide mt-1">{banner.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Produtos */}
                    <div className="px-4 flex flex-col gap-8">
                        {categories
                            .filter(cat => selectedCategory === 'Todos' || cat.name === selectedCategory)
                            .map(cat => {
                                const items = products.filter(p => p.category === cat.name && (searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase())));
                                if (items.length === 0) return null;

                                return (
                                    <div key={cat.id} className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <h5 className="text-white font-black italic text-sm uppercase tracking-tight">{cat.name} <span className="text-[#10b981] text-xs font-black not-italic">({items.length})</span></h5>
                                            <div className="h-px flex-1 bg-white/5"></div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {items.map(product => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => {
                                                        setCart(prev => {
                                                            const existing = prev.find(item => item.product.id === product.id);
                                                            if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                                                            return [...prev, { product, quantity: 1 }];
                                                        });
                                                    }}
                                                    className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer"
                                                >
                                                    <div className="size-20 flex-shrink-0 rounded-xl bg-cover bg-center border border-white/5" style={{ backgroundImage: `url("${product.imageUrl}")` }}></div>
                                                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                        <span className="text-white font-bold text-base tracking-tight leading-tight truncate">{product.name}</span>
                                                        <p className="text-[#444] text-[10px] font-medium line-clamp-2">Sabor original, ingredientes selecionados.</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-[#10b981] font-black italic text-base">{product.price}</span>
                                                            <div className="size-9 bg-[#10b981] rounded-xl flex items-center justify-center text-black">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>

            {/* Botão Finalizar */}
            {cart.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-50">
                    <button
                        onClick={handleCheckout}
                        className="w-full max-w-md mx-auto h-16 bg-[#10b981] text-black px-5 rounded-2xl flex items-center justify-between shadow-2xl active:scale-95 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-black rounded-xl flex items-center justify-center text-[#10b981] font-black text-sm">
                                {cart.reduce((sum, item) => sum + item.quantity, 0)}
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black uppercase tracking-wide text-black/50">Finalizar</span>
                                <span className="text-black font-black italic text-lg tracking-tight -mt-0.5">R$ {cart.reduce((sum, item) => {
                                    const price = parseFloat(item.product.price.replace('R$ ', '').replace(',', '.'));
                                    return sum + (price * item.quantity);
                                }, 0).toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                        <div className="size-10 bg-black rounded-xl flex items-center justify-center text-[#10b981]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
                        </div>
                    </button>
                </div>
            )}

            {/* Modal de Autenticação */}
            {showAuth && (
                <CustomerAuth
                    onLogin={handleLogin}
                    onClose={() => setShowAuth(false)}
                    restaurantName={restaurantName}
                />
            )}
        </div>
    );
};

export default PublicMenu;
