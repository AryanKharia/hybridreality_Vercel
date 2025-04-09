// models/LuckyDrawProperty.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const luckyDrawRegistrationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  isWinner: {
    type: Boolean,
    default: false
  }
});

const luckyDrawPropertySchema = new Schema({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'properties',
    required: true
  },
  biddingStartDate: {
    type: Date,
    required: true
  },
  biddingEndDate: {
    type: Date,
    required: true
  },
  registrations: [luckyDrawRegistrationSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for registration count
luckyDrawPropertySchema.virtual('registrationCount').get(function() {
  return this.registrations.length;
});

// Method to check if a user is registered
luckyDrawPropertySchema.methods.isUserRegistered = function(userId) {
  return this.registrations.some(reg => reg.user.toString() === userId.toString());
};

// Method to check if registration is open
luckyDrawPropertySchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return now >= this.biddingStartDate && now <= this.biddingEndDate;
};

// Method to register a user
luckyDrawPropertySchema.methods.registerUser = function(userId, phone) {
  if (this.isUserRegistered(userId)) {
    throw new Error('User already registered for this lucky draw');
  }
  
  if (!this.isRegistrationOpen()) {
    throw new Error('Registration is not open for this property');
  }
  
  this.registrations.push({
    user: userId,
    phone: phone
  });
  
  return this.save();
};

// Method to select a winner randomly
luckyDrawPropertySchema.methods.selectWinner = function() {
  if (this.registrations.length === 0) {
    throw new Error('No registrations found for this lucky draw');
  }
  
  // Get a random index
  const randomIndex = Math.floor(Math.random() * this.registrations.length);
  const winnerRegistration = this.registrations[randomIndex];
  
  // Update the winner
  this.winner = winnerRegistration.user;
  winnerRegistration.isWinner = true;
  this.status = 'completed';
  
  return this.save();
};

// Before saving, update the updatedAt field
luckyDrawPropertySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Set up the model with the schema
const LuckyDrawProperty = mongoose.model('LuckyDrawProperty', luckyDrawPropertySchema);

export default LuckyDrawProperty;