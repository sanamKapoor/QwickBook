const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('author')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('edition')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('publisher')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('language')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('pages').isInt(),
    body('isbn')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('condition')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('category')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('description')
      .isLength({ min: 3, max: 400 })
      .trim(),
    body('firstname')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('email')
      .isEmail()
      .isLength({ min: 3 })
      .trim(),
    body('mobile').isInt(),
    body('address')
      .isLength({ min: 3, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('author')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('edition')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('publisher')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('language')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('pages').isInt(),
    body('isbn')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('condition')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('category')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('description')
      .isLength({ min: 3, max: 400 })
      .trim(),
    body('firstname')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('email')
      .isEmail()
      .isLength({ min: 3 })
      .trim(),
    body('mobile').isInt(),
    body('address')
      .isLength({ min: 3, max: 400 })
      .trim()
  ],
  isAuth,
  adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;