import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Review, Question } from '../types';
import ProductCard from '../components/ProductCard';
import { Star, Heart, ShoppingCart, Shield, Truck, Calendar, Sparkles, Send, ArrowLeft, Check, Copy, Share2, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductDetailPage() {
  const {
    currentNav,
    db,
    addToCart,
    toggleWishlist,
    wishlist,
    navigate,
    currentUser,
    adminAddProductReview,
    adminAddProductQuestion,
    calculateShipping,
  } = useStore();

  const productId = currentNav.productId;
  const product = db.products.find(p => p.id === productId);

  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'questions'>('desc');
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<{ [key: string]: string }>({});
  
  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Question form state
  const [questionText, setQuestionText] = useState('');
  const [questionSuccess, setQuestionSuccess] = useState(false);

  // Quick Shipping states
  const [quickZip, setQuickZip] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);

  // Share indicator state
  const [copiedLink, setCopiedLink] = useState(false);

  // Mouse move zoom state
  const [zoomStyle, setZoomStyle] = useState({ backgroundImage: '', backgroundPosition: '0% 0%' });

  useEffect(() => {
    // Reset state when product changes
    setSelectedImgIdx(0);
    setQuantity(1);
    setReviewSuccess(false);
    setQuestionSuccess(false);
    setShippingOptions([]);
    setQuickZip('');
    
    if (product) {
      // Default to first variations
      const defaultVars: { [key: string]: string } = {};
      if (product.variations) {
        product.variations.forEach(v => {
          defaultVars[v.name] = v.options[0];
        });
      }
      setSelectedVariations(defaultVars);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <p>Produto não encontrado.</p>
        <button onClick={() => navigate('home')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-all">
          Voltar para Home
        </button>
      </div>
    );
  }

  const isFav = wishlist.includes(product.id);
  const currentPrice = product.promoPrice || product.price;
  const hasDiscount = !!product.promoPrice && product.promoPrice < product.price;
  const discountPct = hasDiscount ? Math.round(((product.price - product.promoPrice!) / product.price) * 100) : 0;

  // Handle zooming effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${product.images[selectedImgIdx]})`,
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToCart = (buyNow = false) => {
    addToCart(product, quantity, selectedVariations);
    if (buyNow) {
      navigate('cart');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const author = reviewName.trim() || currentUser?.name || 'Cliente';
    if (reviewComment.trim()) {
      adminAddProductReview(product.id, author, reviewRating, reviewComment.trim());
      setReviewComment('');
      setReviewRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questionText.trim()) {
      adminAddProductQuestion(product.id, questionText.trim());
      setQuestionText('');
      setQuestionSuccess(true);
      setTimeout(() => setQuestionSuccess(false), 4000);
    }
  };

  const handleQuickShippingCalc = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickZip.replace(/\D/g, '').length >= 8) {
      const options = calculateShipping(quickZip);
      setShippingOptions(options);
    }
  };

  // Filter related products (same category, different id)
  const relatedProducts = db.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#0a0a0a] text-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8 font-medium">
          <span onClick={() => navigate('home')} className="hover:text-[#0066ff] cursor-pointer transition-colors">Início</span>
          <span>/</span>
          <span onClick={() => navigate('category', { categoryId: product.category })} className="hover:text-[#0066ff] cursor-pointer transition-colors capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Core Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
          
          {/* LEFT: Image Gallery with Zoom */}
          <div className="space-y-4">
            {/* Large Image Showcase with Magnifier Zoom effect */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({ backgroundImage: '', backgroundPosition: '0% 0%' })}
              className="aspect-square w-full rounded-2xl border border-white/5 bg-glass flex items-center justify-center p-6 relative overflow-hidden group cursor-zoom-in"
            >
              <img
                src={product.images[selectedImgIdx]}
                alt={product.name}
                className={`max-h-full max-w-full object-contain transition-opacity duration-200 ${zoomStyle.backgroundImage ? 'opacity-0' : 'opacity-100'}`}
              />

              {/* Zoom overlay render */}
              {zoomStyle.backgroundImage && (
                <div
                  className="absolute inset-0 bg-no-repeat bg-zinc-950"
                  style={{
                    backgroundImage: zoomStyle.backgroundImage,
                    backgroundPosition: zoomStyle.backgroundPosition,
                    backgroundSize: '200%'
                  }}
                />
              )}

              {/* Magnifier Tip Badge */}
              <div className="absolute bottom-4 right-4 bg-zinc-950/90 border border-white/10 text-slate-400 text-[10px] px-2.5 py-1 rounded-md pointer-events-none uppercase tracking-wider font-semibold">
                Passe o mouse para ampliar zoom
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-20 h-20 rounded-xl border p-2 bg-white/5 flex items-center justify-center cursor-pointer transition-all ${idx === selectedImgIdx ? 'border-[#0066ff] ring-2 ring-[#0066ff]/10' : 'border-white/10 hover:border-white/20'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Main Details panel */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400 font-bold text-[10px] uppercase tracking-wider bg-[#0066ff]/10 border border-[#0066ff]/20 px-2.5 py-0.5 rounded">
                  {product.brand}
                </span>
                <span className="text-slate-500 text-xs font-semibold">Modelo: {product.model}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {/* Star Rating & QA counters */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-800'}`} />
                    ))}
                  </div>
                  <span>({product.rating})</span>
                </div>
                <span className="text-slate-800">|</span>
                <span onClick={() => { setActiveTab('reviews'); const el = document.getElementById('details-tabs'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-[#0066ff] hover:underline cursor-pointer">
                  {product.reviews.length} Avaliações de clientes
                </span>
                <span className="text-slate-800">|</span>
                <span onClick={() => { setActiveTab('questions'); const el = document.getElementById('details-tabs'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="text-slate-400 hover:text-white cursor-pointer">
                  {product.questions.length} Dúvidas respondidas
                </span>
              </div>
            </div>

            {/* Price section */}
            <div className="bg-glass border border-white/5 p-5 rounded-2xl space-y-3">
              <div className="flex items-baseline gap-3">
                {hasDiscount && (
                  <span className="text-slate-500 text-xs sm:text-sm line-through">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                    {discountPct}% OFF
                  </span>
                )}
              </div>
              <div>
                <p className="text-[#0066ff] text-2xl sm:text-3xl font-bold tracking-tight leading-none">
                  R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  À vista com <span className="text-[#0066ff] font-bold">10% de desconto adicional</span> no PIX ou Boleto por <span className="text-slate-200 font-semibold">R$ {(currentPrice * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>
              <div className="border-t border-white/5 pt-3">
                <p className="text-xs text-slate-300 font-medium">
                  💳 Ou em até <span className="text-white font-bold">10x de R$ {(currentPrice / 10).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> sem juros em todos os cartões.
                </p>
              </div>
            </div>

            {/* Variations Selection */}
            {product.variations && product.variations.length > 0 && (
              <div className="space-y-4">
                {product.variations.map((v) => (
                  <div key={v.name} className="space-y-2">
                    <span className="text-xs text-slate-450 font-bold uppercase tracking-wider">{v.name}:</span>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedVariations(prev => ({ ...prev, [v.name]: opt }))}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-300 ${selectedVariations[v.name] === opt ? 'bg-[#0066ff]/10 border-[#0066ff] text-blue-400 ring-1 ring-[#0066ff]/25' : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock status indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-xs font-semibold text-slate-300">
                {product.stock > 0 ? `Estoque Disponível (${product.stock} unidades prontas para envio)` : 'Fora de estoque temporariamente'}
              </span>
            </div>

            {/* Quantity Selector & Buy buttons */}
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Qty incrementer */}
                <div className="flex items-center border border-white/10 bg-zinc-950/80 rounded-xl p-1 w-full sm:w-max justify-between gap-4">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-white w-6 text-center">{quantity}</span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 w-full bg-glass border border-white/10 hover:border-[#0066ff] hover:bg-[#0066ff]/5 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Adicionar ao Carrinho</span>
                </button>

                {/* Buy now Button */}
                <button
                  onClick={() => handleAddToCart(true)}
                  className="flex-1 w-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#0066ff]/20 accent-glow"
                >
                  Comprar Agora
                </button>
              </div>
            ) : null}

            {/* Quick Actions (Share / Wishlist) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-1.5 hover:text-rose-500 cursor-pointer transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</span>
              </button>
              <span className="text-slate-800">|</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'Link Copiado!' : 'Compartilhar Produto'}</span>
              </button>
            </div>

            {/* Warranty & shipping indicators */}
            <div className="border-t border-white/5 pt-6 space-y-3.5">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#0066ff] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-xs font-bold">Garantia Oficial do Fabricante</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">Este produto possui garantia estendida de <span className="text-slate-200 font-bold">{product.warranty}</span> contra defeitos de fabricação direto com o fabricante.</p>
                </div>
              </div>

              {/* Quick CEP calculation form */}
              <div className="flex items-start gap-3 border-t border-white/5 pt-4">
                <Truck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-white text-xs font-bold">Calcular Frete e Prazo</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">Insira o seu CEP para simular as modalidades de entrega em tempo real.</p>
                  </div>
                  
                  <form onSubmit={handleQuickShippingCalc} className="flex gap-2 max-w-xs">
                    <input
                      type="text"
                      placeholder="01310-100"
                      value={quickZip}
                      onChange={(e) => setQuickZip(e.target.value)}
                      className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0066ff] w-32"
                    />
                    <button
                      type="submit"
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300"
                    >
                      Calcular
                    </button>
                  </form>

                  {shippingOptions.length > 0 && (
                    <div className="bg-zinc-950 border border-white/10 rounded-xl p-3 space-y-2 max-w-sm">
                      {shippingOptions.map((opt) => (
                        <div key={opt.id} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                          <div>
                            <p className="text-white font-medium">{opt.name}</p>
                            <p className="text-slate-500 text-[10px]">Prazo: {opt.days} {opt.days === 1 ? 'dia útil' : 'dias úteis'}</p>
                          </div>
                          <p className="text-blue-400 font-bold">{opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2)}`}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Tabs Section */}
        <div id="details-tabs" className="mb-16 border border-white/5 rounded-2xl overflow-hidden bg-glass">
          {/* Tab buttons bar */}
          <div className="flex border-b border-white/10 bg-zinc-950/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap cursor-pointer transition-all duration-300 ${activeTab === 'desc' ? 'border-[#0066ff] text-[#0066ff] bg-white/5' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              Descrição Geral
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap cursor-pointer transition-all duration-300 ${activeTab === 'specs' ? 'border-[#0066ff] text-[#0066ff] bg-white/5' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              Ficha Técnica
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap cursor-pointer transition-all duration-300 ${activeTab === 'reviews' ? 'border-[#0066ff] text-[#0066ff] bg-white/5' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              Avaliações ({product.reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap cursor-pointer transition-all duration-300 ${activeTab === 'questions' ? 'border-[#0066ff] text-[#0066ff] bg-white/5' : 'border-transparent text-slate-400 hover:text-white'}`}
            >
              Perguntas e Respostas ({product.questions.length})
            </button>
          </div>

          {/* Tab panel displays */}
          <div className="p-6 sm:p-8">
            
            {/* DESC PANEL */}
            {activeTab === 'desc' && (
              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="bg-glass border border-white/5 p-5 rounded-xl">
                    <h4 className="text-[#0066ff] font-bold text-xs mb-2 uppercase tracking-wider">Design Premium</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">Construído meticulosamente com ligas de altíssima resistência mecânica e acabamento nano-texturizado sofisticado que evita marcas de impressões digitais.</p>
                  </div>
                  <div className="bg-glass border border-white/5 p-5 rounded-xl">
                    <h4 className="text-[#0066ff] font-bold text-xs mb-2 uppercase tracking-wider">Desempenho Sem Gargalos</h4>
                    <p className="text-[11px] text-slate-400 leading-normal">Arquitetura eletrônica inteligente otimizada para manter temperaturas sob controle absoluto mesmo em cargas de trabalho ininterruptas extremas.</p>
                  </div>
                </div>
              </div>
            )}

            {/* SPECS PANEL */}
            {activeTab === 'specs' && (
              <div className="overflow-hidden border border-white/10 rounded-xl bg-zinc-950/40">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}>
                        <td className="px-5 py-3 font-bold text-slate-400 border-r border-white/10 w-1/3 uppercase tracking-wider text-[10px]">{key}</td>
                        <td className="px-5 py-3 font-semibold text-slate-200">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* REVIEWS PANEL */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                
                {/* List past reviews */}
                <div className="space-y-6">
                  {product.reviews.length > 0 ? (
                    product.reviews.map((r) => (
                      <div key={r.id} className="border-b border-white/5 pb-5 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{r.userName}</span>
                            <span className="text-slate-500 text-[10px]">{r.date}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-slate-800'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed italic">"{r.comment}"</p>
                        
                        {/* Admin answers to customer review */}
                        {r.adminReply && (
                          <div className="mt-3 ml-6 bg-[#0066ff]/5 border-l-2 border-[#0066ff] p-4 rounded-r-xl">
                            <p className="text-[#0066ff] font-bold text-[10px] uppercase tracking-wider mb-1">Resposta da TechNova Store</p>
                            <p className="text-slate-400 text-xs leading-relaxed">"{r.adminReply}"</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic">Nenhuma avaliação cadastrada para este produto ainda. Seja o primeiro a opinar!</p>
                  )}
                </div>

                {/* Submission Form */}
                <div className="border-t border-white/10 pt-8 max-w-xl">
                  <h4 className="text-white font-bold text-sm mb-4">Deixe sua Avaliação</h4>
                  
                  {reviewSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 flex items-center gap-2 text-xs font-semibold">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span>Avaliação enviada com sucesso! Ela foi integrada ao sistema e já está disponível para visualização.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seu Nome / Apelido:</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: João da Silva"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]/20"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sua Nota (Estrelas):</label>
                          <select
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0066ff] cursor-pointer"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (Excelente)</option>
                            <option value={4}>⭐⭐⭐⭐ (Muito bom)</option>
                            <option value={3}>⭐⭐⭐ (Regular)</option>
                            <option value={2}>⭐⭐ (Fraco)</option>
                            <option value={1}>⭐ (Muito Ruim)</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seu comentário:</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Fale sobre o acabamento, desempenho, o que achou..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0066ff] resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-md shadow-[#0066ff]/10 accent-glow"
                      >
                        <span>Enviar Avaliação</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )}

            {/* QUESTIONS PANEL */}
            {activeTab === 'questions' && (
              <div className="space-y-8">
                
                {/* List past Q&A */}
                <div className="space-y-6">
                  {product.questions.length > 0 ? (
                    product.questions.map((q) => (
                      <div key={q.id} className="border-b border-white/5 pb-5 last:border-0 last:pb-0 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-white text-xs font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/10 text-[10px]">DÚVIDA</span>
                            <span className="font-semibold text-slate-200 text-xs">{q.userName}</span>
                            <span className="text-slate-500 text-[10px]">{q.date}</span>
                          </div>
                          <p className="text-slate-300 text-xs font-medium pl-1 leading-relaxed">"{q.text}"</p>
                        </div>
                        
                        {q.answer ? (
                          <div className="bg-glass border border-white/5 p-4 rounded-xl ml-4">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[#0066ff] text-xs font-bold bg-[#0066ff]/10 border border-[#0066ff]/20 px-2 py-0.5 rounded-md text-[10px]">SUPORTE</span>
                              <span className="font-bold text-slate-300 text-xs">Resposta da TechNova</span>
                              <span className="text-slate-500 text-[10px]">{q.answerDate || q.date}</span>
                            </div>
                            <p className="text-slate-400 text-xs pl-1 leading-relaxed">"{q.answer}"</p>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-[10px] italic pl-5">Nossa equipe responderá esta dúvida em instantes.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic">Nenhuma pergunta para este produto ainda. Faça uma pergunta abaixo!</p>
                  )}
                </div>

                {/* Ask a Question Form */}
                <div className="border-t border-white/10 pt-8 max-w-xl">
                  <h4 className="text-white font-bold text-sm mb-4">Tem alguma dúvida sobre este produto?</h4>
                  
                  {questionSuccess ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl px-4 py-3 flex items-center gap-2 text-xs font-semibold">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span>Sua dúvida foi enviada! Nossa equipe técnica responderá ela no painel em no máximo 1 hora.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleQuestionSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <textarea
                          required
                          rows={3}
                          placeholder="Pergunte sobre conexões, dimensões, consumo de energia..."
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#0066ff] resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-md shadow-[#0066ff]/10 accent-glow"
                      >
                        <span>Enviar Pergunta</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Related Products carousel/grid */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/5 pt-16">
            <h3 className="text-white font-bold text-lg uppercase tracking-tight mb-8">Produtos Relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
