import mongoose from 'mongoose'

const nftSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    type: {
      type: String,
      enum: ['Weapon', 'Character', 'Armor', 'Accessory'],
      required: true,
    },
    rarity: {
      type: String,
      enum: ['Common', 'Rare', 'Epic', 'Legendary'],
      required: true,
    },
    attributes: [
      {
        trait_type: String,
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    owner: {
      type: String, // Wallet address
      required: true,
      index: true,
    },
    creator: {
      type: String, // Wallet address
      required: true,
    },
    mintPrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
    isListed: {
      type: Boolean,
      default: false,
    },
    mintedAt: {
      type: Date,
      default: Date.now,
    },
    lastTransferredAt: Date,
  },
  { timestamps: true }
)

// Add indexes for efficient querying
nftSchema.index({ type: 1, rarity: 1 })
nftSchema.index({ isListed: 1, currentPrice: 1 })

const NFT = mongoose.model('NFT', nftSchema)

export default NFT