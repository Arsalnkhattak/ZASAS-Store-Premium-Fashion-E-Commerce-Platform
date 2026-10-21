import { Product } from '../models/Product.js';

export const validateAndReserveStock = async (items) => {
  const verifiedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isPublished) {
      throw new Error(`Product "${item.name || item.productId}" is not available or has been discontinued.`);
    }

    const variant = product.variants.find(
      (v) => v.sku === item.variantSku || (v.size === item.size && v.color === item.color)
    );

    if (!variant) {
      throw new Error(`The requested size "${item.size}" or color "${item.color}" for "${product.name}" is unavailable.`);
    }

    if (variant.stock < item.quantity) {
      throw new Error(
        `Insufficient inventory for "${product.name}" (${variant.size} / ${variant.color}). Requested: ${item.quantity}, Available: ${variant.stock}.`
      );
    }

    const itemPrice = variant.priceOverride || product.price;
    const itemSubtotal = itemPrice * item.quantity;
    subtotal += itemSubtotal;

    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: itemPrice,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  // Atomically decrement stock
  for (const item of verifiedItems) {
    const updateResult = await Product.updateOne(
      {
        _id: item.product,
        'variants.sku': item.sku,
        'variants.stock': { $gte: item.quantity },
      },
      {
        $inc: {
          'variants.$.stock': -item.quantity,
          totalStock: -item.quantity,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      // Revert any previously decremented items
      await releaseStock(verifiedItems.slice(0, verifiedItems.indexOf(item)));
      throw new Error(`Item ${item.name} (${item.size}/${item.color}) just sold out. Please review your cart.`);
    }
  }

  return { verifiedItems, subtotal };
};

export const releaseStock = async (items) => {
  if (!items || !items.length) return;
  for (const item of items) {
    try {
      await Product.updateOne(
        {
          _id: item.product,
          'variants.sku': item.sku,
        },
        {
          $inc: {
            'variants.$.stock': item.quantity,
            totalStock: item.quantity,
          },
        }
      );
    } catch (err) {
      console.error(`Failed to restore stock for SKU ${item.sku}:`, err.message);
    }
  }
};
