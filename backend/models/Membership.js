const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
    {
        membershipNumber: { type: String, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        contactName: { type: String, required: true },
        contactAddress: { type: String, required: true },
        aadharCardNo: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        membershipType: {
            type: String,
            enum: ['six_months', 'one_year', 'two_years'],
            required: true,
        },
        isRemoved: { type: Boolean, default: false },
    },
    { timestamps: true }
);
membershipSchema.pre('save', async function () {
    if (!this.membershipNumber) {
        const count = await mongoose.model('Membership').countDocuments();
        this.membershipNumber = `MEM${String(count + 1).padStart(5, '0')}`;
    }
});

module.exports = mongoose.model('Membership', membershipSchema);
