import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import HomeHero from '../components/HomeHero';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Award, Laptop, Smartphone, Cpu, Gamepad2, Headphones, Monitor, Mouse, Star, ArrowRight, MessageSquare, Clock, ShieldCheck, ThumbsUp } from 'lucide-react';

const CATEGORY_ICONS: { [key: string]: any } = {
  celulares: Smartphone,
  notebooks: Laptop,
  pc_gamer: Cpu,
  monitores: Monitor,
  consoles: Gamepad2,
  audio: Headphones,
  acessorios: Mouse,
};

export default function HomePage() {
  const { db, navigate } = useStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });

  // Countdown timer for Daily Deals (until midnight)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Filter products for various sections
  const featuredProducts = db.products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = db.products.filter(p => p.isNew).slice(0, 4);
  const bestSellers = db.products.filter(p => p.isBestSeller).slice(0, 4);
  const dailyDeals = db.products.filter(p => p.isDailyDeal).slice(0, 2);
  const promoBanners = db.banners.filter(b => b.type === 'promo' && b.isActive);
  const recentPosts = db.blogPosts.slice(0, 3);

  // Hardcoded visual reviews for home screen social proof
  const HOME_REVIEWS = [
    { name: 'Gabriel Rodrigues', avatar: 'GR', text: 'Comprei meu PS5 Pro aqui e chegou em 2 dias em São Paulo. Embalagem super protegida e atendimento excelente no pós-venda!', rating: 5, product: 'PlayStation 5 Pro' },
    { name: 'Letícia Albuquerque', avatar: 'LA', text: 'O Galaxy S24 Ultra é maravilhoso, e o desconto à vista no PIX de 10% fez toda a diferença. Recomendo muito a loja!', rating: 5, product: 'Galaxy S24 Ultra' },
    { name: 'Maurício Fernandes', avatar: 'MF', text: 'Comprei o setup gamer montado por eles. Peças de primeiríssima qualidade, tudo com nota e garantias. Nota 10!', rating: 5, product: 'PC Gamer TechNova Extreme' }
  ];

  return (
    <div className="bg-[#0a0a0a] text-slate-100 min-h-screen">
      {/* Slider Hero & Benefits */}
      <HomeHero />

      {/* Categories Circle Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">Explore por Categoria</h2>
          <p className="text-slate-400 text-xs mt-1">Clique para filtrar produtos e encontrar o que você precisa</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5">
          {db.categories.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.id] || Smartphone;
            return (
              <div
                key={cat.id}
                onClick={() => navigate('category', { categoryId: cat.id })}
                className="bg-glass border border-white/5 hover:border-[#0066ff] hover:bg-[#0066ff]/5 p-5 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 text-blue-400 group-hover:bg-[#0066ff] group-hover:text-white rounded-xl flex items-center justify-center mb-3 transition-all duration-300">
                  <IconComponent className="w-6 h-6 flex-shrink-0" />
                </div>
                <h3 className="text-xs font-bold text-white group-hover:text-[#0066ff] transition-colors">{cat.name}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">{cat.count} Itens</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Deals Countdown Block */}
      {dailyDeals.length > 0 && (
        <section className="bg-[#111111]/60 border-y border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              
              {/* Countdown panel */}
              <div className="max-w-md text-left">
                <span className="text-rose-500 font-bold text-xs uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-max mb-3">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Ofertas do Dia</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">Super Descontos por Tempo Limitado</h2>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">Produtos selecionados a dedo com preços de custo imbatíveis. O cronômetro não para, garanta já o seu antes que o estoque acabe!</p>
                
                {/* Visual timer digits */}
                <div className="flex items-center gap-3 mt-6">
                  <div className="flex flex-col items-center">
                    <div className="bg-white/5 border border-white/10 w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold mt-1.5">Horas</span>
                  </div>
                  <span className="text-slate-700 font-bold text-xl -mt-5">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/5 border border-white/10 w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold mt-1.5">Minutos</span>
                  </div>
                  <span className="text-slate-700 font-bold text-xl -mt-5">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/5 border border-white/10 w-14 h-14 rounded-xl flex items-center justify-center text-rose-500 font-bold text-xl shadow-lg">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold mt-1.5">Segundos</span>
                  </div>
                </div>
              </div>

              {/* Products in deal */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {dailyDeals.map(product => (
                  <div key={product.id} className="h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Featured Products Tab-Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#0066ff] font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Destaques da Loja</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">Produtos em Destaque</h2>
          </div>
          <button
            onClick={() => navigate('category')}
            className="text-[#0066ff] hover:text-blue-400 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer transition-all self-start md:self-auto"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotional Banners Grid */}
      {promoBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promoBanners.slice(0, 2).map((banner) => (
              <div
                key={banner.id}
                onClick={() => {
                  if (banner.link.includes('category')) {
                    const catId = banner.link.split('/').pop();
                    navigate('category', { categoryId: catId });
                  } else {
                    navigate('category');
                  }
                }}
                className="relative h-60 rounded-3xl overflow-hidden border border-white/10 bg-glass group cursor-pointer shadow-xl"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-8 sm:px-12 max-w-md text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-2">{banner.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{banner.subtitle}</p>
                  <span className="text-[#0066ff] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explorar categoria</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals & Best Sellers (Split Sections) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* New Arrivals */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#0066ff] rounded-full" />
              <span>Últimos Lançamentos</span>
            </h3>
            <span
              onClick={() => navigate('category')}
              className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Ver mais</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <span>Mais Vendidos</span>
            </h3>
            <span
              onClick={() => navigate('category')}
              className="text-slate-400 hover:text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>Ver mais</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands logos grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5">
        <div className="text-center mb-8">
          <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Grandes Marcas de Tecnologia</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-4">
          {db.brands.map((brand, idx) => (
            <div
              key={idx}
              onClick={() => {
                navigate('category');
              }}
              className="bg-glass border border-white/5 rounded-xl px-4 py-3 text-center cursor-pointer hover:border-[#0066ff] hover:bg-[#0066ff]/5 transition-all duration-300 text-slate-300 font-bold text-xs whitespace-nowrap truncate"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Social Proof */}
      <section className="bg-[#111111]/40 border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#0066ff] font-bold text-xs uppercase tracking-widest">Depoimentos</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mt-1">Quem compra na TechNova, aprova!</h2>
            <p className="text-slate-400 text-xs max-w-md mx-auto mt-2">Veja a opinião de clientes reais que compraram conosco e comprovaram nossa excelência de entrega e atendimento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOME_REVIEWS.map((review, idx) => (
              <div key={idx} className="bg-glass border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#0066ff]/40 transition-all duration-300">
                <div>
                  <div className="flex text-amber-400 gap-0.5 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs italic leading-relaxed">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-3 mt-6 border-t border-white/5 pt-4">
                  <div className="w-9 h-9 rounded-full bg-[#0066ff]/10 border border-[#0066ff]/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold leading-tight">{review.name}</h4>
                    <p className="text-slate-500 text-[10px] mt-0.5">Comprou: <span className="text-blue-400 font-medium">{review.product}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blog Posts Highlight */}
      {recentPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[#0066ff] font-bold text-xs uppercase tracking-widest">TechNova Blog</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mt-1">Dicas & Novidades de Tecnologia</h2>
            </div>
            <button
              onClick={() => navigate('blog')}
              className="text-[#0066ff] hover:text-blue-400 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Ver todos os posts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate('blog-post', { postId: post.id })}
                className="bg-glass border border-white/5 hover:border-[#0066ff]/40 rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-zinc-950/90 backdrop-blur border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-slate-500 text-[10px] font-medium mb-1.5">{post.date} &bull; Por {post.author.split(' ')[0]}</p>
                    <h3 className="text-white text-sm font-bold tracking-tight mb-2 group-hover:text-[#0066ff] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 flex items-center text-[#0066ff] text-xs font-bold gap-1 group-hover:underline">
                  <span>Ler artigo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
