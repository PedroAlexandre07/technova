import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingCart, User, Heart, LayoutDashboard, Menu, X, LogOut, Moon, Sun, Laptop, ShieldCheck, Ticket } from 'lucide-react';

export default function Header() {
  const {
    currentUser,
    cart,
    wishlist,
    navigate,
    db,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter products based on search for autocomplete suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const filtered = db.products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, db.products]);

  // Click outside listener for suggestions drop-down
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      navigate('search-results');
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setSearchFocused(false);
    navigate('product-detail', { productId });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      {/* Elegant Dark Top Bar */}
      <div className="w-full bg-[#111111] border-b border-white/5 px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-[11px] uppercase tracking-widest text-gray-400 font-medium">
        <span>FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 500</span>
        <div className="flex gap-4 sm:gap-6 mt-1.5 sm:mt-0">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('client-area')}>SUPORTE 24H</span>
          <span className="text-[#0066ff] hover:text-blue-400 font-bold cursor-pointer transition-colors" onClick={() => navigate('admin')}>DASHBOARD ADM</span>
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('client-area')}>RASTREAR PEDIDO</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tighter uppercase">
              TECH<span className="text-[#0066ff]">NOVA</span><span className="text-blue-400 text-[10px] align-top ml-1 font-semibold">STORE</span>
            </h1>
          </div>

          {/* Search bar Desktop */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Buscar notebooks, celulares, pc gamer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full bg-white/5 border border-white/10 focus:border-[#0066ff] rounded-full py-2.5 pl-5 pr-11 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0066ff] transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Suggestions dropdown */}
            {searchFocused && (searchQuery.length >= 2 || suggestions.length > 0) && (
              <div className="absolute top-full left-0 w-full mt-2 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden">
                {suggestions.length > 0 ? (
                  <div>
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Produtos sugeridos</div>
                    {suggestions.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSuggestionClick(p.id)}
                        className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-zinc-900" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-100 truncate">{p.name}</p>
                          <p className="text-xs font-bold text-[#0066ff]">R$ {(p.promoPrice || p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-400">Nenhum resultado encontrado para "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Nav Right Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Quick Links */}
            <nav className="flex items-center gap-6 text-xs tracking-wider uppercase font-semibold text-slate-300">
              <span className="hover:text-[#0066ff] cursor-pointer transition-colors" onClick={() => navigate('home')}>HOME</span>
              <span className="hover:text-[#0066ff] cursor-pointer transition-colors" onClick={() => { navigate('category'); setSearchQuery(''); }}>HARDWARE</span>
              <span className="hover:text-[#0066ff] cursor-pointer transition-colors" onClick={() => { navigate('category'); setSearchQuery(''); }}>OFERTAS</span>
              <span className="hover:text-[#0066ff] cursor-pointer transition-colors" onClick={() => navigate('blog')}>BLOG</span>
            </nav>

            <span className="h-6 w-[1px] bg-white/10" />

            {/* Wishlist */}
            <button
              onClick={() => navigate('client-area')}
              className="relative p-2 bg-white/5 rounded-lg border border-white/10 text-slate-300 hover:text-[#0066ff] hover:border-[#0066ff]/40 transition-all cursor-pointer"
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('cart')}
              className="relative p-2 bg-[#0066ff] rounded-lg accent-glow text-white hover:bg-blue-600 transition-all cursor-pointer"
              title="Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[#0066ff] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Admin Portal */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('client-area')}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2 cursor-pointer text-slate-200 hover:text-white transition-all"
                  >
                    <User className="w-4 h-4 text-[#0066ff]" />
                    <span className="text-xs font-semibold max-w-[100px] truncate uppercase tracking-wider">{currentUser.name.split(' ')[0]}</span>
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => navigate('admin')}
                      className="bg-[#0066ff]/10 border border-[#0066ff]/30 hover:bg-[#0066ff]/20 rounded-lg p-2 text-blue-400 cursor-pointer transition-all"
                      title="Painel Admin"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('client-area')}
                  className="flex items-center gap-2 bg-[#0066ff] hover:bg-blue-600 text-white rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-wider accent-glow cursor-pointer transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>LOGIN</span>
                </button>
              )}
            </div>
          </div>

          {/* Burger menu Mobile */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => navigate('cart')}
              className="relative p-2 bg-white/5 rounded-lg border border-white/10 text-slate-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#0066ff] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-4 shadow-2xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#0066ff] rounded-xl py-2 pl-4 pr-10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('home'); }}
              className="text-left py-2.5 px-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs tracking-wider uppercase"
            >
              HOME
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('category'); }}
              className="text-left py-2.5 px-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs tracking-wider uppercase"
            >
              HARDWARE
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('blog'); }}
              className="text-left py-2.5 px-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs tracking-wider uppercase"
            >
              BLOG
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigate('client-area'); }}
              className="text-left py-2.5 px-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs tracking-wider uppercase flex items-center justify-between"
            >
              <span>FAVORITOS</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </button>
          </nav>

          <span className="block h-[1px] bg-white/10 w-full" />

          {/* Mobile Auth actions */}
          <div className="flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#0066ff]/10 border border-[#0066ff]/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 leading-none">{currentUser.email}</p>
                  </div>
                </div>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('admin'); }}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-blue-400 rounded-xl py-2.5 text-sm font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Painel Administrativo</span>
                  </button>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('client-area'); }}
                  className="w-full flex items-center justify-center gap-2 bg-[#0066ff] text-white rounded-xl py-2.5 text-sm font-medium transition-colors accent-glow"
                >
                  <User className="w-4 h-4" />
                  <span>Minha Conta</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('client-area'); }}
                className="w-full bg-[#0066ff] hover:bg-blue-600 text-white rounded-xl py-2.5 text-center text-sm font-bold uppercase tracking-wider accent-glow"
              >
                Fazer Login / Cadastrar
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
