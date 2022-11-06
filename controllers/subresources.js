const ErrorResponse = require('../util/error-response');
const asyncHandler = require('../middleware/async');

const Subresource = require('../models/Subresource');
const Resource = require('../models/Resource');

// @desc    Get all subresources
// @route   GET /api/v1/subresources
// @route   GET /api/v1/resources/:d/subresources
// @access  Public
exports.getSubresources = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const subresources = await Subresource.find({
      resource: req.params.resourceId,
    });

    return res.status(200).json({
      success: true,
      count: subresources.length,
      data: subresources,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single Subresource
// @route   GET /api/v1/subresources/:id
// @access  Public
exports.getSubresource = asyncHandler(async (req, res, next) => {
  const subresource = await Subresource.findById(req.params.id).populate({
    path: 'resource',
    select: 'name description',
  });
  if (!subresource) {
    return next(
      new ErrorResponse(
        `Subresource not found with id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: subresource,
  });
});

// @desc    Create a Subresource
// @route   POST /api/v1/resources/:resourceId/subresources
// @access  Private
exports.createSubresource = asyncHandler(async (req, res, next) => {
  req.body.resource = req.params.resourceId;
  req.body.user = req.user.id;

  const resource = await Resource.findById(req.params.resourceId);

  if (!resource) {
    return next(
      new ErrorResponse(
        `No resource found with id of ${req.params.resourceId}`
      ),
      404
    );
  }

  if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Unauthorized.  Access Denied.', 401));
  }

  const subresource = await Subresource.create(req.body);

  res.status(201).json({
    success: true,
    data: subresource,
  });
});

// @desc    Update single Subresource
// @route   PUT /api/v1/subresources/:id
// @access  Private
exports.updateSubresource = asyncHandler(async (req, res, next) => {
  let subresource = await Subresource.findById(req.params.id);

  if (!subresource) {
    return next(
      new ErrorResponse(
        `Subresource not found with id of ${req.params.id}`,
        404
      )
    );
  }

  if (
    subresource.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Unauthorized.  Access Denied.', 401));
  }

  subresource = await Subresource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({ success: true, data: subresource });
});

// @desc    Delete single Subresource
// @route   DELETE /api/v1/subresources/:id
// @access  Private
exports.deleteSubresource = asyncHandler(async (req, res, next) => {
  const subresource = await Subresource.findById(req.params.id);

  if (!subresource) {
    return next(
      new ErrorResponse(
        `Subresource not found with id of ${req.params.id}`,
        404
      )
    );
  }

  if (
    subresource.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Unauthorized.  Access Denied.', 401));
  }

  await subresource.remove();

  res.status(200).json({
    success: true,
    data: subresource,
  });
});
