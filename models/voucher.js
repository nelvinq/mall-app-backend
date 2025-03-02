const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
    {storeName: {
        type: String,
        required: true,
      },
      discount: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      redemptionsPerShopper: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["active", "expired", "inactive"],
        default: true,
      },
      redeemedBy: [{
        user: {type: mongoose.Schema.Types.ObjectId,
        ref: "User"},
        date: Date,
      }],
      globalRedemptionCount:{
        type: Number,
        default: 0
      }
    },
    { timestamps: true }
)

const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;