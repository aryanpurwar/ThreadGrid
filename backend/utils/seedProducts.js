import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Aero Court Ivory',
    slug: 'aero-court-ivory',
    sku: 'TG-SNK-001',
    category: 'sneakers',
    description: 'A smooth leather court sneaker with cloud cushioning and limited-run tonal details.',
    price: 15999,
    compareAtPrice: 19999,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1400&q=90'
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    colors: [{ name: 'Ivory', hex: '#f1eadf' }],
    inventory: 18,
    badge: 'Limited Drop',
    details: ['Full-grain upper', 'Cushioned cupsole', 'Numbered release card']
  },
  {
    name: 'Vanta Runner Clay',
    slug: 'vanta-runner-clay',
    sku: 'TG-SNK-002',
    category: 'sneakers',
    description: 'A sculpted runner with breathable mesh, warm clay overlays and a responsive street sole.',
    price: 18499,
    compareAtPrice: 23999,
    images: [
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1605408499391-6368c628ef42?auto=format&fit=crop&w=1400&q=90'
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 12'],
    colors: [{ name: 'Clay', hex: '#b97455' }],
    inventory: 12,
    badge: 'Few Left',
    details: ['Layered mesh', 'Stabilized heel cage', 'Foam midsole']
  },
  {
    name: 'Studio Overshirt Moss',
    slug: 'studio-overshirt-moss',
    sku: 'TG-CLT-001',
    category: 'clothes',
    description: 'A brushed cotton overshirt made for clean layering, finished with matte hardware.',
    price: 12499,
    compareAtPrice: 15999,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1400&q=90'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Moss', hex: '#69715f' }],
    inventory: 24,
    badge: 'New Season',
    details: ['Midweight brushed cotton', 'Relaxed cut', 'Hidden side pockets']
  },
  {
    name: 'Contour Knit Set',
    slug: 'contour-knit-set',
    sku: 'TG-CLT-002',
    category: 'clothes',
    description: 'A premium ribbed knit co-ord with a soft handfeel and polished city-ready silhouette.',
    price: 14999,
    compareAtPrice: 18999,
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=90'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Oat', hex: '#d9c8ae' }],
    inventory: 15,
    badge: 'Limited Drop',
    details: ['Ribbed knit texture', 'Soft stretch recovery', 'Tailored relaxed fit']
  },
  {
    name: 'Noir Utility Jacket',
    slug: 'noir-utility-jacket',
    sku: 'TG-CLT-003',
    category: 'clothes',
    description: 'A minimal utility layer with premium weight, structured shoulders and everyday function.',
    price: 19999,
    compareAtPrice: 25999,
    images: [
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1400&q=90'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Noir', hex: '#202020' }],
    inventory: 10,
    badge: 'Archive Fit',
    details: ['Structured twill', 'Two-way zipper', 'Adjustable cuffs']
  },
  {
    name: 'Pearl Low 82',
    slug: 'pearl-low-82',
    sku: 'TG-SNK-003',
    category: 'sneakers',
    description: 'A pearl-toned low profile sneaker with suede accents and a timeless premium shape.',
    price: 16999,
    compareAtPrice: 21999,
    images: [
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1400&q=90',
      'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=1400&q=90'
    ],
    sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    colors: [{ name: 'Pearl', hex: '#eee9df' }],
    inventory: 20,
    badge: 'Member Pick',
    details: ['Premium suede trims', 'Low-profile sole', 'Waxed laces']
  }
];

const seedProducts = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} ThreadGrid products`);
  process.exit();
};

seedProducts();
