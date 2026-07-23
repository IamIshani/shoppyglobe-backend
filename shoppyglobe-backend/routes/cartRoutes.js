const express = require('express');
const router = express.Router();
const { addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Protect all cart routes
router.use(protect);

router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);

module.exports = router;
router.get('/', getCart);