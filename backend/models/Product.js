const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // Sofa, Bed, etc.
    material: { type: String, required: true },
    color: { type: String, required: true },
    size: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
    },
    images: [{ type: String, required: true }], // Array of image URLs
    inStock: { type: Boolean, required: true, default: true },
    featured: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
