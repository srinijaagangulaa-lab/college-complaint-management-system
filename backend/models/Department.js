const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide department name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    departmentCode: {
      type: String,
      required: [true, 'Please provide department code'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    staffMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', departmentSchema);
