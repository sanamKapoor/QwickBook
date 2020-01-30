const mongoose = require('mongoose');
const fileHelper = require('../util/file');

const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const edition = req.body.edition;
  const publisher = req.body.publisher;
  const language = req.body.language;
  const pages = req.body.pages;
  const isbn = req.body.isbn;
  const price = req.body.price;
  const condition = req.body.condition;
  const category = req.body.category;
  const firstname = req.body.firstname;
  const email = req.body.email;
  const mobile = req.body.mobile;
  const image = req.file;
  const address = req.body.address;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        author: author,
        edition: edition,
        publisher: publisher,
        language: language,
        pages: pages,
        isbn: isbn,
        price: price,
        condition: condition,
        category: category,
        description: description,
        firstname: firstname,
        email: email,
        mobile: mobile,
        address: address
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        author: author,
        edition: edition,
        publisher: publisher,
        language: language,
        pages: pages,
        isbn: isbn,
        price: price,
        condition: condition,
        category: category,
        imageUrl: imageUrl,
        description: description,
        firstname: firstname,
        email: email,
        mobile: mobile,
        address: address
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;

  const product = new Product({
    // _id: new mongoose.Types.ObjectId('5badf72403fd8b5be0366e81'),
    title: title,
    author: author,
    edition: edition,
    publisher: publisher,
    language: language,
    pages: pages,
    isbn: isbn,
    price: price,
    condition: condition,
    category: category,
    description: description,
    imageUrl: imageUrl,
    firstname: firstname,
    email: email,
    mobile: mobile,
    address: address,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next("Error :", err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedAuthor = req.body.author;
  const updatedEdition = req.body.edition;
  const updatedPublisher = req.body.publisher;
  const updatedLanguage = req.body.language;
  const updatedPages = req.body.pages;
  const updatedIsbn = req.body.isbn;
  const updatedPrice = req.body.price;
  const updatedCondition = req.body.condition;
  const updatedCategory = req.body.category;
  const image = req.file;
  const updatedDesc = req.body.description;
  const updatedFirstname = req.body.firstname;
  const updatedEmail = req.body.email;
  const updatedMobile = req.body.mobile;
  const updatedAddress = req.body.address;
  

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        author: updatedAuthor,
        edition: updatedEdition,
        publisher: updatedPublisher,
        language: updatedLanguage,
        pages: updatedPages,
        isbn: updatedIsbn,
        price: updatedPrice,
        condition: updatedCondition,
        category: updatedCategory,
        description: updatedDesc,
        firstname: updatedFirstname,
        email: updatedEmail,
        mobile: updatedMobile,
        address: updatedAddress,
        
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.author = updatedAuthor;
      product.edition = updatedEdition;
      product.publisher = updatedPublisher;
      product.language = updatedLanguage;
      product.pages = updatedPages;
      product.isbn = updatedIsbn;
      product.price = updatedPrice;
      product.condition = updatedCondition;
      product.category = updatedCategory;
      product.description = updatedDesc;
      product.firstname = updatedFirstname;
      product.email = updatedEmail;
      product.mobile = updatedMobile;
      product.address = updatedAddress;
      if(image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    if(!product){
      return next(new Error('Product not found.'))
    }
    
  fileHelper.deleteFile(product.imageUrl);
  return Product.deleteOne({ _id: prodId, userId: req.user._id });
  
  }).then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({message: "Success"});
    })
    .catch(err => {
      res.status(500).json({message: "Delete product fails"});
    });
};