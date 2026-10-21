import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subCategory,
      minPrice,
      maxPrice,
      size,
      color,
      tag,
      search,
      sort = 'newest',
    } = req.query;

    const query = { isPublished: true };

    // Category filter by slug or ID
    if (category) {
      const categoryDoc = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (subCategory) {
      query.subCategory = new RegExp(`^${subCategory}$`, 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Variant attributes filter
    if (size) {
      query.sizes = size;
    }

    if (color) {
      query['colors.name'] = new RegExp(color, 'i');
    }

    if (tag) {
      query.tags = tag;
    }

    // Keyword search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { editorialStory: searchRegex },
        { tags: searchRegex },
        { sku: searchRegex },
      ];
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    switch (sort) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'name-asc':
        sortOptions = { name: 1 };
        break;
      case 'best-selling':
        sortOptions = { isBestSeller: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isPublished: true }).populate('category', 'name slug tagline');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable in our current catalog.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const products = await Product.find({ isFeatured: true, isPublished: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getNewArrivals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;
    const products = await Product.find({ isNewArrival: true, isPublished: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const related = await Product.find({
      _id: { $ne: currentProduct._id },
      isPublished: true,
      $or: [
        { category: currentProduct.category },
        { tags: { $in: currentProduct.tags || [] } },
      ],
    })
      .populate('category', 'name slug')
      .limit(4)
      .lean();

    res.status(200).json({
      success: true,
      products: related,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.findIndex((id) => id.toString() === productId);
    let isInWishlist = false;

    if (index > -1) {
      user.wishlist.splice(index, 1);
      isInWishlist = false;
    } else {
      user.wishlist.push(productId);
      isInWishlist = true;
    }

    await user.save();
    await user.populate('wishlist', 'name slug price compareAtPrice images isPublished');

    res.status(200).json({
      success: true,
      message: isInWishlist ? 'Added to your wishlist.' : 'Removed from your wishlist.',
      isInWishlist,
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};
