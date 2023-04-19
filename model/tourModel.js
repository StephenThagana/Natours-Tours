const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have  less or equal than 40 characters'],
      minlength: [10, 'A tour must have  more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain chararcters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, ' A tour must have difficulty'],

      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A tour must must be either: easy,medium or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Raring must be above 1.0'],
      max: [5, 'Raring must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        mesage: 'Discount price ({VALE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, ' A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    // secretTours: {
    //   type: boolean,
    //   default: false,
    // },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: 'Point',
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
toursSchema.index({ price: 1, ratingsAverage: -1 });
toursSchema.index({ slug: 1 });
toursSchema.index({ startLocation: '2dsphere' });

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

toursSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document middleware,it runs before save() command and create() bt not insertMany()
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// toursSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promises.all(guidesPromises);
//   next();
// });

// QUERY MIDDLEWARE
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

toursSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});
toursSchema.post(/^find/, function (docs, next) {
  next();
});

// AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function (next) {
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
