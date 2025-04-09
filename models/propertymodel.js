import mongoose from "mongoose";

// Create a counter schema
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// Create a counter model
const Counter = mongoose.model('counter', CounterSchema);

const propertySchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
    unique: true
  },
  isApproved: {
    type: Boolean,
    default: false,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  invest: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: { 
    type: [String],
    required: true
  },
  beds: {
    type: Number,
    required: true,
  },
  baths: {
    type: Number,
    required: true,
  },
  sqft: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    default: "rent",
    // required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: {
    type: Array,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Add pre-save middleware to auto-increment the serial number
propertySchema.pre('save', async function(next) {
  const doc = this;
  
  // Only assign serial number if it's not already assigned
  if (doc.serialNumber === undefined) {
    try {
      // Find and update the counter for property
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'propertySerialNumber' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      // Set the serial number to the updated counter value
      doc.serialNumber = counter.seq;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});

const Property = mongoose.model("properties", propertySchema);

export default Property;