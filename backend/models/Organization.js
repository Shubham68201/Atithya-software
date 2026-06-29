// backend/models/Organization.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const organizationSchema = new Schema({
  name:         { type: String, required: true, trim: true },
  slug:         { type: String, required: true, unique: true, lowercase: true },
  ownerUserId:  { type: ObjectId, ref: 'User', required: true },

  // Subscription
  packageTier: {
    type: String,
    enum: ['trial', 'single_property', 'franchise'],
    default: 'trial',
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'past_due', 'cancelled', 'trialing'],
    default: 'trialing',
  },
  maxProperties:           { type: Number, default: 1 },
  razorpaySubscriptionId:  { type: String, default: null },
  billingEmail:            { type: String, required: true },
  trialEndsAt:             { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  isActive:                { type: Boolean, default: true },
}, { timestamps: true });

export default model('Organization', organizationSchema);