const express = require('express');

const {
  getSubresources,
  getSubresource,
  createSubresource,
  updateSubresource,
  deleteSubresource,
} = require('../controllers/subresources');

const Subresource = require('../models/Subresource');
const advancedResults = require('../middleware/advanced-results');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Subresource, {
      path: 'resource',
      select: 'name description',
    }),
    getSubresources
  )
  .post(protect, authorize('publisher', 'admin'), createSubresource);

router
  .route('/:id')
  .get(getSubresource)
  .put(protect, authorize('publisher', 'admin'), updateSubresource)
  .delete(protect, authorize('publisher', 'admin'), deleteSubresource);

module.exports = router;
