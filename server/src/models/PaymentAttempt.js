import mongoose from 'mongoose';

const paymentAttemptSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  },
  gateway: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'PKR',
  },
  status: {
    type: String,
    enum: ['initiated', 'authorized', 'captured', 'failed', 'cancelled'],
    default: 'initiated',
  },
  gatewayTracker: {
    type: String,
    default: null,
  },
  requestPayload: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  responsePayload: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  signature: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

export const PaymentAttempt = mongoose.model('PaymentAttempt', paymentAttemptSchema);
