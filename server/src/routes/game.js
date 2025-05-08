import express from 'express'
import Game from '../models/Game.js'
import User from '../models/User.js'

const router = express.Router()

// Create new game session
router.post('/create', async (req, res) => {
  try {
    const gameId = `GAME${Date.now()}`
    const mapSize = 2000 // 2000x2000 units

    const game = new Game({
      gameId,
      status: 'waiting',
      map: {
        seed: Math.random().toString(36).substring(7),
        size: mapSize,
        toxicZone: {
          center: { x: mapSize / 2, y: mapSize / 2 },
          radius: mapSize / 2,
        },
      },
    })

    await game.save()
    res.status(201).json(game)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Join game
router.post('/:gameId/join', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.gameId })
    if (!game) {
      return res.status(404).json({ message: 'Game not found' })
    }

    if (game.status !== 'waiting') {
      return res.status(400).json({ message: 'Game already started' })
    }

    const { walletAddress } = req.body
    
    // Check if player already joined
    if (game.players.some(p => p.walletAddress === walletAddress)) {
      return res.status(400).json({ message: 'Already joined' })
    }

    // Add player to game
    game.players.push({
      walletAddress,
      position: {
        x: Math.random() * game.map.size,
        y: Math.random() * game.map.size,
      },
    })

    // Start game if enough players
    if (game.players.length >= 2) { // Minimum 2 players
      game.status = 'in_progress'
      game.startTime = new Date()
    }

    await game.save()
    res.json(game)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update player state
router.patch('/:gameId/player/:walletAddress', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.gameId })
    if (!game) {
      return res.status(404).json({ message: 'Game not found' })
    }

    const player = game.players.find(
      p => p.walletAddress === req.params.walletAddress
    )
    if (!player) {
      return res.status(404).json({ message: 'Player not found' })
    }

    // Update player state
    const { position, health, shield, inventory } = req.body
    if (position) player.position = position
    if (health !== undefined) player.health = health
    if (shield !== undefined) player.shield = shield
    if (inventory) player.inventory = inventory

    // Add event
    game.events.push({
      type: 'player_update',
      timestamp: new Date(),
      data: { walletAddress: player.walletAddress, ...req.body },
    })

    await game.save()
    res.json(game)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Record player elimination
router.post('/:gameId/elimination', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.gameId })
    if (!game) {
      return res.status(404).json({ message: 'Game not found' })
    }

    const { eliminated, eliminator } = req.body

    // Update eliminated player
    const eliminatedPlayer = game.players.find(
      p => p.walletAddress === eliminated
    )
    if (eliminatedPlayer) {
      eliminatedPlayer.health = 0
      eliminatedPlayer.placement = game.players.filter(p => p.health > 0).length + 1
    }

    // Update eliminator stats
    const eliminatorPlayer = game.players.find(
      p => p.walletAddress === eliminator
    )
    if (eliminatorPlayer) {
      eliminatorPlayer.kills += 1
    }

    // Add elimination event
    game.events.push({
      type: 'elimination',
      timestamp: new Date(),
      data: { eliminated, eliminator },
    })

    // Check if game is over
    const alivePlayers = game.players.filter(p => p.health > 0)
    if (alivePlayers.length === 1) {
      game.status = 'completed'
      game.endTime = new Date()
      game.winner = alivePlayers[0].walletAddress

      // Update winner's stats
      const user = await User.findOne({ walletAddress: game.winner })
      if (user) {
        user.stats.wins += 1
        await user.save()
      }
    }

    await game.save()
    res.json(game)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get game state
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.params.gameId })
    if (!game) {
      return res.status(404).json({ message: 'Game not found' })
    }
    res.json(game)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get recent games for a player
router.get('/player/:walletAddress', async (req, res) => {
  try {
    const games = await Game.find({
      'players.walletAddress': req.params.walletAddress,
      status: 'completed',
    })
      .sort({ endTime: -1 })
      .limit(10)
    res.json(games)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router