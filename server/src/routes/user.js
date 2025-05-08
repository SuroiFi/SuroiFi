import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Get user profile
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create or update user
router.post('/', async (req, res) => {
  try {
    const { walletAddress } = req.body
    let user = await User.findOne({ walletAddress })

    if (user) {
      // Update last login
      user.lastLogin = new Date()
      await user.save()
    } else {
      // Create new user
      user = new User({
        walletAddress,
        lastLogin: new Date(),
      })
      await user.save()
    }

    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update user stats
router.patch('/:walletAddress/stats', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { placement, kills, won } = req.body
    
    // Update stats
    user.updateAvgPlacement(placement)
    user.stats.killCount += kills
    if (won) user.stats.wins += 1

    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Add NFT to inventory
router.post('/:walletAddress/inventory', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { tokenId, name, type, rarity } = req.body
    user.inventory.push({
      tokenId,
      name,
      type,
      rarity,
      equipped: false,
    })

    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Toggle NFT equipped status
router.patch('/:walletAddress/inventory/:tokenId', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const nft = user.inventory.find(item => item.tokenId === req.params.tokenId)
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found in inventory' })
    }

    nft.equipped = !nft.equipped
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update user achievements
router.patch('/:walletAddress/achievements', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { achievementName, progress, completed } = req.body
    const achievement = user.achievements.find(a => a.name === achievementName)

    if (achievement) {
      if (completed) {
        achievement.completed = true
        achievement.completedAt = new Date()
      } else {
        achievement.progress = progress
      }
    } else {
      user.achievements.push({
        name: achievementName,
        ...req.body,
      })
    }

    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router