import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Star, Heart, ShoppingCart, Percent } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist, navigate } = useStore();

  const isFav = wishlist.includes(product.id);
  const currentPrice = product.promoPrice || product.price;
  const hasDiscount = !!product.promoPrice && product.promoPrice < product.price;
  const discountPct = hasDiscount 
    ? Math.round(((product.price - product.promoPrice!) / product.price) * 100) 
    : 0;

  // Calculate simulated installment values
  const installmentsCount = 10;
  const installmentVal = currentPrice / installmentsCount;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigate('product-detail', { productId: product.id })}
      className="product-card bg-glass border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-full cursor-pointer transition-all duration-300 group relative overflow-hidden"
    >
      {/* Discount / Tag Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
        {hasDiscount && (
          <span className="bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
            <Percent className="w-3 h-3" />
            <span>-{discountPct}% OFF</span>
          </span>
        )}
        {product.isNew && (
          <span className="bg-[#0066ff] text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full w-max">
            Novo
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full w-max">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-4 right-4 z-10 bg-zinc-950/85 border border-white/10 hover:border-[#0066ff]/30 p-2 rounded-full text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="aspect-square w-full rounded-xl overflow-hidden mb-4 bg-white/5 border border-white/5 flex items-center justify-center p-3 relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Metadata */}
      <div>
        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">{product.brand}</p>
        <h3 className="text-white text-xs sm:text-sm font-semibold tracking-tight leading-tight line-clamp-2 h-10 mb-2 group-hover:text-[#0066ff] transition-colors">
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-3.5 h-3.5 ${idx < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-800'}`}
              />
            ))}
          </div>
          <span className="text-slate-400 text-[10px] font-bold">({product.rating})</span>
        </div>
      </div>

      {/* Price & Action button block */}
      <div className="mt-auto">
        {/* Price tags */}
        <div className="mb-4">
          {hasDiscount && (
            <p className="text-slate-500 text-[11px] line-through leading-none mb-0.5">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}
          <p className="text-[#0066ff] text-base sm:text-lg font-black tracking-tight leading-none">
            R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-slate-400 text-[10px] mt-1">
            Ou em até <span className="text-slate-200 font-medium">{installmentsCount}x de R$ {installmentVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> sem juros
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#0066ff]/20 accent-glow"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </div>
    </div>
  );
}
