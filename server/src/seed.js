import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './config/db.js';
import { User } from './models/User.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';
import { Coupon } from './models/Coupon.js';
import { Order } from './models/Order.js';
import { Cart } from './models/Cart.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Starting database seeding with Pakistani Market Catalog...');

    // Clear existing collections safely
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ]);
    console.log('[Seed] Cleared existing collections.');

    // 1. Create Users (Admin & Customer)
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Admin@Zasas2026';
    const customerPassword = process.env.CUSTOMER_INITIAL_PASSWORD || 'Customer@123';

    const admin = await User.create({
      name: 'ZASAS Atelier Director',
      email: 'admin@zasas.com',
      password: adminPassword,
      role: 'admin',
      phone: '+92 300 1234567',
      addresses: [
        {
          label: 'Flagship Atelier',
          recipientName: 'ZASAS Atelier Director',
          phone: '+92 300 1234567',
          streetAddress: 'Plot 14-C, 10th Commercial Street, Phase 5 DHA',
          city: 'Karachi',
          province: 'Sindh',
          postalCode: '75500',
          isDefault: true,
        },
      ],
    });

    const customer = await User.create({
      name: 'Ayla Mansoor',
      email: 'customer@zasas.com',
      password: customerPassword,
      role: 'customer',
      phone: '+92 321 9876543',
      addresses: [
        {
          label: 'Residence',
          recipientName: 'Ayla Mansoor',
          phone: '+92 321 9876543',
          streetAddress: 'House 82, Sector F-7/2, Margalla Road',
          city: 'Islamabad',
          province: 'Islamabad Capital Territory',
          postalCode: '44000',
          isDefault: true,
        },
      ],
    });

    console.log(`[Seed] Created Admin: ${admin.email} / ${adminPassword}`);
    console.log(`[Seed] Created Customer: ${customer.email} / ${customerPassword}`);

    // 2. Create Categories tailored for Pakistani Market:
    // Women's Clothing, Men's Clothing, Kids, Watches, Shoes, Fragrances
    const categories = await Category.insertMany([
      {
        name: "Women's Pret & Couture",
        slug: 'women',
        tagline: 'Pure raw silks, gossamer chiffons, luxury embroidered lawn & celebratory formals.',
        description: 'Bespoke silhouettes designed for grand celebrations, eid soirees, and daily elegance.',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
        featured: true,
        order: 1,
      },
      {
        name: "Men's Eastern & Pret",
        slug: 'men',
        tagline: 'Pure Egyptian Giza cottons, embroidered raw silk kurta shalwars, and brocade waistcoats.',
        description: 'Impeccable subcontinental tailoring for grooms, ceremonial soirees, and dignified evening wear.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
        featured: true,
        order: 2,
      },
      {
        name: "Kids' Festive Atelier",
        slug: 'kids',
        tagline: 'Handcrafted junior kurtas, waistcoat sets, mirror-work angrakhas, and crushed silk shararas.',
        description: 'Celebratory festive ensembles designed with lightweight breathable fabrics for young royals.',
        image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=1200',
        featured: true,
        order: 3,
      },
      {
        name: 'Horology & Luxury Watches',
        slug: 'watches',
        tagline: 'Swiss sapphire chronographs, ceramic bezels, and diamond-embellished rose gold timepieces.',
        description: 'Distinguished precision horology curated for discerning Pakistani gentlemen and ladies.',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1200',
        featured: true,
        order: 4,
      },
      {
        name: 'Artisanal Footwear & Shoes',
        slug: 'footwear',
        tagline: 'Hand-stitched Kaptaan Peshawari chappals, velvet tilla khussas, and leather slip-on loafers.',
        description: 'Centuries-old shoe craft fused with premium padded insoles for enduring comfort.',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
        featured: true,
        order: 5,
      },
      {
        name: 'Haute Parfumerie & Oud',
        slug: 'fragrances',
        tagline: 'Aged Royal Cambodi Oud, Taif Rose, velvet ambergris, and artisanal unisex extraits.',
        description: 'Sensory perfumes master-blended with high concentration oils designed for enduring sillage.',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200',
        featured: true,
        order: 6,
      },
    ]);

    console.log(`[Seed] Created ${categories.length} Pakistani market categories.`);

    const catMap = categories.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {});

    // 3. Create Products for Women, Men, Kids, Watches, Shoes, and Perfumes
    const productsData = [
      // ─── WOMEN'S CLOTHING ───
      {
        name: 'Noor-e-Kashmir Raw Silk Kalidar Set',
        slug: 'noor-e-kashmir-raw-silk-kalidar-set',
        sku: 'ZSS-WMN-001',
        category: catMap['women'],
        subCategory: 'Pret & Formals',
        price: 28500,
        compareAtPrice: 33000,
        currency: 'PKR',
        description: 'An architectural 16-kali flared kalidar cut from pure 80g Pakistani raw silk. Features intricate hand-rendered silver zardozi along the collar, French knots, and dyed raw silk culottes.',
        editorialStory: 'Inspired by ancient Mughal arches in Shalimar Gardens, Noor-e-Kashmir balances timeless austerity with graceful ceremonial movement. Finished with pure silk buttons.',
        details: [
          'Fabric: 100% Pure Raw Silk (80g export weight)',
          'Embroidery: Fine silver zardozi, dabka, and French knots',
          'Cut: Flared 16-kali kalidar tunic with side pockets',
          'Includes: Stitched Kalidar, culottes, and organza dupatta',
        ],
        fabricCare: ['Dry clean only at an authorized luxury garment cleaner', 'Do not bleach', 'Low steam iron on reverse'],
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Warm Ivory', hex: '#F8F5EF' },
          { name: 'Muted Bronze', hex: '#9A7955' },
        ],
        variants: [
          { sku: 'ZSS-WMN-001-WIV-XS', size: 'XS', color: 'Warm Ivory', stock: 5 },
          { sku: 'ZSS-WMN-001-WIV-S', size: 'S', color: 'Warm Ivory', stock: 8 },
          { sku: 'ZSS-WMN-001-WIV-M', size: 'M', color: 'Warm Ivory', stock: 12 },
          { sku: 'ZSS-WMN-001-WIV-L', size: 'L', color: 'Warm Ivory', stock: 6 },
          { sku: 'ZSS-WMN-001-MBR-S', size: 'S', color: 'Muted Bronze', stock: 7 },
          { sku: 'ZSS-WMN-001-MBR-M', size: 'M', color: 'Muted Bronze', stock: 9 },
        ],
        tags: ['women', 'clothing', 'pret', 'raw-silk', 'eid-edit', 'featured'],
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isPublished: true,
      },
      {
        name: 'Gul-e-Lala Embroidered Luxury Lawn 3-Piece',
        slug: 'gul-e-lala-embroidered-luxury-lawn-3-piece',
        sku: 'ZSS-WMN-002',
        category: catMap['women'],
        subCategory: 'Luxury Lawn',
        price: 15800,
        compareAtPrice: 18500,
        currency: 'PKR',
        description: 'Masterfully woven 100% long-staple Swiss voile cotton lawn. Adorned with delicate schiffli cutwork, embroidered organza hem borders, and a pure silk jacquard dupatta.',
        editorialStory: 'A tribute to spring in Lahore. Intricately rendered floral motifs whisper of garden courtyards and fragrant jasmine blooms under the golden Punjab sun.',
        details: [
          'Shirt: Embroidered Swiss Voile Cotton Lawn (3.2m)',
          'Dupatta: Pure Tissue Silk Jacquard with Scalloped Edges (2.5m)',
          'Trouser: Dyed Cambric Cotton with organza patti (2.5m)',
        ],
        fabricCare: ['Hand wash gently in cold water or dry clean', 'Dry in shade to preserve textile dyes'],
        images: [
          'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Pastel Lilac', hex: '#D8C2E7' },
          { name: 'Pistachio Mist', hex: '#D2E0D0' },
        ],
        variants: [
          { sku: 'ZSS-WMN-002-LIL-S', size: 'S', color: 'Pastel Lilac', stock: 10 },
          { sku: 'ZSS-WMN-002-LIL-M', size: 'M', color: 'Pastel Lilac', stock: 15 },
          { sku: 'ZSS-WMN-002-PIS-S', size: 'S', color: 'Pistachio Mist', stock: 8 },
          { sku: 'ZSS-WMN-002-PIS-M', size: 'M', color: 'Pistachio Mist', stock: 12 },
        ],
        tags: ['women', 'clothing', 'lawn', 'summer', 'unstitched'],
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        isPublished: true,
      },

      // ─── MEN'S CLOTHING ───
      {
        name: 'Shah Jahan Raw Silk Kurta Shalwar & Jamawar Waistcoat',
        slug: 'shah-jahan-raw-silk-kurta-shalwar-jamawar-waistcoat',
        sku: 'ZSS-MEN-001',
        category: catMap['men'],
        subCategory: 'Ceremonial & Pret',
        price: 34500,
        compareAtPrice: 39000,
        currency: 'PKR',
        description: 'Signature men’s 3-piece formal ensemble. Features a tailored pure raw silk kurta and traditional Pakistani shalwar, layered with an antique gold hand-woven Banarsi Jamawar waistcoat.',
        editorialStory: 'Commanding regal poise. Designed for weddings, festive mehfils, and monumental celebrations. Finished with antique Mughal metallic crest buttons and cuff detailing.',
        details: [
          'Kurta & Shalwar: 100% Pure Raw Silk with tailored band collar',
          'Waistcoat: Hand-woven pure Banarsi Jamawar with metallic zari',
          'Buttons: Custom handcrafted brass crest buttons',
          'Fit: Structured modern tailored cut',
        ],
        fabricCare: ['Dry clean only at specialist cleaners', 'Store on structured wooden hangers'],
        images: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Royal Charcoal & Gold', hex: '#2A2A28' },
          { name: 'Off-White Ivory', hex: '#F8F5EF' },
        ],
        variants: [
          { sku: 'ZSS-MEN-001-CHR-S', size: 'S', color: 'Royal Charcoal & Gold', stock: 6 },
          { sku: 'ZSS-MEN-001-CHR-M', size: 'M', color: 'Royal Charcoal & Gold', stock: 10 },
          { sku: 'ZSS-MEN-001-CHR-L', size: 'L', color: 'Royal Charcoal & Gold', stock: 8 },
          { sku: 'ZSS-MEN-001-IVR-M', size: 'M', color: 'Off-White Ivory', stock: 7 },
          { sku: 'ZSS-MEN-001-IVR-L', size: 'L', color: 'Off-White Ivory', stock: 5 },
        ],
        tags: ['men', 'clothing', 'kurta-shalwar', 'waistcoat', 'groom', 'festive-edit'],
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isPublished: true,
      },
      {
        name: 'Peshawar Heritage Egyptian Giza Cotton Kurta Shalwar',
        slug: 'peshawar-heritage-egyptian-giza-cotton-kurta-shalwar',
        sku: 'ZSS-MEN-002',
        category: catMap['men'],
        subCategory: 'Classic Eastern',
        price: 13500,
        compareAtPrice: 16000,
        currency: 'PKR',
        description: 'Crafted from ultra-refined 120s count Egyptian Giza long-staple cotton. Featuring discreet tonal thread work along the placket, classic sherwani collar, and genuine Australian mother-of-pearl buttons.',
        editorialStory: 'Everyday understated perfection. Soft against the skin in high summer yet impeccably crisp, presenting a dignified silhouette from Juma prayers to evening dinner engagements.',
        details: [
          'Fabric: 120/2 Egyptian Giza Luxury Cotton',
          'Finishing: Liquid ammonia finish for permanent silky sheen and crease resistance',
          'Collar: Modern 1.25 inch tailored ban collar',
          'Buttons: Hand-carved natural mother-of-pearl',
        ],
        fabricCare: ['Machine wash cold on delicate cycle or hand wash', 'Medium warm iron while slightly damp'],
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Obsidian Black', hex: '#1C1C1A' },
          { name: 'Pure Pearl White', hex: '#FFFFFF' },
          { name: 'Desert Dune', hex: '#D8CAB8' },
        ],
        variants: [
          { sku: 'ZSS-MEN-002-OBS-S', size: 'S', color: 'Obsidian Black', stock: 12 },
          { sku: 'ZSS-MEN-002-OBS-M', size: 'M', color: 'Obsidian Black', stock: 18 },
          { sku: 'ZSS-MEN-002-OBS-L', size: 'L', color: 'Obsidian Black', stock: 14 },
          { sku: 'ZSS-MEN-002-WHT-M', size: 'M', color: 'Pure Pearl White', stock: 15 },
          { sku: 'ZSS-MEN-002-DNE-L', size: 'L', color: 'Desert Dune', stock: 8 },
        ],
        tags: ['men', 'clothing', 'cotton', 'classic', 'bestseller'],
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: true,
        isPublished: true,
      },

      // ─── KIDS' FESTIVE COLLECTION ───
      {
        name: 'Choti Begum Embroidered Organza Angrakha & Sharara (Girls)',
        slug: 'choti-begum-embroidered-organza-angrakha-sharara',
        sku: 'ZSS-KID-001',
        category: catMap['kids'],
        subCategory: 'Girls Festive',
        price: 11950,
        compareAtPrice: 14000,
        currency: 'PKR',
        description: 'Festive junior angrakha cut from ethereal blush pink organza, embellished with gotta patti, soft resham florals, and paired with a crushed silk tiered sharara and lightweight dupatta.',
        editorialStory: 'Designed so young girls can dance, twirl, and celebrate festivities in supreme lightweight comfort without heavy scratchy linings.',
        details: [
          'Angrakha: Pure silk organza with 100% soft cotton lawn inner lining',
          'Sharara: Crushed silk with metallic gotta border',
          'Sizes tailored for ages 3 to 12 years',
        ],
        fabricCare: ['Dry clean only', 'Store in cotton garment bag'],
        images: [
          'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'],
        colors: [
          { name: 'Blush Rose', hex: '#EBBAB9' },
          { name: 'Pale Mint', hex: '#CCE2D6' },
        ],
        variants: [
          { sku: 'ZSS-KID-001-BLS-3Y', size: '3-4Y', color: 'Blush Rose', stock: 5 },
          { sku: 'ZSS-KID-001-BLS-5Y', size: '5-6Y', color: 'Blush Rose', stock: 8 },
          { sku: 'ZSS-KID-001-BLS-7Y', size: '7-8Y', color: 'Blush Rose', stock: 7 },
          { sku: 'ZSS-KID-001-MNT-5Y', size: '5-6Y', color: 'Pale Mint', stock: 6 },
        ],
        tags: ['kids', 'girls', 'angrakha', 'sharara', 'eid-edit'],
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: false,
        isPublished: true,
      },
      {
        name: 'Shehzada Junior Boys Silk Kurta & Brocade Waistcoat',
        slug: 'shehzada-junior-boys-silk-kurta-brocade-waistcoat',
        sku: 'ZSS-KID-002',
        category: catMap['kids'],
        subCategory: 'Boys Festive',
        price: 9800,
        compareAtPrice: 12000,
        currency: 'PKR',
        description: 'Royal midnight navy raw silk kurta pajama paired with a miniature gold woven brocade waistcoat. Featuring comfortable soft lining and antique metal buttons.',
        editorialStory: 'Miniature aristocracy. Designed to match our father-and-son festive collection with effortless charm.',
        details: [
          'Set includes: Silk Kurta, White Pajama, and Brocade Waistcoat',
          'Breathable cotton lining throughout waistband and collar',
          'Ages: 2 to 12 Years',
        ],
        fabricCare: ['Dry clean recommended', 'Steam iron low'],
        images: [
          'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y'],
        colors: [
          { name: 'Midnight Navy & Gold', hex: '#16233B' },
          { name: 'Emerald Green & Gold', hex: '#133E2B' },
        ],
        variants: [
          { sku: 'ZSS-KID-002-NVY-3Y', size: '3-4Y', color: 'Midnight Navy & Gold', stock: 6 },
          { sku: 'ZSS-KID-002-NVY-5Y', size: '5-6Y', color: 'Midnight Navy & Gold', stock: 9 },
          { sku: 'ZSS-KID-002-NVY-7Y', size: '7-8Y', color: 'Midnight Navy & Gold', stock: 7 },
          { sku: 'ZSS-KID-002-EME-5Y', size: '5-6Y', color: 'Emerald Green & Gold', stock: 5 },
        ],
        tags: ['kids', 'boys', 'kurta', 'waistcoat', 'eid-collection'],
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: true,
        isPublished: true,
      },

      // ─── WATCHES (MEN & WOMEN) ───
      {
        name: 'ZASAS Sultan Chronograph 42mm Sapphire Edition (Men)',
        slug: 'zasas-sultan-chronograph-42mm-sapphire-edition',
        sku: 'ZSS-WAT-001',
        category: catMap['watches'],
        subCategory: "Men's Horology",
        price: 46500,
        compareAtPrice: 52000,
        currency: 'PKR',
        description: 'Precision chronograph timepiece featuring a scratch-resistant sapphire crystal lens, surgical grade 316L stainless steel case, unidirectional ceramic bezel, and genuine embossed Italian calf leather strap.',
        editorialStory: 'Crafted for the distinguished Pakistani connoisseur. Water-resistant to 50 meters, featuring luminescent index markers and sub-dial chronometers calibrated for timeless elegance.',
        details: [
          'Case Diameter: 42mm | Thickness: 11.5mm',
          'Glass: Anti-reflective double-domed Sapphire Crystal',
          'Movement: High-torque Japanese Quartz Chronograph Movement',
          'Strap: 22mm interchangeable genuine calfskin leather with butterfly deployant clasp',
          'Warranty: 2-Year International Atelier Guarantee',
        ],
        fabricCare: ['Wipe clean with microfiber cloth', 'Water resistant to 5 ATM; avoid hot water baths and steam'],
        images: [
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['42mm'],
        colors: [
          { name: 'Obsidian Black & Silver', hex: '#1C1C1A' },
          { name: 'Midnight Navy & Rose Gold', hex: '#16233B' },
        ],
        variants: [
          { sku: 'ZSS-WAT-001-OBS-42', size: '42mm', color: 'Obsidian Black & Silver', stock: 7 },
          { sku: 'ZSS-WAT-001-NVY-42', size: '42mm', color: 'Midnight Navy & Rose Gold', stock: 5 },
        ],
        tags: ['watches', 'men', 'chronograph', 'accessories', 'luxury'],
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isPublished: true,
      },
      {
        name: 'Noor-ul-Ain Rose Gold Mother-of-Pearl Diamond Dial (Women)',
        slug: 'noor-ul-ain-rose-gold-mother-of-pearl-diamond-dial',
        sku: 'ZSS-WAT-002',
        category: catMap['watches'],
        subCategory: "Women's Horology",
        price: 38500,
        compareAtPrice: 44000,
        currency: 'PKR',
        description: 'A jewelry masterpiece. Hand-cut iridescent Australian natural mother-of-pearl dial framed by micro-pave cubic zirconia crystals, 18K rose gold PVD coating, and fluid milanese mesh bracelet.',
        editorialStory: 'Named after the celestial jewel of Persian legend. Gracefully catches candlelight during evening dinners and festive soirees with shimmering, feminine subtlety.',
        details: [
          'Case Size: 34mm slim profile (7mm depth)',
          'Dial: Genuine natural shimmering white Mother-of-Pearl',
          'Strap: Adjustable magnetic milanese rose gold stainless steel mesh',
          'Water Resistance: 3 ATM (splash resistant)',
          'Warranty: 2-Year Atelier Movement Warranty',
        ],
        fabricCare: ['Avoid exposure to harsh perfumes and chemical cleaners', 'Polish with jewelry cloth'],
        images: [
          'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['34mm'],
        colors: [
          { name: '18K Rose Gold Mesh', hex: '#B76E79' },
          { name: 'Champagne Silver Mesh', hex: '#D6D6D6' },
        ],
        variants: [
          { sku: 'ZSS-WAT-002-RSG-34', size: '34mm', color: '18K Rose Gold Mesh', stock: 8 },
          { sku: 'ZSS-WAT-002-SLV-34', size: '34mm', color: 'Champagne Silver Mesh', stock: 6 },
        ],
        tags: ['watches', 'women', 'jewelry', 'rose-gold', 'featured'],
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isPublished: true,
      },

      // ─── ARTISANAL FOOTWEAR & SHOES (MEN & WOMEN) ───
      {
        name: 'Kaptaan Classic Handcrafted Peshawari Chappal (Men)',
        slug: 'kaptaan-classic-handcrafted-peshawari-chappal',
        sku: 'ZSS-SHOE-001',
        category: catMap['footwear'],
        subCategory: "Men's Footwear",
        price: 11500,
        compareAtPrice: 13500,
        currency: 'PKR',
        description: 'Authentic Charsadda Kaptaan chappal shaped from 100% full-grain cowhide leather. Hand-stitched with heavy-duty wax threads, padded dual-density memory foam footbed, and durable repurposed tyre outsole.',
        editorialStory: 'The definitive badge of northern heritage and contemporary Pakistani pride. Rugged yet supremely comfortable for long celebratory wedding days.',
        details: [
          'Upper: 100% Full-Grain Vegetable Tanned Leather',
          'Insole: Orthopedic memory foam covered in soft sheepskin',
          'Sole: Recycled tyre rubber grip outsole for lifetime durability',
          'Origin: Handmade by master cobblers in Peshawar',
        ],
        fabricCare: ['Apply neutral leather balm periodically', 'Do not soak in water; dry naturally'],
        images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['39', '40', '41', '42', '43', '44'],
        colors: [
          { name: 'Charcoal Black', hex: '#1C1C1A' },
          { name: 'Rich Mustard Tan', hex: '#9A7955' },
        ],
        variants: [
          { sku: 'ZSS-SHOE-001-BLK-40', size: '40', color: 'Charcoal Black', stock: 6 },
          { sku: 'ZSS-SHOE-001-BLK-41', size: '41', color: 'Charcoal Black', stock: 12 },
          { sku: 'ZSS-SHOE-001-BLK-42', size: '42', color: 'Charcoal Black', stock: 14 },
          { sku: 'ZSS-SHOE-001-BLK-43', size: '43', color: 'Charcoal Black', stock: 8 },
          { sku: 'ZSS-SHOE-001-TAN-41', size: '41', color: 'Rich Mustard Tan', stock: 9 },
          { sku: 'ZSS-SHOE-001-TAN-42', size: '42', color: 'Rich Mustard Tan', stock: 11 },
        ],
        tags: ['shoes', 'footwear', 'men', 'peshawari', 'chappal', 'bestseller'],
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isPublished: true,
      },
      {
        name: 'Mughal Jahangiri Embellished Velvet Khussa (Women)',
        slug: 'mughal-jahangiri-embellished-velvet-khussa',
        sku: 'ZSS-SHOE-002',
        category: catMap['footwear'],
        subCategory: "Women's Footwear",
        price: 8900,
        compareAtPrice: 10500,
        currency: 'PKR',
        description: 'Pure micro-velvet jutti khussa encrusted with antique gold dabka, French tilla wire, and seed pearls. Features a double-padded genuine leather inner sole designed to prevent shoe bites.',
        editorialStory: 'Handcrafted in Kasur by artisans carrying four generations of royal subcontinental jutti making lineage. Beautifully complements raw silk kalidars, lehengas, and pret kurtas.',
        details: [
          'Upper: Pure Velvet with 100% hand dabka & tilla needlework',
          'Lining & Sole: 100% Pure Genuine Camel Leather',
          'Insole: Extra-padded cushioned heel and arch support',
          'Shape: Traditional rounded toe with zero pinch guarantee',
        ],
        fabricCare: ['Store wrapped in muslin cloth', 'Clean velvet with dry soft brush'],
        images: [
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['36', '37', '38', '39', '40', '41'],
        colors: [
          { name: 'Antique Gold & Emerald', hex: '#9A7955' },
          { name: 'Crimson Garnet', hex: '#722F37' },
        ],
        variants: [
          { sku: 'ZSS-SHOE-002-GLD-37', size: '37', color: 'Antique Gold & Emerald', stock: 8 },
          { sku: 'ZSS-SHOE-002-GLD-38', size: '38', color: 'Antique Gold & Emerald', stock: 15 },
          { sku: 'ZSS-SHOE-002-GLD-39', size: '39', color: 'Antique Gold & Emerald', stock: 12 },
          { sku: 'ZSS-SHOE-002-CRM-38', size: '38', color: 'Crimson Garnet', stock: 7 },
        ],
        tags: ['shoes', 'footwear', 'women', 'khussa', 'bridal', 'handcrafted'],
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isPublished: true,
      },

      // ─── PERFUMES & HAUTE PARFUMERIE (MEN & WOMEN) ───
      {
        name: 'Dehn Al Oud Royal Cambodi Extrait de Parfum 50ml (Men)',
        slug: 'dehn-al-oud-royal-cambodi-extrait-de-parfum',
        sku: 'ZSS-PERF-001',
        category: catMap['fragrances'],
        subCategory: "Men's Haute Parfumerie",
        price: 18500,
        compareAtPrice: 22000,
        currency: 'PKR',
        description: 'An opulent, concentrated extrait de parfum. Formulated with 35% oil concentration highlighting 15-year aged wild Cambodian agarwood (Oud), smoky birch tar, ambergris, dark leather, and warm bourbon vanilla.',
        editorialStory: 'Imperial strength and enigmatic warmth. Projects commanding sillage and lingers on pashmina shawls and raw silk kurtas for well over 24 hours. Bottled in heavy crystal with magnetic gold cap.',
        details: [
          'Concentration: Extrait de Parfum (35% Pure Oil Concentration)',
          'Top Notes: Saffron, Bergamot, Cardamom',
          'Heart Notes: Smoked Birch, Bulgarian Rose, Aged Oud Resin',
          'Base Notes: Royal Ambergris, Cambodian Agarwood, Leather, Civet, Musk',
          'Volume: 50ml / 1.7 FL. OZ. in luxury presentation box',
        ],
        fabricCare: ['Spray on pulse points and fabric from 6 inches away', 'Keep away from direct sunlight and excessive heat'],
        images: [
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['50ml'],
        colors: [
          { name: 'Amber Gold Elixir', hex: '#D4AF37' },
        ],
        variants: [
          { sku: 'ZSS-PERF-001-50ML', size: '50ml', color: 'Amber Gold Elixir', stock: 15 },
        ],
        tags: ['perfumes', 'fragrances', 'men', 'oud', 'luxury', 'featured'],
        isFeatured: true,
        isNewArrival: true,
        isBestSeller: true,
        isPublished: true,
      },
      {
        name: 'Taif Rose & Velvet Ambergris Eau de Parfum 100ml (Women)',
        slug: 'taif-rose-velvet-ambergris-eau-de-parfum',
        sku: 'ZSS-PERF-002',
        category: catMap['fragrances'],
        subCategory: "Women's Haute Parfumerie",
        price: 16500,
        compareAtPrice: 19500,
        currency: 'PKR',
        description: 'A luminous, intoxicating elixir celebrating the world-famous morning roses of the Arabian highlands. Blended with Sambac jasmine, velvety white musk, Madagascar vanilla, and radiant golden amber.',
        editorialStory: 'A delicate yet unforgettable whisper of femininity. Elicits compliments wherever you walk, leaving a romantic trail of crystalline petals and velvety musk in the air.',
        details: [
          'Concentration: Eau de Parfum (25% Oil Concentration)',
          'Top Notes: Hand-harvested Taif Rose, Pink Pepper, Lychee',
          'Heart Notes: Sambac Jasmine, White Peony, Damascena Rose',
          'Base Notes: Velvet Ambergris, White Musk, Soft Sandalwood, Tonka Bean',
          'Volume: 100ml / 3.4 FL. OZ. encased in frosted glass with atomizer',
        ],
        fabricCare: ['Store upright in a cool, dry vanity', 'External fragrance use only'],
        images: [
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['100ml'],
        colors: [
          { name: 'Rose Quartz Elixir', hex: '#E2B2B8' },
        ],
        variants: [
          { sku: 'ZSS-PERF-002-100ML', size: '100ml', color: 'Rose Quartz Elixir', stock: 18 },
        ],
        tags: ['perfumes', 'fragrances', 'women', 'rose', 'floral', 'bestseller'],
        isFeatured: true,
        isNewArrival: false,
        isBestSeller: true,
        isPublished: true,
      },
      {
        name: 'Iskandar Mysore Sandalwood & Bergamot Extrait 75ml (Unisex)',
        slug: 'iskandar-mysore-sandalwood-bergamot-extrait',
        sku: 'ZSS-PERF-003',
        category: catMap['fragrances'],
        subCategory: 'Unisex Parfumerie',
        price: 15200,
        compareAtPrice: 17500,
        currency: 'PKR',
        description: 'Crisp sun-drenched Italian bergamot married with creamy sacred Mysore sandalwood, Kashmiri saffron, Haitian vetiver, and clean cedarwood. A modern unisex masterpiece.',
        editorialStory: 'Transcends gender with intellectual elegance. Fresh and sparkling in daylight meetings, yet warm, sensual, and comforting as evening descends over the Arabian Sea.',
        details: [
          'Concentration: Extrait de Parfum (30% Essential Oil)',
          'Top Notes: Sunlit Bergamot, Green Cardamom, Kashmiri Saffron',
          'Heart Notes: Orris Root, Violet Leaf, Frankincense',
          'Base Notes: Mysore Sandalwood, Cashmeran, Cedarwood, Vetiver',
          'Volume: 75ml / 2.5 FL. OZ.',
        ],
        fabricCare: ['Avoid direct exposure to sunlight', 'Mist over collar and wrist pulse points'],
        images: [
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200',
        ],
        sizes: ['75ml'],
        colors: [
          { name: 'Smoky Gold', hex: '#B89B72' },
        ],
        variants: [
          { sku: 'ZSS-PERF-003-75ML', size: '75ml', color: 'Smoky Gold', stock: 14 },
        ],
        tags: ['perfumes', 'fragrances', 'unisex', 'sandalwood', 'modern'],
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        isPublished: true,
      },
    ];

    const products = await Product.create(productsData);
    console.log(`[Seed] Created ${products.length} luxury Pakistani products with variant stock across all categories.`);

    // 4. Create Coupons
    await Coupon.create([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 5000,
        maxDiscount: 4000,
        isActive: true,
      },
      {
        code: 'ZASAS2026',
        discountType: 'fixed',
        discountValue: 2500,
        minOrderAmount: 20000,
        isActive: true,
      },
      {
        code: 'EIDMUBARAK',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 15000,
        maxDiscount: 6000,
        isActive: true,
      },
    ]);
    console.log('[Seed] Created promotional coupons.');

    // 5. Create Sample Confirmed Orders for Customer (COD)
    const sampleProduct1 = products[0]; // Noor-e-Kashmir Kalidar
    const sampleVariant1 = sampleProduct1.variants[1];
    const sampleProduct2 = products[2]; // Shah Jahan Mens
    const sampleVariant2 = sampleProduct2.variants[1];

    await Order.create({
      orderNumber: 'ZS-2026-10492',
      user: customer._id,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: {
        fullName: 'Ayla Mansoor',
        phone: customer.phone,
        streetAddress: 'House 82, Sector F-7/2, Margalla Road',
        apartment: 'Villa B',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        postalCode: '44000',
        deliveryInstructions: 'Please call before arrival. Guard at the gate.',
      },
      items: [
        {
          product: sampleProduct1._id,
          name: sampleProduct1.name,
          image: sampleProduct1.images[0],
          sku: sampleVariant1.sku,
          size: sampleVariant1.size,
          color: sampleVariant1.color,
          price: sampleProduct1.price,
          quantity: 1,
          subtotal: sampleProduct1.price,
        },
      ],
      subtotal: sampleProduct1.price,
      discount: 0,
      shippingFee: 0,
      total: sampleProduct1.price,
      currency: 'PKR',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      statusHistory: [
        {
          status: 'confirmed',
          timestamp: new Date(Date.now() - 3600000 * 24 * 2),
          note: 'Order placed via Cash on Delivery (COD). Confirmed by automated verification.',
          changedBy: 'System',
        },
        {
          status: 'processing',
          timestamp: new Date(Date.now() - 3600000 * 24),
          note: 'Ensemble being packed in bespoke atelier gift box at Karachi fulfillment center.',
          changedBy: 'Atelier Director',
        },
      ],
    });

    await Order.create({
      orderNumber: 'ZS-2026-10381',
      user: customer._id,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: {
        fullName: 'Ayla Mansoor',
        phone: customer.phone,
        streetAddress: 'House 82, Sector F-7/2, Margalla Road',
        apartment: 'Villa B',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        postalCode: '44000',
      },
      items: [
        {
          product: sampleProduct2._id,
          name: sampleProduct2.name,
          image: sampleProduct2.images[0],
          sku: sampleVariant2.sku,
          size: sampleVariant2.size,
          color: sampleVariant2.color,
          price: sampleProduct2.price,
          quantity: 1,
          subtotal: sampleProduct2.price,
        },
      ],
      subtotal: sampleProduct2.price,
      discount: 2500,
      shippingFee: 0,
      total: sampleProduct2.price - 2500,
      currency: 'PKR',
      paymentMethod: 'cod',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      statusHistory: [
        {
          status: 'confirmed',
          timestamp: new Date(Date.now() - 3600000 * 24 * 10),
          note: 'Order confirmed with Cash on Delivery.',
          changedBy: 'System',
        },
        {
          status: 'dispatched',
          timestamp: new Date(Date.now() - 3600000 * 24 * 8),
          note: 'Handed over to TCS Express with tracking CN # 7718928312.',
          changedBy: 'Courier Desk',
        },
        {
          status: 'delivered',
          timestamp: new Date(Date.now() - 3600000 * 24 * 6),
          note: 'Delivered and cash collected successfully.',
          changedBy: 'TCS Rider',
        },
      ],
    });

    console.log('[Seed] Created customer orders with status history.');
    console.log('[Seed] Database seeding completed successfully!');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedData();
