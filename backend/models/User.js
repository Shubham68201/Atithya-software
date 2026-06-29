// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },

  // === PLATFORM STAFF (Level 0) ===
  // isPlatformStaff: true means organizationId MUST be null
  // These users NEVER see hotel operational data
  isPlatformStaff: { type: Boolean, default: false },

  // === HOTEL TENANT (Levels 1–3) ===
  // Both null for platform staff
  organizationId: { type: ObjectId, ref: 'Organization', default: null, index: true },
  propertyId:     { type: ObjectId, ref: 'Property',     default: null, index: true },

  role: {
    type: String,
    required: true,
    // Full role list lives in backend/config/roles.js (Phase 4)
    // For now just store as string — validation added in Phase 4
  },

  // Granular permissions — only populated for Level 3 staff
  // e.g. { 'housekeeping.tasks': true, 'guests.view': true }
  permissions: {
    type: Map,
    of: Boolean,
    default: {},
  },

  department: {
    type: String,
    enum: ['front_office', 'housekeeping', 'maintenance', 'hr', 'finance', 'security', null],
    default: null,
  },

  isActive:             { type: Boolean, default: true },
  lastLoginAt:          { type: Date,   default: null },
  refreshTokenHash:     { type: String, default: null },
  resetPasswordOTP:     { type: String, default: null },
  resetPasswordExpires: { type: Date,   default: null },
}, { timestamps: true });

// Never return sensitive fields in queries
userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.set('toJSON', {
  transform: (_, obj) => {
    delete obj.passwordHash;
    delete obj.refreshTokenHash;
    delete obj.resetPasswordOTP;
    return obj;
  },
});

export default model('User', userSchema);