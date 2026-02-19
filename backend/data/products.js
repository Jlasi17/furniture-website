const products = [
    {
        name: 'Rosewood Lounge Chair',
        image: '/uploads/sample-chair.jpg',
        description:
            'Experience ultimate comfort with our signature lounge chair. Crafted from premium rosewood and upholstered in soft, durable fabric.',
        category: 'Living Room',
        price: 899.99,
        countInStock: 10,
        inStock: true,
        material: 'Rosewood, Fabric',
        color: 'Beige',
        size: {
            length: 30,
            width: 30,
            height: 35
        },
        images: ['/uploads/sample-chair.jpg']
    },
    {
        name: 'Henk Cave Bed',
        image: '/uploads/sample-bed.jpg',
        description:
            'Minimalist bed frame designed for modern bedrooms. Robust construction with a sleek finish.',
        category: 'Bedroom',
        price: 1299.99,
        countInStock: 7,
        inStock: true,
        material: 'Oak, Metal',
        color: 'Natural Wood',
        size: {
            length: 80,
            width: 60,
            height: 40
        },
        images: ['/uploads/sample-bed.jpg']
    },
    {
        name: 'Cave Curved Divan',
        image: '/uploads/sample-sofa.jpg',
        description:
            'A statement piece for your living room. The curved design encourages conversation and adds a touch of elegance.',
        category: 'Living Room',
        price: 2499.99,
        countInStock: 0,
        inStock: false,
        material: 'Velvet, Pine',
        color: 'Cream',
        size: {
            length: 90,
            width: 35,
            height: 30
        },
        images: ['/uploads/sample-sofa.jpg']
    },
    {
        name: 'Unique Bedside Table',
        image: '/uploads/sample-table.jpg',
        description:
            'Compact and functional. Perfect for keeping your essentials within reach.',
        category: 'Bedroom',
        price: 399.99,
        countInStock: 15,
        inStock: true,
        material: 'Walnut',
        color: 'Dark Brown',
        size: {
            length: 20,
            width: 20,
            height: 25
        },
        images: ['/uploads/sample-table.jpg']
    },
];

module.exports = products;
