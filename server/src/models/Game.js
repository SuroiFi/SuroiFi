import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'completed'],
      default: 'waiting',
    },
    startTime: Date,
    endTime: Date,
    players: [
      {
        walletAddress: String,
        position: {
          x: Number,
          y: Number,
        },
        health: {
          type: Number,
          default: 100,
        },
        shield: {
          type: Number,
          default: 0,
        },
        inventory: [
          {
            type: String,
            itemId: String,
            amount: Number,
          },
        ],
        kills: {
          type: Number,
          default: 0,
        },
        placement: Number,
      },
    ],
    map: {
      seed: String,
      size: Number,
      toxicZone: {
        center: {
          x: Number,
          y: Number,
        },
        radius: Number,
      },
    },
    events: [
      {
        type: String,
        timestamp: Date,
        data: mongoose.Schema.Types.Mixed,
      },
    ],
    winner: String, // Wallet address of winner
  },
  { timestamps: true }
)

// Add indexes for efficient querying
gameSchema.index({ status: 1, startTime: -1 })
gameSchema.index({ 'players.walletAddress': 1 })

const Game = mongoose.model('Game', gameSchema)

export default Game