import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Image,
  Badge,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'

// Mock NFT data for demonstration
const mockNFTs = [
  {
    id: 1,
    name: 'Golden Assault Rifle',
    image: '/nft/golden-ar.svg',
    price: 100,
    type: 'Weapon',
    rarity: 'Legendary',
  },
  {
    id: 2,
    name: 'Cyber Ninja Skin',
    image: '/nft/cyber-ninja.svg',
    price: 150,
    type: 'Character',
    rarity: 'Epic',
  },
  {
    id: 3,
    name: 'Dragon Scale Armor',
    image: '/nft/dragon-armor.svg',
    price: 80,
    type: 'Armor',
    rarity: 'Rare',
  },
  // Add more mock NFTs here
]

const NFTCard = ({ nft, onPurchase }) => {
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Box
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
    >
      <Image
        src={nft.image}
        alt={nft.name}
        h="200px"
        w="full"
        objectFit="cover"
        fallbackSrc="https://via.placeholder.com/200"
      />
      <VStack p={4} align="start" spacing={2}>
        <Heading size="md">{nft.name}</Heading>
        <HStack>
          <Badge colorScheme="purple">{nft.type}</Badge>
          <Badge
            colorScheme={
              nft.rarity === 'Legendary'
                ? 'yellow'
                : nft.rarity === 'Epic'
                ? 'purple'
                : 'blue'
            }
          >
            {nft.rarity}
          </Badge>
        </HStack>
        <Text fontSize="xl" fontWeight="bold" color="brand.500">
          {nft.price} SUR
        </Text>
        <Button w="full" onClick={() => onPurchase(nft)}>
          Purchase
        </Button>
      </VStack>
    </Box>
  )
}

const Marketplace = () => {
  const { connected } = useWallet()
  const toast = useToast()
  const [nfts, setNfts] = useState(mockNFTs)

  const handlePurchase = (nft) => {
    if (!connected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to make purchases',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Here we would integrate with Solana for actual NFT purchase
    toast({
      title: 'Purchase Initiated',
      description: `Attempting to purchase ${nft.name}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Heading>NFT Marketplace</Heading>
        <Text>Browse and purchase unique in-game assets using SUR tokens.</Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onPurchase={handlePurchase} />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Marketplace