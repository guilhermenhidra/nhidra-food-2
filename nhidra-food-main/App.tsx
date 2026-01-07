

import React, { useState, useEffect } from 'react';
import { View } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Waiter from './pages/Waiter';
import Kitchen from './pages/Kitchen';
import Cashier from './pages/Cashier';
import Plans from './pages/Plans';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import PublicMenu from './pages/PublicMenu';
import TestSupabase from './pages/TestSupabase';
import Header from './components/Header';
import Sidebar from './components/Sidebar';


const App: React.FC = () => {
  // Inicializar view com base na slug da URL (mais robusto)
  const getInitialView = () => {
    const path = window.location.pathname.split('/').filter(Boolean)[0];

    // Detectar se é uma rota pública do cardápio digital
    if (path && path.startsWith('cardapio-digital-')) {
      return 'PUBLIC_MENU' as any;
    }

    const validViews = Object.values(View);
    // Se estiver na raiz ou tentar ir pro login, manda pro dashboard (já que o protect route saiu)
    if (!path || path === 'login') return View.DASHBOARD;
    return validViews.includes(path as View) ? (path as View) : View.DASHBOARD;
  };

  const [currentView, _setCurrentView] = useState<View>(getInitialView());
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [totalTables, setTotalTables] = useState(() => Number(localStorage.getItem('totalTables')) || 12);

  // Estados de Identidade e Usuário com Persistência
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('companyName') || 'Restaurante Gourmet');
  const [companyLogo, setCompanyLogo] = useState<string | null>(() => localStorage.getItem('companyLogo'));
  const [companyAddress, setCompanyAddress] = useState(() => localStorage.getItem('companyAddress') || 'Rua das Flores, 123 - Centro, São Paulo - SP');
  const [companyCnpj, setCompanyCnpj] = useState(() => localStorage.getItem('companyCnpj') || '12.345.678/0001-90');

  const [userFirstName, setUserFirstName] = useState('João');
  const [userLastName, setUserLastName] = useState('Silva');
  const [userEmail, setUserEmail] = useState('joao@restaurante.com');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState('Plano Premium');

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onbStreet, setOnbStreet] = useState('');
  const [onbNumber, setOnbNumber] = useState('');
  const [onbBairro, setOnbBairro] = useState('');
  const [onbState, setOnbState] = useState('');

  // Persistência em tempo real
  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('companyCnpj', companyCnpj);
    localStorage.setItem('totalTables', String(totalTables));
    if (companyLogo) localStorage.setItem('companyLogo', companyLogo);
  }, [isLoggedIn, companyName, companyAddress, companyCnpj, totalTables, companyLogo]);

  // Função para navegar atualizando a URL (Slug)
  const setCurrentView = (view: View) => {
    if (view !== currentView) {
      window.history.pushState({}, '', `/${view}`);
      _setCurrentView(view);
    }
  };

  // Sincronizar com botões voltar/avançar do navegador
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.split('/').filter(Boolean)[0];
      const validViews = Object.values(View);
      // Se voltar pra raiz, dashboard
      if (!path) {
        _setCurrentView(View.DASHBOARD);
        return;
      }
      const newView = validViews.includes(path as View) ? (path as View) : View.DASHBOARD;
      _setCurrentView(newView);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateOnboardingAddress = (street: string, num: string, bairro: string, state: string) => {
    setCompanyAddress(`${street}${num ? ', ' + num : ''}${bairro ? ' - ' + bairro : ''}${state ? ' - ' + state : ''}`);
  };

  const handleLogin = (mode: 'login' | 'signup') => {
    setIsLoggedIn(true);
    setCurrentView(View.DASHBOARD);
    if (mode === 'signup') {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(View.LOGIN);
    setShowOnboarding(false);
  };

  const renderView = () => {
    // Rota de teste do Supabase
    if (window.location.pathname === '/test-supabase') {
      return <TestSupabase />;
    }

    // Se for rota pública do cardápio digital
    if (currentView === 'PUBLIC_MENU' as any) {
      const path = window.location.pathname.split('/').filter(Boolean)[0];
      const restaurantSlug = path || 'restaurante-gourmet';
      return <PublicMenu restaurantSlug={restaurantSlug} />;
    }

    switch (currentView) {
      case View.LOGIN:
        return <Login onLogin={handleLogin} onNavigate={setCurrentView} />;
      case View.DASHBOARD:
        return <Dashboard />;
      case View.ORDERS:
        return <Orders />;
      case View.MENU:
        return <Menu />;
      case View.DIGITAL_MENU:
        return <Menu isDigitalOnly={true} />;
      case View.TEAM:
        return <Team />;
      case View.KITCHEN:
        return <Kitchen />;
      case View.CASHIER:
        return <Cashier />;
      case View.WAITER:
        return <Waiter totalTables={totalTables} setTotalTables={setTotalTables} />;
      case View.PLANS:
        return <Plans currentPlan={userPlan} onSelectPlan={setUserPlan} />;
      case View.TERMS:
        return <Terms onBack={() => setCurrentView(isLoggedIn ? View.SETTINGS : View.LOGIN)} />;
      case View.PRIVACY:
        return <Privacy onBack={() => setCurrentView(isLoggedIn ? View.SETTINGS : View.LOGIN)} />;
      case View.SETTINGS:
        return (
          <Settings
            onLogout={handleLogout}
            totalTables={totalTables}
            setTotalTables={setTotalTables}
            companyName={companyName}
            setCompanyName={setCompanyName}
            companyLogo={companyLogo}
            setCompanyLogo={setCompanyLogo}
            companyAddress={companyAddress}
            setCompanyAddress={setCompanyAddress}
            companyCnpj={companyCnpj}
            setCompanyCnpj={setCompanyCnpj}
            userFirstName={userFirstName}
            setUserFirstName={setUserFirstName}
            userLastName={userLastName}
            setUserLastName={setUserLastName}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            userPhoto={userPhoto}
            setUserPhoto={setUserPhoto}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  // Se estiver em uma dessas views, mostra a interface completa (Sidebar + Header)
  const managementViews = [
    View.DASHBOARD, View.ORDERS, View.MENU, View.TEAM,
    View.KITCHEN, View.WAITER, View.CASHIER,
    View.SETTINGS, View.PLANS
  ];

  const isAuthView = managementViews.includes(currentView);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-['Inter',_'Noto_Sans',_sans-serif]">
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-[500px] rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center mb-2">
                <img src="/briez-logo.png" alt="Logo briez" className="h-16 object-contain" />
              </div>
              <h2 className="text-white text-xl font-bold tracking-tight">Seja bem-vindo! 🚀</h2>
              <p className="text-[#666] text-sm">Para começar, precisamos de algumas informações sobre o seu estabelecimento.</p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Nome do Restaurante</label>
                <input
                  autoFocus
                  placeholder="Ex: Nhidra Gourmet"
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">CNPJ (Opcional)</label>
                <input
                  placeholder="00.000.000/0000-00"
                  onChange={(e) => setCompanyCnpj(e.target.value)}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-all"
                />
              </div>

              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-8 flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Endereço</label>
                  <input
                    placeholder="Rua / Avenida"
                    onChange={(e) => { setOnbStreet(e.target.value); updateOnboardingAddress(e.target.value, onbNumber, onbBairro, onbState); }}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-all"
                  />
                </div>
                <div className="col-span-4 flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Número</label>
                  <input
                    placeholder="123"
                    onChange={(e) => { setOnbNumber(e.target.value); updateOnboardingAddress(onbStreet, e.target.value, onbBairro, onbState); }}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Bairro</label>
                  <input
                    placeholder="Bairro"
                    onChange={(e) => { setOnbBairro(e.target.value); updateOnboardingAddress(onbStreet, onbNumber, e.target.value, onbState); }}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Estado (UF)</label>
                  <input
                    placeholder="SP"
                    maxLength={2}
                    onChange={(e) => { setOnbState(e.target.value); updateOnboardingAddress(onbStreet, onbNumber, onbBairro, e.target.value); }}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-white transition-all uppercase"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowOnboarding(false)}
              className="w-full bg-white text-black h-12 rounded-xl font-bold text-sm hover:bg-[#e6e6e6] transition-all shadow-lg active:scale-95"
            >
              Concluir Cadastro e Começar
            </button>
          </div>
        </div>
      )}

      {isAuthView && (
        <Sidebar
          activeView={currentView}
          onNavigate={setCurrentView}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isAuthView ? (isSidebarCollapsed ? 'ml-[80px]' : 'ml-[240px]') : ''
          }`}
      >
        {isAuthView && (
          <Header
            activeView={currentView}
            companyName={companyName}
            companyLogo={companyLogo}
            userPlan={userPlan}
            userPhoto={userPhoto}
            onNavigate={setCurrentView}
          />
        )}

        <main className={`flex-1 ${isAuthView ? 'p-8' : 'max-w-[1200px] mx-auto px-4 sm:px-10 py-5'}`}>
          {renderView()}
        </main>

        {isAuthView && (
          <footer className="px-8 py-6 border-t border-[#1a1a1a] mt-auto text-center">
            <p className="text-[#666] text-[10px] font-bold uppercase tracking-[0.2em]">
              &copy; 2026 briez - Sistema de Gestão Gastronômica
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};

export default App;
