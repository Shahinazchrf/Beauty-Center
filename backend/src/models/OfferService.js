const mongoose = require('mongoose');

const offerServiceSchema = new mongoose.Schema({
    // SQL: offer_id INT FK
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    
    // SQL: service_id INT FK
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }

}, {
    // Even though SQL doesn't ask for timestamps here, it is good practice in MongoDB
    timestamps: true 
});

module.exports = mongoose.model('OfferService', offerServiceSchema);