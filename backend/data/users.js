const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@rosewood.com',
        password: 'password123', // Will be hashed by seeder or model? 
        // If I use Model.create() it uses pre-save hook.
        // If I use Model.insertMany() it MIGHT skip pre-save hooks depending on mongoose version/config.
        // Safe bet: Loop and save, or hash manually here.
        // I'll use a loop in seeder.
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
    },
];

module.exports = users;
