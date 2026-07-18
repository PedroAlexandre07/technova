import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Coupon, BlogPost } from '../types';
import {
  LayoutDashboard, ShoppingCart, Package, Users, Ticket, FileText,
  AlertTriangle, DollarSign, ArrowUpRight, TrendingUp, Plus, Edit, Trash2,
  CheckCircle2, XCircle, Search, RefreshCcw, Save, MessageSquare, Check, X, ShieldAlert,
  Lock, Eye, EyeOff
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AdminPanelPage() {
  const {
    db,
    currentUser,
    adminSaveProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    adminSaveCoupon,
    adminDeleteCoupon,
    adminSavePost,
    adminDeletePost,
    navigate
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'coupons' | 'blog'>('dashboard');

  // Search/Filters inside Admin sub-tabs
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Modals / Forms States
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [orderLogNote, setOrderLogNote] = useState('');

  // Controle de segurança do Painel Administrativo
  const [typedPassword, setTypedPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 1. Se não estiver logado ou não for admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="bg-[#0a0a0a] text-slate-100 min-h-[85vh] py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-glass border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 text-center">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/5">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Acesso Negado</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              Esta página é estritamente reservada para administradores credenciados da TechNova Store.
            </p>
          </div>



          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => navigate('client-area')}
              className="w-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider accent-glow transition-colors duration-300 cursor-pointer"
            >
              Fazer Login como Admin
            </button>
            <button
              onClick={() => navigate('home')}
              className="w-full bg-zinc-950 hover:bg-zinc-900 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Se for admin mas ainda não desbloqueou o painel nesta sessão
  if (!isUnlocked) {
    const handleUnlockSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Valida com a senha do usuário administrador logado (geralmente "admin")
      if (typedPassword === currentUser.password) {
        setIsUnlocked(true);
        setUnlockError('');
      } else {
        setUnlockError('Senha administrativa incorreta! Por favor, tente novamente.');
      }
    };

    return (
      <div className="bg-[#0a0a0a] text-slate-100 min-h-[85vh] py-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md bg-glass border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 text-left">
          
          <div className="text-center">
            <div className="w-16 h-16 bg-[#0066ff]/10 border border-[#0066ff]/20 text-[#0066ff] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#0066ff]/5 mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Desbloqueio de Segurança</h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Olá, <span className="text-[#0066ff] font-semibold">{currentUser.name}</span>! Por segurança, confirme sua senha administrativa antes de abrir o painel corporativo.
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sua Senha de Administrador:</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Senha secreta"
                  value={typedPassword}
                  onChange={(e) => {
                    setTypedPassword(e.target.value);
                    if (unlockError) setUnlockError('');
                  }}
                  className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] rounded-xl pl-3.5 pr-10 py-3 text-xs text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {unlockError && (
              <p className="text-rose-500 text-xs font-semibold flex items-center gap-1.5 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{unlockError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider accent-glow transition-all duration-300 cursor-pointer"
            >
              Confirmar e Entrar
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('home')}
              className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-all duration-300 cursor-pointer"
            >
              Voltar para Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // METRICS & CHARTS CALCULATION
  // ----------------------------------------------------
  const totalRevenue = db.orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const totalOrdersCount = db.orders.length;
  const avgOrderTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  
  // Inventory alert: stock <= 3
  const lowStockProducts = db.products.filter(p => p.stock <= 3);

  // Recharts fake sales-by-date aggregation
  const salesHistoryChartData = db.orders
    .filter(o => o.status !== 'cancelled')
    .map((o) => ({
      date: o.createdAt.split(' ')[0], // Get date segment (DD/MM/AAAA)
      Valor: o.total
    }))
    .reduce((acc: any[], item) => {
      const existing = acc.find(x => x.date === item.date);
      if (existing) {
        existing.Valor += item.Valor;
      } else {
        acc.push({ date: item.date, Valor: item.Valor });
      }
      return acc;
    }, []);

  // Default mock fallback chart data if empty
  const chartData = salesHistoryChartData.length > 0 ? salesHistoryChartData : [
    { date: '10/07', Valor: 2400 },
    { date: '11/07', Valor: 4500 },
    { date: '12/07', Valor: 3200 },
    { date: '13/07', Valor: 7800 },
    { date: '14/07', Valor: 5100 },
    { date: '15/07', Valor: 9600 },
    { date: '16/07', Valor: 12400 }
  ];

  // ----------------------------------------------------
  // PRODUCT SAVING ACTIONS
  // ----------------------------------------------------
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    // Ensure array conversions
    const imagesArray = typeof editingProduct.images === 'string'
      ? (editingProduct.images as string).split(',').map(s => s.trim())
      : editingProduct.images || [];

    const specsObj = typeof editingProduct.specs === 'string'
      ? JSON.parse(editingProduct.specs || '{}')
      : editingProduct.specs || {};

    const variationsObj = typeof editingProduct.variations === 'string'
      ? JSON.parse(editingProduct.variations || '{}')
      : editingProduct.variations || {};

    const payload: Product = {
      id: editingProduct.id || `prod_${Date.now()}`,
      name: editingProduct.name || 'Sem nome',
      description: editingProduct.description || '',
      price: Number(editingProduct.price) || 0,
      promoPrice: editingProduct.promoPrice ? Number(editingProduct.promoPrice) : undefined,
      category: editingProduct.category || 'notebook',
      brand: editingProduct.brand || 'TechNova',
      model: editingProduct.model || 'Padrão',
      warranty: editingProduct.warranty || '12 meses',
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500'],
      stock: Number(editingProduct.stock) || 0,
      rating: editingProduct.rating || 5,
      reviewsCount: editingProduct.reviewsCount || 1,
      reviews: editingProduct.reviews || [],
      questions: editingProduct.questions || [],
      specs: specsObj,
      variations: variationsObj,
      isFeatured: !!editingProduct.isFeatured,
      isPromo: !!editingProduct.promoPrice,
      isNew: !!editingProduct.isNew
    };

    adminSaveProduct(payload);
    setEditingProduct(null);
  };

  // ----------------------------------------------------
  // ORDER STATUS CHANGE
  // ----------------------------------------------------
  const handleOrderStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    adminUpdateOrderStatus(orderId, newStatus, orderLogNote || undefined);
    setOrderLogNote('');
  };

  // ----------------------------------------------------
  // COUPONS SUBMIT
  // ----------------------------------------------------
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    const payload: Coupon = {
      id: editingCoupon.id || 'coupon_' + Math.floor(Math.random() * 100000),
      code: editingCoupon.code?.toUpperCase() || '',
      type: editingCoupon.type || 'percent',
      value: Number(editingCoupon.value) || 0,
      minPurchase: Number(editingCoupon.minPurchase) || 0,
      minSubtotal: Number(editingCoupon.minPurchase) || 0,
      expiryDate: editingCoupon.expiryDate || '31/12/2026',
      usageLimit: Number(editingCoupon.usageLimit) || 100,
      usageCount: Number(editingCoupon.usageCount) || 0,
      isActive: editingCoupon.isActive !== undefined ? editingCoupon.isActive : true
    };

    adminSaveCoupon(payload);
    setEditingCoupon(null);
  };

  // ----------------------------------------------------
  // BLOG POSTS SUBMIT
  // ----------------------------------------------------
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const payload: BlogPost = {
      id: editingPost.id || `post_${Date.now()}`,
      title: editingPost.title || 'Novo Post',
      summary: editingPost.summary || editingPost.excerpt || '',
      excerpt: editingPost.excerpt || '',
      content: editingPost.content || '',
      image: editingPost.image || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600',
      category: editingPost.category || 'Tecnologia',
      author: editingPost.author || 'Redação TechNova',
      date: editingPost.date || new Date().toLocaleDateString('pt-BR'),
      readTime: editingPost.readTime || '3 min de leitura',
      views: Number(editingPost.views) || 0,
      comments: editingPost.comments || []
    };

    adminSavePost(payload);
    setEditingPost(null);
  };

  return (
    <div className="bg-[#0b0f19] text-slate-100 min-h-screen py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8">
          <div>
            <span className="bg-red-500/10 border border-red-500/25 text-red-500 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 inline-flex mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Painel de Controle Admin</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Painel Corporativo</h1>
            <p className="text-slate-400 text-xs mt-1">Gerenciamento integral da TechNova Store &bull; Inventários, Faturamentos e CRM.</p>
          </div>
          <button
            onClick={() => navigate('home')}
            className="bg-slate-950 border border-slate-850 hover:border-slate-800 text-slate-300 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
          >
            Voltar para Loja
          </button>
        </div>

        {/* Outer Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Admin Sidebar Navigation */}
          <aside className="lg:col-span-1 bg-slate-900/30 border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-md shadow-red-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Painel Geral</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'products' ? 'bg-red-600 text-white shadow-md shadow-red-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              <Package className="w-4 h-4" />
              <span>Produtos</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-red-600 text-white shadow-md shadow-red-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Pedidos</span>
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'customers' ? 'bg-red-600 text-white shadow-md shadow-red-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes</span>
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'coupons' ? 'bg-red-600 text-white shadow-md shadow-red-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              <Ticket className="w-4 h-4" />
              <span>Cupons</span>
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'blog' ? 'bg-red-600 text-white shadow-md shadow-red-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'}`}
            >
              <FileText className="w-4 h-4" />
              <span>Artigos Blog</span>
            </button>
          </aside>

          {/* Admin Panels content space */}
          <main className="lg:col-span-4 space-y-6">
            
            {/* TAB 1: GENERAL DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* 4 Cards Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Faturamento Total</p>
                    <p className="text-white text-lg font-black tracking-tight mt-1">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-2">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12.4% este mês</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Pedidos Faturados</p>
                    <p className="text-white text-lg font-black tracking-tight mt-1">{totalOrdersCount}</p>
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-2">
                      <span>Conversão de 2.8%</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Ticket Médio</p>
                    <p className="text-white text-lg font-black tracking-tight mt-1">R$ {avgOrderTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <div className="text-[10px] text-slate-500 mt-2">Cesta padrão corporativa</div>
                  </div>
                  <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Alertas de Estoque</p>
                    <p className="text-rose-400 text-lg font-black tracking-tight mt-1">{lowStockProducts.length}</p>
                    <div className="text-[10px] text-rose-500 font-semibold flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Estoque mínimo atingido</span>
                    </div>
                  </div>
                </div>

                {/* Recharts Area Sales diagrams */}
                <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl space-y-4">
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase tracking-wider">Fluxo de Caixa / Vendas no Período</h3>
                    <p className="text-slate-500 text-[10px] mt-0.5">Visão do faturamento diário consolidado.</p>
                  </div>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', color: '#fff' }} />
                        <Area type="monotone" dataKey="Valor" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Inventory Alerts section */}
                {lowStockProducts.length > 0 && (
                  <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl space-y-3">
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
                      <span>Alerta de Reposição Crítica</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {lowStockProducts.map(p => (
                        <div key={p.id} className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-white font-semibold truncate pr-4">{p.name}</p>
                            <p className="text-slate-500 text-[10px]">Qtd em estoque: <span className="text-rose-500 font-bold">{p.stock} un</span></p>
                          </div>
                          <button
                            onClick={() => adminSaveProduct({ ...p, stock: p.stock + 10 })}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1.5 rounded cursor-pointer transition-colors whitespace-nowrap"
                          >
                            +10 Estoque
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: PRODUCTS TABLE & CRUD */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                {/* Header inside sub tab */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Pesquisar por nome ou marca..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button
                    onClick={() => setEditingProduct({})}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-500/10"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Produto</span>
                  </button>
                </div>

                {/* Edit/Create Form on-screen block if active */}
                {editingProduct && (
                  <form onSubmit={handleProductSubmit} className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-950 pb-3">
                      <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">{editingProduct.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h4>
                      <button type="button" onClick={() => setEditingProduct(null)} className="text-slate-500 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nome:</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ''}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Categoria:</label>
                        <select
                          value={editingProduct.category || 'notebook'}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        >
                          {db.categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Marca:</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.brand || ''}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, brand: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Preço Base (R$):</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price || ''}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Preço Promocional (Opcional):</label>
                        <input
                          type="number"
                          value={editingProduct.promoPrice || ''}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, promoPrice: e.target.value ? Number(e.target.value) : undefined }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estoque:</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.stock || 0}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">URLs de Capa/Imagens (Separados por vírgula):</label>
                      <input
                        type="text"
                        placeholder="Insira as URLs das imagens"
                        value={Array.isArray(editingProduct.images) ? editingProduct.images.join(', ') : editingProduct.images || ''}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, images: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Descrição:</label>
                      <textarea
                        rows={3}
                        value={editingProduct.description || ''}
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-950 pt-4">
                      <label className="flex items-center gap-2 text-slate-300 select-none">
                        <input
                          type="checkbox"
                          checked={!!editingProduct.isFeatured}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="rounded border-slate-800 bg-slate-950 text-red-600"
                        />
                        <span>Destacar na Home</span>
                      </label>
                      <label className="flex items-center gap-2 text-slate-300 select-none">
                        <input
                          type="checkbox"
                          checked={!!editingProduct.isNew}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, isNew: e.target.checked }))}
                          className="rounded border-slate-800 bg-slate-950 text-red-600"
                        />
                        <span>Selo de Lançamento</span>
                      </label>
                    </div>

                    <div className="flex gap-2 justify-end border-t border-slate-950 pt-3">
                      <button type="button" onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white px-3.5 py-1.5 font-bold">Cancelar</button>
                      <button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-1.5 font-bold flex items-center gap-1">
                        <Save className="w-4 h-4" />
                        <span>Salvar Produto</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Table list of products */}
                <div className="overflow-x-auto bg-slate-900/10 border border-slate-900 rounded-2xl">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-extrabold uppercase">
                        <th className="p-4">Produto</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4 text-center">Estoque</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.products
                        .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase()))
                        .map((product) => (
                          <tr key={product.id} className="border-b border-slate-900 hover:bg-slate-900/10 last:border-0">
                            <td className="p-4 flex items-center gap-3">
                              <img src={product.images[0]} alt={product.name} className="w-8 h-8 object-contain rounded bg-slate-950 p-1 border border-slate-900" />
                              <div className="min-w-0">
                                <p className="text-white font-bold truncate max-w-[200px]">{product.name}</p>
                                <p className="text-slate-500 text-[10px]">{product.brand}</p>
                              </div>
                            </td>
                            <td className="p-4 text-slate-400 capitalize">{product.category}</td>
                            <td className="p-4">
                              {product.promoPrice ? (
                                <div className="space-y-0.5">
                                  <p className="text-emerald-400 font-extrabold">R$ {product.promoPrice.toLocaleString('pt-BR')}</p>
                                  <p className="text-slate-500 text-[9px] line-through">R$ {product.price.toLocaleString('pt-BR')}</p>
                                </div>
                              ) : (
                                <p className="text-white font-bold">R$ {product.price.toLocaleString('pt-BR')}</p>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${product.stock <= 3 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-950 text-slate-400'}`}>
                                {product.stock} un
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="text-blue-500 hover:text-blue-400 p-1 bg-slate-950 border border-slate-900 rounded hover:border-slate-850 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => adminDeleteProduct(product.id)}
                                className="text-rose-500 hover:text-rose-400 p-1 bg-slate-950 border border-slate-900 rounded hover:border-slate-850 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 3: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                <div className="relative max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Pesquisar por Código de Pedido..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-4">
                  {db.orders
                    .filter(o => o.id.toLowerCase().includes(orderSearch.toLowerCase()))
                    .map((order) => (
                      <div key={order.id} className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl space-y-4 text-xs">
                        
                        <div className="flex flex-col sm:flex-row justify-between border-b border-slate-950 pb-3 gap-2">
                          <div>
                            <p className="text-white font-black text-sm">{order.id}</p>
                            <p className="text-slate-500 text-[10px]">{order.createdAt} &bull; Transação: <span className="text-slate-400 font-semibold">{order.paymentDetails.transactionCode}</span></p>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-extrabold text-sm block">R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">{order.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Order info list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                          <div className="space-y-1.5">
                            <p className="text-slate-500 font-bold uppercase text-[9px]">Endereço do Cliente:</p>
                            <p className="text-slate-300 font-semibold">{order.shippingAddress.label}</p>
                            <p className="text-slate-400">{order.shippingAddress.street}, nº {order.shippingAddress.number} &bull; {order.shippingAddress.city}</p>
                          </div>
                          
                          {/* Log note text fields */}
                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Nota de atualização interna:</label>
                            <input
                              type="text"
                              placeholder="Adicione observações para o cliente..."
                              onChange={(e) => setOrderLogNote(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* Status changers */}
                        <div className="flex flex-wrap gap-2 items-center justify-between border-t border-slate-950/60 pt-3">
                          <div className="flex gap-2">
                            {['preparing', 'shipped', 'delivered', 'cancelled'].map((st) => {
                              const labels = { preparing: 'Separar', shipped: 'Enviar', delivered: 'Entregar', cancelled: 'Cancelar' }[st];
                              return (
                                <button
                                  key={st}
                                  onClick={() => handleOrderStatusUpdate(order.id, st as Order['status'])}
                                  className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-[11px] font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                                >
                                  {labels}
                                </button>
                              );
                            })}
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                            order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            Status Atual: {order.status}
                          </span>
                        </div>

                      </div>
                    ))}
                </div>

              </div>
            )}

            {/* TAB 4: CUSTOMERS CRM */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                
                <div className="relative max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Pesquisar cliente por nome ou email..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="overflow-x-auto bg-slate-900/10 border border-slate-900 rounded-2xl text-xs text-left">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 font-extrabold uppercase">
                        <th className="p-4">Cliente</th>
                        <th className="p-4">E-mail</th>
                        <th className="p-4 text-center">Pedidos</th>
                        <th className="p-4 text-right">Cadastrado em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.users
                        .filter(u => u.name.toLowerCase().includes(customerSearch.toLowerCase()) || u.email.toLowerCase().includes(customerSearch.toLowerCase()))
                        .map((user) => {
                          const orderCount = db.orders.filter(o => o.userId === user.id).length;
                          return (
                            <tr key={user.id} className="border-b border-slate-900 hover:bg-slate-900/10 last:border-0">
                              <td className="p-4 flex items-center gap-3">
                                <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold">
                                  {user.name.slice(0,2).toUpperCase()}
                                </div>
                                <span className="text-white font-bold">{user.name}</span>
                              </td>
                              <td className="p-4 text-slate-400">{user.email}</td>
                              <td className="p-4 text-center">
                                <span className="bg-slate-950 border border-slate-900 rounded px-2 py-0.5 text-[10px] font-bold text-slate-400">
                                  {orderCount} ped
                                </span>
                              </td>
                              <td className="p-4 text-right text-slate-500 font-medium">{user.createdAt}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* TAB 5: COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                
                {/* Coupon Create widget button */}
                <div className="text-right">
                  <button
                    onClick={() => setEditingCoupon({})}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Cupom</span>
                  </button>
                </div>

                {/* Coupon Editor widget form */}
                {editingCoupon && (
                  <form onSubmit={handleCouponSubmit} className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-950 pb-3">
                      <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Adicionar/Editar Cupom</h4>
                      <button type="button" onClick={() => setEditingCoupon(null)} className="text-slate-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Código:</label>
                        <input
                          type="text"
                          required
                          placeholder="EX: TECH10"
                          value={editingCoupon.code || ''}
                          onChange={(e) => setEditingCoupon(prev => ({ ...prev, code: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white uppercase"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Tipo de Desconto:</label>
                        <select
                          value={editingCoupon.type || 'percent'}
                          onChange={(e) => setEditingCoupon(prev => ({ ...prev, type: e.target.value as Coupon['type'] }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        >
                          <option value="percent">Porcentagem (%)</option>
                          <option value="fixed">Valor Fixo (R$)</option>
                          <option value="free_shipping">Frete Grátis</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Valor do Desconto:</label>
                        <input
                          type="number"
                          value={editingCoupon.value || 0}
                          onChange={(e) => setEditingCoupon(prev => ({ ...prev, value: Number(e.target.value) }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Compra Mínima (R$):</label>
                        <input
                          type="number"
                          value={editingCoupon.minPurchase || 0}
                          onChange={(e) => setEditingCoupon(prev => ({ ...prev, minPurchase: Number(e.target.value) }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end border-t border-slate-950 pt-3">
                      <button type="button" onClick={() => setEditingCoupon(null)} className="text-slate-400 hover:text-white px-3.5 py-1.5 font-bold">Cancelar</button>
                      <button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-1.5 font-bold">Salvar Cupom</button>
                    </div>
                  </form>
                )}

                {/* List of active coupons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left">
                  {db.coupons.map((coupon) => (
                    <div key={coupon.code} className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl relative flex flex-col justify-between">
                      <div>
                        <p className="text-white font-extrabold text-sm uppercase tracking-wide mb-1.5">{coupon.code}</p>
                        <p className="text-slate-400 font-medium">
                          Tipo: {coupon.type === 'percent' ? 'Porcentagem' : coupon.type === 'fixed' ? 'Fixo' : 'Frete Grátis'}
                        </p>
                        <p className="text-slate-400 font-medium">Desconto: {coupon.type === 'percent' ? `${coupon.value}%` : coupon.type === 'fixed' ? `R$ ${coupon.value.toFixed(2)}` : 'Sim'}</p>
                        <p className="text-slate-500 text-[10px] mt-1">Compra mínima: R$ {coupon.minPurchase.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => adminDeleteCoupon(coupon.code)}
                        className="text-rose-500 hover:text-rose-400 font-bold mt-4 self-end flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir Cupom</span>
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 6: BLOG ARTICLES MANAGEMENT */}
            {activeTab === 'blog' && (
              <div className="space-y-6">
                
                <div className="text-right">
                  <button
                    onClick={() => setEditingPost({})}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Artigo</span>
                  </button>
                </div>

                {editingPost && (
                  <form onSubmit={handlePostSubmit} className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-950 pb-3">
                      <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Adicionar/Editar Post do Blog</h4>
                      <button type="button" onClick={() => setEditingPost(null)} className="text-slate-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Título:</label>
                        <input
                          type="text"
                          required
                          value={editingPost.title || ''}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Categoria:</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Hardware"
                          value={editingPost.category || ''}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Resumo (Excerpt):</label>
                      <input
                        type="text"
                        required
                        value={editingPost.excerpt || ''}
                        onChange={(e) => setEditingPost(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Conteúdo do Artigo:</label>
                      <textarea
                        rows={6}
                        required
                        value={editingPost.content || ''}
                        onChange={(e) => setEditingPost(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">URL da Imagem de Capa:</label>
                        <input
                          type="text"
                          value={editingPost.image || ''}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Tempo de Leitura:</label>
                        <input
                          type="text"
                          placeholder="Ex: 5 min de leitura"
                          value={editingPost.readTime || ''}
                          onChange={(e) => setEditingPost(prev => ({ ...prev, readTime: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end border-t border-slate-950 pt-3">
                      <button type="button" onClick={() => setEditingPost(null)} className="text-slate-400 hover:text-white px-3.5 py-1.5 font-bold">Cancelar</button>
                      <button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-1.5 font-bold">Salvar Artigo</button>
                    </div>
                  </form>
                )}

                {/* List of Blog Posts */}
                <div className="grid grid-cols-1 gap-4 text-xs text-left">
                  {db.blogPosts.map((post) => (
                    <div key={post.id} className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={post.image} alt={post.title} className="w-12 h-12 object-cover rounded-xl bg-slate-950 border border-slate-900 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white font-extrabold truncate">{post.title}</p>
                          <p className="text-slate-500 text-[10px] mt-0.5">{post.category} &bull; {post.date} &bull; {post.readTime}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="text-blue-500 hover:text-blue-400 p-1.5 bg-slate-950 border border-slate-900 rounded cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => adminDeletePost(post.id)}
                          className="text-rose-500 hover:text-rose-400 p-1.5 bg-slate-950 border border-slate-900 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
