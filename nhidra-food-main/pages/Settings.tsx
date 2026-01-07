
import React, { useState, useEffect, useRef } from 'react';

interface SettingsProps {
  onLogout: () => void;
  totalTables: number;
  setTotalTables: (val: number) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  companyLogo: string | null;
  setCompanyLogo: (val: string | null) => void;
  companyAddress: string;
  setCompanyAddress: (val: string) => void;
  companyCnpj: string;
  setCompanyCnpj: (val: string) => void;
  userFirstName: string;
  setUserFirstName: (val: string) => void;
  userLastName: string;
  setUserLastName: (val: string) => void;
  userEmail: string;
  setUserEmail: (val: string) => void;
  userPhoto: string | null;
  setUserPhoto: (val: string | null) => void;
}

const Settings: React.FC<SettingsProps> = ({
  onLogout,
  totalTables,
  setTotalTables,
  companyName,
  setCompanyName,
  companyLogo,
  setCompanyLogo,
  companyAddress,
  setCompanyAddress,
  companyCnpj,
  setCompanyCnpj,
  userFirstName,
  setUserFirstName,
  userLastName,
  setUserLastName,
  userEmail,
  setUserEmail,
  userPhoto,
  setUserPhoto
}) => {
  const [localTables, setLocalTablesInternal] = useState(totalTables);
  const [localCompanyName, setLocalCompanyName] = useState(companyName);
  const [localCompanyLogo, setLocalCompanyLogo] = useState(companyLogo);
  const [localCompanyAddress, setLocalCompanyAddress] = useState(companyAddress);
  const [localCompanyCnpj, setLocalCompanyCnpj] = useState(companyCnpj);
  const [localUserFirstName, setLocalUserFirstName] = useState(userFirstName);
  const [localUserLastName, setLocalUserLastName] = useState(userLastName);
  const [localUserEmail, setLocalUserEmail] = useState(userEmail);
  const [localUserPhoto, setLocalUserPhoto] = useState(userPhoto);

  // Estados detalhados de endereço
  const [localStreet, setLocalStreet] = useState('');
  const [localNumber, setLocalNumber] = useState('');
  const [localBairro, setLocalBairro] = useState('');
  const [localState, setLocalState] = useState('');

  // Sincronizar estados detalhados quando o endereço principal muda (inicialmente ou via prop)
  useEffect(() => {
    if (companyAddress) {
      const parts = companyAddress.split(' - ');
      if (parts.length >= 1) {
        const firstPart = parts[0].split(', ');
        setLocalStreet(firstPart[0] || '');
        setLocalNumber(firstPart[1] || '');
      }
      setLocalBairro(parts[1] || '');
      setLocalState(parts[2] || '');
    }
  }, [companyAddress]);

  // Atualizar o endereço completo local sempre que um campo detalhado mudar
  useEffect(() => {
    const formatted = `${localStreet}${localNumber ? ', ' + localNumber : ''}${localBairro ? ' - ' + localBairro : ''}${localState ? ' - ' + localState : ''}`;
    setLocalCompanyAddress(formatted);
  }, [localStreet, localNumber, localBairro, localState]);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Alterações salvas com sucesso!');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);

  const hasPasswordChanges = isChangingPassword && currentPassword && newPassword && confirmPassword;

  const hasChanges =
    localTables !== totalTables ||
    localCompanyName !== companyName ||
    localCompanyLogo !== companyLogo ||
    localCompanyAddress !== companyAddress ||
    localCompanyCnpj !== companyCnpj ||
    localUserFirstName !== userFirstName ||
    localUserLastName !== userLastName ||
    localUserEmail !== userEmail ||
    localUserPhoto !== userPhoto ||
    hasPasswordChanges;

  const handleSaveAll = () => {
    if (!hasChanges) return;

    if (isChangingPassword) {
      if (newPassword !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }
      // Aqui entraria a lógica de API
      setToastMessage('Perfil e senha atualizados!');
    } else {
      setToastMessage('Alterações salvas com sucesso!');
    }

    setTotalTables(localTables);
    setCompanyName(localCompanyName);
    setCompanyLogo(localCompanyLogo);
    setCompanyAddress(localCompanyAddress);
    setCompanyCnpj(localCompanyCnpj);
    setUserFirstName(localUserFirstName);
    setUserLastName(localUserLastName);
    setUserEmail(localUserEmail);
    setUserPhoto(localUserPhoto);

    // Reset password fields
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // Notificação Toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLocalCompanyLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLocalUserPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-10 relative">

      {/* Notificação Toast Customizada */}
      {showToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] animate-in fade-in slide-in-from-top-8 duration-500">
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="size-6 bg-[#10b981] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"></path></svg>
            </div>
            <span className="text-white text-sm font-bold tracking-tight">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-white text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-[#666] text-sm font-medium">Gestão do estabelecimento e perfil.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Perfil do Usuário */}
          <section className="bg-[#111] border border-[#1a1a1a] p-8 rounded-3xl flex flex-col gap-8 shadow-xl">
            <h3 className="text-white text-lg font-bold flex items-center gap-3">
              <span className="size-8 bg-[#3b82f6]/10 text-[#3b82f6] rounded-xl flex items-center justify-center">👤</span>
              Perfil do Usuário
            </h3>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <div
                  className="size-24 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] bg-cover bg-center overflow-hidden flex items-center justify-center relative group"
                >
                  {localUserPhoto ? (
                    <img src={localUserPhoto} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-[#333]">US</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => userPhotoInputRef.current?.click()} className="text-[10px] text-white font-bold uppercase tracking-widest">Alterar</button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => userPhotoInputRef.current?.click()}
                    className="bg-[#1a1a1a] border border-[#333] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#444] transition-all"
                  >
                    Mudar Foto
                  </button>
                  <p className="text-[#666] text-[10px] font-medium">PNG, JPG ou WEBP. Máx 2MB.</p>
                </div>
                <input ref={userPhotoInputRef} type="file" className="hidden" onChange={handleUserPhotoUpload} accept="image/*" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Nome</label>
                  <input
                    value={localUserFirstName}
                    onChange={e => setLocalUserFirstName(e.target.value)}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#3b82f6] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Sobrenome</label>
                  <input
                    value={localUserLastName}
                    onChange={e => setLocalUserLastName(e.target.value)}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#3b82f6] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">E-mail</label>
                <input
                  type="email"
                  value={localUserEmail}
                  onChange={e => setLocalUserEmail(e.target.value)}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-[#1a1a1a] flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-white text-sm font-bold">Segurança da Conta</span>
                    <span className="text-[#666] text-xs font-medium">Mantenha sua conta protegida mudando sua senha regularmente.</span>
                  </div>
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isChangingPassword
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                      : 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                      }`}
                  >
                    {isChangingPassword ? 'Cancelar Alteração' : 'Mudar Senha'}
                  </button>
                </div>

                {isChangingPassword && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-2">
                      <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Senha Atual</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#3b82f6] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Nova Senha</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Confirmar Nova Senha</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981] transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Estabelecimento */}
          <section className="bg-[#111] border border-[#1a1a1a] p-8 rounded-3xl flex flex-col gap-8 shadow-xl">
            <h3 className="text-white text-lg font-bold flex items-center gap-3">
              <span className="size-8 bg-[#10b981]/10 text-[#10b981] rounded-xl flex items-center justify-center">🏢</span>
              Informações da Empresa
            </h3>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <div
                  className="size-24 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] bg-cover bg-center overflow-hidden flex items-center justify-center relative group"
                >
                  {localCompanyLogo ? (
                    <img src={localCompanyLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl text-[#333]">LG</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => logoInputRef.current?.click()} className="text-[10px] text-white font-bold uppercase tracking-widest">Alterar</button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="bg-[#1a1a1a] border border-[#333] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#444] transition-all"
                  >
                    Mudar Logo
                  </button>
                  <p className="text-[#666] text-[10px] font-medium">PNG ou JPG. Recomendado 512x512.</p>
                </div>
                <input ref={logoInputRef} type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Nome Fantasia</label>
                  <input
                    value={localCompanyName}
                    onChange={e => setLocalCompanyName(e.target.value)}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">CNPJ</label>
                  <input
                    value={localCompanyCnpj}
                    onChange={e => setLocalCompanyCnpj(e.target.value)}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Endereço</label>
                  <input
                    value={localStreet}
                    onChange={e => setLocalStreet(e.target.value)}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981] transition-colors"
                    placeholder="Rua / Avenida"
                  />
                </div>
                <div className="col-span-4 flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Número</label>
                  <input
                    value={localNumber}
                    onChange={e => setLocalNumber(e.target.value)}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981] transition-colors"
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Bairro</label>
                  <input
                    value={localBairro}
                    onChange={e => setLocalBairro(e.target.value)}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981] transition-colors"
                    placeholder="Bairro"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#666] text-[10px] font-bold uppercase tracking-widest">Estado (UF)</label>
                  <input
                    value={localState}
                    maxLength={2}
                    onChange={e => setLocalState(e.target.value.toUpperCase())}
                    className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl h-12 px-4 text-white outline-none focus:border-[#10b981] transition-colors uppercase"
                    placeholder="SP"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#111] border border-[#1a1a1a] p-8 rounded-3xl flex flex-col gap-8 shadow-xl">
            <h3 className="text-white text-lg font-bold flex items-center gap-3">
              <span className="size-8 bg-[#f2800d]/10 text-[#f2800d] rounded-xl flex items-center justify-center">🪑</span>
              Configuração de Mesas
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 bg-[#0a0a0a] border border-[#1a1a1a] p-2 rounded-2xl">
                <button
                  onClick={() => setLocalTablesInternal(Math.max(0, localTables - 1))}
                  className="size-10 bg-[#1a1a1a] hover:bg-[#222] text-white rounded-xl font-bold transition-all"
                >
                  -
                </button>
                <span className="text-2xl font-black text-white w-12 text-center">{localTables}</span>
                <button
                  onClick={() => setLocalTablesInternal(localTables + 1)}
                  className="size-10 bg-[#1a1a1a] hover:bg-[#222] text-white rounded-xl font-bold transition-all"
                >
                  +
                </button>
              </div>
              <p className="text-[#666] text-xs font-medium">Defina a quantidade total de mesas disponíveis no seu estabelecimento.</p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#111] border border-[#1a1a1a] p-8 rounded-3xl flex flex-col gap-6 shadow-lg sticky top-24">
            <h3 className="text-white text-lg font-bold">Gerenciamento</h3>
            <div className="flex flex-col gap-3">
              <button
                disabled={!hasChanges}
                onClick={handleSaveAll}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${hasChanges
                  ? 'bg-white text-black hover:bg-white/90 shadow-white/5'
                  : 'bg-[#1a1a1a] text-[#333] cursor-not-allowed border border-[#1a1a1a]'
                  }`}
              >
                Salvar Alterações
              </button>
              <button
                onClick={onLogout}
                className="w-full py-4 rounded-2xl bg-transparent border border-[#ef4444]/20 hover:bg-[#ef4444]/10 text-[#ef4444] text-[10px] font-black uppercase tracking-[0.2em] transition-all"
              >
                Sair do Sistema
              </button>
            </div>
            <div className="pt-6 border-t border-[#1a1a1a] flex flex-col gap-2">
              <p className="text-[#666] text-[10px] font-bold uppercase tracking-widest text-center">briez v2.4.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
