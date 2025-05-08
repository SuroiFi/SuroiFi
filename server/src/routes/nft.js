import express from 'express'
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex } from '@metaplex-foundation/js'
import NFT from '../models/NFT.js'

const router = express.Router()

// Initialize Solana connection
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com')
const metaplex = new Metaplex(connection)

// Get all listed NFTs
router.get('/marketplace', async (req, res) => {
  try {
    const nfts = await NFT.find({ isListed: true })
      .sort({ currentPrice: 1 })
      .limit(50)
    res.json(nfts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get NFTs by owner
router.get('/owner/:walletAddress', async (req, res) => {
  try {
    const nfts = await NFT.find({ owner: req.params.walletAddress })
    res.json(nfts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get single NFT
router.get('/:tokenId', async (req, res) => {
  try {
    const nft = await NFT.findOne({ tokenId: req.params.tokenId })
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' })
    }
    res.json(nft)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Mint new NFT
router.post('/mint', async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      type,
      rarity,
      attributes,
      creator,
      mintPrice,
    } = req.body

    // Create NFT metadata
    const metadata = {
      name,
      description,
      image,
      attributes: [
        { trait_type: 'Type', value: type },
        { trait_type: 'Rarity', value: rarity },
        ...attributes,
      ],
    }

    // Mint NFT on Solana (simplified for demo)
    // In production, implement proper Solana NFT minting logic
    const tokenId = `TOKEN${Date.now()}`

    // Save NFT to database
    const nft = new NFT({
      tokenId,
      name,
      description,
      image,
      type,
      rarity,
      attributes,
      owner: creator,
      creator,
      mintPrice,
    })

    await nft.save()
    res.status(201).json(nft)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// List NFT for sale
router.post('/:tokenId/list', async (req, res) => {
  try {
    const nft = await NFT.findOne({ tokenId: req.params.tokenId })
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' })
    }

    if (nft.owner !== req.body.owner) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    nft.isListed = true
    nft.currentPrice = req.body.price
    await nft.save()

    res.json(nft)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Purchase NFT
router.post('/:tokenId/purchase', async (req, res) => {
  try {
    const nft = await NFT.findOne({ tokenId: req.params.tokenId })
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' })
    }

    if (!nft.isListed) {
      return res.status(400).json({ message: 'NFT is not listed for sale' })
    }

    const { buyer } = req.body

    // In production, implement Solana transaction logic here

    // Update NFT ownership
    nft.owner = buyer
    nft.isListed = false
    nft.lastTransferredAt = new Date()
    await nft.save()

    res.json(nft)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router