const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/cloudinaryUpload');

router.route('/').get(getProducts).post(protect, admin, createProduct);

// Upload route: images go directly to Cloudinary — returns permanent HTTPS URLs
// Must be before /:id — otherwise Express matches 'upload' as a product ID
// Upload route — uses multer callback style so MulterErrors are caught and returned as 400
router.post('/upload', (req, res) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            // multer errors (e.g. file too large) → 400 with readable message
            const status = err.code === 'LIMIT_FILE_SIZE' ? 400 : 500;
            const message = err.code === 'LIMIT_FILE_SIZE'
                ? 'File too large — maximum size is 10MB per image'
                : (err.message || 'Upload failed');
            console.error('Upload error:', err.message);
            return res.status(status).json({ message });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        // Cloudinary returns the full secure URL on req.files[n].path
        const fileUrls = req.files.map((file) => file.path);
        res.json(fileUrls);
    });
});

router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);

module.exports = router;
