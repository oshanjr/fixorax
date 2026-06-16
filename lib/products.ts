export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  gallery: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
  specs: { name: string; value: string }[];
  stockStatus: 'available' | 'low-stock' | 'out-of-stock';
  stockCount: number;
  variants?: {
    name: string;
    options: string[];
  }[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-iphone15pro',
    name: 'Fixora iPhone 15 Pro Max (Titanium)',
    price: 485000,
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1695048065091-fe69032608bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601784551146-12c4eef79a9e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unleash state-of-the-art titanium engineering. Features the revolutionary A17 Pro ultra-silicon chip, customized action slider, and the advanced 5x optical telephoto camera lens, curated by FixoraX\'s premium mobile curators.',
    rating: 4.9,
    reviews: 124,
    badge: 'Flagship Peak',
    stockStatus: 'low-stock',
    stockCount: 3,
    specs: [
      { name: 'Processor', value: 'A17 Pro Chip (6-Core GPU)' },
      { name: 'Build Material', value: 'Grade 5 Aerospace Titanium' },
      { name: 'Screen', value: '6.7-inch Super Retina XDR OLED' },
      { name: 'Camera', value: '48MP Main / 5x Optical Zoom' }
    ],
    variants: [
      { name: 'Storage Capacity', options: ['256GB', '512GB', '1TB'] },
      { name: 'Titanium Finish', options: ['Natural Titanium', 'Blue Titanium', 'Black Silicon-Glass'] }
    ]
  },
  {
    id: 'prod-s24ultra',
    name: 'Galaxy S24 Ultra Onyx Edition',
    price: 445000,
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583573636246-18cb2246697f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Meet the pinnacle of mobile artificial intelligence. Integrates the state-of-the-art Galaxy AI suite, a stunning flat titanium frame, and the legendary embedded S-Pen stylus.',
    rating: 4.8,
    reviews: 82,
    badge: 'AI Advanced',
    stockStatus: 'available',
    stockCount: 15,
    specs: [
      { name: 'Processor', value: 'Snapdragon 8 Gen 3 For Galaxy' },
      { name: 'Display Detail', value: '6.8-inch Dynamic AMOLED 2X QHD+' },
      { name: 'Stylus Integration', value: 'Embedded Ultra-low Latency S-Pen' },
      { name: 'Primary Camera', value: '200MP Quad Rear Lens Array' }
    ],
    variants: [
      { name: 'Memory Configuration', options: ['12GB RAM + 512GB', '12GB RAM + 1TB'] },
      { name: 'Titanium Trim', options: ['Titanium Gray', 'Titanium Violet', 'Onyx Black'] }
    ]
  },
  {
    id: 'prod-pixel8pro',
    name: 'Google Pixel 8 Pro Obsidian',
    price: 320000,
    category: 'Smartphones',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The ultimate Google software and device synergy. Powered by the Google Tensor G3 chip, taking mobile photography into the stratosphere with Magic Eraser and Best Take AI integrations.',
    rating: 4.7,
    reviews: 58,
    badge: 'Pure Google',
    stockStatus: 'available',
    stockCount: 8,
    specs: [
      { name: 'AI Engine', value: 'Google Tensor G3 (Titan M2 Security)' },
      { name: 'Screen Type', value: '6.7-inch LTPO OLED Super Actua' },
      { name: 'Primary Camera', value: '50MP Octa PD Main Lens' }
    ],
    variants: [
      { name: 'Chassis Finish', options: ['Obsidian Black', 'Porcelain White', 'Bay Blue'] }
    ]
  },
  {
    id: 'prod-magsafecase',
    name: 'Fixora Aramid Fibres MagShield Case',
    price: 18500,
    category: 'Cases & Protection',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-slim aerospace grade aramid fibre weave shielding. Designed with integrated sub-surface N52 magnets for strong seamless MagSafe docking compatibility.',
    rating: 5.0,
    reviews: 19,
    badge: 'Ultra Shield',
    stockStatus: 'available',
    stockCount: 45,
    specs: [
      { name: 'Shield Material', value: '600D Military Aramid Fibre' },
      { name: 'Magnetic Force', value: 'N52 Ultra-force Magnets' },
      { name: 'Profile thickness', value: '0.85mm Ultra-slim feel' }
    ],
    variants: [
      { name: 'Device Fit', options: ['iPhone 15 Pro Max', 'Galaxy S24 Ultra', 'Pixel 8 Pro'] }
    ]
  },
  {
    id: 'prod-magsafecharger',
    name: 'Fixora Halo-Charge 3-in-1 Dock',
    price: 32500,
    category: 'Chargers & Cables',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A premium multi-device desktop staging ground. Charges phone, smartwatch, and wireless earbuds simultaneously on high-grade tempered glass and aluminum pedestals.',
    rating: 4.9,
    reviews: 41,
    badge: 'Best Seller',
    stockStatus: 'available',
    stockCount: 30,
    specs: [
      { name: 'Input Support', value: 'USB-C Power Delivery 45W' },
      { name: 'Output Speeds', value: '15W MagSafe / 5W Watch / 5W Qi Buds' },
      { name: 'Build Materials', value: 'Satin Aluminum & Tempered Dark Glass' }
    ],
    variants: [
      { name: 'Mains Adapter', options: ['UK Standard (Sri Lanka)', 'US 2-pin Flat', 'EU Round Pin'] }
    ]
  },
  {
    id: 'prod-airpodspro',
    name: 'Apple AirPods Pro (2nd Gen) USB-C',
    price: 95000,
    category: 'Audio & Wearables',
    image: 'https://images.unsplash.com/photo-1588449668338-d15168b5a4c5?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1588449668338-d15168b5a4c5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The premium reference in active sound suppression. Implements active noise cancellation up to 2x more powerful, customized transparency mode, adaptive audio, and spatial sound tuning.',
    rating: 5.0,
    reviews: 240,
    badge: 'Pure Acoustics',
    stockStatus: 'available',
    stockCount: 120,
    specs: [
      { name: 'Acoustic Driver', value: 'Custom High-excursion Apple Driver' },
      { name: 'Wireless Chip', value: 'Apple H2 Silicon' },
      { name: 'Water Resistance', value: 'IP54 Dust, Sweat and Water Proof' }
    ]
  },
  {
    id: 'prod-wf1000xm5',
    name: 'Sony WF-1000XM5 Hi-Res Buds',
    price: 110000,
    category: 'Audio & Wearables',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Unrivaled Hi-Res Wireless noise-cancelling performance. Engineered with dual noise-cancelling processors and a wide-frequency reproducing Dynamic Driver X.',
    rating: 4.8,
    reviews: 31,
    stockStatus: 'available',
    stockCount: 45,
    specs: [
      { name: 'DAC/Amplifier', value: 'Integrated Processor V2 & QN2e' },
      { name: 'Audio Codecs', value: 'LDAC, AAC, SBC (Hi-Res Wireless)' },
      { name: 'Battery Reserve', value: 'Up to 24 Hours with wireless charging case' }
    ]
  },
  {
    id: 'prod-screenguard',
    name: 'Extreme Sapphire Crystal Armor',
    price: 12500,
    category: 'Cases & Protection',
    image: 'https://images.unsplash.com/photo-1541140111769-46f951e70908?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541140111769-46f951e70908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Premium synthetic sapphire crystal protection shield with Mohs 9H hardness level. Resists micro-scratches and heavy metal impact perfectly while ensuring 99.9% pristine screen clarity.',
    rating: 4.6,
    reviews: 90,
    badge: 'Liquid Proof Fit',
    stockStatus: 'available',
    stockCount: 30,
    specs: [
      { name: 'Core Depth', value: 'Mohs 9H Synthetic Sapphire Armour' },
      { name: 'Surface Finish', value: 'Anti-fingerprint Oleophobic Overlay' },
      { name: 'Shatter Protection', value: 'Multi-layer explosion-proof shield' }
    ],
    variants: [
      { name: 'Device Form', options: ['iPhone 15 Pro Max', 'Galaxy S24 Ultra', 'Pixel 8 Pro'] }
    ]
  }
];
