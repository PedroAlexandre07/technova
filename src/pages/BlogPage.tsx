import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BlogPost, Product } from '../types';
import { FileText, Calendar, Clock, ArrowRight, ArrowLeft, Search, MessageSquare, Heart, ShieldCheck, Tag } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function BlogPage() {
  const { db, currentNav, navigate } = useStore();

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Comment section states for active article
  const [comments, setComments] = useState<any[]>([
    { name: 'Gabriel Santos', date: 'Há 2 dias', text: 'Excelente artigo! Me ajudou muito a entender qual processador escolher para o meu próximo upgrade.' },
    { name: 'Mariana Lima', date: 'Há 1 dia', text: 'Muito bem explicado. A TechNova sempre trazendo os melhores materiais informativos para a comunidade!' }
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Sync navigation parameter if passed in nav options (e.g. read specific article from homepage)
  useEffect(() => {
    if (currentNav.postId) {
      setSelectedPostId(currentNav.postId);
    } else {
      setSelectedPostId(null);
    }
  }, [currentNav]);

  const handleBackToCatalog = () => {
    setSelectedPostId(null);
    navigate('blog');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;
    
    const comment = {
      name: newCommentName.trim(),
      date: 'Agora mesmo',
      text: newCommentText.trim()
    };

    setComments(prev => [comment, ...prev]);
    setNewCommentName('');
    setNewCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  const blogCategories = ['all', ...Array.from(new Set(db.blogPosts.map(p => p.category)))];

  // Perform listing filters
  const filteredPosts = db.blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(blogSearch.toLowerCase());
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Current active post detail
  const activePost = db.blogPosts.find(p => p.id === selectedPostId);

  // Render detail view if selected
  if (activePost) {
    // Pick 2 random related products from catalog for display inside post detail
    const relatedProducts = db.products.slice(0, 3);

    return (
      <div className="bg-[#0a0a0a] text-slate-100 min-h-screen py-8 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <button
            onClick={handleBackToCatalog}
            className="text-slate-400 hover:text-white font-bold text-xs flex items-center gap-1.5 mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para o Blog</span>
          </button>

          {/* Article Header */}
          <article className="space-y-6">
            
            <span className="bg-[#0066ff]/15 border border-[#0066ff]/25 text-[#0066ff] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
              {activePost.category}
            </span>

            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight uppercase tracking-tight">
              {activePost.title}
            </h1>

            {/* Metas info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-y border-white/5 py-3.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0066ff]" />
                <span>{activePost.date}</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0066ff]" />
                <span>{activePost.readTime}</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <span>Por: Redação TechNova</span>
            </div>

            {/* Hero Banner Cover Image */}
            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/5 bg-zinc-950/40">
              <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
            </div>

            {/* Content Body Layout */}
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-5 whitespace-pre-line font-medium pt-4">
              {activePost.content || activePost.excerpt}
            </div>

          </article>

          {/* RELATED PRODUCTS INSIDE ARTICLE */}
          <section className="mt-16 pt-10 border-t border-white/5 space-y-6">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Produtos recomendados do artigo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* COMMENTS SECTION */}
          <section className="mt-16 pt-10 border-t border-white/5 space-y-8">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#0066ff]" />
              <span>Comentários ({comments.length})</span>
            </h3>

            {/* Comment Form */}
            <div className="bg-glass border border-white/5 p-6 rounded-2xl space-y-4">
              <p className="text-white font-bold text-xs">Deixe sua opinião ou dúvida:</p>
              
              {commentSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Seu comentário foi registrado com sucesso para aprovação!</span>
                </div>
              )}

              <form onSubmit={handleAddComment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-xs text-white"
                  />
                  <span className="hidden sm:block text-[11px] text-slate-500 self-center">Comentários passam por aprovação de segurança antes de publicar.</span>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Escreva sua opinião ou dúvida técnica sobre o artigo..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl p-2.5 text-xs text-white"
                />
                <button
                  type="submit"
                  className="bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer accent-glow"
                >
                  Enviar Comentário
                </button>
              </form>
            </div>

            {/* Comments roster */}
            <div className="space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="bg-glass border border-white/5 p-4 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{c.name}</span>
                    <span className="text-slate-500 text-[10px]">{c.date}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-medium">{c.text}</p>
                </div>
              ))}
            </div>

          </section>

        </div>
      </div>
    );
  }

  // Render articles catalog grid list if no article selected
  return (
    <div className="bg-[#0a0a0a] text-slate-100 min-h-screen py-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-[#0066ff]" />
            <span>TechNova News & Insights</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">Seu canal exclusivo de hardware, reviews técnicas de ponta e tutoriais de tecnologia avançada.</p>
        </div>

        {/* Filters and search layout */}
        <div className="bg-glass border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          
          {/* Categories select row pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border font-bold uppercase text-[10px] tracking-wide transition-all cursor-pointer ${selectedCategory === cat ? 'bg-[#0066ff]/10 border-[#0066ff] text-[#0066ff]' : 'bg-zinc-950 border-white/10 hover:border-white/20 text-slate-400'}`}
              >
                {cat === 'all' ? 'Tudo' : cat}
              </button>
            ))}
          </div>

          {/* Search bar inside blog list */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar artigos..."
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 focus:border-[#0066ff] focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs text-white"
            />
          </div>

        </div>

        {/* Listing Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-glass border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/10 group transition-all duration-300"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-zinc-950/40">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 space-y-3">
                    <span className="bg-[#0066ff]/15 border border-[#0066ff]/20 text-[#0066ff] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <h3 className="text-white font-bold text-sm sm:text-base leading-snug uppercase tracking-tight group-hover:text-[#0066ff] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed font-medium">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-white/5 mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </span>
                  <button
                    onClick={() => navigate('blog', { postId: post.id })}
                    className="text-[#0066ff] hover:text-[#0066ff]/80 font-bold flex items-center gap-1 group/btn cursor-pointer transition-colors"
                  >
                    <span>Ler Artigo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-16 text-center text-slate-500">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-sm font-semibold">Nenhum artigo encontrado para a pesquisa selecionada.</p>
          </div>
        )}

      </div>
    </div>
  );
}
