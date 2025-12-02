import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'CV_UPLOAD', 'LOGIN', 'LOGOUT', 'EXPORT']
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  },
  resourceName: {
    type: String
  },
  changes: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for faster queries
historySchema.index({ user: 1, createdAt: -1 });
historySchema.index({ resource: 1, createdAt: -1 });
historySchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('History', historySchema);
