import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Product } from '../src/models/Product.js';
import { Category } from '../src/models/Category.js';
import { Order } from '../src/models/Order.js';

describe('ZASAS Luxury E-Commerce API Suite', () => {
  let customerToken = '';
  let customerCookie = '';
  let adminCookie = '';
  let sampleProduct = null;
  let sampleCategory = null;

  beforeAll(async () => {
    await connectDB();

    // Clean test state
    await User.deleteMany({ email: { $in: ['test-customer@zasas.com', 'test-admin@zasas.com'] } });
    await Product.deleteMany({ sku: 'TEST-SKU-001' });
    await Category.deleteMany({ slug: 'test-pret' });

    // Seed test category
    sampleCategory = await Category.create({
      name: 'Test Pret Luxury',
      slug: 'test-pret',
      tagline: 'Artisanal silk pret',
      description: 'Handcrafted test collection',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    });

    // Seed test product
    sampleProduct = await Product.create({
      name: 'Gul-e-Bahar Raw Silk Ensemble',
      slug: 'gul-e-bahar-raw-silk-ensemble',
      sku: 'TEST-SKU-001',
      category: sampleCategory._id,
      subCategory: 'Pret',
      price: 24500,
      compareAtPrice: 28000,
      currency: 'PKR',
      description: 'High-end embroidered pure raw silk ensemble.',
      images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'],
      sizes: ['S', 'M'],
      colors: [{ name: 'Warm Ivory', hex: '#F8F5EF' }],
      variants: [
        { sku: 'TEST-SKU-001-S', size: 'S', color: 'Warm Ivory', stock: 10 },
        { sku: 'TEST-SKU-001-M', size: 'M', color: 'Warm Ivory', stock: 5 },
      ],
      tags: ['pret', 'new-arrivals'],
      isFeatured: true,
      isPublished: true,
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: ['test-customer@zasas.com', 'test-admin@zasas.com'] } });
    await Product.deleteMany({ sku: 'TEST-SKU-001' });
    await Category.deleteMany({ slug: 'test-pret' });
    await Order.deleteMany({ customerEmail: 'test-customer@zasas.com' });
    await disconnectDB();
  });

  describe('Health & Public Catalog Endpoints', () => {
    it('GET /api/health should return system status with Pakistani market PKR info', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.market).toContain('PKR');
    });

    it('GET /api/v1/products should return published products with pagination', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.totalCount).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/v1/products/:slug should return individual product details', async () => {
      const res = await request(app).get(`/api/v1/products/${sampleProduct.slug}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.sku).toBe('TEST-SKU-001');
      expect(res.body.product.price).toBe(24500);
    });

    it('GET /api/v1/products with search should filter by title keyword', async () => {
      const res = await request(app).get('/api/v1/products?search=Gul-e-Bahar');
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBeGreaterThanOrEqual(1);
      expect(res.body.products[0].name).toContain('Gul-e-Bahar');
    });
  });

  describe('Authentication & Role-Based Access Control', () => {
    it('POST /api/v1/auth/register should create customer account and return cookie', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'ZASAS Test Patron',
          email: 'test-customer@zasas.com',
          password: 'Password@123',
          phone: '+92 300 0000000',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('test-customer@zasas.com');
      expect(res.body.user.role).toBe('customer');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      customerCookie = cookies[0];
    });

    it('POST /api/v1/auth/login with invalid password should fail safely', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test-customer@zasas.com',
          password: 'WrongPassword456',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/v1/auth/me should restore session from HTTP-only cookie', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', customerCookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('test-customer@zasas.com');
    });

    it('Admin endpoints should forbid unauthenticated requests', async () => {
      const res = await request(app).get('/api/v1/admin/dashboard');
      expect(res.status).toBe(401);
    });

    it('Admin endpoints should forbid normal customer accounts with 403', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Cookie', customerCookie);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Administrative privileges are required');
    });

    it('Admin login and access to dashboard stats', async () => {
      await User.create({
        name: 'Super Admin',
        email: 'test-admin@zasas.com',
        password: 'AdminPassword@123',
        role: 'admin',
      });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test-admin@zasas.com',
          password: 'AdminPassword@123',
        });

      expect(loginRes.status).toBe(200);
      adminCookie = loginRes.headers['set-cookie'][0];

      const dashboardRes = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Cookie', adminCookie);

      expect(dashboardRes.status).toBe(200);
      expect(dashboardRes.body.success).toBe(true);
      expect(dashboardRes.body.stats).toBeDefined();
    });
  });

  describe('Order Processing, Cash on Delivery, & Inventory Validation', () => {
    it('Should reject checkout if variant inventory is insufficient', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .send({
          customerEmail: 'test-customer@zasas.com',
          customerPhone: '+92 300 0000000',
          shippingAddress: {
            fullName: 'Test Patron',
            phone: '+92 300 0000000',
            streetAddress: '100 Sunset Boulevard, Clifton',
            city: 'Karachi',
            province: 'Sindh',
          },
          items: [
            {
              productId: sampleProduct._id.toString(),
              variantSku: 'TEST-SKU-001-S',
              size: 'S',
              color: 'Warm Ivory',
              quantity: 999, // Exceeds available stock of 10
            },
          ],
          paymentMethod: 'cod',
        });

      expect(res.status).toBe(500); // Handled by inventory reservation error
      expect(res.body.message).toContain('Insufficient inventory');
    });

    it('Should successfully place a Cash on Delivery (COD) order with verified stock decrement', async () => {
      const initialStock = sampleProduct.variants[0].stock;

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Cookie', customerCookie)
        .send({
          customerEmail: 'test-customer@zasas.com',
          customerPhone: '+92 300 0000000',
          shippingAddress: {
            fullName: 'Test Patron',
            phone: '+92 300 0000000',
            streetAddress: '100 Sunset Boulevard, Clifton',
            city: 'Karachi',
            province: 'Sindh',
          },
          items: [
            {
              productId: sampleProduct._id.toString(),
              variantSku: 'TEST-SKU-001-S',
              size: 'S',
              color: 'Warm Ivory',
              quantity: 2,
            },
          ],
          paymentMethod: 'cod',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order.orderNumber).toMatch(/^ZS-\d{4}-\d+/);
      expect(res.body.order.orderStatus).toBe('confirmed');
      expect(res.body.order.paymentMethod).toBe('cod');
      expect(res.body.order.paymentStatus).toBe('pending');
      expect(res.body.order.subtotal).toBe(24500 * 2);

      // Verify stock was decremented in database
      const updatedProduct = await Product.findById(sampleProduct._id);
      const updatedVariant = updatedProduct.variants.find((v) => v.sku === 'TEST-SKU-001-S');
      expect(updatedVariant.stock).toBe(initialStock - 2);
    });

    it('Should protect payment gateway status endpoint and document status honestly', async () => {
      const res = await request(app).get('/api/v1/payments/status');
      expect(res.status).toBe(200);
      expect(res.body.currency).toBe('PKR');
      expect(Array.isArray(res.body.supportedMethods)).toBe(true);
      expect(typeof res.body.isConfigured).toBe('boolean');
    });
  });
});
