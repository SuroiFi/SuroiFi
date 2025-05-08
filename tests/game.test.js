import { expect } from 'chai'
import request from 'supertest'
import app from '../server/src/index.js'
import Game from '../server/src/models/Game.js'
import User from '../server/src/models/User.js'
import mongoose from 'mongoose'

describe('Game API Tests', () => {
  let testGame
  const testWallet = '0x1234567890abcdef'

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/suroifi_test')
  })

  beforeEach(async () => {
    // Clear database before each test
    await Game.deleteMany({})
    await User.deleteMany({})

    // Create test game
    testGame = new Game({
      gameId: 'TEST_GAME_1',
      status: 'waiting',
      map: {
        seed: 'test_seed',
        size: 2000,
        toxicZone: {
          center: { x: 1000, y: 1000 },
          radius: 1000,
        },
      },
    })
    await testGame.save()
  })

  describe('POST /game/create', () => {
    it('should create a new game', async () => {
      const res = await request(app)
        .post('/api/game/create')
        .expect(201)

      expect(res.body).to.have.property('gameId')
      expect(res.body.status).to.equal('waiting')
      expect(res.body.map).to.have.property('size', 2000)
    })
  })

  describe('POST /game/:gameId/join', () => {
    it('should allow player to join game', async () => {
      const res = await request(app)
        .post(`/api/game/${testGame.gameId}/join`)
        .send({ walletAddress: testWallet })
        .expect(200)

      expect(res.body.players).to.have.lengthOf(1)
      expect(res.body.players[0].walletAddress).to.equal(testWallet)
    })

    it('should not allow joining full game', async () => {
      // Add maximum players
      testGame.players = Array(100).fill({ walletAddress: '0x' + Math.random().toString(16).slice(2) })
      await testGame.save()

      await request(app)
        .post(`/api/game/${testGame.gameId}/join`)
        .send({ walletAddress: testWallet })
        .expect(400)
    })
  })

  describe('PATCH /game/:gameId/player/:walletAddress', () => {
    beforeEach(async () => {
      testGame.players.push({
        walletAddress: testWallet,
        position: { x: 100, y: 100 },
        health: 100,
      })
      await testGame.save()
    })

    it('should update player state', async () => {
      const newState = {
        position: { x: 200, y: 200 },
        health: 80,
        shield: 20,
      }

      const res = await request(app)
        .patch(`/api/game/${testGame.gameId}/player/${testWallet}`)
        .send(newState)
        .expect(200)

      expect(res.body.players[0].position).to.deep.equal(newState.position)
      expect(res.body.players[0].health).to.equal(newState.health)
      expect(res.body.players[0].shield).to.equal(newState.shield)
    })
  })

  describe('POST /game/:gameId/elimination', () => {
    beforeEach(async () => {
      testGame.players = [
        { walletAddress: testWallet, health: 100 },
        { walletAddress: '0xabc', health: 100 },
      ]
      await testGame.save()
    })

    it('should handle player elimination', async () => {
      const res = await request(app)
        .post(`/api/game/${testGame.gameId}/elimination`)
        .send({
          eliminated: '0xabc',
          eliminator: testWallet,
        })
        .expect(200)

      expect(res.body.players[1].health).to.equal(0)
      expect(res.body.players[0].kills).to.equal(1)
    })

    it('should end game when one player remains', async () => {
      const res = await request(app)
        .post(`/api/game/${testGame.gameId}/elimination`)
        .send({
          eliminated: '0xabc',
          eliminator: testWallet,
        })
        .expect(200)

      expect(res.body.status).to.equal('completed')
      expect(res.body.winner).to.equal(testWallet)
    })
  })

  after(async () => {
    await mongoose.disconnect()
  })
})