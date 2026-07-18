import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, User, Order, Coupon, BlogPost, Banner, SupportMessage, SystemLog, Address, Notification, Question, Review } from '../types';
import { loadDb, saveDb, addSystemLog, Database } from '../data/mockDb';

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariations?: { [key: string]: string };
}

interface ShippingOption {
  id: 'express' | 'eco' | 'store';
  name: string;
  price: number;
  days: number;
  description: string;
}

interface StoreContextType {
  db: Database;
  currentUser: User | null;
  cart: CartItem[];
  wishlist: string[];
  activeCoupon: Coupon | null;
  shippingInfo: ShippingOption | null;
  zipCode: string;
  searchHistory: string[];
  currentNav: {
    page: 'home' | 'product-detail' | 'category' | 'cart' | 'checkout' | 'client-area' | 'admin' | 'blog' | 'blog-post' | 'search-results';
    productId?: string;
    categoryId?: string;
    postId?: string;
  };
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Navigation
  navigate: (page: 'home' | 'product-detail' | 'category' | 'cart' | 'checkout' | 'client-area' | 'admin' | 'blog' | 'blog-post' | 'search-results', params?: { productId?: string; categoryId?: string; postId?: string }) => void;
  // Auth
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (name: string, password?: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  toggleNotificationRead: (id: string) => void;
  // Cart Actions
  addToCart: (product: Product, quantity: number, variations?: { [key: string]: string }) => void;
  updateCartQty: (productId: string, quantity: number, variations?: { [key: string]: string }) => void;
  removeFromCart: (productId: string, variations?: { [key: string]: string }) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  calculateShipping: (zip: string) => ShippingOption[];
  selectShipping: (option: ShippingOption) => void;
  // Order Actions
  placeOrder: (addressId: string, paymentMethod: 'pix' | 'card' | 'boleto', cardDetails?: { number: string; name: string; expiry: string; cvv: string }) => Order;
  cancelOrder: (orderId: string) => void;
  // Wishlist
  toggleWishlist: (productId: string) => void;
  // Admin Operations
  adminSaveProduct: (product: Product) => void;
  adminDeleteProduct: (id: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: Order['status'], tracking?: string) => void;
  adminSaveCoupon: (coupon: Coupon) => void;
  adminDeleteCoupon: (id: string) => void;
  adminSaveBanner: (banner: Banner) => void;
  adminSaveBlogPost: (post: BlogPost) => void;
  adminDeleteBlogPost: (id: string) => void;
  adminReplySupport: (id: string, reply: string) => void;
  adminReplyReview: (productId: string, reviewId: string, reply: string) => void;
  adminAddProductQuestion: (productId: string, qText: string) => void;
  adminReplyQuestion: (productId: string, questionId: string, reply: string) => void;
  adminAddProductReview: (productId: string, userName: string, rating: number, comment: string) => void;
  addSupportMessage: (name: string, email: string, subject: string, message: string) => void;
  // Blog
  addBlogComment: (postId: string, commentText: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState<Database>(loadDb);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingOption | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentNav, setCurrentNav] = useState<StoreContextType['currentNav']>({ page: 'home' });
  const [searchQuery, setSearchQuery] = useState('');

  // Hydrate logged-in user and cart on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('technova_logged_user');
    const savedCart = localStorage.getItem('technova_cart');
    const savedHistory = localStorage.getItem('technova_search_history');

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        setCurrentUser(parsed);
        setWishlist(parsed.wishlist || []);
      } catch (e) {
        console.error(e);
      }
    }

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }

    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync state to localstorage when db, cart or user changes
  const updateDbState = (newDb: Database) => {
    setDb(newDb);
    saveDb(newDb);
  };

  const navigate = (page: StoreContextType['currentNav']['page'], params?: { productId?: string; categoryId?: string; postId?: string }) => {
    setCurrentNav({ page, ...params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Functions
  const login = (email: string, password: string): boolean => {
    const user = db.users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setWishlist(user.wishlist || []);
      localStorage.setItem('technova_logged_user', JSON.stringify(user));
      addSystemLog('Login', user.name, `Usuário ${user.email} efetuou login.`);
      // Refresh DB log state in react
      setDb(loadDb());
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    const exists = db.users.some(u => u.email === email);
    if (exists) return false;

    const newUser: User = {
      id: 'u' + Math.floor(Math.random() * 100000),
      name,
      email,
      password,
      role: 'customer',
      addresses: [],
      wishlist: [],
      notifications: [
        {
          id: 'n_welcome',
          title: 'Boas-vindas à TechNova!',
          message: `Olá ${name}! Obrigado por se cadastrar na TechNova Store. Aproveite nosso cupom TECH10 para obter 10% de desconto em sua primeira compra.`,
          date: new Date().toLocaleString('pt-BR'),
          isRead: false
        }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0
    };

    const newDb = { ...db, users: [...db.users, newUser] };
    updateDbState(newDb);
    addSystemLog('Cadastro', name, `Novo usuário cadastrado: ${email}`);
    return true;
  };

  const logout = () => {
    if (currentUser) {
      addSystemLog('Logout', currentUser.name, `Usuário ${currentUser.email} efetuou logout.`);
    }
    setCurrentUser(null);
    setWishlist([]);
    localStorage.removeItem('technova_logged_user');
    // If we're in checkout or admin, go home
    if (currentNav.page === 'checkout' || currentNav.page === 'admin' || currentNav.page === 'client-area') {
      navigate('home');
    }
  };

  const updateProfile = (name: string, password?: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, ...(password ? { password } : {}) };
    setCurrentUser(updated);
    localStorage.setItem('technova_logged_user', JSON.stringify(updated));

    const updatedUsers = db.users.map(u => u.id === currentUser.id ? { ...u, name, ...(password ? { password } : {}) } : u);
    updateDbState({ ...db, users: updatedUsers });
    addSystemLog('Perfil Atualizado', name, `Informações de perfil atualizadas.`);
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddress: Address = {
      ...address,
      id: 'addr_' + Math.floor(Math.random() * 100000),
    };
    const updated = {
      ...currentUser,
      addresses: [...(currentUser.addresses || []), newAddress]
    };
    setCurrentUser(updated);
    localStorage.setItem('technova_logged_user', JSON.stringify(updated));

    const updatedUsers = db.users.map(u => u.id === currentUser.id ? updated : u);
    updateDbState({ ...db, users: updatedUsers });
  };

  const removeAddress = (id: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      addresses: (currentUser.addresses || []).filter(a => a.id !== id)
    };
    setCurrentUser(updated);
    localStorage.setItem('technova_logged_user', JSON.stringify(updated));

    const updatedUsers = db.users.map(u => u.id === currentUser.id ? updated : u);
    updateDbState({ ...db, users: updatedUsers });
  };

  const toggleNotificationRead = (id: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      notifications: (currentUser.notifications || []).map(n => n.id === id ? { ...n, isRead: true } : n)
    };
    setCurrentUser(updated);
    localStorage.setItem('technova_logged_user', JSON.stringify(updated));

    const updatedUsers = db.users.map(u => u.id === currentUser.id ? updated : u);
    updateDbState({ ...db, users: updatedUsers });
  };

  // Cart Actions
  const addToCart = (product: Product, quantity: number, variations?: { [key: string]: string }) => {
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id && 
      JSON.stringify(item.selectedVariations) === JSON.stringify(variations)
    );

    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity, selectedVariations: variations });
    }

    setCart(newCart);
    localStorage.setItem('technova_cart', JSON.stringify(newCart));
  };

  const updateCartQty = (productId: string, quantity: number, variations?: { [key: string]: string }) => {
    if (quantity <= 0) {
      removeFromCart(productId, variations);
      return;
    }

    const newCart = cart.map(item => {
      if (item.product.id === productId && JSON.stringify(item.selectedVariations) === JSON.stringify(variations)) {
        return { ...item, quantity };
      }
      return item;
    });

    setCart(newCart);
    localStorage.setItem('technova_cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId: string, variations?: { [key: string]: string }) => {
    const newCart = cart.filter(
      item => !(item.product.id === productId && JSON.stringify(item.selectedVariations) === JSON.stringify(variations))
    );
    setCart(newCart);
    localStorage.setItem('technova_cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
    setShippingInfo(null);
    localStorage.removeItem('technova_cart');
  };

  const applyCoupon = (code: string) => {
    const coupon = db.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.product.promoPrice || item.product.price) * item.quantity, 0);
    if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
      return { success: false, message: `Este cupom requer uma compra mínima de R$ ${coupon.minSubtotal.toFixed(2)}.` };
    }

    setActiveCoupon(coupon);
    return { success: true, message: 'Cupom aplicado com sucesso!' };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const calculateShipping = (zip: string): ShippingOption[] => {
    setZipCode(zip);
    // CEP Fictício simulation
    const codeNum = parseInt(zip.replace(/\D/g, '')) || 0;
    
    // Simulate shipping options
    const baseOptions: ShippingOption[] = [
      { id: 'eco', name: 'Entrega Econômica', price: codeNum % 3 === 0 ? 0 : 15, days: 5 + (codeNum % 5), description: 'Entrega padrão pelos Correios / Transportadora.' },
      { id: 'express', name: 'Entrega Expressa', price: 29.90 + (codeNum % 15), days: 1 + (codeNum % 3), description: 'Envio prioritário por motoboy / transportadora aérea.' },
      { id: 'store', name: 'Retirada na Loja', price: 0, days: 1, description: 'Retirada imediata após faturamento em nossa unidade central.' },
    ];
    
    return baseOptions;
  };

  const selectShipping = (option: ShippingOption) => {
    setShippingInfo(option);
  };

  // Order placement
  const placeOrder = (addressId: string, paymentMethod: 'pix' | 'card' | 'boleto', cardDetails?: { number: string; name: string; expiry: string; cvv: string }): Order => {
    if (!currentUser) throw new Error('Necessário login para finalizar a compra');
    
    const shippingAddress = currentUser.addresses.find(a => a.id === addressId);
    if (!shippingAddress) throw new Error('Endereço inválido');

    const subtotal = cart.reduce((acc, item) => acc + (item.product.promoPrice || item.product.price) * item.quantity, 0);
    let discount = 0;
    
    if (activeCoupon) {
      if (activeCoupon.type === 'percent') {
        discount = subtotal * (activeCoupon.value / 100);
      } else if (activeCoupon.type === 'fixed') {
        discount = activeCoupon.value;
      } else if (activeCoupon.type === 'free_shipping') {
        discount = 0; // Handled below or as free shipping price
      }
    }

    const shipPrice = activeCoupon?.type === 'free_shipping' ? 0 : (shippingInfo?.price || 0);
    const total = Math.max(0, subtotal - discount + shipPrice);

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0],
      price: item.product.promoPrice || item.product.price,
      quantity: item.quantity,
      selectedVariations: item.selectedVariations
    }));

    const transactionCode = 'TX-' + Math.floor(Math.random() * 100000000);
    const orderId = 'PED-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      items: orderItems,
      shippingAddress,
      shippingMethod: shippingInfo?.id || 'eco',
      shippingPrice: shipPrice,
      shippingDays: shippingInfo?.days || 5,
      status: 'pending',
      paymentMethod,
      paymentDetails: {
        transactionCode,
        ...(paymentMethod === 'card' ? { cardBrand: 'Mastercard', cardLast4: cardDetails?.number.slice(-4) } : {}),
        ...(paymentMethod === 'pix' ? { pixCode: '00020101021226850014BR.GOV.BCB.PIX2563technova-qr-code-pix-payload-simulated-payment' } : {}),
        ...(paymentMethod === 'boleto' ? { boletoUrl: 'https://technova.com/boleto-pdf-simulated-url' } : {}),
      },
      subtotal,
      discount,
      couponCode: activeCoupon?.code,
      total,
      trackingNumber: 'TN-' + (shippingInfo?.id || 'eco').toUpperCase() + '-' + Math.floor(10000 + Math.random() * 90000) + 'BR',
      createdAt: new Date().toLocaleString('pt-BR'),
      history: [
        { status: 'Pendente', date: new Date().toLocaleString('pt-BR'), note: 'Pedido recebido com sucesso. Aguardando processamento do pagamento.' }
      ]
    };

    // Update DB
    const updatedOrders = [newOrder, ...db.orders];
    
    // Decrement stock
    const updatedProducts = db.products.map(p => {
      const cartMatch = cart.find(c => c.product.id === p.id);
      if (cartMatch) {
        return { ...p, stock: Math.max(0, p.stock - cartMatch.quantity) };
      }
      return p;
    });

    // Update coupon usage count
    const updatedCoupons = db.coupons.map(c => {
      if (activeCoupon && c.id === activeCoupon.id) {
        return { ...c, usageCount: c.usageCount + 1 };
      }
      return c;
    });

    // Notify client
    const notification: Notification = {
      id: 'n_' + Math.floor(Math.random() * 10000),
      title: 'Pedido Recebido!',
      message: `Seu pedido ${orderId} foi gerado com sucesso. Total: R$ ${total.toFixed(2)}.`,
      date: new Date().toLocaleString('pt-BR'),
      isRead: false
    };

    const updatedUser = {
      ...currentUser,
      notifications: [notification, ...(currentUser.notifications || [])],
      totalSpent: (currentUser.totalSpent || 0) + total
    };

    const updatedUsers = db.users.map(u => {
      if (u.id === currentUser.id) return updatedUser;
      return u;
    });

    updateDbState({
      ...db,
      orders: updatedOrders,
      products: updatedProducts,
      coupons: updatedCoupons,
      users: updatedUsers
    });

    setCurrentUser(updatedUser);
    localStorage.setItem('technova_logged_user', JSON.stringify(updatedUser));
    
    addSystemLog('Pedido Realizado', currentUser.name, `Gerou o pedido ${orderId} de R$ ${total.toFixed(2)}`);
    
    // Clear shopping state
    clearCart();
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    const order = db.orders.find(o => o.id === orderId);
    if (!order) return;

    const updatedOrders = db.orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'cancelled' as const,
          history: [
            ...o.history,
            { status: 'Cancelado', date: new Date().toLocaleString('pt-BR'), note: 'O pedido foi cancelado pelo cliente.' }
          ]
        };
      }
      return o;
    });

    // Restore stock
    const updatedProducts = db.products.map(p => {
      const orderItem = order.items.find(item => item.productId === p.id);
      if (orderItem) {
        return { ...p, stock: p.stock + orderItem.quantity };
      }
      return p;
    });

    updateDbState({ ...db, orders: updatedOrders, products: updatedProducts });
    addSystemLog('Pedido Cancelado', currentUser?.name || 'Cliente', `Cancelou o pedido ${orderId}`);
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    if (!currentUser) {
      // Prompt user to login or keep in localized unlogged state
      return;
    }

    const isFav = wishlist.includes(productId);
    const newWishlist = isFav ? wishlist.filter(id => id !== productId) : [...wishlist, productId];
    setWishlist(newWishlist);

    const updatedUser = { ...currentUser, wishlist: newWishlist };
    setCurrentUser(updatedUser);
    localStorage.setItem('technova_logged_user', JSON.stringify(updatedUser));

    const updatedUsers = db.users.map(u => u.id === currentUser.id ? updatedUser : u);
    updateDbState({ ...db, users: updatedUsers });
    addSystemLog('Favoritos', currentUser.name, `${isFav ? 'Removeu' : 'Adicionou'} produto ${productId} dos favoritos.`);
  };

  // Admin CRUD Operations
  const adminSaveProduct = (product: Product) => {
    const exists = db.products.some(p => p.id === product.id);
    let updatedProducts = [];

    if (exists) {
      updatedProducts = db.products.map(p => p.id === product.id ? product : p);
    } else {
      updatedProducts = [product, ...db.products];
    }

    updateDbState({ ...db, products: updatedProducts });
    addSystemLog('Admin Produto', currentUser?.name || 'Admin', `${exists ? 'Editou' : 'Criou'} o produto ${product.name}`);
  };

  const adminDeleteProduct = (id: string) => {
    const updatedProducts = db.products.filter(p => p.id !== id);
    updateDbState({ ...db, products: updatedProducts });
    addSystemLog('Admin Produto', currentUser?.name || 'Admin', `Deletou o produto ID: ${id}`);
  };

  const adminUpdateOrderStatus = (orderId: string, status: Order['status'], tracking?: string) => {
    const updatedOrders = db.orders.map(o => {
      if (o.id === orderId) {
        const historyNote = {
          pending: 'Aguardando pagamento.',
          preparing: 'Pagamento confirmado. Pedido em separação e embalagem.',
          shipped: `Pedido despachado para entrega. Código de rastreio: ${tracking || o.trackingNumber || 'Em emissão'}.`,
          delivered: 'Pedido entregue com sucesso.',
          cancelled: 'Pedido cancelado pela administração.'
        }[status];

        const translatedStatus = {
          pending: 'Pendente',
          preparing: 'Separando',
          shipped: 'Enviado',
          delivered: 'Entregue',
          cancelled: 'Cancelado'
        }[status];

        return {
          ...o,
          status,
          ...(tracking ? { trackingNumber: tracking } : {}),
          history: [
            ...o.history,
            { status: translatedStatus, date: new Date().toLocaleString('pt-BR'), note: historyNote }
          ]
        };
      }
      return o;
    });

    // Notify client of status update
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
      const client = db.users.find(u => u.id === order.userId);
      if (client) {
        const notification: Notification = {
          id: 'n_' + Math.floor(Math.random() * 10000),
          title: `Atualização do Pedido ${orderId}`,
          message: `O status do seu pedido mudou para: ${status.toUpperCase()}.`,
          date: new Date().toLocaleString('pt-BR'),
          isRead: false
        };
        const updatedUsers = db.users.map(u => {
          if (u.id === client.id) {
            return {
              ...u,
              notifications: [notification, ...(u.notifications || [])]
            };
          }
          return u;
        });

        // If the updated client is the current logged user, sync state
        if (currentUser && currentUser.id === client.id) {
          const updatedCur = { ...currentUser, notifications: [notification, ...(currentUser.notifications || [])] };
          setCurrentUser(updatedCur);
          localStorage.setItem('technova_logged_user', JSON.stringify(updatedCur));
        }

        updateDbState({ ...db, orders: updatedOrders, users: updatedUsers });
      } else {
        updateDbState({ ...db, orders: updatedOrders });
      }
    } else {
      updateDbState({ ...db, orders: updatedOrders });
    }

    addSystemLog('Admin Pedido', currentUser?.name || 'Admin', `Alterou status do pedido ${orderId} para ${status}`);
  };

  const adminSaveCoupon = (coupon: Coupon) => {
    const exists = db.coupons.some(c => c.id === coupon.id);
    let updatedCoupons = [];
    if (exists) {
      updatedCoupons = db.coupons.map(c => c.id === coupon.id ? coupon : c);
    } else {
      updatedCoupons = [coupon, ...db.coupons];
    }
    updateDbState({ ...db, coupons: updatedCoupons });
    addSystemLog('Admin Cupom', currentUser?.name || 'Admin', `${exists ? 'Editou' : 'Criou'} cupom ${coupon.code}`);
  };

  const adminDeleteCoupon = (id: string) => {
    const updatedCoupons = db.coupons.filter(c => c.id !== id);
    updateDbState({ ...db, coupons: updatedCoupons });
    addSystemLog('Admin Cupom', currentUser?.name || 'Admin', `Deletou cupom ID: ${id}`);
  };

  const adminSaveBanner = (banner: Banner) => {
    const exists = db.banners.some(b => b.id === banner.id);
    let updatedBanners = [];
    if (exists) {
      updatedBanners = db.banners.map(b => b.id === banner.id ? banner : b);
    } else {
      updatedBanners = [banner, ...db.banners];
    }
    updateDbState({ ...db, banners: updatedBanners });
  };

  const adminSaveBlogPost = (post: BlogPost) => {
    const exists = db.blogPosts.some(p => p.id === post.id);
    let updatedPosts = [];
    if (exists) {
      updatedPosts = db.blogPosts.map(p => p.id === post.id ? post : p);
    } else {
      updatedPosts = [post, ...db.blogPosts];
    }
    updateDbState({ ...db, blogPosts: updatedPosts });
    addSystemLog('Admin Blog', currentUser?.name || 'Admin', `${exists ? 'Editou' : 'Criou'} post no blog: ${post.title}`);
  };

  const adminDeleteBlogPost = (id: string) => {
    const updatedPosts = db.blogPosts.filter(p => p.id !== id);
    updateDbState({ ...db, blogPosts: updatedPosts });
    addSystemLog('Admin Blog', currentUser?.name || 'Admin', `Deletou post ID: ${id}`);
  };

  const adminReplySupport = (id: string, reply: string) => {
    const updatedMessages = db.supportMessages.map(m => {
      if (m.id === id) {
        return { ...m, reply, status: 'replied' as const };
      }
      return m;
    });
    updateDbState({ ...db, supportMessages: updatedMessages });
    addSystemLog('Admin Suporte', currentUser?.name || 'Admin', `Respondeu mensagem de suporte ID: ${id}`);
  };

  const adminReplyReview = (productId: string, reviewId: string, reply: string) => {
    const updatedProducts = db.products.map(p => {
      if (p.id === productId) {
        const updatedReviews = p.reviews.map(r => r.id === reviewId ? { ...r, adminReply: reply } : r);
        return { ...p, reviews: updatedReviews };
      }
      return p;
    });
    updateDbState({ ...db, products: updatedProducts });
    addSystemLog('Admin Review', currentUser?.name || 'Admin', `Respondeu review ID ${reviewId} do produto ${productId}`);
  };

  const adminAddProductQuestion = (productId: string, qText: string) => {
    const newQuestion: Question = {
      id: 'q_' + Math.floor(Math.random() * 100000),
      userName: currentUser?.name || 'Cliente Anônimo',
      text: qText,
      date: new Date().toLocaleDateString('pt-BR'),
    };

    const updatedProducts = db.products.map(p => {
      if (p.id === productId) {
        return { ...p, questions: [newQuestion, ...(p.questions || [])] };
      }
      return p;
    });

    updateDbState({ ...db, products: updatedProducts });
  };

  const adminReplyQuestion = (productId: string, questionId: string, reply: string) => {
    const updatedProducts = db.products.map(p => {
      if (p.id === productId) {
        const updatedQs = p.questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              answer: reply,
              answerDate: new Date().toLocaleDateString('pt-BR')
            };
          }
          return q;
        });
        return { ...p, questions: updatedQs };
      }
      return p;
    });
    updateDbState({ ...db, products: updatedProducts });
  };

  const adminAddProductReview = (productId: string, userName: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: 'r_' + Math.floor(Math.random() * 100000),
      userName,
      rating,
      comment,
      date: new Date().toLocaleDateString('pt-BR')
    };

    const updatedProducts = db.products.map(p => {
      if (p.id === productId) {
        const oldReviews = p.reviews || [];
        const reviews = [newReview, ...oldReviews];
        const avgRating = parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1));
        return { ...p, reviews, rating: avgRating };
      }
      return p;
    });

    updateDbState({ ...db, products: updatedProducts });
  };

  const addSupportMessage = (name: string, email: string, subject: string, message: string) => {
    const newMsg: SupportMessage = {
      id: 'msg_' + Math.floor(Math.random() * 100000),
      name,
      email,
      subject,
      message,
      date: new Date().toLocaleString('pt-BR'),
      status: 'unread'
    };

    const updatedMsgs = [newMsg, ...db.supportMessages];
    updateDbState({ ...db, supportMessages: updatedMsgs });
  };

  const addBlogComment = (postId: string, commentText: string) => {
    const newComment = {
      id: 'c_' + Math.floor(Math.random() * 100000),
      userName: currentUser?.name || 'Leitor Anônimo',
      comment: commentText,
      date: new Date().toLocaleDateString('pt-BR'),
    };

    const updatedPosts = db.blogPosts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    });

    updateDbState({ ...db, blogPosts: updatedPosts });
  };

  return (
    <StoreContext.Provider value={{
      db,
      currentUser,
      cart,
      wishlist,
      activeCoupon,
      shippingInfo,
      zipCode,
      searchHistory,
      currentNav,
      searchQuery,
      setSearchQuery,
      navigate,
      login,
      register,
      logout,
      updateProfile,
      addAddress,
      removeAddress,
      toggleNotificationRead,
      addToCart,
      updateCartQty,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      calculateShipping,
      selectShipping,
      placeOrder,
      cancelOrder,
      toggleWishlist,
      adminSaveProduct,
      adminDeleteProduct,
      adminUpdateOrderStatus,
      adminSaveCoupon,
      adminDeleteCoupon,
      adminSaveBanner,
      adminSaveBlogPost,
      adminDeleteBlogPost,
      adminReplySupport,
      adminReplyReview,
      adminAddProductQuestion,
      adminReplyQuestion,
      adminAddProductReview,
      addSupportMessage,
      addBlogComment,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
