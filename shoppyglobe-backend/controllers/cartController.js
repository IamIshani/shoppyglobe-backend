const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // Extracted from JWT middleware

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient product stock' });
    }

    // Find cart for user, or create new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      // Check if item already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const itemId = req.params.id;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      // Remove item if quantity updated to 0 or negative
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.pull(itemId);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};