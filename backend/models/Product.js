import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['sneakers', 'clothes'],
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    compareAtPrice: {
      type: Number,
      min: 0
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    sizes: [
      {
        type: String,
        required: true
      }
    ],
    colors: [
      {
        name: String,
        hex: String
      }
    ],
    inventory: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'active',
      index: true
    },
    badge: {
      type: String,
      default: 'Limited Drop'
    },
    releaseAt: {
      type: Date,
      default: Date.now
    },
    details: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

productSchema.index({ category: 1, status: 1, releaseAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
