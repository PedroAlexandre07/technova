import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Mail, Shield, MapPin, Heart, Bell, ShoppingBag, Eye, Lock, Edit, Plus, Trash2, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ClientAreaPage() {
  const {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    removeAddress,
    toggleNotificationRead,
    db,
    wishlist,
    toggleWishlist,
    addToCart,
    navigate
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist' | 'notifications'>('orders');

  // Auth form states (if unlogged)
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Profile Form states
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePass, setProfilePass] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address creation states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Selected Order for tracing details modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (isLoginTab) {
      const success = login(emailInput, passwordInput);
      if (!success) {
        setAuthError('Credenciais inválidas. Dica: cliente@technova.com / senha');
      }
    } else {
      if (!nameInput || !emailInput || !passwordInput) {
        setAuthError('Preencha todos os campos obrigatórios.');
        return;
      }
      const success = register(nameInput, emailInput, passwordInput);
      if (success) {
        login(emailInput, passwordInput);
      } else {
        setAuthError('E-mail já cadastrado.');
      }
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);
    updateProfile(profileName, profilePass || undefined);
    setProfilePass('');
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({
      label: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    });
  };

  // Re-order feature: adds all previous order items to active cart
  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity, item.selectedVariations);
      }
    });
    navigate('cart');
  };

  // Filter orders for the logged-in customer
  const clientOrders = db.orders.filter(o => o.userId === currentUser?.id);

  if (!currentUser) {
    return (
      <div className="bg-[#0a0a0a] text-slate-100 min-h-[70vh] py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-glass border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 text-left">
          
          <div className="text-center">
            <User className="w-12 h-12 text-[#0066ff] mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white">Área do Cliente</h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">Faça login para acompanhar seus pedidos, gerenciar endereços de entrega e verificar notificações.</p>
          </div>
 
          {/* Form Tabs */}
          <div className="flex bg-zinc-950/60 border border-white/5 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => { setIsLoginTab(true); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg cursor-pointer ${isLoginTab ? 'bg-[#0066ff] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Fazer Login
            </button>
            <button
              onClick={() => { setIsLoginTab(false); setAuthError(''); }}
              className={`flex-1 py-2 rounded-lg cursor-pointer ${!isLoginTab ? 'bg-[#0066ff] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Criar Conta
            </button>
          </div>
 
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLoginTab && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seu nome completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedro de Alcântara"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail de Cadastro:</label>
              <input
                type="email"
                required
                placeholder="Ex: cliente@technova.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sua Senha:</label>
              <input
                type="password"
                required
                placeholder="Sua senha secreta"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
 
            {authError && (
              <p className="text-rose-500 text-xs font-semibold flex items-center gap-1.5 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </p>
            )}
 
            <button
              type="submit"
              className="w-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider accent-glow"
            >
              {isLoginTab ? 'Acessar Conta' : 'Cadastrar e Acessar'}
            </button>
          </form>
 
          {isLoginTab && (
            <div className="bg-zinc-950/60 border border-white/5 p-3.5 rounded-xl space-y-1 text-[10px] text-slate-500">
              <p className="font-bold text-slate-400 uppercase">🔑 Credenciais prontas para teste:</p>
              <p>E-mail: <span className="text-slate-300 font-bold">cliente@technova.com</span> | Senha: <span className="text-slate-300 font-bold">senha</span></p>
            </div>
          )}
 
        </div>
      </div>
    );
  }

  // Active notifications count
  const unreadNotifications = (currentUser.notifications || []).filter(n => !n.isRead).length;

  return (
    <div className="bg-[#0a0a0a] text-slate-100 min-h-screen py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-glass border border-white/5 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0066ff]/10 border border-[#0066ff]/20 text-[#0066ff] font-bold rounded-full flex items-center justify-center text-lg">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Olá, {currentUser.name}!</h2>
              <p className="text-slate-400 text-xs mt-0.5">Cadastrado em {currentUser.createdAt}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-zinc-950 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-slate-400 hover:text-rose-500 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-colors duration-300"
          >
            Sair da Conta
          </button>
        </div>
 
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Navigation Tabs (Sidebar menu) */}
          <nav className="flex flex-col gap-1.5 bg-glass border border-white/5 p-4 rounded-2xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-[#0066ff] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Meus Pedidos</span>
              {clientOrders.length > 0 && (
                <span className={`text-[10px] ml-auto font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-blue-800 text-blue-100' : 'bg-zinc-950 text-slate-400'}`}>
                  {clientOrders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-[#0066ff] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              <Edit className="w-4 h-4" />
              <span>Meus Dados / Perfil</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'addresses' ? 'bg-[#0066ff] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              <MapPin className="w-4 h-4" />
              <span>Meus Endereços</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'wishlist' ? 'bg-[#0066ff] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              <Heart className="w-4 h-4" />
              <span>Lista de Desejos</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'notifications' ? 'bg-[#0066ff] text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              <Bell className="w-4 h-4" />
              <span>Notificações</span>
              {unreadNotifications > 0 && (
                <span className={`text-[10px] ml-auto font-bold px-1.5 py-0.5 rounded-full ${activeTab === 'notifications' ? 'bg-rose-800 text-rose-100' : 'bg-rose-600 text-white animate-pulse'}`}>
                  {unreadNotifications}
                </span>
              )}
            </button>
          </nav>

          {/* MAIN TAB CONTENT DISPLAY */}
          <section className="lg:col-span-3">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Histórico de Pedidos</h3>
                
                {clientOrders.length > 0 ? (
                  clientOrders.map((order) => {
                    const statusColors = {
                      pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                      preparing: 'bg-[#0066ff]/10 text-blue-400 border border-[#0066ff]/20',
                      shipped: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
                      delivered: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                      cancelled: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }[order.status];
 
                    const statusLabels = {
                      pending: 'Pendente',
                      preparing: 'Preparando',
                      shipped: 'Enviado',
                      delivered: 'Entregue',
                      cancelled: 'Cancelado'
                    }[order.status];
 
                    return (
                      <div
                        key={order.id}
                        className="bg-glass border border-white/5 hover:border-white/10 rounded-2xl p-5 space-y-4 text-xs transition-colors duration-300 text-left"
                      >
                        {/* Order Header block */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-bold text-white text-sm">{order.id}</span>
                            <span className="text-slate-500 font-medium">{order.createdAt}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors}`}>
                              {statusLabels}
                            </span>
                            <span className="text-white font-extrabold text-sm">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
 
                        {/* Items miniatures */}
                        <div className="flex flex-wrap gap-4 items-center">
                          {order.items.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 max-w-xs">
                              <img src={item.productImage} alt={item.productName} className="w-8 h-8 object-contain rounded bg-zinc-950/40 border border-white/5" />
                              <div className="min-w-0 text-left">
                                <p className="text-slate-300 font-medium truncate max-w-[150px]">{item.productName}</p>
                                <p className="text-slate-500 text-[10px] leading-none mt-0.5">Qtd: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
 
                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3 pt-2 justify-end border-t border-white/5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 hover:border-white/20 text-slate-300 font-bold py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all duration-300"
                          >
                            <Eye className="w-4 h-4 text-[#0066ff]" />
                            <span>Rastrear Entrega</span>
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="bg-[#0066ff]/10 border border-[#0066ff]/20 hover:bg-[#0066ff]/20 text-[#0066ff] font-bold py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all duration-300"
                          >
                            <RotateCcw className="w-4 h-4 text-[#0066ff]" />
                            <span>Repetir Pedido</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-10 text-center text-slate-500">
                    <p>Nenhum pedido faturado para sua conta até o momento.</p>
                  </div>
                )}
              </div>
            )}
 
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-glass border border-white/5 p-6 rounded-2xl space-y-6 max-w-lg text-left">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <User className="w-5 h-5 text-[#0066ff]" />
                  <span>Atualizar Informações de Perfil</span>
                </h3>
 
                {profileSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Seus dados foram atualizados com sucesso no banco de dados!</span>
                  </div>
                )}
 
                <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome Completo:</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail (Imutável):</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full bg-zinc-950/65 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alterar Senha (Deixe em branco para manter):</label>
                    <input
                      type="password"
                      placeholder="Sua nova senha super secreta"
                      value={profilePass}
                      onChange={(e) => setProfilePass(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />
                  </div>
 
                  <button
                    type="submit"
                    className="bg-[#0066ff] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-colors duration-300 accent-glow"
                  >
                    Salvar Informações
                  </button>
                </form>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Meus Endereços Cadastrados</h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 hover:border-white/20 text-[#0066ff] font-bold text-xs py-2 px-4 rounded-xl cursor-pointer flex items-center gap-1 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Endereço</span>
                  </button>
                </div>
 
                {showAddressForm && (
                  <form onSubmit={handleCreateAddress} className="bg-glass border border-white/5 p-5 rounded-2xl space-y-4 max-w-xl text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome do Endereço (Ex: Casa):</label>
                        <input
                          type="text"
                          required
                          placeholder="Minha Casa"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CEP:</label>
                        <input
                          type="text"
                          required
                          placeholder="01310-100"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rua / Logradouro:</label>
                        <input
                          type="text"
                          required
                          placeholder="Avenida Paulista"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Número:</label>
                        <input
                          type="text"
                          required
                          placeholder="1000"
                          value={newAddress.number}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, number: e.target.value }))}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complemento (Opcional):</label>
                        <input
                          type="text"
                          placeholder="Apto 101"
                          value={newAddress.complement}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, complement: e.target.value }))}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bairro:</label>
                        <input
                          type="text"
                          required
                          placeholder="Bela Vista"
                          value={newAddress.neighborhood}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cidade:</label>
                        <input
                          type="text"
                          required
                          placeholder="São Paulo"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado (UF):</label>
                        <input
                          type="text"
                          required
                          maxLength={2}
                          placeholder="SP"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end border-t border-white/5 pt-3">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="text-slate-400 hover:text-white px-3.5 py-1.5 font-bold transition-colors">Cancelar</button>
                      <button type="submit" className="bg-[#0066ff] hover:bg-blue-600 text-white rounded-xl px-4 py-1.5 font-bold transition-all duration-300 accent-glow">Salvar</button>
                    </div>
                  </form>
                )}
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {currentUser.addresses && currentUser.addresses.length > 0 ? (
                    currentUser.addresses.map((addr) => (
                      <div key={addr.id} className="bg-glass border border-white/5 rounded-2xl p-5 relative flex flex-col justify-between text-left">
                        <div>
                          <p className="text-white font-bold text-sm uppercase mb-2">{addr.label}</p>
                          <p className="text-slate-300 font-medium">{addr.street}, nº {addr.number}</p>
                          {addr.complement && <p className="text-slate-400">{addr.complement}</p>}
                          <p className="text-slate-400">{addr.neighborhood}, {addr.city} - {addr.state}</p>
                          <p className="text-slate-300 font-bold mt-2">CEP: {addr.zipCode}</p>
                        </div>
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className="text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1 mt-4 self-end cursor-pointer transition-colors duration-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remover</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 bg-zinc-950/40 border border-white/5 rounded-2xl p-8 text-center text-slate-500">
                      Nenhum endereço cadastrado.
                    </div>
                  )}
                </div>
              </div>
            )}
 
            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 text-xs text-left">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Meus Produtos Favoritados</h3>
                
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlist.map((id) => {
                      const prod = db.products.find(p => p.id === id);
                      if (!prod) return null;
                      return (
                        <div key={id} className="bg-glass border border-white/5 p-4 rounded-2xl space-y-3 relative group hover:border-white/10 transition-all duration-300">
                          <button
                            onClick={() => toggleWishlist(id)}
                            className="absolute top-3 right-3 text-rose-500 p-1.5 bg-zinc-950/85 rounded-full border border-white/10 hover:bg-zinc-900 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="aspect-square w-full rounded-xl bg-zinc-950/40 border border-white/5 flex items-center justify-center p-4">
                            <img src={prod.images[0]} alt={prod.name} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{prod.brand}</p>
                            <h4
                              onClick={() => navigate('product-detail', { productId: prod.id })}
                              className="text-white font-bold tracking-tight hover:text-blue-400 cursor-pointer truncate mt-0.5"
                            >
                              {prod.name}
                            </h4>
                            <p className="text-[#0066ff] font-bold text-sm mt-1">R$ {(prod.promoPrice || prod.price).toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-10 text-center text-slate-500">
                    Sua lista de favoritos está vazia. Explore os produtos e clique no ícone de coração para salvá-los aqui!
                  </div>
                )}
              </div>
            )}
 
            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 text-left">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Suas Notificações</h3>
                
                {currentUser.notifications && currentUser.notifications.length > 0 ? (
                  <div className="space-y-3 text-xs">
                    {currentUser.notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => !n.isRead && toggleNotificationRead(n.id)}
                        className={`border rounded-2xl p-4 text-left transition-all relative duration-300 ${n.isRead ? 'bg-zinc-950/40 border-white/5 opacity-60' : 'bg-[#0066ff]/5 border-[#0066ff]/20 hover:border-[#0066ff]/40 cursor-pointer'}`}
                      >
                        {!n.isRead && <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#0066ff]" />}
                        <p className="text-slate-500 text-[10px]">{n.date}</p>
                        <h4 className="text-white font-bold text-xs mt-1">{n.title}</h4>
                        <p className="text-slate-300 text-xs mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-10 text-center text-slate-500">
                    Você não possui notificações.
                  </div>
                )}
              </div>
            )}

          </section>
        </div>
      </div>

      {/* TRACKING MODAL POPUP */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal content */}
          <div className="bg-zinc-950/95 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 text-xs text-left max-h-[85vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-base cursor-pointer"
            >
              &times;
            </button>
            
            <div className="mb-6">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Rastreamento do pedido</span>
              <h3 className="text-white font-bold text-lg mt-0.5">{selectedOrder.id}</h3>
              <p className="text-slate-400 text-[10px] mt-0.5">Faturamento: {selectedOrder.createdAt}</p>
            </div>
 
            {/* Simulated delivery progress bar */}
            <div className="space-y-4 mb-8">
              <p className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">Status da Entrega</p>
              
              <div className="flex justify-between items-center relative py-2">
                <span className="absolute left-0 right-0 h-1 bg-white/10 z-0" />
                
                {/* Active progress color bar depending on current status */}
                <span
                  className="absolute left-0 h-1 bg-[#0066ff] z-0 transition-all"
                  style={{
                    width: {
                      pending: '10%',
                      preparing: '40%',
                      shipped: '75%',
                      delivered: '100%',
                      cancelled: '0%'
                    }[selectedOrder.status]
                  }}
                />
 
                {/* Steps indicators */}
                {['pending', 'preparing', 'shipped', 'delivered'].map((step, idx) => {
                  const stepNames = { pending: 'Gerado', preparing: 'Separando', shipped: 'Enviado', delivered: 'Entregue' }[step];
                  const activeIdx = { pending: 0, preparing: 1, shipped: 2, delivered: 3 }[selectedOrder.status];
                  const isPassed = idx <= activeIdx;
                  return (
                    <div key={step} className="flex flex-col items-center z-10 relative">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold border transition-colors ${isPassed ? 'bg-[#0066ff] border-[#0066ff] text-white text-xs' : 'bg-zinc-950 border-white/10 text-slate-500 text-xs'}`}>
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase">{stepNames}</span>
                    </div>
                  );
                })}
              </div>
            </div>
 
            {/* Tracking logs */}
            <div className="space-y-4">
              <p className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">Histórico de Atualizações</p>
              <div className="space-y-4 border-l border-white/5 pl-4">
                {selectedOrder.history && selectedOrder.history.length > 0 ? (
                  [...selectedOrder.history].reverse().map((hist: any, i: number) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0066ff] border border-zinc-950" />
                      <p className="text-[10px] text-slate-550 font-semibold">{hist.date}</p>
                      <p className="text-white font-bold text-xs mt-0.5">{hist.status}</p>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{hist.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-650 italic">Nenhum registro de trâmite.</p>
                )}
              </div>
            </div>
 
            <div className="mt-8 border-t border-white/5 pt-4 text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-[#0066ff] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-colors duration-300 accent-glow"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
