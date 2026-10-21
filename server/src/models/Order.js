import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  sku: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  streetAddress: { type: String, required: true },
  apartment: { type: String, default: '' },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, default: '' },
  deliveryInstructions: { type: String, default: '' },
}, { _id: false });

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
  changedBy: { type: String, default: 'System' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  customerEmail: {
    type: String,
    required: true,
    index: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true,
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    default: null,
  },
  shippingFee: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'PKR',
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online_gateway'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
    index: true,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  statusHistory: [statusHistorySchema],
  paymentDetails: {
    gateway: { type: String, default: 'None' },
    transactionId: { type: String, default: null },
    referenceId: { type: String, default: null },
    paidAt: { type: Date, default: null },
  },
  cancelReason: {
    type: String,
    default: null,
  },
  idempotencyKey: {
    type: String,
    sparse: true,
    index: true,
  },
}, {
  timestamps: true,
});

export const Order = mongoose.model('Order', orderSchema);
