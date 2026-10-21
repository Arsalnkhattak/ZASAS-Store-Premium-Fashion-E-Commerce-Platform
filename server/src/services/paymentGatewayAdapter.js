import crypto from 'crypto';
import { ENV } from '../config/env.js';

/**
 * Pakistani Online Payment Gateway Adapter (Safepay & PayFast specification)
 * 
 * Safepay provides checkout links and webhook callbacks for Pakistani Debit/Credit cards,
 * 1Bill, and mobile wallets (JazzCash / EasyPaisa).
 * When SAFEPAY_API_KEY / SAFEPAY_SECRET_KEY are unconfigured, this adapter refuses
 * unauthorized transaction faking and informs the caller with detailed integration requirements.
 */

export class PakistaniPaymentGatewayAdapter {
  static isConfigured() {
    return Boolean(ENV.SAFEPAY_API_KEY && ENV.SAFEPAY_SECRET_KEY);
  }

  static getGatewayDetails() {
    return {
      provider: ENV.PAYMENT_GATEWAY_PROVIDER,
      isConfigured: this.isConfigured(),
      currency: 'PKR',
      sandbox: ENV.SAFEPAY_SANDBOX,
      supportedMethods: [
        'Visa / Mastercard (Pakistani & International)',
        '1Bill (Bank Transfer / ATM)',
        'JazzCash Wallet',
        'EasyPaisa Wallet'
      ],
      notice: this.isConfigured()
        ? 'Live Pakistani Payment Gateway active.'
        : 'Online card/wallet gateway requires merchant sandbox or production keys. Cash on Delivery (COD) is active nationwide.'
    };
  }

  /**
   * Initializes a payment checkout session with the gateway
   */
  static async initializePayment({ order, customer }) {
    if (!this.isConfigured()) {
      return {
        success: false,
        requiresConfiguration: true,
        message: 'Online payment gateway credentials (SAFEPAY_API_KEY / SAFEPAY_SECRET_KEY) are not configured. Please checkout using Cash on Delivery (COD) or configure valid gateway credentials in your server environment.',
      };
    }

    try {
      const baseUrl = ENV.SAFEPAY_SANDBOX 
        ? 'https://sandbox.api.getsafepay.com' 
        : 'https://api.getsafepay.com';

      // Real Safepay API payload structure
      const payload = {
        client: ENV.SAFEPAY_API_KEY,
        amount: Math.round(order.total * 100), // in minor units (paisa)
        currency: 'PKR',
        environment: ENV.SAFEPAY_SANDBOX ? 'sandbox' : 'production',
        order_id: order.orderNumber,
        customer: {
          first_name: customer.fullName.split(' ')[0] || 'Customer',
          last_name: customer.fullName.split(' ').slice(1).join(' ') || 'Valued',
          email: customer.email || order.customerEmail,
          phone: customer.phone || order.customerPhone,
        },
      };

      const response = await fetch(`${baseUrl}/order/v1/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SFPY-MERCHANT-SECRET': ENV.SAFEPAY_SECRET_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.data?.token) {
        throw new Error(data.message || 'Payment gateway failed to initialize session');
      }

      const checkoutUrl = ENV.SAFEPAY_SANDBOX
        ? `https://sandbox.api.getsafepay.com/checkout/pay?beacon=${data.data.token}`
        : `https://getsafepay.com/checkout/pay?beacon=${data.data.token}`;

      return {
        success: true,
        token: data.data.token,
        checkoutUrl,
      };
    } catch (error) {
      return {
        success: false,
        message: `Payment gateway communication error: ${error.message}`,
      };
    }
  }

  /**
   * Cryptographic webhook signature verification
   */
  static verifyWebhookSignature(payloadString, signatureHeader) {
    if (!ENV.SAFEPAY_SECRET_KEY) return false;
    try {
      const computed = crypto
        .createHmac('sha256', ENV.SAFEPAY_SECRET_KEY)
        .update(payloadString)
        .digest('hex');
      return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signatureHeader));
    } catch {
      return false;
    }
  }
}
