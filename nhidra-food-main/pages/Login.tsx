
import React, { useState } from 'react';
import { View } from '../types';

interface LoginProps {
  onLogin: (mode: 'login' | 'signup') => void;
  onNavigate: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <div className="w-full max-w-[420px] bg-[#111111] border border-[#1a1a1a] p-8 rounded-2xl flex flex-col gap-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center mb-2">
            <img src="/briez-logo.png" alt="Logo briez" className="h-20 object-contain" />
          </div>
          <p className="text-[#666] text-sm text-center">
            {mode === 'login'
              ? 'Entre com suas credenciais para acessar o painel administrativo.'
              : 'Cadastre seu restaurante e comece a gerenciar hoje mesmo.'}
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {mode === 'signup' && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Nome Completo</label>
              <input
                type="text"
                placeholder="Seu nome ou do restaurante"
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white focus:border-white transition-all outline-none"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white focus:border-white transition-all outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Senha</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 pr-12 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white focus:border-white transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333] hover:text-white transition-colors p-1"
                title={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24l4.24 4.24zM1 1l22 22"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            {mode === 'login' ? (
              <>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`size-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-white border-white' : 'bg-[#0a0a0a] border-[#1a1a1a] group-hover:border-[#333]'}`}
                  >
                    {rememberMe && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="black" strokeWidth="3" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    )}
                  </div>
                  <span className="text-[#666] text-xs font-medium group-hover:text-[#999] transition-colors select-none">Continuar conectado</span>
                </label>
                <button className="text-[#666] text-xs font-medium hover:text-white transition-colors">
                  Esqueceu sua senha?
                </button>
              </>
            ) : (
              <p className="text-[#666] text-[10px] font-medium leading-relaxed">
                Ao se cadastrar, você concorda com nossos <span onClick={() => onNavigate(View.TERMS)} className="text-white cursor-pointer hover:underline">Termos</span> e <span onClick={() => onNavigate(View.PRIVACY)} className="text-white cursor-pointer hover:underline">Privacidade</span>.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <button
            onClick={() => onLogin(mode)}
            className="w-full bg-white text-black h-12 rounded-xl font-bold text-sm hover:bg-[#e6e6e6] transition-all shadow-lg active:scale-[0.98]"
          >
            {mode === 'login' ? 'Entrar no Painel' : 'Criar Minha Conta'}
          </button>

          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="w-full text-[#666] text-xs font-medium hover:text-white transition-colors text-center"
          >
            {mode === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
