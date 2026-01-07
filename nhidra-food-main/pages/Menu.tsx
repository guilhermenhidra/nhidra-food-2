
import React, { useState, useRef, useEffect } from 'react';
import { Category, Product } from '../types';

const KITCHEN_AREAS = ['Cozinha Principal', 'Bar', 'Pizzaria', 'Copa', 'Sobremesas'];

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

interface MenuProps {
  isDigitalOnly?: boolean;
}

const Menu: React.FC<MenuProps> = ({ isDigitalOnly = false }) => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDigitalMenu, setShowDigitalMenu] = useState(isDigitalOnly);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDigitalCategory, setSelectedDigitalCategory] = useState('Todos');
  const [banners, setBanners] = useState([
    { id: '1', title: 'Promoção de Verão', subtitle: '50% de desconto em sucos naturais', color: 'from-orange-500 to-red-500', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800' },
    { id: '2', title: 'Combo Familiar', subtitle: '2 Pizzas G + Refrigerante 2L', color: 'from-purple-600 to-indigo-600', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' }
  ]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  // Marketing & Growth states
  const [showStoreConfig, setShowStoreConfig] = useState(false);
  const [activeConfigTab, setActiveConfigTab] = useState<'banners' | 'coupons' | 'delivery' | 'loyalty'>('banners');
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'PRIMEIRACOMPRA', discount: '10%', isActive: true },
    { id: '2', code: 'NHIDRA5', discount: 'R$ 5,00', isActive: true }
  ]);
  const [deliveryConfig, setDeliveryConfig] = useState({
    price: 7.00,
    freeOver: 50.00,
    isActive: true
  });
  const [loyaltyConfig, setLoyaltyConfig] = useState({
    enabled: true,
    pointsPerReal: 1,
    threshold: 100,
    rewardValue: 15.00
  });
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');

  // Operating Hours state
  const [operatingHours, setOperatingHours] = useState({
    open: '18:00',
    close: '23:30',
    days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  });

  const isStoreOpen = () => {
    const now = new Date();
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDayName = dayNames[now.getDay()];

    if (!operatingHours.days.includes(currentDayName)) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = operatingHours.open.split(':').map(Number);
    const [closeH, closeM] = operatingHours.close.split(':').map(Number);

    const openTime = openH * 60 + openM;
    const closeTime = closeH * 60 + closeM;

    // Handle overnight hours (e.g., 18:00 to 02:00)
    if (closeTime < openTime) {
      return currentTime >= openTime || currentTime <= closeTime;
    }

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const storeStatus = isStoreOpen();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerScrollRef = useRef<HTMLDivElement>(null);

  // Bloquear scroll do body quando o cardápio digital estiver aberto
  useEffect(() => {
    if (showDigitalMenu) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showDigitalMenu]);

  useEffect(() => {
    if (showDigitalMenu && banners.length > 1) {
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
  }, [showDigitalMenu, banners]);

  // Form states for Category
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodTwoFlavors, setProdTwoFlavors] = useState(false);
  const [prodKitchen, setProdKitchen] = useState(KITCHEN_AREAS[0]);
  const [isNotKitchenItem, setIsNotKitchenItem] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openNewCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDesc('');
    setShowCategoryModal(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setShowCategoryModal(true);
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCat('');
    setProdPrice('');
    setProdImageUrl('');
    setProdTwoFlavors(false);
    setProdKitchen(KITCHEN_AREAS[0]);
    setIsNotKitchenItem(false);
    setShowProductModal(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCat(prod.category);
    setProdImageUrl(prod.imageUrl);
    setProdTwoFlavors(prod.hasTwoFlavors || false);
    setIsNotKitchenItem(prod.kitchenArea === 'Nenhum');
    setProdKitchen(prod.kitchenArea === 'Nenhum' ? KITCHEN_AREAS[0] : prod.kitchenArea);
    const numericPrice = prod.price.replace('R$ ', '').replace(',', '.');
    setProdPrice(numericPrice);
    setShowProductModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    if (editingCategory) {
      setCategories(prev => prev.map(c =>
        c.id === editingCategory.id ? { ...c, name: catName, description: catDesc } : c
      ));
    } else {
      const newCategory: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: catName,
        description: catDesc,
        productCount: 0
      };
      setCategories([...categories, newCategory]);
    }
    setShowCategoryModal(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodCat) return;
    const formattedPrice = `R$ ${parseFloat(prodPrice || '0').toFixed(2).replace('.', ',')}`;
    const finalImageUrl = prodImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300&h=300';
    const finalKitchenArea = isNotKitchenItem ? 'Nenhum' : prodKitchen;

    if (editingProduct) {
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id ? { ...p, name: prodName, category: prodCat, price: formattedPrice, imageUrl: finalImageUrl, hasTwoFlavors: prodTwoFlavors, kitchenArea: finalKitchenArea } : p
      ));
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: prodName,
        category: prodCat,
        price: formattedPrice,
        variations: 'Padrão',
        imageUrl: finalImageUrl,
        hasTwoFlavors: prodTwoFlavors,
        kitchenArea: finalKitchenArea
      };
      setProducts([...products, newProduct]);
    }
    setShowProductModal(false);
  };

  return (
    <div className="flex flex-col gap-12 relative pb-20">
      {/* Header Seção */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-bold tracking-tight">Cardápio</h1>
            <p className="text-[#666] text-sm font-medium">Gerencie categorias e produtos.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDigitalMenu(true)}
              className="bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#10b981]/20 transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              Cardápio Digital
            </button>
            <button onClick={openNewCategory} className="bg-[#1a1a1a] border border-[#333] text-white px-5 py-2.5 rounded-xl font-bold text-sm">Nova Categoria</button>
          </div>
        </div>

        {/* Categorias Table */}
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="px-8 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest">Nome</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-[#1a1a1a] last:border-0">
                  <td className="px-8 py-5 text-sm font-bold text-white">{cat.name}</td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => openEditCategory(cat)} className="text-[10px] font-bold text-white uppercase">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Produtos Seção */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Produtos</h2>
          <button onClick={openNewProduct} className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg">Novo Produto</button>
        </div>
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="px-8 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest">Produto</th>
                <th className="px-8 py-4 text-[10px] font-bold text-[#666] uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} className="border-b border-[#1a1a1a] last:border-0">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-cover bg-center border border-[#1a1a1a]" style={{ backgroundImage: `url("${prod.imageUrl}")` }}></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{prod.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#666]">{prod.category}</span>
                          <span className="text-[8px] text-[#444] uppercase px-1 border border-[#1a1a1a] rounded">{prod.kitchenArea}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => openEditProduct(prod)} className="text-[10px] font-bold text-white uppercase">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Seção de Banners e Ofertas (Digital Menu Config) */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-white">Banners e Ofertas</h2>
            <p className="text-[#666] text-sm">Gerencie os anúncios do seu cardápio digital.</p>
          </div>
          <button
            onClick={() => {
              setEditingBanner(null);
              setBannerTitle('');
              setBannerSubtitle('');
              setBannerImageUrl('');
              setShowBannerModal(true);
            }}
            className="bg-[#1a1a1a] border border-[#333] text-white px-5 py-2.5 rounded-xl font-bold text-sm"
          >
            Novo Banner
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map(banner => (
            <div key={banner.id} className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 flex items-center justify-between group hover:border-[#333] transition-all">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-xl bg-cover bg-center border border-[#1a1a1a]" style={{ backgroundImage: `url("${banner.image}")` }}></div>
                <div className="flex flex-col">
                  <span className="text-white font-bold">{banner.title}</span>
                  <span className="text-[#666] text-xs">{banner.subtitle}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingBanner(banner);
                    setBannerTitle(banner.title);
                    setBannerSubtitle(banner.subtitle);
                    setBannerImageUrl(banner.image);
                    setShowBannerModal(true);
                  }}
                  className="p-2 text-[#666] hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button
                  onClick={() => setBanners(prev => prev.filter(b => b.id !== banner.id))}
                  className="p-2 text-[#666] hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Categoria */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-white text-xl font-bold">{editingCategory ? 'Editar' : 'Nova'} Categoria</h3>
            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Nome</label>
                <input value={catName} onChange={e => setCatName(e.target.value)} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-colors" placeholder="Ex: Bebidas" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Descrição</label>
                <textarea value={catDesc} onChange={e => setCatDesc(e.target.value)} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 text-white outline-none focus:border-white transition-colors h-24 resize-none text-sm" placeholder="Opcional..." />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="flex-1 border border-[#1a1a1a] text-[#666] font-bold py-3 rounded-xl text-sm uppercase">Cancelar</button>
                <button type="submit" className="flex-1 bg-white text-black font-bold py-3 rounded-xl text-sm uppercase">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Produto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-md rounded-2xl p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] subtle-scrollbar">
            <h3 className="text-white text-xl font-bold">{editingProduct ? 'Editar' : 'Novo'} Produto</h3>
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Foto do Produto</label>
                <div className="flex items-center gap-4">
                  <div className="size-20 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl flex items-center justify-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: prodImageUrl ? `url("${prodImageUrl}")` : 'none' }}>
                    {!prodImageUrl && <svg className="size-6 text-[#1a1a1a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>}
                  </div>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#1a1a1a] border border-[#333] text-white px-4 py-2 rounded-lg text-xs font-bold">Fazer Upload</button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Nome</label>
                <input value={prodName} onChange={e => setProdName(e.target.value)} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-colors" placeholder="Ex: Batata Frita" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Preço</label>
                <input type="number" step="0.01" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-colors" placeholder="0,00" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Categoria</label>
                <select value={prodCat} onChange={e => setProdCat(e.target.value)} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-colors">
                  <option value="">Selecione...</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Cozinha / Área de Preparo</label>
                <select
                  disabled={isNotKitchenItem}
                  value={prodKitchen}
                  onChange={e => setProdKitchen(e.target.value)}
                  className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-colors ${isNotKitchenItem ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {KITCHEN_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
                <div onClick={() => setIsNotKitchenItem(!isNotKitchenItem)} className="flex items-center gap-3 mt-1 px-1 cursor-pointer group">
                  <div className={`size-5 rounded-md border flex items-center justify-center transition-all ${isNotKitchenItem ? 'bg-white border-white' : 'bg-[#0a0a0a] border-[#1a1a1a] group-hover:border-[#333]'}`}>
                    {isNotKitchenItem && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="black" strokeWidth="4" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>}
                  </div>
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest cursor-pointer group-hover:text-white transition-colors">Não é item de cozinha</label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl mt-2">
                <div className="flex flex-col gap-0.5">
                  <label className="text-white text-xs font-bold">Aceita 2 Sabores?</label>
                  <p className="text-[9px] text-[#666] uppercase font-bold tracking-tight">Permite combinar meio a meio</p>
                </div>
                <button
                  type="button"
                  onClick={() => setProdTwoFlavors(!prodTwoFlavors)}
                  className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${prodTwoFlavors ? 'bg-[#10b981]' : 'bg-[#1a1a1a] border border-[#333]'}`}
                >
                  <div className={`size-4 rounded-full bg-white shadow-sm transition-transform ${prodTwoFlavors ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 border border-[#1a1a1a] text-[#666] font-bold py-3 rounded-xl text-sm uppercase hover:text-white transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-white text-black font-bold py-3 rounded-xl text-sm uppercase hover:bg-[#e6e6e6] transition-colors">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Banner */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-white text-xl font-bold">{editingBanner ? 'Editar' : 'Novo'} Banner</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Título da Oferta</label>
                <input value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-colors" placeholder="Ex: Promoção de Pizza" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Subtítulo / Descrição</label>
                <input value={bannerSubtitle} onChange={e => setBannerSubtitle(e.target.value)} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-colors" placeholder="Ex: Na compra de uma, a segunda é grátis" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">URL da Imagem</label>
                <input value={bannerImageUrl} onChange={e => setBannerImageUrl(e.target.value)} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-colors" placeholder="https://..." />
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowBannerModal(false)} className="flex-1 border border-[#1a1a1a] text-[#666] font-bold py-3 rounded-xl text-sm uppercase">Cancelar</button>
                <button
                  onClick={() => {
                    if (editingBanner) {
                      setBanners(prev => prev.map(b => b.id === editingBanner.id ? { ...b, title: bannerTitle, subtitle: bannerSubtitle, image: bannerImageUrl } : b));
                    } else {
                      setBanners([...banners, { id: Math.random().toString(), title: bannerTitle, subtitle: bannerSubtitle, image: bannerImageUrl, color: 'from-blue-500 to-emerald-500' }]);
                    }
                    setShowBannerModal(false);
                  }}
                  className="flex-1 bg-white text-black font-bold py-3 rounded-xl text-sm uppercase"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY CARDÁPIO DIGITAL */}
      {showDigitalMenu && (
        <div className="fixed inset-0 bg-[#050505] z-[200] flex flex-col overflow-hidden">
          {/* Header do Cardápio Digital */}
          <div className="w-full max-w-[100vw] bg-[#0a0a0a]/80 border-b border-white/5 px-4 py-4 md:p-4 flex flex-col gap-4 sticky top-0 z-10 backdrop-blur-2xl">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <img src="/briez-logo.png" alt="Logo briez" className="h-7 md:h-8 object-contain" />
                <div className="flex items-center gap-1.5">
                  <div className={`size-1.5 rounded-full animate-pulse ${storeStatus ? 'bg-[#10b981]' : 'bg-red-500'}`}></div>
                  <span className={`text-[8px] md:text-[7px] font-black uppercase tracking-wide ${storeStatus ? 'text-[#10b981]' : 'text-red-500'}`}>
                    {storeStatus ? 'Aberto' : 'Fechado'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setShowStoreConfig(true)}
                  className="size-9 md:size-10 bg-[#10b981]/10 rounded-xl flex items-center justify-center text-[#10b981] active:scale-90 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H4a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V4a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H20a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
                </button>
                <button
                  onClick={async () => {
                    // Gerar slug do nome do restaurante
                    const companyName = localStorage.getItem('companyName') || 'Restaurante Gourmet';
                    const slug = companyName
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
                      .trim()
                      .replace(/\s+/g, '-'); // Substitui espaços por hífens

                    const publicUrl = `${window.location.origin}/cardapio-digital-${slug}`;
                    const shareData = {
                      title: companyName,
                      text: `Confira o cardápio digital do ${companyName}!`,
                      url: publicUrl
                    };

                    try {
                      if (navigator.share) await navigator.share(shareData);
                      else { await navigator.clipboard.writeText(publicUrl); alert('Link do cardápio copiado!'); }
                    } catch (err) { console.error(err); }
                  }}
                  className="size-9 md:size-10 bg-white/5 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"></path></svg>
                </button>
                <button
                  onClick={() => { setShowDigitalMenu(false); setCart([]); }}
                  className="size-9 md:size-10 bg-white/5 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
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

            {/* Filtros de Categoria */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                onClick={() => setSelectedDigitalCategory('Todos')}
                className={`flex-shrink-0 px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all ${selectedDigitalCategory === 'Todos' ? 'bg-[#10b981] text-white' : 'bg-white/5 text-[#666]'}`}
              >
                Ver Tudo
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDigitalCategory(cat.name)}
                  className={`flex-shrink-0 px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all ${selectedDigitalCategory === cat.name ? 'bg-[#10b981] text-white' : 'bg-white/5 text-[#666]'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo Scrollável */}
          <div className="flex-1 overflow-y-auto w-full max-w-[100vw]" style={{ overflowX: 'hidden' }}>
            <div className="flex flex-col gap-6 pb-32">
              {/* Banners */}
              {banners.length > 0 && (
                <div className="w-full overflow-x-auto pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div ref={bannerScrollRef} className="flex gap-3 px-4 snap-x snap-mandatory">
                    {banners.map(banner => (
                      <div
                        key={banner.id}
                        className="flex-shrink-0 w-[calc(100vw-32px)] max-w-[400px] h-44 rounded-3xl overflow-hidden relative snap-center shadow-lg border border-white/5"
                      >
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
                  .filter(cat => selectedDigitalCategory === 'Todos' || cat.name === selectedDigitalCategory)
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
                onClick={() => {
                  alert('🚀 Pedido enviado com sucesso!');
                  setCart([]);
                  setShowDigitalMenu(false);
                }}
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
        </div>
      )}

      {/* OVERLAY DE CONFIGURAÇÕES DA LOJA (OWNER ONLY UI) */}
      {showStoreConfig && (
        <div className="fixed inset-0 bg-[#050505] z-[300] flex flex-col animate-in zoom-in-95 duration-300">
          <div className="bg-[#0a0a0a] border-b border-white/5 p-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-[#10b981] rounded-2xl flex items-center justify-center text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"></path><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H4a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V4a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H20a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-black uppercase text-xs tracking-[0.2em]">Configuração Geral</h3>
                <p className="text-[#666] text-[10px] font-bold">Marketing, Entrega e Operação.</p>
              </div>
            </div>
            <button
              onClick={() => setShowStoreConfig(false)}
              className="size-10 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex border-b border-white/5 bg-[#0a0a0a] overflow-x-auto invisible-scrollbar">
            {(['hours', 'banners', 'coupons', 'delivery', 'loyalty'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveConfigTab(tab as any)}
                className={`flex-1 min-w-[100px] py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeConfigTab === tab ? 'border-[#10b981] text-white' : 'border-transparent text-[#444] hover:text-white'}`}
              >
                {tab === 'hours' ? 'Horários' : tab === 'banners' ? 'Banners' : tab === 'coupons' ? 'Cupons' : tab === 'delivery' ? 'Entrega' : 'Fidelidade'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 subtle-scrollbar">
            <div className="max-w-lg mx-auto w-full flex flex-col gap-8">

              {(activeConfigTab as string) === 'hours' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#111] border border-white/5 rounded-[24px] p-6 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-white font-black text-xs uppercase tracking-widest">Horário de Funcionamento</span>
                      <p className="text-[#666] text-[10px] font-bold">Defina quando seu cardápio estará aberto para pedidos.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <label className="text-[#444] text-[10px] font-bold uppercase tracking-widest">Dias de Funcionamento</label>
                      <div className="flex flex-wrap gap-2">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const newDays = operatingHours.days.includes(day)
                                ? operatingHours.days.filter(d => d !== day)
                                : [...operatingHours.days, day];
                              setOperatingHours({ ...operatingHours, days: newDays });
                            }}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${operatingHours.days.includes(day) ? 'bg-[#10b981] text-black border-[#10b981]' : 'bg-black/50 text-[#444] border-white/5 hover:text-white'}`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-3">
                        <label className="text-[#444] text-[10px] font-bold uppercase tracking-widest text-center">Abre às</label>
                        <input
                          type="time"
                          value={operatingHours.open}
                          onChange={e => setOperatingHours({ ...operatingHours, open: e.target.value })}
                          className="bg-black/50 border border-white/5 rounded-xl h-14 px-4 text-white text-lg font-black text-center outline-none focus:border-[#10b981]/50"
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-[#444] text-[10px] font-bold uppercase tracking-widest text-center">Fecha às</label>
                        <input
                          type="time"
                          value={operatingHours.close}
                          onChange={e => setOperatingHours({ ...operatingHours, close: e.target.value })}
                          className="bg-black/50 border border-white/5 rounded-xl h-14 px-4 text-white text-lg font-black text-center outline-none focus:border-[#10b981]/50"
                        />
                      </div>
                    </div>

                    <div className="bg-[#10b981]/5 border border-[#10b981]/10 rounded-2xl p-4 flex items-center gap-4">
                      <div className={`size-3 rounded-full animate-pulse ${storeStatus ? 'bg-[#10b981]' : 'bg-red-500'}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${storeStatus ? 'text-[#10b981]' : 'text-red-500'}`}>
                        Status Atual: {storeStatus ? 'Sua loja está aberta agora' : 'Sua loja está fechada agora'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeConfigTab === 'banners' && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-bold text-sm">Banners em Destaque</h4>
                    <button onClick={() => setShowBannerModal(true)} className="text-[10px] font-black text-[#10b981] uppercase tracking-widest">Adicionar Novo</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {banners.map(banner => (
                      <div key={banner.id} className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-cover bg-center border border-white/5" style={{ backgroundImage: `url("${banner.image}")` }}></div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-xs">{banner.title}</span>
                            <span className="text-[#666] text-[10px]">{banner.subtitle}</span>
                          </div>
                        </div>
                        <button onClick={() => setBanners(prev => prev.filter(b => b.id !== banner.id))} className="text-red-500/50 hover:text-red-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeConfigTab === 'coupons' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 p-5 bg-[#111] border border-white/5 rounded-[24px]">
                    <span className="text-white font-bold text-xs">Criar Novo Cupom</span>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={newCouponCode}
                        onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                        placeholder="CÓDIGO"
                        className="bg-black/50 border border-white/5 rounded-xl h-11 px-4 text-white text-[10px] font-bold outline-none focus:border-[#10b981]/50"
                      />
                      <input
                        value={newCouponDiscount}
                        onChange={e => setNewCouponDiscount(e.target.value)}
                        placeholder="EX: 10% ou R$ 5"
                        className="bg-black/50 border border-white/5 rounded-xl h-11 px-4 text-white text-[10px] font-bold outline-none focus:border-[#10b981]/50"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newCouponCode || !newCouponDiscount) return;
                        setCoupons([...coupons, { id: Math.random().toString(), code: newCouponCode, discount: newCouponDiscount, isActive: true }]);
                        setNewCouponCode('');
                        setNewCouponDiscount('');
                      }}
                      className="w-full bg-[#10b981] text-black font-black text-[10px] uppercase py-3 rounded-xl tracking-widest"
                    >
                      Ativar Cupom
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    <span className="text-[#666] text-[10px] font-black uppercase tracking-[0.2em]">Cupons Ativos</span>
                    {coupons.map(coupon => (
                      <div key={coupon.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#10b981]/10 text-[#10b981] text-[10px] font-black px-3 py-1 rounded-lg border border-[#10b981]/20">
                            {coupon.code}
                          </div>
                          <span className="text-white font-bold text-xs">{coupon.discount} OFF</span>
                        </div>
                        <button onClick={() => setCoupons(prev => prev.filter(c => c.id !== coupon.id))} className="text-[#444] hover:text-red-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeConfigTab === 'delivery' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#111] border border-white/5 rounded-[24px] p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">Taxa de Entrega</span>
                        <p className="text-[#666] text-[10px]">Valor fixo para todas as entregas.</p>
                      </div>
                      <input
                        type="number"
                        value={deliveryConfig.price}
                        onChange={e => setDeliveryConfig({ ...deliveryConfig, price: parseFloat(e.target.value) })}
                        className="bg-black/50 border border-white/5 rounded-xl h-12 w-24 px-4 text-white text-xs font-bold text-center outline-none focus:border-[#10b981]/50"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">Frete Grátis</span>
                        <p className="text-[#666] text-[10px]">Valor mínimo de pedido para frete grátis.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#666] text-[10px] font-bold">R$</span>
                        <input
                          type="number"
                          value={deliveryConfig.freeOver}
                          onChange={e => setDeliveryConfig({ ...deliveryConfig, freeOver: parseFloat(e.target.value) })}
                          className="bg-black/50 border border-white/5 rounded-xl h-12 w-24 px-4 text-white text-xs font-bold text-center outline-none focus:border-[#10b981]/50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      <span className="text-white font-bold text-xs uppercase tracking-widest">Loja Aberta para Entregas</span>
                      <button
                        onClick={() => setDeliveryConfig({ ...deliveryConfig, isActive: !deliveryConfig.isActive })}
                        className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${deliveryConfig.isActive ? 'bg-[#10b981]' : 'bg-white/5 border border-white/5'}`}
                      >
                        <div className={`size-5 rounded-full shadow-sm transition-transform ${deliveryConfig.isActive ? 'bg-black translate-x-5' : 'bg-[#333] translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeConfigTab === 'loyalty' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#111] border border-white/5 rounded-[24px] p-6 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-white font-black text-xs uppercase tracking-widest">Programa de Fidelidade</span>
                        <p className="text-[#666] text-[10px] font-bold line-clamp-1">Recompense seus clientes fieis automaticamente.</p>
                      </div>
                      <button
                        onClick={() => setLoyaltyConfig({ ...loyaltyConfig, enabled: !loyaltyConfig.enabled })}
                        className={`w-12 h-7 rounded-full transition-all flex items-center px-1 ${loyaltyConfig.enabled ? 'bg-[#10b981]' : 'bg-white/5 border border-white/5'}`}
                      >
                        <div className={`size-5 rounded-full shadow-sm transition-transform ${loyaltyConfig.enabled ? 'bg-black translate-x-5' : 'bg-[#333] translate-x-0'}`}></div>
                      </button>
                    </div>

                    <div className={`flex flex-col gap-6 transition-all ${loyaltyConfig.enabled ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                      <div className="flex flex-col gap-3">
                        <label className="text-[#444] text-[10px] font-bold uppercase tracking-widest">A cada R$ 1,00 gasto vale:</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            value={loyaltyConfig.pointsPerReal}
                            onChange={e => setLoyaltyConfig({ ...loyaltyConfig, pointsPerReal: parseInt(e.target.value) })}
                            className="bg-black/50 border border-white/5 rounded-xl h-12 flex-1 px-4 text-white text-xs font-bold outline-none focus:border-[#10b981]/50"
                          />
                          <span className="text-white font-bold text-xs uppercase">Ponto(s)</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-[#444] text-[10px] font-bold uppercase tracking-widest">Ao atingir:</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            value={loyaltyConfig.threshold}
                            onChange={e => setLoyaltyConfig({ ...loyaltyConfig, threshold: parseInt(e.target.value) })}
                            className="bg-black/50 border border-white/5 rounded-xl h-12 flex-1 px-4 text-white text-xs font-bold outline-none focus:border-[#10b981]/50"
                          />
                          <span className="text-white font-bold text-xs uppercase">Pontos</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-[#444] text-[10px] font-bold uppercase tracking-widest">O cliente ganha um bônus de:</label>
                        <div className="flex items-center gap-4">
                          <span className="text-white font-bold text-xs uppercase">R$</span>
                          <input
                            type="number"
                            value={loyaltyConfig.rewardValue}
                            onChange={e => setLoyaltyConfig({ ...loyaltyConfig, rewardValue: parseFloat(e.target.value) })}
                            className="bg-black/50 border border-white/5 rounded-xl h-12 flex-1 px-4 text-white text-xs font-bold outline-none focus:border-[#10b981]/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowStoreConfig(false)}
                className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos Auxiliares */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .subtle-scrollbar::-webkit-scrollbar { width: 4px; }
        .subtle-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .subtle-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .invisible-scrollbar::-webkit-scrollbar { display: none; }
        .invisible-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Menu;
