// backend/models/Property.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const propertySchema = new Schema({
  organizationId: { type: ObjectId, ref: 'Organization', required: true, index: true },
  name:           { type: String, required: true, trim: true },
  propertyType: {
    type: String,
    enum: ['hotel', 'resort', 'homestay', 'serviced_apartment', 'guesthouse'],
    default: 'hotel',
  },
  address: {
    line1:   String,
    city:    String,
    state:   String,
    pincode: String,
    country: { type: String, default: 'India' },
  },
  totalRooms: { type: Number, default: 0 },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

export default model('Property', propertySchema);