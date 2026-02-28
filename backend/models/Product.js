const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    material: { type: String, default: '' },
    color: { type: String, default: '' },
    size: {
        length: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    images: [{ type: String }],
    countInStock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
}, {
    timestamps: true,
});

// ── Indexes for faster queries ────────────────────────────────────────────────
productSchema.index({ category: 1 });          // fast category filtering
productSchema.index({ name: 'text' });          // full-text search on name
productSchema.index({ price: 1 });              // fast price sorting
productSchema.index({ featured: 1, createdAt: -1 }); // homepage featured products

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
