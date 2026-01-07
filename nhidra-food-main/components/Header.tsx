
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  activeView: View;
  companyName: string;
  companyLogo: string | null;
  userPlan: string;
  userPhoto: string | null;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, companyName, companyLogo, userPlan, userPhoto, onNavigate }) => {
  const defaultProfileImg = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100";

  const getTitle = () => {
    switch (activeView) {
      case View.DASHBOARD: return 'Dashboard';
      case View.ORDERS: return 'Pedidos';
      case View.MENU: return 'Cardápio';
      case View.TEAM: return 'Equipe';
      case View.WAITER: return 'Garçom';
      case View.KITCHEN: return 'Praças';
      case View.CASHIER: return 'Caixa';
      case View.SETTINGS: return 'Configurações';
      case View.PLANS: return 'Planos e Assinatura';
      default: return 'briez | Food';
    }
  }

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#0a0a0a] border-b border-[#1a1a1a] sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="text-[#666] text-xs uppercase tracking-widest font-medium">{getTitle()}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Informações da Empresa no Canto Direito - Clicável para Planos */}
        <div
          onClick={() => onNavigate(View.PLANS)}
          className="flex items-center gap-3 pr-4 border-r border-[#1a1a1a] cursor-pointer group hover:bg-white/5 px-3 py-1 rounded-xl transition-all"
        >
          <div className="flex flex-col items-end">
            <span className="text-white text-xs font-black uppercase tracking-tight leading-none group-hover:text-[#f2800d] transition-colors">{companyName}</span>
            <span className="text-[8px] text-[#10b981] font-bold uppercase tracking-widest mt-0.5">{userPlan}</span>
          </div>
          <div className="size-9 bg-[#111] rounded-xl border border-[#1a1a1a] overflow-hidden flex items-center justify-center shadow-inner group-hover:border-[#f2800d]/50 transition-all">
            {companyLogo ? (
              <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <span className="text-white font-black text-xs">{companyName.charAt(0)}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-[#666] hover:text-white transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <div className="absolute -top-0.5 -right-0.5 size-2 bg-[#f2800d] rounded-full border border-[#0a0a0a]"></div>
          </button>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border border-[#1a1a1a] cursor-pointer shadow-md"
            style={{ backgroundImage: `url("${userPhoto || defaultProfileImg}")` }}
            onClick={() => onNavigate(View.SETTINGS)}
          ></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
