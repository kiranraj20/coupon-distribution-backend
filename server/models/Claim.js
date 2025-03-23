import { Schema, model } from 'mongoose';

const claimSchema = new Schema({
  ip: {
    type: String,
    required: true,
  },
  cookieId: {
    type: String,
    required: true,
  },
  couponId: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default model('Claim', claimSchema);