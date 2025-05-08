import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    stats: {
      gamesPlayed: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      killCount: { type: Number, default: 0 },
      avgPlacement: { type: Number, default: 0 },
    },
    inventory: [
      {
        tokenId: String,
        name: String,
        type: String,
        rarity: String,
        equipped: { type: Boolean, default: false },
      },
    ],
    achievements: [
      {
        name: String,
        description: String,
        completed: { type: Boolean, default: false },
        progress: Number,
        total: Number,
        completedAt: Date,
      },
    ],
    surBalance: {
      type: Number,
      default: 0,
    },
    lastLogin: Date,
  },
  { timestamps: true }
)

// Calculate win rate
userSchema.virtual('winRate').get(function () {
  if (this.stats.gamesPlayed === 0) return '0%'
  return ((this.stats.wins / this.stats.gamesPlayed) * 100).toFixed(1) + '%'
})

// Update average placement
userSchema.methods.updateAvgPlacement = function (placement) {
  const totalGames = this.stats.gamesPlayed
  const currentAvg = this.stats.avgPlacement
  this.stats.avgPlacement =
    (currentAvg * totalGames + placement) / (totalGames + 1)
  this.stats.gamesPlayed += 1
}

const User = mongoose.model('User', userSchema)

export default User