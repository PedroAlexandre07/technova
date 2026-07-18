import { Product, User, Order, Coupon, BlogPost, Banner, SupportMessage, SystemLog, Review, Question, Address } from '../types';

export interface Database {
  products: Product[];
  users: User[];
  orders: Order[];
  coupons: Coupon[];
  blogPosts: BlogPost[];
  banners: Banner[];
  supportMessages: SupportMessage[];
  logs: SystemLog[];
  categories: { id: string; name: string; icon: string; count: number }[];
  brands: string[];
}

const DEFAULT_CATEGORIES = [
  { id: 'celulares', name: 'Celulares', icon: 'Smartphone', count: 18 },
  { id: 'notebooks', name: 'Notebooks', icon: 'Laptop', count: 12 },
  { id: 'pc_gamer', name: 'PC Gamer', icon: 'Cpu', count: 8 },
  { id: 'monitores', name: 'Monitores', icon: 'Monitor', count: 10 },
  { id: 'consoles', name: 'Consoles', icon: 'Gamepad2', count: 6 },
  { id: 'audio', name: 'Áudio', icon: 'Headphones', count: 15 },
  { id: 'acessorios', name: 'Acessórios', icon: 'Mouse', count: 25 },
];

const DEFAULT_BRANDS = [
  'Apple',
  'Samsung',
  'ASUS ROG',
  'NVIDIA',
  'Sony',
  'Logitech G',
  'LG',
  'Nintendo',
  'Microsoft',
  'Corsair',
];

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'b1',
    title: 'Samsung Galaxy S24 Ultra',
    subtitle: 'O poder da Inteligência Artificial em suas mãos. Compre agora com frete grátis e até 12x sem juros.',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1200',
    link: '/product/p2',
    type: 'hero',
    isActive: true,
  },
  {
    id: 'b2',
    title: ' setup gamer dos seus sonhos',
    subtitle: 'Até 25% de desconto em Placas de Vídeo RTX, Processadores e Computadores Gamer Completos.',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200',
    link: '/category/pc_gamer',
    type: 'hero',
    isActive: true,
  },
  {
    id: 'b3',
    title: 'PlayStation 5 Pro',
    subtitle: 'Nova fidelidade gráfica e carregamento ultra rápido. Unidades limitadas em estoque!',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200',
    link: '/product/p9',
    type: 'hero',
    isActive: true,
  },
  {
    id: 'b4',
    title: 'Ofertas da Semana: Som Premium',
    subtitle: 'Fones Wireless Sony e JBL com cancelamento de ruído ativo por tempo limitado.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
    link: '/category/audio',
    type: 'promo',
    isActive: true,
  },
  {
    id: 'b5',
    title: 'Notebooks para Produtividade',
    subtitle: 'Trabalhe e estude de onde quiser com a linha MacBook e Zenbook com bateria de longa duração.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600',
    link: '/category/notebooks',
    type: 'promo',
    isActive: true,
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Apple iPhone 15 Pro Max 256GB - Titânio Natural',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    description: 'O iPhone 15 Pro Max traz um design robusto e leve em titânio aeroespacial. Sua câmera ultra-angular de 48 MP e lente teleobjetiva de 5x permitem capturas cinematográficas. Equipado com o chip A17 Pro de última geração para performance imbatível em jogos pesados e IA.',
    category: 'celulares',
    subcategory: 'Smartphones Premium',
    price: 9499,
    promoPrice: 8299,
    warranty: '12 Meses',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600'
    ],
    rating: 4.9,
    reviews: [
      { id: 'r1', userName: 'Lucas Silveira', rating: 5, comment: 'Celular espetacular! O titânio é levíssimo e as fotos à noite são inacreditáveis.', date: '2026-06-10' },
      { id: 'r2', userName: 'Mariana Costa', rating: 4.8, comment: 'Desempenho incrível, mas esquenta um pouco ao jogar por muito tempo.', date: '2026-06-15' }
    ],
    questions: [
      { id: 'q1', userName: 'Guilherme P.', text: 'Vem com o carregador na caixa?', date: '2026-05-20', answer: 'Olá Guilherme! O produto acompanha cabo USB-C, mas a fonte de carregamento deve ser adquirida separadamente.', answerDate: '2026-05-21' }
    ],
    specs: {
      'Tela': 'Super Retina XDR OLED de 6.7" ProMotion 120Hz',
      'Processador': 'Apple A17 Pro (3nm)',
      'Memória RAM': '8 GB',
      'Armazenamento': '256 GB NVMe',
      'Câmeras': 'Traseira Tripla 48MP (Wide) + 12MP (Telephoto 5x) + 12MP (Ultrawide) e Lidar',
      'Bateria': '4441 mAh',
      'Peso': '221g'
    },
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    isDailyDeal: false,
    variations: [
      { name: 'Cor', options: ['Titânio Natural', 'Titânio Preto', 'Titânio Azul'] }
    ]
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24 Ultra 512GB - Titânio Cinza',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    description: 'Conheça o Galaxy S24 Ultra, o ápice da inovação móvel com Galaxy AI. Traduza chamadas em tempo real, aperfeiçoe fotos com retoques inteligentes e faça buscas inovadoras com o Circule para Pesquisar. Estrutura em titânio durável, caneta S Pen integrada e câmera de 200MP.',
    category: 'celulares',
    subcategory: 'Smartphones Premium',
    price: 8999,
    promoPrice: 7199,
    warranty: '12 Meses',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600'
    ],
    rating: 4.8,
    reviews: [
      { id: 'r3', userName: 'Roberto Santana', rating: 5, comment: 'A S Pen é fantástica para reuniões. E a câmera de 200MP tem um zoom incrível!', date: '2026-06-01' }
    ],
    questions: [],
    specs: {
      'Tela': 'Dynamic AMOLED 2X de 6.8" QHD+, Gorilla Glass Armor',
      'Processador': 'Snapdragon 8 Gen 3 for Galaxy',
      'Memória RAM': '12 GB',
      'Armazenamento': '512 GB UFS 4.0',
      'Câmeras': 'Traseira Quádrupla 200MP + 50MP + 12MP + 10MP com Zoom 100x',
      'Bateria': '5000 mAh com Carregamento Rápido 45W',
      'Acessórios': 'S Pen inclusa na carcaça'
    },
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isDailyDeal: true,
    variations: [
      { name: 'Capacidade', options: ['256GB', '512GB'] },
      { name: 'Cor', options: ['Titânio Cinza', 'Titânio Violeta', 'Titânio Amarelo'] }
    ]
  },
  {
    id: 'p3',
    name: 'PC Gamer TechNova Extreme Core i9 RTX 4070 Ti',
    brand: 'ASUS ROG',
    model: 'TN-Extreme i9',
    description: 'Máquina absoluta projetada para entusiastas e streamers de elite. Este PC Gamer traz o monstruoso processador Intel Core i9 de 14ª Geração refrigerado por Water Cooler de 360mm, placa gráfica NVIDIA RTX 4070 Ti de 12GB para Ray Tracing perfeito e 32GB de memória RAM DDR5.',
    category: 'pc_gamer',
    subcategory: 'Computadores Gamer',
    price: 13999,
    promoPrice: 11999,
    warranty: '24 Meses',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600'
    ],
    rating: 4.9,
    reviews: [
      { id: 'r4', userName: 'Bruno Alencar', rating: 5, comment: 'Roda absolutamente qualquer jogo no Ultra em 4K sem nem suar. Refrigeração excelente.', date: '2026-07-02' }
    ],
    questions: [
      { id: 'q2', userName: 'Claudio J.', text: 'Vem com sistema operacional instalado?', date: '2026-06-25', answer: 'Olá Claudio! Sim, o PC acompanha o Windows 11 Home de fábrica, ativado e pronto para uso.', answerDate: '2026-06-26' }
    ],
    specs: {
      'Processador': 'Intel Core i9-14900K (Até 6.0 GHz)',
      'Water Cooler': 'ROG Strix LC III 360 ARGB',
      'Placa de Vídeo': 'NVIDIA GeForce RTX 4070 Ti Super 12GB GDDR6X',
      'Memória RAM': '32 GB DDR5 6000MHz Corsair Vengeance',
      'Armazenamento': '2 TB SSD NVMe M.2 PCIe 4.0 (Leitura até 7400 MB/s)',
      'Placa Mãe': 'ASUS ROG Strix Z790-F Gaming Wifi',
      'Fonte': '850W ROG Thor 80 Plus Platinum Modular'
    },
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    isDailyDeal: false,
    variations: [
      { name: 'Gabinete', options: ['Preto RGB', 'Branco RGB'] }
    ]
  },
  {
    id: 'p4',
    name: 'MacBook Pro 16" Apple M3 Max 36GB - Cinza Espacial',
    brand: 'Apple',
    model: 'MacBook Pro 16 M3 Max',
    description: 'Projetado para mentes criativas e fluxos de trabalho extremos. O chip M3 Max conta com uma CPU de 14 núcleos e GPU de 30 núcleos, oferecendo renderização 3D, compilação de milhões de linhas de código e edição de vídeos em 8K simultâneos com fluidez insuperável e bateria para até 22 horas.',
    category: 'notebooks',
    subcategory: 'Notebooks Premium',
    price: 28999,
    promoPrice: 24999,
    warranty: '12 Meses',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600'
    ],
    rating: 5.0,
    reviews: [
      { id: 'r5', userName: 'Rodrigo M.', rating: 5, comment: 'Melhor notebook que já tive na vida. A tela Liquid Retina XDR é de outro planeta e a bateria dura o dia inteiro trabalhando com edição de fotos.', date: '2026-07-10' }
    ],
    questions: [],
    specs: {
      'Tela': '16.2" Liquid Retina XDR (3024x1964) 120Hz ProMotion',
      'Processador': 'Apple M3 Max (14 Cores CPU / 30 Cores GPU)',
      'Memória RAM': '36 GB Unificada',
      'Armazenamento': '1 TB SSD Ultrarrápido',
      'Conectividade': 'Wi-Fi 6E, Bluetooth 5.3, 3x Thunderbolt 4, HDMI, MagSafe 3',
      'Teclado': 'Magic Keyboard retroiluminado com Touch ID',
      'Autonomia': 'Até 22 Horas de Bateria'
    },
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    isDailyDeal: false
  },
  {
    id: 'p5',
    name: 'Monitor Gamer LG UltraGear OLED 27" 240Hz 0.03ms QHD',
    brand: 'LG',
    model: '27GR95QE-B',
    description: 'Experimente a revolução da tecnologia OLED em painéis gamer. Com tempo de resposta recorde de 0.03ms (GtG) e taxa de atualização insana de 240Hz, você terá uma nitidez absoluta de movimentos rápidos e contrastes infinitos com cores pretas reais perfeitas.',
    category: 'monitores',
    subcategory: 'Monitores',
    price: 4999,
    promoPrice: 3999,
    warranty: '12 Meses',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600'
    ],
    rating: 4.7,
    reviews: [
      { id: 'r6', userName: 'Felipe Soares', rating: 4.7, comment: 'O contraste do OLED é sensacional. Adeus vazamento de luz! O painel de 240Hz é incrivelmente fluido.', date: '2026-06-20' }
    ],
    questions: [],
    specs: {
      'Tamanho da Tela': '26.5 polegadas OLED',
      'Resolução': 'QHD (2560 x 1440)',
      'Frequência': '240 Hz',
      'Tempo de Resposta': '0.03 ms (Cinza para Cinza)',
      'Brilho': '200 cd/m²',
      'Contraste': '1.500.000:1',
      'Entradas': '2x HDMI 2.1, 1x DisplayPort 1.4, Hub USB 3.0'
    },
    isFeatured: true,
    isNew: false,
    isBestSeller: false,
    isDailyDeal: true
  },
  {
    id: 'p6',
    name: 'Placa de Vídeo NVIDIA GeForce RTX 4090 ROG Strix 24GB',
    brand: 'NVIDIA',
    model: 'ROG Strix RTX 4090 24G',
    description: 'A placa gráfica suprema para entusiastas. Equipada com a arquitetura NVIDIA Ada Lovelace, núcleos RT de 3ª geração e núcleos Tensor de 4ª geração, oferece suporte ao DLSS 3 para triplicar taxas de quadros em jogos 4K exigentes e criação em tempo real sem gargalos.',
    category: 'pc_gamer',
    subcategory: 'Placas de Vídeo',
    price: 15999,
    promoPrice: 14499,
    warranty: '36 Meses',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600'
    ],
    rating: 4.9,
    reviews: [],
    questions: [],
    specs: {
      'Chipset': 'NVIDIA GeForce RTX 4090',
      'Memória de Vídeo': '24 GB GDDR6X',
      'Barramento de Memória': '384-bit',
      'Interface': 'PCI Express 4.0 x16',
      'Saídas': '2x HDMI 2.1a, 3x DisplayPort 1.4a',
      'Conector de Energia': '1x 16-pin (12VHPWR)',
      'Fonte Recomendada': '1000W mínima'
    },
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    isDailyDeal: false
  },
  {
    id: 'p7',
    name: 'Headset Gamer Sem Fio Logitech G PRO X LIGHTSPEED',
    brand: 'Logitech G',
    model: 'G PRO X Lightspeed',
    description: 'Projetado em parceria com profissionais de eSports. Com áudio DTS Headphone:X 2.0 de 7.1 canais, drivers PRO-G de 50mm e microfone com tecnologia BLUE VO!CE para filtragem e clareza de estúdio em tempo real. Liberdade total sem fios a até 15 metros.',
    category: 'audio',
    subcategory: 'Headsets',
    price: 1499,
    promoPrice: 1149,
    warranty: '24 Meses',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600'
    ],
    rating: 4.6,
    reviews: [
      { id: 'r7', userName: 'Diego Nunes', rating: 4.5, comment: 'O conforto dos fones em couro sintético e veludo é ótimo. Bateria dura cerca de 20 horas fáceis.', date: '2026-05-18' }
    ],
    questions: [],
    specs: {
      'Transmissão': 'Sem fio LIGHTSPEED de 2,4 GHz',
      'Driver': 'PRO-G de malha híbrida de 50 mm',
      'Resposta de Frequência': '20 Hz - 20 kHz',
      'Impedância': '32 ohms',
      'Microfone': 'Eletreto de 6 mm com filtro Blue VO!CE',
      'Bateria': 'Até 20 horas por carga'
    },
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    isDailyDeal: false
  },
  {
    id: 'p8',
    name: 'Fones de Ouvido Bluetooth Sony WH-1000XM5 ANC',
    brand: 'Sony',
    model: 'WH-1000XM5',
    description: 'Líder de mercado em Cancelamento de Ruído Ativo (ANC). Equipado com processador integrado V1 e HD QN1, este fone de ouvido de nível audiófilo se adapta ao seu ambiente para silenciar qualquer distração. Áudio de alta resolução Hi-Res Audio, 30 horas de bateria e chamadas cristalinas.',
    category: 'audio',
    subcategory: 'Fones Bluetooth',
    price: 2499,
    promoPrice: 1999,
    warranty: '12 Meses',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600'
    ],
    rating: 4.8,
    reviews: [],
    questions: [],
    specs: {
      'Conexão': 'Bluetooth 5.2 (Multiponto para 2 aparelhos)',
      'Cancelamento de Ruído': 'Sim, Processadores Duplos com 8 microfones',
      'Autonomia da Bateria': 'Até 30 horas de reprodução com ANC ativo',
      'Codecs de Áudio': 'SBC, AAC, LDAC (Áudio de Alta Resolução)',
      'Sensores': 'Controles por toque, pausa automática ao tirar o fone',
      'Peso': '250g'
    },
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isDailyDeal: false
  },
  {
    id: 'p9',
    name: 'Sony PlayStation 5 Pro 1TB - Edição Limitada',
    brand: 'Sony',
    model: 'PlayStation 5 Pro',
    description: 'Experimente gráficos de tirar o fôlego com o console mais potente da Sony. O PS5 Pro traz uma GPU aprimorada com aceleração Ray Tracing de alta velocidade, a inovadora tecnologia de upscaling PSSR com inteligência artificial para rodar jogos em 4K real com 60FPS estáveis.',
    category: 'consoles',
    subcategory: 'PlayStation',
    price: 6999,
    promoPrice: 6299,
    warranty: '12 Meses',
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600'
    ],
    rating: 4.9,
    reviews: [
      { id: 'r8', userName: 'Arthur Ramos', rating: 5, comment: 'Simplesmente perfeito. Roda Alan Wake 2 e Horizon Forbidden West no Modo Desempenho Pro com uma nitidez incomparável.', date: '2026-07-05' }
    ],
    questions: [],
    specs: {
      'Processador CPU': 'AMD Zen 2 personalizado de 8 núcleos',
      'Processamento GPU': 'Arquitetura RDNA Pro, desempenho gráfico 45% mais rápido que PS5 Padrão',
      'Memória': '16 GB GDDR6 + 2 GB DDR5 auxiliares',
      'Armazenamento': 'SSD NVMe de 1 TB de velocidade extrema',
      'Conectividade': 'Wi-Fi 7, Ethernet Gigabit, 2x USB-C, HDMI 2.1',
      'Áudio': 'Tempest 3D AudioTech',
      'Mídia Física': 'Digital de fábrica (leitor de discos vendido separadamente)'
    },
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    isDailyDeal: false
  },
  {
    id: 'p10',
    name: 'Console Nintendo Switch OLED - Edição Mario Red',
    brand: 'Nintendo',
    model: 'Switch OLED Mario',
    description: 'Desfrute de cores vibrantes e pretos profundos com a tela OLED de 7 polegadas do Nintendo Switch, onde quer que você esteja. Esta edição especial celebra o icônico herói encanador Mario em uma belíssima carcaça vermelha, acompanhada do suporte traseiro amplo ajustável.',
    category: 'consoles',
    subcategory: 'Nintendo',
    price: 2499,
    promoPrice: 2099,
    warranty: '12 Meses',
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600'
    ],
    rating: 4.7,
    reviews: [],
    questions: [],
    specs: {
      'Tela': 'OLED Multitouch de 7.0 polegadas (1280x720)',
      'Armazenamento Interno': '64 GB (Expansível via MicroSD)',
      'Modos de Jogo': 'Portátil, Semi-Portátil (Tabletop) e TV',
      'Resolução Máxima na TV': '1080p via HDMI a 60 FPS',
      'Bateria': 'Íon de lítio 4310 mAh (Duração de 4.5 a 9 horas)'
    },
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    isDailyDeal: false
  },
  {
    id: 'p11',
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm - Titânio',
    brand: 'Apple',
    model: 'Watch Ultra 2',
    description: 'O relógio de aventura mais robusto e capaz da Apple, agora com o chip S9 SiP inovador. Tela Retina Sempre Ativa mais brilhante do mercado de 3000 nits, recurso inovador de Toque Duplo sem tocar na tela, GPS de dupla frequência de alta precisão e bateria para até 36 horas.',
    category: 'acessorios',
    subcategory: 'Smartwatch',
    price: 7999,
    promoPrice: 6999,
    warranty: '12 Meses',
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600'
    ],
    rating: 4.8,
    reviews: [],
    questions: [],
    specs: {
      'Caixa': '49 mm em Titânio Aeroespacial com bordas elevadas',
      'Brilho da Tela': 'Retina de até 3000 nits',
      'Chip': 'S9 SiP de 64 bits com Toque Duplo',
      'Sensores': 'Oxigênio no sangue, ECG, Batimentos, Temperatura corporal',
      'Resistência à água': 'Até 100 metros (Mergulho recreativo até 40m)',
      'Bateria': 'Até 36 horas em uso normal (72 horas em economia)'
    },
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    isDailyDeal: false
  },
  {
    id: 'p12',
    name: 'Teclado Mecânico Gamer Sem Fio Corsair K70 PRO MINI Wireless',
    brand: 'Corsair',
    model: 'K70 Pro Mini Wireless',
    description: 'Teclado gamer mecânico RGB em formato compacto de 60%. Ele une a alta performance e durabilidade das teclas CHERRY MX Red com as velocidades incríveis das tecnologias SLIPSTREAM WIRELESS de sub-1ms e Bluetooth multiponto com criptografia segura.',
    category: 'acessorios',
    subcategory: 'Teclados',
    price: 1199,
    promoPrice: 899,
    warranty: '24 Meses',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600'
    ],
    rating: 4.5,
    reviews: [],
    questions: [],
    specs: {
      'Formato': 'Compacto 60%',
      'Switches': 'Mecânicos Lineares CHERRY MX Red (Hot-swappable)',
      'Conexão': 'Slipstream Wireless 2.4GHz, Bluetooth 4.2 ou Cabo USB-C',
      'Iluminação': 'RGB por tecla personalizável com iCUE',
      'Memória Integrada': 'Até 50 perfis de atalhos e macros',
      'Bateria': 'Até 32 horas com RGB ativo (200 horas desligado)'
    },
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    isDailyDeal: false
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  { id: 'c1', code: 'TECH10', type: 'percent', value: 10, minSubtotal: 100, expiryDate: '2027-12-31', usageLimit: 100, usageCount: 15, isActive: true },
  { id: 'c2', code: 'TECHNOVAFRETE', type: 'free_shipping', value: 0, minSubtotal: 1500, expiryDate: '2027-12-31', usageLimit: 500, usageCount: 42, isActive: true },
  { id: 'c3', code: 'PROMO150', type: 'fixed', value: 150, minSubtotal: 2000, expiryDate: '2027-12-31', usageLimit: 50, usageCount: 5, isActive: true }
];

const DEFAULT_BLOG: BlogPost[] = [
  {
    id: 'b1',
    title: 'Guia de Compra: Como escolher a melhor Placa de Vídeo em 2026',
    summary: 'Análise detalhada sobre placas NVIDIA RTX série 50 e 40, resoluções ideais e gargalos de processamento.',
    content: 'Escolher uma placa de vídeo pode parecer complexo com tantas siglas e especificações. Neste guia de 2026, analisamos os principais fatores para sua compra: resolução alvo (FHD, QHD ou 4K), taxa de atualização (Hz) desejada e a compatibilidade do seu setup atual. A NVIDIA GeForce RTX 4070 Ti, por exemplo, oferece o melhor custo-benefício para quem quer jogar em QHD ultra a mais de 100 quadros por segundo, enquanto a RTX 4090 continua reinando absoluta para o verdadeiro 4K com Ray Tracing completo ativado. Verifique se sua fonte possui os conectores adequados e a potência mínima recomendada para evitar instabilidades.',
    category: 'Hardware',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=600',
    author: 'Daniel Marques (TechNova Lab)',
    date: '2026-07-15',
    views: 452,
    comments: [
      { id: 'c1', userName: 'Jefferson Alves', comment: 'Artigo excelente! Me ajudou a escolher a fonte certa para a RTX 4070 Ti.', date: '2026-07-16' }
    ]
  },
  {
    id: 'b2',
    title: 'iPhone 15 Pro Max vs Galaxy S24 Ultra: O Embate dos Titãs',
    summary: 'Colocamos os dois maiores smartphones do mercado lado a lado. Qual é o melhor para produtividade, jogos e fotografia?',
    content: 'O mercado de smartphones premium está mais competitivo do que nunca. De um lado, a Apple aposta em um design elegante de titânio aeroespacial e no processador A17 Pro com foco em performance bruta para jogos de console. Do outro, a Samsung revoluciona a experiência móvel com a suíte Galaxy AI de inteligência artificial generativa e a conveniência da S Pen embutida. Em termos de fotografia, o Galaxy se destaca pelo zoom óptico e digital insano de até 100x, ideal para registrar grandes distâncias, enquanto o iPhone brilha na gravação de vídeo profissional e na precisão tonal das cores. Ambos são dispositivos excepcionais; sua escolha dependerá de qual ecossistema você prefere.',
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
    author: 'Gabriela Lima',
    date: '2026-07-10',
    views: 618,
    comments: []
  },
  {
    id: 'b3',
    title: 'PlayStation 5 Pro: Vale a pena o upgrade gráficos em 2026?',
    summary: 'Análise técnica da aceleração de Ray Tracing e do upscaling PSSR com Inteligência Artificial.',
    content: 'O PS5 Pro chegou com a promessa de acabar com o dilema clássico dos consoles entre "Modo Qualidade" (30FPS com gráficos altos) e "Modo Desempenho" (60FPS com resolução reduzida). Graças ao hardware aprimorado e principalmente à tecnologia de reconstrução de imagem por IA (PSSR), os jogos rodam de forma fluida a 60FPS estáveis na mesma nitidez gráfica do modo de alta fidelidade do PS5 convencional. Se você possui uma TV OLED moderna com suporte a taxas de quadros altas (120Hz e VRR) e busca a experiência de console mais avançada disponível hoje, o upgrade se justifica amplamente.',
    category: 'Games',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600',
    author: 'Felipe Soares',
    date: '2026-07-01',
    views: 310,
    comments: []
  }
];

const DEFAULT_USERS: User[] = [
  {
    id: 'u1',
    name: 'Cliente Teste',
    email: 'cliente@technova.com',
    password: 'senha', // Simplificado para simulação
    role: 'customer',
    addresses: [
      { id: 'addr1', label: 'Minha Casa', street: 'Avenida Paulista', number: '1000', complement: 'Apto 101', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP', zipCode: '01310-100' }
    ],
    wishlist: ['p1', 'p8'],
    notifications: [
      { id: 'n1', title: 'Boas-vindas à TechNova!', message: 'Obrigado por se cadastrar na TechNova Store. Aproveite nosso cupom TECH10 para obter 10% de desconto em sua primeira compra.', date: '2026-07-18 10:00', isRead: false }
    ],
    createdAt: '2026-07-18',
    totalSpent: 0,
  },
  {
    id: 'u2',
    name: 'Administrador',
    email: 'admin@technova.com',
    password: 'admin',
    role: 'admin',
    addresses: [],
    wishlist: [],
    notifications: [],
    createdAt: '2026-07-18',
  }
];

const DEFAULT_ORDERS: Order[] = [];

const DEFAULT_SUPPORT: SupportMessage[] = [];

const DEFAULT_LOGS: SystemLog[] = [
  { id: 'l1', action: 'Banco de Dados', user: 'Sistema', date: '2026-07-18 11:00', details: 'Banco de dados simulado inicializado com sucesso.' }
];

export const loadDb = (): Database => {
  const localData = localStorage.getItem('technova_db_v1');
  if (localData) {
    try {
      const db = JSON.parse(localData);
      // Forçar zeramento solicitado pelo usuário
      db.orders = [];
      db.supportMessages = [];
      db.products = db.products.map((p: any) => p.stock <= 3 ? { ...p, stock: 15 } : p);
      saveDb(db);
      return db;
    } catch (e) {
      console.error('Erro ao ler banco de dados do localStorage, redefinindo', e);
    }
  }

  // Se não houver dados, inicializa com os defaults
  const db: Database = {
    products: DEFAULT_PRODUCTS.map(p => p.stock <= 3 ? { ...p, stock: 15 } : p),
    users: DEFAULT_USERS,
    orders: DEFAULT_ORDERS,
    coupons: DEFAULT_COUPONS,
    blogPosts: DEFAULT_BLOG,
    banners: DEFAULT_BANNERS,
    supportMessages: DEFAULT_SUPPORT,
    logs: DEFAULT_LOGS,
    categories: DEFAULT_CATEGORIES,
    brands: DEFAULT_BRANDS,
  };
  saveDb(db);
  return db;
};

export const saveDb = (db: Database) => {
  localStorage.setItem('technova_db_v1', JSON.stringify(db));
};

// Logs helper
export const addSystemLog = (action: string, user: string, details: string) => {
  const db = loadDb();
  const newLog: SystemLog = {
    id: 'l' + Math.floor(Math.random() * 100000),
    action,
    user,
    date: new Date().toLocaleString('pt-BR'),
    details,
  };
  db.logs.unshift(newLog);
  saveDb(db);
};
