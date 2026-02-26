const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            images,
            category,
            countInStock,
            material,
            color,
            size
        } = req.body;

        const product = new Product({
            name,
            price,
            description,
            images: images || [],
            category,
            countInStock: countInStock || 0,
            inStock: countInStock > 0,   // derive inStock from countInStock
            material: material || '',
            color: color || '',
            size: size || { length: 0, width: 0, height: 0 },
            featured: false,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Create product error:', error.message);
        res.status(500).json({ message: error.message });
    }
};


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        material,
        color,
        size,
        images,
        countInStock,
        inStock,
        featured
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = category;
        if (material !== undefined) product.material = material;
        if (color !== undefined) product.color = color;
        if (size !== undefined) product.size = size;
        if (images !== undefined) product.images = images;
        if (countInStock !== undefined) {
            product.countInStock = countInStock;
            product.inStock = countInStock > 0;   // keep inStock in sync
        }
        if (inStock !== undefined) product.inStock = inStock;
        if (featured !== undefined) product.featured = featured;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct, // Using this as a "seed" or "init" if needed, but implementation says PUT is main update?
    updateProduct,
};
