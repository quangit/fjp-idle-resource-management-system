import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  employeeCode: {
    type: String,
    required: [true, 'Employee code is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['IT', 'QA', 'BA', 'HR', 'Design', 'DevOps']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required']
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  rate: {
    type: Number,
    required: [true, 'Rate is required'],
    min: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Assigned', 'On Hold'],
    default: 'Available'
  },
  idleFrom: {
    type: Date,
    required: [true, 'Idle from date is required']
  },
  idleDuration: {
    type: Number, // in months
    default: 0
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  cv: {
    type: String // file path
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate idle duration before saving
resourceSchema.pre('save', function(next) {
  if (this.idleFrom) {
    const now = new Date();
    const idleDate = new Date(this.idleFrom);
    const monthsDiff = (now.getFullYear() - idleDate.getFullYear()) * 12 + 
                       (now.getMonth() - idleDate.getMonth());
    this.idleDuration = monthsDiff;
    this.isUrgent = monthsDiff >= 2;
  }
  next();
});

// Index for faster queries
resourceSchema.index({ department: 1, status: 1 });
resourceSchema.index({ employeeCode: 1 });
resourceSchema.index({ skills: 1 });

export default mongoose.model('Resource', resourceSchema);
