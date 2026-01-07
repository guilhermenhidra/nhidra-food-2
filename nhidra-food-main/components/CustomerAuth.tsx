
import React, { useState } from 'react';

interface CustomerAuthProps {
    onLogin: (customerData: { name: string; phone: string; email?: string }) => void;
    onClose: () => void;
    restaurantName: string;
}

const CustomerAuth: React.FC<CustomerAuthProps> = ({ onLogin, onClose, restaurantName }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length >= 10) {
            onLogin({ name, phone, email });
        }
    };

    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return value;
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 size-8 bg-white/5 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>

                <div className="flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="text-white text-2xl font-black tracking-tight">{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
                        <p className="text-[#666] text-sm mt-2">Faça login para fazer seu pedido no {restaurantName}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {!isLogin && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[#666] text-xs font-bold uppercase tracking-wide">Nome Completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="bg-[#0a0a0a] border border-white/10 rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981]/50 transition-all"
                                    placeholder="Seu nome"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="text-[#666] text-xs font-bold uppercase tracking-wide">Telefone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(formatPhone(e.target.value))}
                                className="bg-[#0a0a0a] border border-white/10 rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981]/50 transition-all"
                                placeholder="(00) 00000-0000"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[#666] text-xs font-bold uppercase tracking-wide">E-mail (Opcional)</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="bg-[#0a0a0a] border border-white/10 rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981]/50 transition-all"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#10b981] text-black h-12 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-[#0ea572] transition-all active:scale-95 mt-2"
                        >
                            {isLogin ? 'Entrar' : 'Criar Conta'}
                        </button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#666] text-sm hover:text-white transition-colors"
                        >
                            {isLogin ? 'Não tem conta? Criar agora' : 'Já tem conta? Fazer login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerAuth;
