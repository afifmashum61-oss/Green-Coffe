// Green Cafe POS Seed Data

const CATEGORIES = [
    { id: 'all', name: 'Semua Menu', icon: 'fa-utensils', count: 16 },
    { id: 'coffee', name: 'Kopi & Espresso', icon: 'fa-mug-hot', count: 4, badge: 'Popular' },
    { id: 'tea', name: 'Teh Organic', icon: 'fa-leaf', count: 3 },
    { id: 'juice', name: 'Cold-Pressed Juice', icon: 'fa-glass-water', count: 3, badge: 'Fresh' },
    { id: 'makanan', name: 'Makanan Utama', icon: 'fa-bowl-food', count: 4 },
    { id: 'pastry', name: 'Pastry & Roti', icon: 'fa-bread-slice', count: 2 },
    { id: 'bowls', name: 'Healthy Bowls', icon: 'fa-seedling', count: 2 },
    { id: 'dessert', name: 'Dessert & Cake', icon: 'fa-cake-candles', count: 2 }
];

const MENU_ITEMS = [
    {
        id: 101,
        name: 'Avocado Green Zinger Burger',
        category: 'makanan',
        price: 45000,
        originalPrice: 55000,
        rating: 4.9,
        reviewsCount: 128,
        badge: 'Bestseller',
        discountBadge: '18% OFF',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        description: 'Burger vegetarian gurih dengan patty alpukat, keju emmental, selada organik, dan saus spesial green zinger.',
        options: {
            sugar: false,
            ice: false,
            spicy: ['Tidak Pedas', 'Sedang', 'Pedas Mampus'],
            extras: [
                { name: 'Extra Patty Alpukat', price: 12000 },
                { name: 'Keju Emmental Melted', price: 7000 },
                { name: 'Kentang Goreng Herb', price: 15000 }
            ]
        }
    },
    {
        id: 102,
        name: 'Grilled Salmon Super Bowl',
        category: 'bowls',
        price: 68000,
        originalPrice: 75000,
        rating: 4.9,
        reviewsCount: 94,
        badge: 'Bestseller',
        discountBadge: '10% OFF',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        description: 'Salmon panggang segar, edamame, quinoa, alpukat slice, dan dressing wijen sangrai organik.',
        options: {
            spicy: ['Original', 'Spicy Sesame'],
            extras: [
                { name: 'Extra Salmon Slice 50g', price: 25000 },
                { name: 'Poached Egg', price: 6000 },
                { name: 'Extra Quinoa', price: 10000 }
            ]
        }
    },
    {
        id: 103,
        name: 'Margherita Green Basil Pizza',
        category: 'makanan',
        price: 52000,
        originalPrice: 62000,
        rating: 4.8,
        reviewsCount: 110,
        badge: 'Popular',
        discountBadge: '16% OFF',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
        description: 'Pizza tipis krispi bertabur saus tomat italia, keju mozarella cair, dan daun basil hijau segar.',
        options: {
            extras: [
                { name: 'Extra Mozzarella Cheese', price: 10000 },
                { name: 'Jamur Truffle Slice', price: 15000 }
            ]
        }
    },
    {
        id: 104,
        name: 'Iced Matcha Oat Latte',
        category: 'tea',
        price: 32000,
        originalPrice: 38000,
        rating: 4.9,
        reviewsCount: 210,
        badge: 'Bestseller',
        discountBadge: '15% OFF',
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
        description: 'Matcha Uji Jepang kelas premium dipadu susu gandum (Oat Milk) creamy dan es segar.',
        options: {
            sugar: ['100% (Normal)', '75% (Less Sugar)', '50% (Half Sugar)', '0% (No Sugar)'],
            ice: ['Normal Ice', 'Less Ice', 'No Ice'],
            extras: [
                { name: 'Espresso Shot', price: 6000 },
                { name: 'Matcha Cream Foam', price: 7000 },
                { name: 'Boba Gula Aren', price: 5000 }
            ]
        }
    },
    {
        id: 105,
        name: 'Green Supreme Cold-Pressed Juice',
        category: 'juice',
        price: 28000,
        originalPrice: 35000,
        rating: 4.7,
        reviewsCount: 76,
        badge: 'Organic',
        discountBadge: '20% OFF',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
        description: 'Jus Murni tanpa gula tambahan: Kale, Apel Hijau, Mentimun, Lemon, dan Jahe Organik.',
        options: {
            ice: ['Normal Ice', 'Less Ice', 'No Ice (Chilled)'],
            extras: [
                { name: 'Chia Seeds Topping', price: 4000 },
                { name: 'Collagen Shot Booster', price: 10000 }
            ]
        }
    },
    {
        id: 106,
        name: 'Caramel Macchiato Avocado Brew',
        category: 'coffee',
        price: 36000,
        originalPrice: 42000,
        rating: 4.8,
        reviewsCount: 145,
        badge: 'Chef Choice',
        discountBadge: '14% OFF',
        image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80',
        description: 'Perpaduan espresso espresso arabika house blend, sirup karamel gurih, dan puree alpukat lembut.',
        options: {
            sugar: ['100% (Normal)', '75% (Less)', '50% (Half)', '0% (Zero)'],
            ice: ['Normal Ice', 'Less Ice', 'Hot Served'],
            extras: [
                { name: 'Extra Espresso Shot', price: 6000 },
                { name: 'Vanilla Ice Cream Scoop', price: 8000 }
            ]
        }
    },
    {
        id: 107,
        name: 'Chocolate Lava Cake with Vanilla Gelato',
        category: 'dessert',
        price: 38000,
        originalPrice: 48000,
        rating: 4.9,
        reviewsCount: 88,
        badge: 'Favorit',
        discountBadge: '20% OFF',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
        description: 'Kue cokelat leleh hangat dipadu satu scoop gelato vanila asli Madagaskar.',
        options: {
            extras: [
                { name: 'Extra Gelato Scoop', price: 12000 },
                { name: 'Strawberry Slice', price: 5000 }
            ]
        }
    },
    {
        id: 108,
        name: 'Organic Acai Berry Smoothie Bowl',
        category: 'bowls',
        price: 48000,
        originalPrice: 58000,
        rating: 4.9,
        reviewsCount: 62,
        badge: 'Healthy Choice',
        discountBadge: '17% OFF',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
        description: 'Smoothie buah acai & pisang dengan topping granola krispi, buah naga, blueberry, dan chia seed.',
        options: {
            extras: [
                { name: 'Extra Honey Drizzle', price: 4000 },
                { name: 'Almond Flakes', price: 6000 }
            ]
        }
    },
    {
        id: 109,
        name: 'Artisan Butter Croissant',
        category: 'pastry',
        price: 22000,
        originalPrice: 26000,
        rating: 4.7,
        reviewsCount: 90,
        badge: 'Fresh Baked',
        discountBadge: '15% OFF',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        description: 'Croissant khas Perancis berbahan pure mentega mentah, renyah di luar dan lembut berlapis di dalam.',
        options: {
            heating: ['Dipanaskan (Warm)', 'Suhu Ruang (Normal)'],
            extras: [
                { name: 'Selai Nutella Chocolate', price: 6000 },
                { name: 'Cream Cheese Dip', price: 7000 }
            ]
        }
    },
    {
        id: 110,
        name: 'V60 Single Origin Gayo Arabica',
        category: 'coffee',
        price: 30000,
        originalPrice: 35000,
        rating: 4.8,
        reviewsCount: 52,
        badge: 'Specialty',
        discountBadge: '14% OFF',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        description: 'Manual brew V60 biji kopi Aceh Gayo Organik dengan aroma buah peach dan fruity sweetness.',
        options: {
            temperature: ['Hot (Panas)', 'Iced (Dingin)'],
            grindSize: ['Medium Light', 'Medium Dark']
        }
    },
    {
        id: 111,
        name: 'Pistachio Kunafa Pastry',
        category: 'pastry',
        price: 34000,
        originalPrice: 40000,
        rating: 4.9,
        reviewsCount: 43,
        badge: 'New Item',
        discountBadge: '15% OFF',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        description: 'Pastry renyah bergaya Timur Tengah berisi krim keju manis dan taburan kacang pistachio hijau.',
        options: {
            extras: [
                { name: 'Extra Pistachio Sauce', price: 8000 }
            ]
        }
    },
    {
        id: 112,
        name: 'Pandan Aren Coconut Coffee',
        category: 'coffee',
        price: 29000,
        originalPrice: 34000,
        rating: 4.8,
        reviewsCount: 180,
        badge: 'Bestseller',
        discountBadge: '14% OFF',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
        description: 'Kopi susu gula aren dengan ekstra aroma alami daun pandan wangi dan santan kelapa muda.',
        options: {
            sugar: ['100% (Normal)', '75% (Less)', '50% (Half)', '0% (Zero)'],
            ice: ['Normal Ice', 'Less Ice']
        }
    },
    {
        id: 113,
        name: 'Grilled Chicken Caesar Salad',
        category: 'makanan',
        price: 46000,
        originalPrice: 52000,
        rating: 4.7,
        reviewsCount: 78,
        badge: 'Healthy',
        discountBadge: '11% OFF',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        description: 'Dada ayam panggang tender, romain lettuce segar, crouton gandum, parmesan, dan caesar dressing.',
        options: {
            extras: [
                { name: 'Extra Dada Ayam Panggang', price: 15000 },
                { name: 'Extra Keju Parmesan', price: 6000 }
            ]
        }
    },
    {
        id: 114,
        name: 'Dragon Fruit Citrus Cold Detox',
        category: 'juice',
        price: 26000,
        originalPrice: 32000,
        rating: 4.8,
        reviewsCount: 45,
        badge: 'Detox',
        discountBadge: '18% OFF',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
        description: 'Perasan Segar Buah Naga Merah, Jeruk Sunkist, dan Air Kelapa Murni pembakar toksin.',
        options: {
            ice: ['Normal Ice', 'Less Ice', 'No Ice']
        }
    },
    {
        id: 115,
        name: 'Chamomile Mint Organic Tea',
        category: 'tea',
        price: 24000,
        originalPrice: 28000,
        rating: 4.6,
        reviewsCount: 38,
        badge: 'Relaxing',
        discountBadge: '14% OFF',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        description: 'Teh bunga kamomil organik penenang pikiran yang harum dengan sensasi daun mint segar.',
        options: {
            sugar: ['Tawar (No Sugar)', 'Madu Asli Alami (+Rp 4.000)'],
            temperature: ['Hot Teapot (Teko Panas)', 'Iced Tea Glass (Es)']
        }
    },
    {
        id: 116,
        name: 'Matcha Green Tea Tiramisu',
        category: 'dessert',
        price: 36000,
        originalPrice: 42000,
        rating: 4.9,
        reviewsCount: 81,
        badge: 'Chef Special',
        discountBadge: '14% OFF',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=600&q=80',
        description: 'Tiramisu lembut khas Italia yang direndam bubuk matcha asli dan lapisan mascarpone.',
        options: {}
    }
];

const PROMO_VOUCHERS = [
    { code: 'GREENSAVE15', discountPercent: 15, maxDiscount: 30000, minPurchase: 50000, description: 'Diskon 15% khusus pembelian min 50rb' },
    { code: 'TASTY30', discountPercent: 30, maxDiscount: 45000, minPurchase: 100000, description: 'Flat 30% OFF Pembelian Pertama' },
    { code: 'MEMBER20', discountPercent: 20, maxDiscount: 25000, minPurchase: 40000, description: 'Diskon Spesial 20% Member Green Cafe' }
];

const MEMBERS_LIST = [
    { id: 'M-001', name: 'Budi Santoso', phone: '081234567890', points: 450, tier: 'Gold' },
    { id: 'M-002', name: 'Siti Rahma', phone: '085712345678', points: 890, tier: 'Platinum' },
    { id: 'M-003', name: 'Andi Wijaya', phone: '081987654321', points: 120, tier: 'Silver' },
    { id: 'M-004', name: 'Dewi Lestari', phone: '082133445566', points: 310, tier: 'Gold' }
];

const TABLES_LIST = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `Meja #${i + 1}`,
    capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
    status: i === 2 || i === 5 ? 'Occupied' : 'Available'
}));
