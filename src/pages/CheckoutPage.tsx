import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, CreditCard, Ticket, Truck, ArrowRight, User, MapPin, Check, Plus, AlertCircle, Copy, FileText, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const {
    currentUser,
    cart,
    wishlist,
    activeCoupon,
    shippingInfo,
    addAddress,
    placeOrder,
    navigate,
    login,
    register,
    db
  } = useStore();

  const [activeStep, setActiveStep] = useState<'auth' | 'address' | 'payment' | 'success'>('address');

  // Login/Register States (In case user is not logged in)
  const [isLogin, setIsLogin] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Address States
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
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

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Loading/Success simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Auto redirect to login tab if not logged in
  useEffect(() => {
    if (!currentUser) {
      setActiveStep('auth');
    } else {
      setActiveStep('address');
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        setSelectedAddressId(currentUser.addresses[0].id);
      }
    }
  }, [currentUser]);

  // If cart is empty and we are not in success screen, go back to cart
  useEffect(() => {
    if (cart.length === 0 && activeStep !== 'success') {
      navigate('cart');
    }
  }, [cart, activeStep]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (isLogin) {
      const success = login(authEmail, authPassword);
      if (!success) {
        setAuthError('Credenciais inválidas. Use cliente@technova.com / senha');
      }
    } else {
      if (!authName || !authEmail || !authPassword) {
        setAuthError('Preencha todos os campos.');
        return;
      }
      const success = register(authName, authEmail, authPassword);
      if (success) {
        login(authEmail, authPassword);
      } else {
        setAuthError('E-mail já cadastrado.');
      }
    }
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.street || !newAddress.number || !newAddress.neighborhood || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      alert('Por favor, preencha todos os campos obrigatórios do endereço.');
      return;
    }
    addAddress(newAddress);
    setShowNewAddressForm(false);
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

  const handleFinalPaymentSubmit = () => {
    if (!selectedAddressId) {
      alert('Por favor, selecione ou cadastre um endereço de entrega.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Por favor, preencha todos os campos do cartão de crédito.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate gateway response delays
    setTimeout(() => {
      try {
        const order = placeOrder(selectedAddressId, paymentMethod, cardDetails);
        setCreatedOrder(order);
        setIsProcessing(false);
        setActiveStep('success');
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
        alert('Erro ao processar pedido. Verifique os dados.');
      }
    }, 2000);
  };

  const handleCopyPix = () => {
    if (createdOrder?.paymentDetails.pixCode) {
      navigator.clipboard.writeText(createdOrder.paymentDetails.pixCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.promoPrice || item.product.price) * item.quantity, 0);
  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.type === 'percent') {
      discount = subtotal * (activeCoupon.value / 100);
    } else if (activeCoupon.type === 'fixed') {
      discount = activeCoupon.value;
    }
  }
  const shippingPrice = activeCoupon?.type === 'free_shipping' ? 0 : (shippingInfo?.price || 0);
  const total = Math.max(0, subtotal - discount + shippingPrice);

  return (
    <div className="bg-[#0a0a0a] text-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Visual indicator */}
        {activeStep !== 'success' && (
          <div className="flex items-center justify-center gap-4 sm:gap-10 mb-12 border-b border-white/5 pb-6 text-xs sm:text-sm">
            <div className={`flex items-center gap-2 font-bold ${activeStep === 'auth' ? 'text-[#0066ff]' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep === 'auth' ? 'bg-[#0066ff] text-white' : 'bg-zinc-950 text-slate-550 border border-white/5'}`}>1</span>
              <span>Identificação</span>
            </div>
            <span className="h-[1px] w-12 bg-white/10" />
            <div className={`flex items-center gap-2 font-bold ${activeStep === 'address' ? 'text-[#0066ff]' : currentUser ? 'text-slate-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep === 'address' ? 'bg-[#0066ff] text-white' : 'bg-zinc-950 text-slate-550 border border-white/5'}`}>2</span>
              <span>Endereço</span>
            </div>
            <span className="h-[1px] w-12 bg-white/10" />
            <div className={`flex items-center gap-2 font-bold ${activeStep === 'payment' ? 'text-[#0066ff]' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${activeStep === 'payment' ? 'bg-[#0066ff] text-white' : 'bg-zinc-950 text-slate-550 border border-white/5'}`}>3</span>
              <span>Pagamento</span>
            </div>
          </div>
        )}

        {/* CORE CONTENT GRID */}
        {isProcessing ? (
          /* Processing checkout spinner layout */
          <div className="py-20 text-center space-y-6 max-w-md mx-auto bg-glass border border-white/5 p-8 rounded-3xl">
            <div className="w-12 h-12 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Processando seu Pagamento...</h2>
            <p className="text-slate-400 text-xs leading-relaxed">Estamos conectando com o gateway de faturamento seguro e registrando suas garantias de estoque simuladas. Por favor, não feche esta página.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT / CENTER columns for Step Forms */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* STEP 1: AUTH FORM (If unlogged) */}
              {activeStep === 'auth' && (
                <div className="bg-glass border border-white/5 p-6 sm:p-8 rounded-2xl max-w-xl mx-auto">
                  <div className="text-center mb-6">
                    <User className="w-10 h-10 text-[#0066ff] mx-auto mb-2" />
                    <h2 className="text-xl font-bold text-white">{isLogin ? 'Faça Login para continuar' : 'Crie sua conta rapidinho'}</h2>
                    <p className="text-slate-400 text-xs mt-1">Sua compra é totalmente criptografada e segura de ponta a ponta.</p>
                  </div>
 
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seu nome completo:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Pedro de Alcântara"
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-mail de Acesso:</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: cliente@technova.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sua Senha:</label>
                      <input
                        type="password"
                        required
                        placeholder="Sua senha secreta"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
 
                    {authError && (
                      <p className="text-rose-500 text-xs font-semibold flex items-center gap-1.5 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{authError}</span>
                      </p>
                    )}
 
                    <button
                      type="submit"
                      className="w-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider accent-glow"
                    >
                      {isLogin ? 'Entrar e Continuar' : 'Criar Conta e Continuar'}
                    </button>
                  </form>
 
                  <div className="text-center mt-6 text-xs border-t border-white/5 pt-5">
                    <p className="text-slate-400">
                      {isLogin ? 'Não possui uma conta ainda?' : 'Já possui cadastro?'}
                      <button
                        onClick={() => { setIsLogin(!isLogin); setAuthError(''); }}
                        className="text-[#0066ff] hover:underline font-bold ml-1.5"
                      >
                        {isLogin ? 'Criar nova conta' : 'Acessar com meu email'}
                      </button>
                    </p>
                    
                    {isLogin && (
                      <div className="mt-4 bg-zinc-950/60 p-3 rounded-xl border border-white/5 text-[10px] text-slate-550 text-left space-y-1">
                        <p className="font-bold text-slate-400">💡 Credenciais de simulação prontas:</p>
                        <p>E-mail: <span className="text-slate-300 font-bold">cliente@technova.com</span> | Senha: <span className="text-slate-300 font-bold">senha</span></p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: ADDRESS CHOICE */}
              {activeStep === 'address' && currentUser && (
                <div className="space-y-6">
                  
                  {/* List of saved addresses */}
                  <div className="bg-glass border border-white/5 p-6 rounded-2xl space-y-4 text-left">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#0066ff]" />
                      <span>Selecione o Endereço de Entrega</span>
                    </h3>
 
                    {currentUser.addresses && currentUser.addresses.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentUser.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`border rounded-2xl p-4 cursor-pointer text-left transition-all relative duration-300 ${selectedAddressId === addr.id ? 'bg-[#0066ff]/10 border-[#0066ff]' : 'bg-zinc-950 border-white/10 hover:border-white/20'}`}
                          >
                            {selectedAddressId === addr.id && (
                              <span className="absolute top-4 right-4 bg-[#0066ff] text-white rounded-full p-0.5">
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <p className="text-white font-bold text-xs mb-1.5 uppercase tracking-wide">{addr.label}</p>
                            <p className="text-slate-400 text-[11px] leading-relaxed">{addr.street}, nº {addr.number}</p>
                            {addr.complement && <p className="text-slate-400 text-[11px] leading-relaxed">{addr.complement}</p>}
                            <p className="text-slate-400 text-[11px] leading-relaxed">{addr.neighborhood}, {addr.city} - {addr.state}</p>
                            <p className="text-slate-300 text-[11px] font-bold mt-1.5">CEP: {addr.zipCode}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs italic">Nenhum endereço cadastrado ainda. Cadastre o seu primeiro endereço abaixo.</p>
                    )}
 
                    {/* Toggle new address form button */}
                    {!showNewAddressForm && (
                      <button
                        onClick={() => setShowNewAddressForm(true)}
                        className="bg-zinc-950 border border-white/10 hover:border-white/20 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all mt-4 duration-300"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Novo Endereço</span>
                      </button>
                    )}
                  </div>
 
                  {/* Add Address Form popup/block */}
                  {showNewAddressForm && (
                    <div className="bg-glass border border-white/5 p-6 rounded-2xl space-y-4 text-left">
                      <h4 className="text-white font-bold text-xs uppercase tracking-wider">Adicionar Novo Endereço</h4>
                      <form onSubmit={handleAddNewAddress} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identificador (Ex: Casa, Trabalho):</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Minha Casa"
                              value={newAddress.label}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CEP:</label>
                            <input
                              type="text"
                              required
                              placeholder="01310-100"
                              value={newAddress.zipCode}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="sm:col-span-3 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rua / Logradouro:</label>
                            <input
                              type="text"
                              required
                              placeholder="Avenida Paulista"
                              value={newAddress.street}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Número:</label>
                            <input
                              type="text"
                              required
                              placeholder="1000"
                              value={newAddress.number}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, number: e.target.value }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complemento (Opcional):</label>
                            <input
                              type="text"
                              placeholder="Apto 101, bloco B"
                              value={newAddress.complement}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, complement: e.target.value }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bairro:</label>
                            <input
                              type="text"
                              required
                              placeholder="Bela Vista"
                              value={newAddress.neighborhood}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cidade:</label>
                            <input
                              type="text"
                              required
                              placeholder="São Paulo"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado (UF):</label>
                            <input
                              type="text"
                              required
                              placeholder="SP"
                              maxLength={2}
                              value={newAddress.state}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>
 
                        <div className="flex gap-2 justify-end border-t border-white/5 pt-4 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setShowNewAddressForm(false)}
                            className="text-slate-400 hover:text-white px-4 py-2 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="bg-[#0066ff] hover:bg-blue-600 text-white rounded-xl px-5 py-2.5 cursor-pointer font-bold tracking-wide transition-all duration-300 accent-glow"
                          >
                            Salvar Endereço
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
 
                  {/* Proceed CTAs */}
                  {selectedAddressId && (
                    <div className="text-right">
                      <button
                        onClick={() => setActiveStep('payment')}
                        className="bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs py-3.5 px-6 rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-all shadow-lg hover:shadow-[#0066ff]/20 accent-glow"
                      >
                        <span>Ir para o Pagamento</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD FORM */}
              {activeStep === 'payment' && currentUser && (
                <div className="space-y-6 text-left">
                  <div className="bg-glass border border-white/5 p-6 rounded-2xl space-y-6">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#0066ff]" />
                      <span>Escolha a Forma de Pagamento</span>
                    </h3>
 
                    {/* Choice pills */}
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setPaymentMethod('pix')}
                        className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer duration-300 ${paymentMethod === 'pix' ? 'bg-[#0066ff]/10 border-[#0066ff] text-blue-400' : 'bg-zinc-950 border-white/10 text-slate-400 hover:border-white/20'}`}
                      >
                        <span className="text-xs font-bold">PIX</span>
                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/10 px-1.5 py-0.5 rounded">10% OFF</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer duration-300 ${paymentMethod === 'card' ? 'bg-[#0066ff]/10 border-[#0066ff] text-blue-400' : 'bg-zinc-950 border-white/10 text-slate-400 hover:border-white/20'}`}
                      >
                        <span className="text-xs font-bold">Cartão de Crédito</span>
                        <span className="text-[9px] text-slate-550 font-semibold">Até 10x S/ Juros</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('boleto')}
                        className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer duration-300 ${paymentMethod === 'boleto' ? 'bg-[#0066ff]/10 border-[#0066ff] text-blue-400' : 'bg-zinc-950 border-white/10 text-slate-400 hover:border-white/20'}`}
                      >
                        <span className="text-xs font-bold">Boleto Bancário</span>
                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/10 px-1.5 py-0.5 rounded">10% OFF</span>
                      </button>
                    </div>
 
                    {/* Selected payment dynamic fields */}
                    {paymentMethod === 'pix' && (
                      <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-4 space-y-2">
                        <p className="text-white font-bold text-xs">Pagar com PIX Simulado</p>
                        <p className="text-slate-400 text-xs leading-relaxed">Ganhe <span className="text-emerald-400 font-bold">10% de desconto adicional</span> no valor da compra. Ao finalizar o pedido, o sistema gerará uma simulação de QR-Code e Copia e Cola para você concluir e o faturamento será aprovado instantaneamente de forma automática.</p>
                      </div>
                    )}
 
                    {paymentMethod === 'card' && (
                      <div className="space-y-4 bg-zinc-950/50 border border-white/5 rounded-2xl p-5">
                        <p className="text-white font-bold text-xs">Insira os Dados do Cartão (Simulação)</p>
                        
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Número do Cartão:</label>
                            <input
                              type="text"
                              required
                              placeholder="4000 1234 5678 9010"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19) }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
 
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome Impresso no Cartão:</label>
                            <input
                              type="text"
                              required
                              placeholder="EX: JOAO S SILVA"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                            />
                          </div>
 
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Validade (MM/AA):</label>
                              <input
                                type="text"
                                required
                                placeholder="12/30"
                                maxLength={5}
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                                className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl px-3 py-2 text-xs text-white text-center"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CVV:</label>
                              <input
                                type="password"
                                required
                                placeholder="123"
                                maxLength={4}
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                                className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl px-3 py-2 text-xs text-white text-center"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
 
                    {paymentMethod === 'boleto' && (
                      <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-4 space-y-2">
                        <p className="text-white font-bold text-xs">Pagar com Boleto Bancário Simulado</p>
                        <p className="text-slate-400 text-xs leading-relaxed">Ganhe <span className="text-emerald-400 font-bold">10% de desconto adicional</span> no valor do pedido. Ao concluir, o sistema gerará um link simulado de boleto em PDF e linha digitável e o pagamento constará aprovado em alguns instantes no histórico.</p>
                      </div>
                    )}
                  </div>
 
                  <div className="flex justify-between items-center text-xs font-bold">
                    <button
                      onClick={() => setActiveStep('address')}
                      className="text-slate-400 hover:text-white px-4 py-2 flex items-center gap-1 cursor-pointer"
                    >
                      Voltar ao Endereço
                    </button>
                    <button
                      onClick={handleFinalPaymentSubmit}
                      className="bg-emerald-600 hover:bg-emerald-750 text-white font-bold py-3.5 px-8 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Concluir e Pagar</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Order Summary Card (Only shows when not in success view) */}
            {activeStep !== 'success' && (
              <div className="space-y-6">
                <div className="bg-glass border border-white/5 p-5 rounded-2xl space-y-4 text-left">
                  <h3 className="text-white font-bold text-xs uppercase tracking-wider pb-3 border-b border-white/5">Itens do Pedido</h3>
                  
                  {/* Miniature list of items in cart */}
                  <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center text-xs border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-contain rounded-lg bg-zinc-950/40 p-1 border border-white/5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate leading-tight">{item.product.name}</p>
                          <p className="text-slate-500 text-[10px] mt-0.5">Qtd: {item.quantity} &bull; R$ {(item.product.promoPrice || item.product.price).toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
 
                  {/* Calculations breakdown */}
                  <div className="border-t border-white/5 pt-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span className="text-slate-200 font-semibold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>Cupom ({activeCoupon?.code}):</span>
                        <span>- R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {paymentMethod !== 'card' && (
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>Desconto PIX/Boleto (10%):</span>
                        <span>- R$ {((subtotal - discount) * 0.1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Frete ({shippingInfo?.name || 'Não selecionado'}):</span>
                      <span className="text-slate-200 font-semibold">
                        {shippingInfo ? (shippingPrice === 0 ? 'Grátis' : `R$ ${shippingPrice.toFixed(2)}`) : 'Calcule o CEP'}
                      </span>
                    </div>
                  </div>
 
                  {/* Final Total */}
                  <div className="border-t border-white/5 pt-4 flex items-baseline justify-between">
                    <span className="text-white font-bold text-xs uppercase">Total Final:</span>
                    <span className="text-[#0066ff] font-black text-lg tracking-tight">
                      R$ {
                        (paymentMethod !== 'card' ? (total - (subtotal - discount) * 0.1) : total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                      }
                    </span>
                  </div>
 
                  {/* Safety seals info */}
                  <div className="bg-zinc-950/60 border border-white/5 p-3 rounded-xl flex items-center gap-2 mt-4">
                    <ShieldCheck className="w-5 h-5 text-[#0066ff] flex-shrink-0" />
                    <span className="text-[10px] text-slate-400 leading-snug">Garantia de Compra Protegida TechNova Store. Seus produtos são cobertos contra extravios.</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION DISPLAY SCREEN */}
        {activeStep === 'success' && createdOrder && (
          <div className="max-w-2xl mx-auto bg-glass border border-white/5 p-8 sm:p-10 rounded-3xl text-center space-y-6 text-left">
            
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Pedido Gerado com Sucesso!</h2>
              <p className="text-slate-400 text-xs">O pagamento foi processado e faturado em nosso gateway simulado.</p>
            </div>

            {/* Order stats container */}
            <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3.5 border-b border-white/5 font-semibold">
                <div>
                  <p className="text-slate-500">NÚMERO DO PEDIDO</p>
                  <p className="text-white font-bold text-sm mt-0.5">{createdOrder.id}</p>
                </div>
                <div>
                  <p className="text-slate-500">CÓDIGO DE TRANSAÇÃO</p>
                  <p className="text-blue-400 font-bold text-sm mt-0.5">{createdOrder.paymentDetails.transactionCode}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-slate-500 font-semibold">ENDEREÇO DE ENTREGA</p>
                <p className="text-slate-200 font-medium">{createdOrder.shippingAddress.label} &bull; {createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.number}</p>
                <p className="text-slate-400">{createdOrder.shippingAddress.neighborhood}, {createdOrder.shippingAddress.city} - {createdOrder.shippingAddress.state} ({createdOrder.shippingAddress.zipCode})</p>
              </div>

              <div className="border-t border-white/5 pt-3.5 flex justify-between font-bold text-slate-200">
                <span>Total Faturado:</span>
                <span className="text-[#0066ff] text-sm font-bold">R$ {createdOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Payment Method Specific actions (PIX / Boleto) */}
            {createdOrder.paymentMethod === 'pix' && (
              <div className="bg-zinc-950/50 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 text-xs text-left">
                {/* Simulated QR Code */}
                <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                  <div className="w-24 h-24 bg-slate-950 flex flex-wrap p-1 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 ${i % 3 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <p className="text-white font-bold">Conclua o pagamento via PIX</p>
                  <p className="text-slate-400 leading-normal">Escaneie o QR-Code ao lado ou utilize o copia e cola para pagar. O faturamento está registrado como pago automaticamente para simulação.</p>
                  <button
                    onClick={handleCopyPix}
                    className="bg-zinc-950 hover:bg-zinc-900/85 border border-white/10 text-white font-bold py-2 px-4 rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-300"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPix ? 'Copiado!' : 'Copiar Chave PIX'}</span>
                  </button>
                </div>
              </div>
            )}

            {createdOrder.paymentMethod === 'boleto' && (
              <div className="bg-zinc-950/50 border border-white/10 rounded-2xl p-5 flex items-center gap-4 text-xs text-left">
                <div className="bg-blue-600/10 border border-blue-500/20 p-3.5 rounded-xl text-blue-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-white font-bold">Imprimir Boleto Bancário</p>
                  <p className="text-slate-400 leading-normal">Seu boleto simulado foi emitido. Você pode baixar o arquivo em PDF para conferência ou pagar no internet banking.</p>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('Simulação: Boleto PDF gerado com sucesso.'); }}
                    className="text-[#0066ff] font-bold hover:underline"
                  >
                    Visualizar boleto simulado &rarr;
                  </a>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 font-bold text-xs">
              <button
                onClick={() => navigate('client-area')}
                className="flex-1 bg-[#0066ff] hover:bg-blue-600 text-white py-3.5 rounded-xl cursor-pointer text-center shadow-lg hover:shadow-[#0066ff]/20 accent-glow transition-all duration-300"
              >
                Acompanhar Meus Pedidos
              </button>
              <button
                onClick={() => navigate('home')}
                className="flex-1 bg-zinc-950 border border-white/10 hover:border-white/20 text-slate-300 py-3.5 rounded-xl cursor-pointer text-center transition-colors duration-300"
              >
                Voltar para a Página Inicial
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
