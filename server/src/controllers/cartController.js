import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

// Helper to populate and format cart with live stock status and current price
const formatCartResponse = async (cartDoc) => {
  if (!cartDoc) return { items: [], subtotal: 0, itemCount: 0 };

  await cartDoc.populate({
    path: 'items.product',
    select: 'name slug price compareAtPrice images variants isPublished',
  });

  const validItems = [];
  let subtotal = 0;
  let itemCount = 0;

  for (const item of cartDoc.items) {
    if (!item.product || !item.product.isPublished) continue;

    const variant = item.product.variants.find(
      (v) => v.sku === item.variantSku || (v.size === item.size && v.color === item.color)
    );

    const currentPrice = variant?.priceOverride || item.product.price;
    const availableStock = variant ? variant.stock : 0;
    const itemTotal = currentPrice * item.quantity;

    subtotal += itemTotal;
    itemCount += item.quantity;

    validItems.push({
      _id: item._id,
      productId: item.product._id,
      name: item.product.name,
      slug: item.product.slug,
      image: item.product.images[0] || '',
      variantSku: item.variantSku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: currentPrice,
      itemTotal,
      availableStock,
      inStock: availableStock >= item.quantity,
    });
  }

  return {
    _id: cartDoc._id,
    items: validItems,
    subtotal,
    itemCount,
  };
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    const formatted = await formatCartResponse(cart);
    res.status(200).json({
      success: true,
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const { productId, variantSku, size, color, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isPublished) {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    const variant = product.variants.find((v) => v.sku === variantSku || (v.size === size && v.color === color));
    if (!variant) {
      return res.status(400).json({ success: false, message: 'Selected variant is invalid' });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} item(s) available in size ${size} / ${color}`,
      });
    }

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
      if (!cart) cart = new Cart({ user: userId, items: [] });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
      if (!cart) cart = new Cart({ guestId, items: [] });
    } else {
      return res.status(400).json({ success: false, message: 'Guest ID or authenticated session is required' });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.variantSku === (variant.sku || variantSku)
    );

    const price = variant.priceOverride || product.price;

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > variant.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Maximum available stock is ${variant.stock}.`,
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        variantSku: variant.sku || variantSku,
        size,
        color,
        quantity,
        priceAtAdd: price,
      });
    }

    await cart.save();
    const formatted = await formatCartResponse(cart);

    res.status(200).json({
      success: true,
      message: 'Item added to your shopping bag.',
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.body.guestId;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find((v) => v.sku === item.variantSku);
      if (variant && quantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot update quantity. Only ${variant.stock} units available in stock.`,
        });
      }
    }

    item.quantity = quantity;
    await cart.save();

    const formatted = await formatCartResponse(cart);
    res.status(200).json({
      success: true,
      message: 'Cart updated.',
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const guestId = req.headers['x-guest-id'] || req.query.guestId;
    const { itemId } = req.params;

    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    const formatted = await formatCartResponse(cart);
    res.status(200).json({
      success: true,
      message: 'Item removed from bag.',
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const mergeGuestCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({ success: false, message: 'Guest ID is required to merge' });
    }

    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart || guestCart.items.length === 0) {
      const userCart = await Cart.findOne({ user: userId });
      const formatted = await formatCartResponse(userCart);
      return res.status(200).json({ success: true, cart: formatted });
    }

    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    for (const gItem of guestCart.items) {
      const existing = userCart.items.find(
        (uItem) => uItem.product.toString() === gItem.product.toString() && uItem.variantSku === gItem.variantSku
      );
      if (existing) {
        existing.quantity += gItem.quantity;
      } else {
        userCart.items.push(gItem);
      }
    }

    await userCart.save();
    await Cart.deleteOne({ _id: guestCart._id });

    const formatted = await formatCartResponse(userCart);
    res.status(200).json({
      success: true,
      message: 'Guest bag merged with your account.',
      cart: formatted,
    });
  } catch (error) {
    next(error);
  }
};
