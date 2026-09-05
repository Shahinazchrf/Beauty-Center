const mongoose = require('mongoose');
require('dotenv').config();

// Connect to Atlas (cloud)
mongoose.connect(process.env.MONGODB_URI);

const Service = require('./src/models/Service');

const services = [
    {
        name: 'Soin visage',
        description: 'A relaxing facial',
        price: 3000,
        duration: 60,
        image: '/Soin%20visage.jpeg',
        isActive: true
    },
    {
        name: 'Massage relaxant',
        description: 'Full body massage',
        price: 4000,
        duration: 90,
        image: '/Massagerelaxant.jpeg',
        isActive: true
    },
    {
        name: 'Coiffure femme',
        description: 'Hair styling',
        price: 3000,
        duration: 120,
        image: '/Coiffure%20femme.jpg',
        isActive: true
    },
    {
        name: 'Coloration cheveux',
        description: 'Hair coloring',
        price: 6000,
        duration: 180,
        image: '/Coloration%20cheveux.jpg',
        isActive: true
    },
    {
        name: 'Pédicure',
        description: 'Foot care',
        price: 2000,
        duration: 60,
        image: '/Pédicure.jpg',
        isActive: true
    },
    {
        name: 'Épilation',
        description: 'Hair removal',
        price: 3000,
        duration: 60,
        image: '/Épilation.webp',
        isActive: true
    }
];

const seedServices = async () => {
    try {
        // Clear existing services in Atlas
        await Service.deleteMany({});
        console.log('🗑️  Deleted old services from Atlas');
        
        // Insert services
        await Service.insertMany(services);
        console.log(`✅ Added ${services.length} services to Atlas!`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

seedServices();