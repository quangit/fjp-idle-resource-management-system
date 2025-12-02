import { validationResult } from 'express-validator';
import Resource from '../models/Resource.model.js';
import History from '../models/History.model.js';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
export const getResources = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      department, 
      status, 
      skills,
      urgent 
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) query.department = department;
    if (status) query.status = status;
    if (skills) query.skills = { $in: skills.split(',') };
    if (urgent === 'true') query.isUrgent = true;

    const resources = await Resource.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');

    const count = await Resource.countDocuments(query);

    res.json({
      success: true,
      resources,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Private
export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create resource
// @route   POST /api/resources
// @access  Private (Admin, RA)
export const createResource = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if employee code exists
    const existingResource = await Resource.findOne({ 
      employeeCode: req.body.employeeCode 
    });

    if (existingResource) {
      return res.status(400).json({
        success: false,
        message: 'Resource with this employee code already exists'
      });
    }

    const resource = await Resource.create({
      ...req.body,
      createdBy: req.user._id
    });

    // Log action
    await History.create({
      user: req.user._id,
      action: 'CREATE',
      resource: resource._id,
      resourceName: resource.name,
      changes: `Created resource: ${resource.name} (${resource.employeeCode})`
    });

    res.status(201).json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (Admin, RA)
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const oldStatus = resource.status;
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    // Log action
    const changes = oldStatus !== updatedResource.status 
      ? `Status: ${oldStatus} → ${updatedResource.status}`
      : 'Updated resource details';

    await History.create({
      user: req.user._id,
      action: 'UPDATE',
      resource: updatedResource._id,
      resourceName: updatedResource.name,
      changes
    });

    res.json({
      success: true,
      resource: updatedResource
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Admin)
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    await resource.deleteOne();

    // Log action
    await History.create({
      user: req.user._id,
      action: 'DELETE',
      resourceName: resource.name,
      changes: `Deleted resource: ${resource.name} (${resource.employeeCode})`
    });

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload CV
// @route   POST /api/resources/:id/cv
// @access  Private (Admin, RA)
export const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    resource.cv = `/uploads/cvs/${req.file.filename}`;
    await resource.save();

    // Log action
    await History.create({
      user: req.user._id,
      action: 'CV_UPLOAD',
      resource: resource._id,
      resourceName: resource.name,
      changes: `Uploaded CV for ${resource.name}`
    });

    res.json({
      success: true,
      cv: resource.cv
    });
  } catch (error) {
    console.error('Upload CV error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
