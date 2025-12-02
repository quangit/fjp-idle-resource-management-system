import Resource from '../models/Resource.model.js';
import History from '../models/History.model.js';

// @desc    Get overview statistics
// @route   GET /api/reports/overview
// @access  Private
export const getOverviewStats = async (req, res) => {
  try {
    const totalIdle = await Resource.countDocuments();
    const urgent = await Resource.countDocuments({ isUrgent: true });
    const available = await Resource.countDocuments({ status: 'Available' });
    const assigned = await Resource.countDocuments({ status: 'Assigned' });

    // Calculate average idle duration
    const resources = await Resource.find();
    const avgIdleDuration = resources.length > 0
      ? resources.reduce((sum, r) => sum + r.idleDuration, 0) / resources.length
      : 0;

    res.json({
      success: true,
      stats: {
        totalIdle,
        urgent,
        available,
        assigned,
        avgIdleDuration: avgIdleDuration.toFixed(1)
      }
    });
  } catch (error) {
    console.error('Get overview stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get department statistics
// @route   GET /api/reports/department
// @access  Private
export const getDepartmentStats = async (req, res) => {
  try {
    const stats = await Resource.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] }
          },
          urgent: {
            $sum: { $cond: ['$isUrgent', 1, 0] }
          },
          avgDuration: { $avg: '$idleDuration' }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          count: 1,
          available: 1,
          urgent: 1,
          avgDuration: { $round: ['$avgDuration', 1] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get skills statistics
// @route   GET /api/reports/skills
// @access  Private
export const getSkillsStats = async (req, res) => {
  try {
    const resources = await Resource.find();
    
    const skillCount = {};
    resources.forEach(resource => {
      resource.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    const stats = Object.entries(skillCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get skills stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get trend data
// @route   GET /api/reports/trends
// @access  Private
export const getTrendData = async (req, res) => {
  try {
    const { months = 6 } = req.query;

    // Get monthly data for the last N months
    const trends = await Resource.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          idle: { $sum: 1 },
          assigned: {
            $sum: { $cond: [{ $eq: ['$status', 'Assigned'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: parseInt(months) }
    ]);

    res.json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Get trend data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Export report
// @route   POST /api/reports/export
// @access  Private (Admin, RA, Manager)
export const exportReport = async (req, res) => {
  try {
    const { format, type } = req.body;

    // Log export action
    await History.create({
      user: req.user._id,
      action: 'EXPORT',
      changes: `Exported ${type} report as ${format}`
    });

    // In production, implement actual export logic (PDF/Excel generation)
    res.json({
      success: true,
      message: `Report exported as ${format}`,
      downloadUrl: `/exports/report-${Date.now()}.${format}`
    });
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
