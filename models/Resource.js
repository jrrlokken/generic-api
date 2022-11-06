const mongoose = require('mongoose');
const slugify = require('slugify');

const ResourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ResourceSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

ResourceSchema.pre('remove', async function (next) {
  await this.model('Subresource').deleteMany({ resource: this._id });
  next();
});

ResourceSchema.virtual('subresources', {
  ref: 'Subresource',
  localField: '_id',
  foreignField: 'resource',
  justOne: false,
});

module.exports = mongoose.model('Resource', ResourceSchema);
