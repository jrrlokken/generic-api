const Resource = require('../models/Resource');
const ErrorResponse = require('../util/error-response');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc    Get all Resources
// @route   GET /api/v1/resources
// @access  Public
exports.getResources = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single Resource
// @route   GET /api/v1/resources/:id
// @access  Public
exports.getResource = asyncHandler(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: resource,
  });
});

// @desc    Create a Resource
// @route   POST /api/v1/resources
// @access  Private
exports.createResource = asyncHandler(async (req, res, next) => {
  const resource = await Resource.create(req.body);
  res.status(201).json({
    success: true,
    data: resource,
  });
});

// @desc    Update single Resource
// @route   PUT /api/v1/resources/:id
// @access  Private
exports.updateResource = asyncHandler(async (req, res, next) => {
  let resource = await Resource.findById(req.params.id);
  if (!resource) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized.  Access Denied.', 401));
  }

  resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({ success: true, data: Resource });
});

// @desc    Delete single Resource
// @route   DELETE /api/v1/resources/:id
// @access  Private
exports.deleteResource = asyncHandler(async (req, res, next) => {
  const Resource = await Resource.findById(req.params.id);

  if (!resource) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized.  Access Denied.', 401));
  }

  resource.remove();

  res.status(200).json({
    success: true,
    data: Resource,
  });
});

// @desc    Upload image for Resource
// @route   DELETE /api/v1/resources/:id/photo
// @access  Private
exports.imageUpload = asyncHandler(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    );
  }

  if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized.  Access Denied.', 401));
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  const file = req.files.file;
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload a valid image', 400));
  }

  if (file.size > process.env.FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        'Please upload a smaller image. Maximum file size is 1MB',
        400
      )
    );
  }

  file.name = `photo_${Resource._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with file upload'), 500);
    }

    await resource.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

// @desc    Get Resources within radius
// @route   GET /api/v1/Resources/radius/:zipcode/:distance
// @access  Private
// exports.getResourcesInRadius = asyncHandler(async (req, res, next) => {
//   const { zipcode, distance } = req.params;
//   const loc = await geocoder.geocode(zipcode);
//   const lat = loc[0].latitude;
//   const lng = loc[0].longitude;

//   // Divide distance by radius of earth
//   // 3,963 mi
//   const radius = distance / 3963;
//   const Resources = await Resource.find({
//     location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
//   });

//   res.status(200).json({
//     success: true,
//     count: Resources.length,
//     data: Resources,
//   });
// });
