
import React, { useState } from 'react';
import { TeamMember } from '../types';

const INITIAL_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Sophia Carter', role: 'Dono', status: 'Ativo' },
  { id: '2', name: 'Ethan Bennett', role: 'Gerente', status: 'Ativo' },
  { id: '3', name: 'Olivia Hayes', role: 'Garçom', status: 'Ativo', color: '#f2800d' },
  { id: '4', name: 'Lucas Silva', role: 'Garçom', status: 'Ativo', color: '#3b82f6' },
  { id: '5', name: 'Bia Oliveira', role: 'Caixa', status: 'Pendente' },
];

const WAITer_COLORS = [
  { name: 'Laranja', hex: '#f2800d' },
  { name: 'Azul', hex: '#3b82f6' },
  { name: 'Verde', hex: '#10b981' },
  { name: 'Roxo', hex: '#8b5cf6' },
  { name: 'Rosa', hex: '#ec4899' },
  { name: 'Vermelho', hex: '#ef4444' },
  { name: 'Amarelo', hex: '#eab308' },
];

const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedColor, setSelectedColor] = useState(WAITer_COLORS[0].hex);
  const [error, setError] = useState('');

  // Estados para edição
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAddMember = () => {
    setError('');
    if (!firstName || !lastName || !email || !role || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${firstName} ${lastName}`.trim(),
      role: role === 'waiter' ? 'Garçom' : role === 'manager' ? 'Gerente' : 'Caixa',
      status: 'Ativo',
      color: role === 'waiter' ? selectedColor : undefined
    };

    setMembers([...members, newMember]);
    setFirstName('');
    setLastName('');
    setEmail('');
    setRole('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    alert('Membro adicionado com sucesso!');
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditColor(member.color || WAITer_COLORS[0].hex);
    setShowEditModal(true);
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editName) return;

    setMembers(prev => prev.map(m => 
      m.id === editingMember.id 
        ? { ...m, name: editName, color: m.role === 'Garçom' ? editColor : m.color } 
        : m
    ));
    
    setShowEditModal(false);
    setEditingMember(null);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl font-bold tracking-tight">Equipe</h1>
        <p className="text-[#666] text-sm font-medium">Administre os acessos e permissões dos seus colaboradores.</p>
      </div>

      <section className="bg-[#111111] border border-[#1a1a1a] p-8 rounded-2xl flex flex-col gap-8 shadow-xl">
        <div className="flex flex-col gap-1">
          <h3 className="text-white text-lg font-bold">Adicionar Membro</h3>
          <p className="text-[#666] text-xs font-medium">Cadastre um novo colaborador diretamente no sistema.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 items-start">
          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Nome</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex: João"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Sobrenome</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ex: Silva"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">E-mail</label>
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white outline-none"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Função</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>Selecionar Função</option>
                <option value="manager">Gerente</option>
                <option value="waiter">Garçom</option>
                <option value="cashier">Caixa</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#666]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white placeholder:text-[#333] focus:ring-1 focus:ring-white outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-[#ef4444] text-xs font-bold bg-[#ef4444]/10 p-3 rounded-lg border border-[#ef4444]/20 animate-in fade-in duration-200">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-6">
          {/* Seletor de Cores Dinâmico para Garçom */}
          {role === 'waiter' && (
            <div className="flex flex-col gap-4 p-5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl animate-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col gap-1">
                <span className="text-white text-xs font-bold">Cor de Identificação</span>
                <p className="text-[#666] text-[10px]">Escolha uma cor única para identificar este garçom no mapa de mesas.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {WAITer_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    title={color.name}
                    className={`size-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === color.hex ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selectedColor === color.hex && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleAddMember}
            className="w-full bg-white text-black h-12 px-8 rounded-xl font-bold text-sm hover:bg-[#e6e6e6] transition-all shadow-md active:scale-[0.98]"
          >
            Adicionar Membro
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h3 className="text-white text-lg font-bold">Colaboradores</h3>
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Nome Completo</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Função</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[#666] uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a]/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      {member.role === 'Garçom' && member.color && (
                        <div 
                          className="size-3 rounded-full shadow-sm shrink-0" 
                          style={{ backgroundColor: member.color }}
                        />
                      )}
                      <span className="text-sm font-bold text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-[#999] font-medium">{member.role}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      member.status === 'Ativo' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-white/5 text-[#666]'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button 
                        onClick={() => openEditModal(member)}
                        className="text-[10px] font-bold text-white hover:underline uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                        className="text-[10px] font-bold text-[#ef4444] hover:underline uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal de Edição */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-[#111111] border border-[#1a1a1a] w-full max-w-md rounded-2xl p-8 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="text-white text-xl font-bold">Editar Colaborador</h3>
                <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest">{editingMember.role}</span>
              </div>
              <button 
                onClick={() => { setShowEditModal(false); setEditingMember(null); }} 
                className="text-[#666] hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateMember} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Nome do Colaborador</label>
                <input 
                  autoFocus
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Nome completo" 
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white focus:ring-1 focus:ring-white outline-none" 
                />
              </div>

              {editingMember.role === 'Garçom' && (
                <div className="flex flex-col gap-4">
                  <label className="text-[#666] text-[10px] font-bold tracking-widest uppercase">Cor de Identificação</label>
                  <div className="flex flex-wrap gap-3 p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
                    {WAITer_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setEditColor(color.hex)}
                        className={`size-8 rounded-full border-2 transition-all flex items-center justify-center ${
                          editColor === color.hex ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {editColor === color.hex && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingMember(null); }}
                  className="flex-1 bg-transparent border border-[#333] text-white font-bold py-3 rounded-xl hover:bg-[#1a1a1a] transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-[#e6e6e6] transition-all active:scale-[0.98] shadow-lg"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
