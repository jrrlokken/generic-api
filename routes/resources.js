const express = require('express');

const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  getResourcesInRadius,
  imageUpload,
} = require('../controllers/resources');

const advancedResults = require('../middleware/advanced-results');
const Resource = require('../models/Resource');
const subresourceRouter = require('./subresources');
const reviewsRouter = require('./reviews');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use('/:ResourceId/subresources', subresourceRouter);
router.use('/:ResourceId/reviews', reviewsRouter);
// router.route('/radius/:zipcode/:distance').get(getResourcesInRadius);

router
  .route('/')
  .get(advancedResults(Resource, 'subresources'), getResources)
  .post(protect, authorize('publisher', 'admin'), createResource);
router
  .route('/:id')
  .get(getResource)
  .put(protect, authorize('publisher', 'admin'), updateResource)
  .delete(protect, authorize('publisher', 'admin'), deleteResource);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), imageUpload);

module.exports = router;
