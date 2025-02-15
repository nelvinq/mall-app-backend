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
      usagePerShopper: {
        type: Number,
        required: true,
      },
      status: {
        type: Boolean,
        default: true,
      },
      redeemedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
      redemptionDate: [{
        type: Date,
      }],
    },
    { timestamps: true }
)

const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;
