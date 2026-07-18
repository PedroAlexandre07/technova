import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, ShieldCheck, Heart, LayoutDashboard, Send, Clock } from 'lucide-react';

export default function Footer() {
  const { navigate, db, currentUser } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      // Optionally we can save to newsletter DB
      try {
        const localDb = JSON.parse(localStorage.getItem('technova_db_v1') || '{}');
        if (localDb) {
          localDb.newsletter = localDb.newsletter || [];
          if (!localDb.newsletter.includes(email)) {
            localDb.newsletter.push(email);
            localStorage.setItem('technova_db_v1', JSON.stringify(localDb));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar with Newsletter */}
        <div className="pb-12 border-b border-white/10 lg:flex lg:items-center lg:justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-white font-bold text-lg mb-2">Fique por dentro das novidades!</h3>
            <p className="text-slate-400 text-xs">Inscreva-se em nossa newsletter para receber ofertas exclusivas, cupons de desconto e novidades tecnológicas diretamente em seu email.</p>
          </div>
          <div className="mt-6 lg:mt-0 flex-1 max-w-md">
            {subscribed ? (
              <div className="bg-[#0066ff]/10 border border-[#0066ff]/20 text-blue-400 rounded-xl px-4 py-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-medium">Inscrição realizada com sucesso! Aproveite as ofertas.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Digite seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff]/30"
                />
                <button
                  type="submit"
                  className="bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all accent-glow"
                >
                  <span>INSCREVER</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Core content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          
          {/* Col 1: TechNova Info */}
          <div>
            <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => navigate('home')}>
              <h1 className="text-lg font-bold tracking-tighter uppercase text-white">
                TECH<span className="text-[#0066ff]">NOVA</span><span className="text-blue-400 text-[9px] align-top ml-1 font-semibold">STORE</span>
              </h1>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">A TechNova Store é sua loja de tecnologia e eletrônicos premium de confiança. Oferecemos as melhores marcas com garantia, suporte de ponta e facilidades de pagamento.</p>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Atendimento Seg-Sex 9h-18h</span>
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Principais Categorias</h4>
            <ul className="space-y-2.5 text-xs">
              {db.categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <span
                    onClick={() => navigate('category', { categoryId: cat.id })}
                    className="hover:text-[#0066ff] cursor-pointer transition-colors"
                  >
                    {cat.name}
                  </span>
                </li>
              ))}
              <li>
                <span onClick={() => navigate('category')} className="text-[#0066ff] hover:underline cursor-pointer transition-colors font-medium">Ver Todas as Categorias</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Useful Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Links Úteis</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span onClick={() => navigate('home')} className="hover:text-[#0066ff] cursor-pointer transition-colors">Início</span></li>
              <li><span onClick={() => navigate('category')} className="hover:text-[#0066ff] cursor-pointer transition-colors">Todas as Categorias</span></li>
              <li><span onClick={() => navigate('blog')} className="hover:text-[#0066ff] cursor-pointer transition-colors">Nosso Blog</span></li>
              <li><span onClick={() => navigate('client-area')} className="hover:text-[#0066ff] cursor-pointer transition-colors">Minha Conta</span></li>
              <li><span onClick={() => navigate('client-area')} className="hover:text-[#0066ff] cursor-pointer transition-colors">Acompanhar Pedidos</span></li>
              {currentUser?.role === 'admin' && (
                <li><span onClick={() => navigate('admin')} className="text-emerald-500 hover:underline cursor-pointer font-medium">Painel Admin</span></li>
              )}
            </ul>
          </div>

          {/* Col 4: Contact & Seal */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">Contato & Suporte</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0066ff] flex-shrink-0 mt-0.5" />
                <span>Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0066ff] flex-shrink-0" />
                <span>+55 (11) 4003-8888</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0066ff] flex-shrink-0" />
                <span>suporte@technovastore.com</span>
              </li>
            </ul>

            {/* Certifications badges */}
            <div className="mt-6 flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center gap-1.5" title="Site blindado e criptografado com certificado SSL">
                <ShieldCheck className="w-4 h-4 text-[#0066ff]" />
                <span className="text-[10px] font-bold text-slate-300">SSL BLINDADO</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 flex items-center gap-1.5" title="Garantia oficial de satisfação TechNova">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-300">SATISFAÇÃO</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar with payments, copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          
          {/* Copyright */}
          <div>
            <p className="text-[11px] text-gray-500 tracking-wider">© {new Date().getFullYear()} TECHNOVA STORE. CNPJ: 12.345.678/0001-99 | Endereço: Av. Paulista, 1000, São Paulo, SP. TODOS OS DIREITOS RESERVADOS.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider">SISTEMA ONLINE</span>
            </div>
            
            {/* Payment Badges */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-[#0066ff]">
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>ELO</span>
              <span>PIX</span>
              <span>STRIPE</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
