const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['book', 'movie'], required: true },
        name: { type: String, required: true },
        authorName: { type: String },
        serialNo: { type: String, unique: true },
        dateOfProcurement: { type: Date, required: true },
        quantity: { type: Number, default: 1 },
        status: {
            type: String,
            enum: ['available', 'issued', 'lost', 'damaged'],
            default: 'available',
        },
    },
    { timestamps: true }
);
bookSchema.pre('save', async function () {
    if (!this.serialNo) {
        const count = await mongoose.model('Book').countDocuments();
        const prefix = this.type === 'book' ? 'BK' : 'MV';
        this.serialNo = `${prefix}${String(count + 1).padStart(5, '0')}`;
    }
});

module.exports = mongoose.model('Book', bookSchema);
