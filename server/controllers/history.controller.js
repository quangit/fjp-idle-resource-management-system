import History from '../models/History.model.js';

// @desc    Get all history
// @route   GET /api/history
// @access  Private (Admin, RA, Manager)
export const getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, userId, startDate, endDate } = req.query;

    const query = {};

    if (action) query.action = action;
    if (userId) query.user = userId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const history = await History.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('user', 'username email role')
      .populate('resource', 'name employeeCode');

    const count = await History.countDocuments(query);

    res.json({
      success: true,
      history,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get resource history
// @route   GET /api/history/resource/:id
// @access  Private
export const getResourceHistory = async (req, res) => {
  try {
    const history = await History.find({ resource: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username email role');

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get resource history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
