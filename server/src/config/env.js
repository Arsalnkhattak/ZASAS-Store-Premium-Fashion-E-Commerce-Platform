import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zasas_fashion_db',
  JWT_SECRET: process.env.JWT_SECRET || 'zasas_luxury_editorial_secret_key_2026_super_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'zasas_cookie_secret_key_2026',
  
  // Shipping settings
  FREE_SHIPPING_THRESHOLD: parseInt(process.env.FREE_SHIPPING_THRESHOLD, 10) || 10000, // PKR 10,000
  STANDARD_SHIPPING_FEE: parseInt(process.env.STANDARD_SHIPPING_FEE, 10) || 350, // PKR 350 standard across Pakistan
  EXPRESS_SHIPPING_FEE: parseInt(process.env.EXPRESS_SHIPPING_FEE, 10) || 750, // PKR 750 express shipping

  // Payment Gateway (Pakistan Adapter)
  PAYMENT_GATEWAY_PROVIDER: process.env.PAYMENT_GATEWAY_PROVIDER || 'SAFEPAY',
  SAFEPAY_API_KEY: process.env.SAFEPAY_API_KEY || '',
  SAFEPAY_SECRET_KEY: process.env.SAFEPAY_SECRET_KEY || '',
  SAFEPAY_SANDBOX: process.env.SAFEPAY_SANDBOX !== 'false',

  // Cloudinary (Optional image hosting)
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
