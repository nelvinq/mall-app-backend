const mongoose = require('mongoose');
const voucherSchema = require('./voucher')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["shopper", "staff"],
  },
  vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }],
},
{ timestamps: true }
)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.password;
  }
});

module.exports = mongoose.model('User', userSchema);
