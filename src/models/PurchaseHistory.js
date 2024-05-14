import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    purchaseId: {
        type: String,
        required: true,
        unique: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const PurchaseHistory = mongoose.model('PurchaseHistory', purchaseSchema);

export default PurchaseHistory;