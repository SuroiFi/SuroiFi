import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
} from '@chakra-ui/react'

const Game = () => {
  const { connected } = useWallet()
  const toast = useToast()
  const [gameState, setGameState] = useState({
    health: 100,
    shield: 0,
    ammo: 30,
    players: 0,
    gameStarted: false,
  })

  // Game stats display
  const GameStats = () => (
    <HStack spacing={4} w="full" p={4} bg="gray.700" rounded="md">
      <VStack align="start">
        <Text>Health</Text>
        <Progress
          value={gameState.health}
          colorScheme="red"
          w="100px"
          hasStripe
        />
      </VStack>
      <VStack align="start">
        <Text>Shield</Text>
        <Progress
          value={gameState.shield}
          colorScheme="blue"
          w="100px"
          hasStripe
        />
      </VStack>
      <VStack align="start">
        <Text>Ammo</Text>
        <Text>{gameState.ammo}</Text>
      </VStack>
      <VStack align="start">
        <Text>Players</Text>
        <Text>{gameState.players}</Text>
      </VStack>
    </HStack>
  )

  const startGame = () => {
    if (!connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to play',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      players: Math.floor(Math.random() * 50) + 50, // Random number of players
    }))

    toast({
      title: 'Game Started',
      description: 'Good luck, survivor!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Heading>Battle Royale</Heading>
        
        {gameState.gameStarted ? (
          <>
            <GameStats />
            <Box
              w="full"
              h="600px"
              bg="gray.800"
              rounded="lg"
              position="relative"
              overflow="hidden"
            >
              {/* Game canvas will be mounted here */}
              <Text
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              >
                Game Canvas Loading...
              </Text>
            </Box>
          </>
        ) : (
          <VStack spacing={4} align="center">
            <Text fontSize="xl">
              Ready to join the battle? Connect your wallet and start playing!
            </Text>
            <Button
              size="lg"
              colorScheme="brand"
              onClick={startGame}
              isDisabled={!connected}
            >
              Start Game
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

export default Game