import { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, CreditCard, ShieldCheck, Headphones, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const BENEFITS = [
  { icon: Truck, title: 'Frete Seguro e Rápido', desc: 'Grátis para compras acima de R$ 1.500 ou via correios econômico.' },
  { icon: CreditCard, title: 'Até 12x Sem Juros', desc: 'No cartão de crédito ou ganhe 10% de desconto via PIX.' },
  { icon: ShieldCheck, title: 'Garantia Oficial', desc: 'Até 36 meses de cobertura oficial de fábrica homologada.' },
  { icon: Headphones, title: 'Suporte Técnico Premium', desc: 'Equipe especializada pronta para tirar suas dúvidas pós-compra.' },
];

export default function HomeHero() {
  const { db, navigate } = useStore();
  const heroBanners = db.banners.filter(b => b.type === 'hero' && b.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto sliding every 6 seconds
  useEffect(() => {
    if (heroBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  if (heroBanners.length === 0) return null;

  const activeSlide = heroBanners[currentSlide];

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % heroBanners.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] pt-4 pb-12">
      {/* Banner Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-[450px] sm:h-[500px] rounded-3xl overflow-hidden bg-glass border border-white/10 group">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background image with overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 md:opacity-75 scale-105 hover:scale-100 transition-transform duration-[8000ms]"
            />
 
            {/* Slide Content */}
            <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-2xl text-left">
              <span className="text-[#0066ff] font-bold text-xs uppercase tracking-widest bg-[#0066ff]/10 border border-[#0066ff]/20 px-3 py-1 rounded-full w-max mb-4">
                LANÇAMENTO EXCLUSIVO
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
                {activeSlide.title}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
                {activeSlide.subtitle}
              </p>
              <button
                onClick={() => {
                  if (activeSlide.link.includes('product')) {
                    const id = activeSlide.link.split('/').pop();
                    navigate('product-detail', { productId: id });
                  } else if (activeSlide.link.includes('category')) {
                    const id = activeSlide.link.split('/').pop();
                    navigate('category', { categoryId: id });
                  } else {
                    navigate('category');
                  }
                }}
                className="bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full cursor-pointer shadow-xl accent-glow flex items-center gap-2 w-max transition-all active:scale-95"
              >
                <span>COMPRAR AGORA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
 
        {/* Sliders Controllers */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/5 hover:bg-[#0066ff] border border-white/10 p-2.5 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/5 hover:bg-[#0066ff] border border-white/10 p-2.5 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
 
        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {heroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'bg-[#0066ff] w-8' : 'bg-white/10 hover:bg-white/30'}`}
            />
          ))}
        </div>
 
      </div>
 
      {/* Benefits grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, idx) => {
            const IconComp = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-glass border border-white/5 p-5 rounded-2xl flex gap-4 items-start hover:border-[#0066ff]/40 transition-all group"
              >
                <div className="bg-[#0066ff]/10 border border-[#0066ff]/20 group-hover:bg-[#0066ff] group-hover:text-white p-3 rounded-xl text-[#0066ff] flex items-center justify-center transition-all">
                  <IconComp className="w-5 h-5 flex-shrink-0" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs leading-tight mb-1 group-hover:text-[#0066ff] transition-colors">{benefit.title}</h4>
                  <p className="text-slate-400 text-[11px] leading-snug">{benefit.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
