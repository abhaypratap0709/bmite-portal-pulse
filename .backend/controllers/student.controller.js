const User = require('../models/User.model');
const Course = require('../models/Course.model');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student)
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('academic.course', 'name code department duration')
      .select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is a student
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Student role required.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        academic: user.academic,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student)
exports.updateProfile = async (req, res, next) => {
  try {
    const { bio, photoURL, phone, dateOfBirth, gender, address } = req.body;

    // Validate input
    const updateData = {};
    
    // Only allow updating specific fields
    if (bio !== undefined) {
      if (typeof bio !== 'string' || bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Bio must be a string with maximum 500 characters',
        });
      }
      updateData['profile.bio'] = bio.trim();
    }

    if (photoURL !== undefined) {
      if (typeof photoURL !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Photo URL must be a string',
        });
      }
      updateData['profile.photoURL'] = photoURL.trim();
    }

    if (phone !== undefined) {
      if (phone && !/^[0-9]{10}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be exactly 10 digits',
        });
      }
      updateData['profile.phone'] = phone;
    }

    if (dateOfBirth !== undefined) {
      if (dateOfBirth) {
        const dob = new Date(dateOfBirth);
        if (isNaN(dob.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Invalid date of birth format',
          });
        }
        updateData['profile.dateOfBirth'] = dob;
      } else {
        updateData['profile.dateOfBirth'] = null;
      }
    }

    if (gender !== undefined) {
      if (gender && !['male', 'female', 'other'].includes(gender)) {
        return res.status(400).json({
          success: false,
          message: 'Gender must be one of: male, female, other',
        });
      }
      updateData['profile.gender'] = gender;
    }

    if (address !== undefined) {
      if (address && typeof address === 'object') {
        const { street, city, state, pincode, country } = address;
        
        if (street !== undefined) updateData['profile.address.street'] = street;
        if (city !== undefined) updateData['profile.address.city'] = city;
        if (state !== undefined) updateData['profile.address.state'] = state;
        if (pincode !== undefined) {
          if (pincode && !/^[0-9]{6}$/.test(pincode)) {
            return res.status(400).json({
              success: false,
              message: 'Pincode must be exactly 6 digits',
            });
          }
          updateData['profile.address.pincode'] = pincode;
        }
        if (country !== undefined) updateData['profile.address.country'] = country;
      }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    // Update the user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('academic.course', 'name code department duration')
     .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is a student
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Student role required.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        academic: user.academic,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile photo (base64)
// @route   POST /api/student/profile/photo
// @access  Private (Student)
exports.uploadPhoto = async (req, res, next) => {
  try {
    const { photoData } = req.body;

    if (!photoData) {
      return res.status(400).json({
        success: false,
        message: 'Photo data is required',
      });
    }

    // Validate base64 image data
    if (!photoData.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Please provide a valid base64 image.',
      });
    }

    // Check image size (max 5MB)
    const sizeInBytes = (photoData.length * 3) / 4;
    if (sizeInBytes > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size too large. Maximum size is 5MB.',
      });
    }

    // Update user with photo URL (storing base64 directly for simplicity)
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'profile.photoURL': photoData },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        photoURL: user.profile.photoURL,
      },
    });
  } catch (error) {
    next(error);
  }
};
