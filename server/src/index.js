import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'http'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const httpServer = createServer(app)

// Set up Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/suroifi')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Import routes
import userRoutes from './routes/user.js'
import nftRoutes from './routes/nft.js'
import gameRoutes from './routes/game.js'

// Routes
app.use('/api/users', userRoutes)
app.use('/api/nfts', nftRoutes)
app.use('/api/games', gameRoutes)

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('join_game', (data) => {
    // Handle player joining game
    socket.join(data.gameId)
    io.to(data.gameId).emit('player_joined', {
      playerId: socket.id,
      playerCount: io.sockets.adapter.rooms.get(data.gameId).size,
    })
  })

  socket.on('player_move', (data) => {
    // Broadcast player movement to other players in the same game
    socket.to(data.gameId).emit('player_moved', {
      playerId: socket.id,
      position: data.position,
    })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// Start server
const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})