
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  onLogout?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  onLogout,
  isCollapsed,
  onToggleCollapse
}) => {
  const navItems = [
    {
      label: 'Dashboard',
      view: View.DASHBOARD,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      label: 'Cardápio',
      view: View.MENU,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M11 5L6 9l5 4m3-8l5 4-5 4M2 12h20"></path>
          <path d="M12 2v20"></path>
        </svg>
      )
    },
    {
      label: 'Praças',
      view: View.KITCHEN,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"></path>
          <path d="M7 2v11"></path>
          <path d="M15 14v7a2 2 0 002 2h2a2 2 0 002-2v-7"></path>
          <path d="M18 20V2"></path>
        </svg>
      )
    },
    {
      label: 'Pedidos',
      view: View.ORDERS,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      )
    },
    {
      label: 'Garçom',
      view: View.WAITER,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-3-3.87m4-12a4 4 0 010 7.75"></path>
          <path d="M7 21v-2a4 4 0 014-4h2a4 4 0 014 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    {
      label: 'Equipe',
      view: View.TEAM,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path>
        </svg>
      )
    },
    {
      label: 'Caixa',
      view: View.CASHIER,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
        </svg>
      )
    },
    {
      label: 'Configurações',
      view: View.SETTINGS,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path>
        </svg>
      )
    },
  ];

  return (
    <aside
      className={`h-screen fixed left-0 top-0 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col z-50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[80px]' : 'w-[240px]'
        }`}
    >
      <div className={`py-6 flex items-center justify-between h-20 border-b border-[#1a1a1a] transition-all duration-300 ${isCollapsed ? 'px-3' : 'pr-4'}`}>
        <div className={`flex items-center pl-6 ${isCollapsed ? 'size-10' : 'h-12'}`}>
          <img src="/briez-logo.png" alt="Logo briez" className={`object-contain ${isCollapsed ? 'h-10' : 'h-12'}`} />
        </div>
        <button
          onClick={onToggleCollapse}
          className={`text-[#666] hover:text-white transition-all duration-300 p-1 flex items-center justify-center ${isCollapsed ? 'bg-[#1a1a1a] rounded-lg' : ''}`}
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-lg transition-all duration-200 group relative ${isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
                } ${isActive
                  ? 'bg-[#1a1a1a] text-white font-medium'
                  : 'text-[#666] hover:text-white'
                }`}
            >
              <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#666] group-hover:text-white'}`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <button
          onClick={onLogout}
          className={`w-full flex items-center text-[#666] hover:text-white transition-colors group ${isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2'
            }`}
          title={isCollapsed ? "Sair" : undefined}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          {!isCollapsed && <span className="text-sm">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
