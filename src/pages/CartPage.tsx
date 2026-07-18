import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Ticket, Truck, AlertCircle } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    calculateShipping,
    selectShipping,
    shippingInfo,
    navigate
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [zipInput, setZipInput] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [zipError, setZipError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.product.promoPrice || item.product.price) * item.quantity, 0);
  
  // Calculate coupon discount
  let discount = 0;
  if (activeCoupon) {
    if (activeCoupon.type === 'percent') {
      discount = subtotal * (activeCoupon.value / 100);
    } else if (activeCoupon.type === 'fixed') {
      discount = activeCoupon.value;
    } else if (activeCoupon.type === 'free_shipping') {
      discount = 0;
    }
  }

  const shippingPrice = activeCoupon?.type === 'free_shipping' ? 0 : (shippingInfo?.price || 0);
  const total = Math.max(0, subtotal - discount + shippingPrice);

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (couponCode.trim()) {
      const res = applyCoupon(couponCode.trim());
      if (res.success) {
        setCouponSuccess(res.message);
        setCouponCode('');
      } else {
        setCouponError(res.message);
      }
    }
  };

  const handleShippingCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setZipError('');
    const sanitizedZip = zipInput.replace(/\D/g, '');
    if (sanitizedZip.length < 8) {
      setZipError('CEP inválido. Insira 8 dígitos.');
      return;
    }
    const options = calculateShipping(zipInput);
    setShippingOptions(options);
  };

  const handleSelectShipping = (option: any) => {
    selectShipping(option);
  };  if (cart.length === 0) {
    return (
      <div className="bg-[#0a0a0a] text-slate-100 min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-7xl mx-auto">
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-5 text-slate-400">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Seu carrinho está vazio</h2>
        <p className="text-slate-400 text-xs mt-1.5 max-w-sm">Dê uma olhada no nosso catálogo e adicione os melhores produtos de tecnologia.</p>
        <button
          onClick={() => navigate('category')}
          className="mt-6 bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl cursor-pointer shadow-lg hover:shadow-[#0066ff]/20 flex items-center gap-2 transition-all uppercase tracking-wider accent-glow"
        >
          <span>Ir para as Compras</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mb-8">Seu Carrinho</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Items List Grid */}
          <div className="lg:col-span-2 space-y-4">
            
            {cart.map((item, idx) => {
              const activePrice = item.product.promoPrice || item.product.price;
              const hasPromo = !!item.product.promoPrice;
              return (
                <div
                  key={`${item.product.id}_${idx}`}
                  className="bg-glass border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Image & name details */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded-xl bg-zinc-950/40 p-2 border border-white/5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">{item.product.brand}</p>
                      <h3
                        onClick={() => navigate('product-detail', { productId: item.product.id })}
                        className="text-white text-xs sm:text-sm font-semibold tracking-tight hover:text-[#0066ff] cursor-pointer transition-colors truncate"
                      >
                        {item.product.name}
                      </h3>
                      {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {Object.entries(item.selectedVariations).map(([k, v]) => (
                            <span key={k} className="text-[10px] bg-zinc-950/60 border border-white/5 px-2 py-0.5 rounded text-slate-400 font-medium">
                              {k}: <span className="text-slate-200">{v}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity manager & pricing */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                    
                    {/* Qty controller */}
                    <div className="flex items-center border border-white/10 bg-zinc-950/80 rounded-xl p-1 justify-between gap-2.5">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1, item.selectedVariations)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-xs text-white w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1, item.selectedVariations)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Pricing details */}
                    <div className="text-right min-w-[100px]">
                      {hasPromo && (
                        <p className="text-slate-500 text-[10px] line-through">
                          R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      )}
                      <p className="text-[#0066ff] text-sm font-bold tracking-tight leading-none">
                        R$ {(activePrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      {item.quantity > 1 && (
                        <span className="text-slate-500 text-[10px]">Cada: R$ {activePrice.toLocaleString('pt-BR')}</span>
                      )}
                    </div>

                    {/* Trash buttons */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedVariations)}
                      className="text-slate-550 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/5 cursor-pointer transition-colors"
                      title="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })}

            {/* Simulated Shipping calculation panel */}
            <div className="bg-glass border border-white/5 p-5 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0066ff]" />
                <span>Simular Frete de Entrega</span>
              </h3>
              
              <form onSubmit={handleShippingCalc} className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="Ex: 01310-100"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  className="bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0066ff] w-40"
                />
                <button
                  type="submit"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer transition-all duration-300"
                >
                  Simular
                </button>
              </form>
              
              {zipError && <p className="text-rose-500 text-xs font-semibold">{zipError}</p>}

              {shippingOptions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {shippingOptions.map((opt) => {
                    const isSelected = shippingInfo?.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectShipping(opt)}
                        className={`border rounded-xl p-3 cursor-pointer text-left transition-all duration-300 ${isSelected ? 'bg-[#0066ff]/10 border-[#0066ff]' : 'bg-zinc-950 border-white/10 hover:border-white/20'}`}
                      >
                        <p className="text-white font-bold text-xs">{opt.name}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Prazo: {opt.days} dias</p>
                        <p className="text-blue-400 font-extrabold text-xs mt-2">{opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2)}`}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Totals & Summary panel */}
          <div className="space-y-6">
            
            {/* Coupon widget */}
            <div className="bg-glass border border-white/5 p-5 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#0066ff]" />
                <span>Aplicar Cupom de Desconto</span>
              </h3>

              {activeCoupon ? (
                <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-emerald-400 font-bold">Cupom {activeCoupon.code} Ativo</p>
                    <p className="text-[10px] text-slate-400">
                      {activeCoupon.type === 'percent' ? `${activeCoupon.value}% de desconto` : activeCoupon.type === 'fixed' ? `R$ ${activeCoupon.value.toFixed(2)} de desconto` : 'Frete Grátis'}
                    </p>
                  </div>
                  <button onClick={removeCoupon} className="text-rose-500 hover:underline font-bold text-[10px] uppercase">Remover</button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: TECH10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0066ff] uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-all duration-300"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-rose-500 text-xs font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}
              {couponSuccess && (
                <p className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{couponSuccess}</span>
                </p>
              )}
            </div>

            {/* Summary calculations list */}
            <div className="bg-glass border border-white/5 p-5 rounded-2xl space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider pb-3 border-b border-white/5">Resumo do Pedido</h3>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-slate-200 font-semibold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Desconto do Cupom ({activeCoupon?.code}):</span>
                    <span>- R$ {discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-400">
                  <span>Frete ({shippingInfo?.name || 'Não selecionado'}):</span>
                  <span className="text-slate-200 font-semibold">
                    {shippingInfo ? (shippingPrice === 0 ? 'Grátis' : `R$ ${shippingPrice.toFixed(2)}`) : 'Calcule o CEP'}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex items-baseline justify-between">
                <span className="text-white font-bold text-xs uppercase">Total Geral:</span>
                <span className="text-white font-black text-xl tracking-tight">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => navigate('checkout')}
                  className="w-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#0066ff]/20 accent-glow"
                >
                  <span>Ir para o Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('category')}
                  className="w-full bg-zinc-950 border border-white/10 hover:border-white/20 text-slate-300 font-bold py-3.5 rounded-xl cursor-pointer text-xs transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
