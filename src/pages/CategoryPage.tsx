import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ArrowUpDown, ChevronDown, Check, RotateCcw, X, Grid, Star, LayoutList } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CategoryPage() {
  const { db, currentNav, navigate, searchQuery, setSearchQuery } = useStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 30000 });
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyPromo, setOnlyPromo] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('featured');

  // Load category filter from nav parameter if set
  useEffect(() => {
    if (currentNav.categoryId) {
      setSelectedCat(currentNav.categoryId);
    } else if (currentNav.page === 'search-results') {
      // Keep category as all, search query is central
    } else {
      setSelectedCat('all');
    }
  }, [currentNav]);

  const handleResetFilters = () => {
    setSelectedCat('all');
    setSelectedBrand('all');
    setPriceRange({ min: 0, max: 30000 });
    setMinRating(0);
    setOnlyInStock(false);
    setOnlyPromo(false);
    setSortOption('featured');
    setSearchQuery('');
  };

  // Perform client side filtering & sorting
  const filteredProducts = db.products.filter(product => {
    // Search query filter (matches name, brand, category, subcategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(q) || 
                            product.brand.toLowerCase().includes(q) ||
                            product.category.toLowerCase().includes(q) ||
                            (product.subcategory && product.subcategory.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCat !== 'all' && product.category !== selectedCat) {
      return false;
    }

    // Brand filter
    if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
      return false;
    }

    // Price range filter
    const activePrice = product.promoPrice || product.price;
    if (activePrice < priceRange.min || activePrice > priceRange.max) {
      return false;
    }

    // Rating filter
    if (product.rating < minRating) {
      return false;
    }

    // Stock availability filter
    if (onlyInStock && product.stock <= 0) {
      return false;
    }

    // Promo filter
    if (onlyPromo && !product.promoPrice) {
      return false;
    }

    return true;
  });

  // Sort filtered list
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.promoPrice || a.price;
    const bPrice = b.promoPrice || b.price;

    switch (sortOption) {
      case 'price-asc':
        return aPrice - bPrice;
      case 'price-desc':
        return bPrice - aPrice;
      case 'rating':
        return b.rating - a.rating;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  return (
    <div className="bg-[#0a0a0a] text-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title / Search Context indicator */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
            {searchQuery ? `Resultados para: "${searchQuery}"` : 'Catálogo de Produtos'}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Exibindo <span className="text-[#0066ff] font-bold">{sortedProducts.length}</span> produtos encontrados
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* DESKTOP SIDEBAR FILTERS (Hidden on Mobile) */}
          <aside className="hidden lg:block space-y-6 bg-glass border border-white/5 p-5 rounded-2xl sticky top-24">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0066ff]" />
                <span>Filtros Avançados</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-slate-400 hover:text-rose-400 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar</span>
              </button>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Categorias</h4>
              <div className="flex flex-col gap-1 text-xs text-slate-300">
                <button
                  onClick={() => setSelectedCat('all')}
                  className={`text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${selectedCat === 'all' ? 'bg-[#0066ff]/10 text-blue-400 font-bold' : 'hover:bg-white/5 text-slate-400'}`}
                >
                  <span>Todas</span>
                </button>
                {db.categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className={`text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${selectedCat === c.id ? 'bg-[#0066ff]/10 text-blue-400 font-bold' : 'hover:bg-white/5 text-slate-400'}`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold">({db.products.filter(p => p.category === c.id).length})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Marcas</h4>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none focus:border-[#0066ff] cursor-pointer"
              >
                <option value="all">Todas as marcas</option>
                {db.brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Inputs */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Preço (R$)</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500">Mín:</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#0066ff]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500">Máx:</span>
                  <input
                    type="number"
                    placeholder="30000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(0, parseInt(e.target.value) || 30000) }))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#0066ff]"
                  />
                </div>
              </div>
            </div>

            {/* Rating stars filter */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">Avaliação Mínima</h4>
              <div className="flex flex-col gap-1 text-xs">
                {[0, 4, 4.5, 4.8].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`text-left py-1.5 px-2.5 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${minRating === stars ? 'bg-[#0066ff]/10 text-blue-400 font-bold' : 'hover:bg-white/5 text-slate-300'}`}
                  >
                    <span>{stars === 0 ? 'Qualquer nota' : `${stars}★ ou mais`}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle checkboxes (In stock / Promo) */}
            <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-semibold">
              <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer py-1 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-white/10 bg-zinc-950 text-[#0066ff] focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span>Apenas em estoque</span>
              </label>
              <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer py-1 select-none">
                <input
                  type="checkbox"
                  checked={onlyPromo}
                  onChange={(e) => setOnlyPromo(e.target.checked)}
                  className="rounded border-white/10 bg-zinc-950 text-[#0066ff] focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span>Apenas ofertas em promoção</span>
              </label>
            </div>

          </aside>

          {/* MAIN RESULTS DISPLAY */}
          <section className="lg:col-span-3 space-y-6">
            
            {/* Toolbar: mobile toggler, sorter */}
            <div className="bg-glass border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4">
              
              {/* Mobile filter trigger button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden bg-zinc-950 border border-white/10 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#0066ff]" />
                <span>Filtrar</span>
              </button>

              {/* Quick display style indicator (Desktop only) */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-450 font-semibold uppercase tracking-wider">
                <span className="font-bold">Ordenar por:</span>
              </div>

              {/* Sorting options select */}
              <div className="flex items-center gap-2 relative w-full sm:w-60">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-[#0066ff] cursor-pointer appearance-none"
                >
                  <option value="featured">🔥 Recomendados</option>
                  <option value="newest">✨ Novidades</option>
                  <option value="rating">⭐️ Melhor Avaliados</option>
                  <option value="price-asc">📈 Menor Preço</option>
                  <option value="price-desc">📉 Maior Preço</option>
                  <option value="name-asc">🔤 Alfabética (A-Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 pointer-events-none" />
              </div>

            </div>

            {/* Grid of Product Cards */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-glass border border-white/5 rounded-3xl p-16 text-center text-slate-500">
                <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-sm font-semibold">Nenhum produto atende a estes critérios de filtragem.</p>
                <p className="text-xs text-slate-600 mt-1">Tente afrouxar os preços ou redefinir suas pesquisas.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 bg-zinc-950 border border-white/10 hover:border-[#0066ff] hover:text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}

          </section>

        </div>

      </div>

      {/* MOBILE FILTERS SHEET MODAL (Bottom drawer on mobile) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet drawer content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 w-full bg-zinc-950 border-t border-white/10 rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0066ff]" />
                  <span>Filtros</span>
                </h3>
                <div className="flex items-center gap-4">
                  <button onClick={handleResetFilters} className="text-rose-400 text-xs font-bold">Limpar</button>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 p-1 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mobile categories list */}
              <div className="space-y-2">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Categorias</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setSelectedCat('all')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${selectedCat === 'all' ? 'bg-[#0066ff]/10 border-[#0066ff] text-blue-400' : 'bg-white/5 border-white/5 text-slate-300'}`}
                  >
                    Todas
                  </button>
                  {db.categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCat(c.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${selectedCat === c.id ? 'bg-[#0066ff]/10 border-[#0066ff] text-blue-400' : 'bg-white/5 border-white/5 text-slate-300'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Brand */}
              <div className="space-y-2">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Marcas</h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">Todas as marcas</option>
                  {db.brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2">
                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Preço (R$)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.max(0, parseInt(e.target.value) || 0) }))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(0, parseInt(e.target.value) || 30000) }))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Mobile Stock toggles */}
              <div className="space-y-3 pt-2 text-xs">
                <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded border-white/10 bg-zinc-950 text-[#0066ff] focus:ring-0 w-4 h-4"
                  />
                  <span>Apenas em estoque</span>
                </label>
                <label className="flex items-center gap-2.5 text-slate-300 hover:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyPromo}
                    onChange={(e) => setOnlyPromo(e.target.checked)}
                    className="rounded border-white/10 bg-zinc-950 text-[#0066ff] focus:ring-0 w-4 h-4"
                  />
                  <span>Apenas ofertas em promoção</span>
                </label>
              </div>

              {/* Mobile CTA Apply */}
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider accent-glow"
              >
                Aplicar Filtros ({sortedProducts.length})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
