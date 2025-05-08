import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
} from '@chakra-ui/react'

// Mock user data for demonstration
const mockUserData = {
  stats: {
    gamesPlayed: 150,
    wins: 23,
    killCount: 450,
    winRate: '15.3%',
    avgPlacement: 12,
  },
  inventory: [
    {
      id: 1,
      name: 'Golden Assault Rifle',
      type: 'Weapon',
      rarity: 'Legendary',
      equipped: true,
    },
    {
      id: 2,
      name: 'Cyber Ninja Skin',
      type: 'Character',
      rarity: 'Epic',
      equipped: true,
    },
    // Add more inventory items
  ],
  achievements: [
    {
      id: 1,
      name: 'First Victory',
      description: 'Win your first battle royale match',
      completed: true,
      date: '2024-03-15',
    },
    {
      id: 2,
      name: 'Legendary Collection',
      description: 'Collect 5 legendary items',
      completed: false,
      progress: 3,
      total: 5,
    },
    // Add more achievements
  ],
}

const Profile = () => {
  const { connected, publicKey } = useWallet()
  const [userData, setUserData] = useState(mockUserData)
  const statBg = useColorModeValue('white', 'gray.700')

  const StatCard = ({ label, value, helpText }) => (
    <Stat
      px={4}
      py={3}
      bg={statBg}
      rounded="lg"
      shadow="base"
      textAlign="center"
    >
      <StatLabel fontSize="sm" fontWeight="medium">
        {label}
      </StatLabel>
      <StatNumber fontSize="2xl" fontWeight="bold">
        {value}
      </StatNumber>
      {helpText && <StatHelpText>{helpText}</StatHelpText>}
    </Stat>
  )

  if (!connected) {
    return (
      <VStack spacing={4} align="center" py={10}>
        <Heading size="lg">Connect Your Wallet</Heading>
        <Text>Please connect your wallet to view your profile</Text>
      </VStack>
    )
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Heading>Player Profile</Heading>
        <Text color="gray.500">
          Wallet: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
        </Text>

        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
          <StatCard
            label="Games Played"
            value={userData.stats.gamesPlayed}
          />
          <StatCard
            label="Wins"
            value={userData.stats.wins}
            helpText={userData.stats.winRate}
          />
          <StatCard
            label="Kills"
            value={userData.stats.killCount}
          />
          <StatCard
            label="Avg Placement"
            value={userData.stats.avgPlacement}
          />
          <StatCard
            label="SUR Balance"
            value="1,234"
            helpText="≈ $123.40"
          />
        </SimpleGrid>

        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            <Tab>Inventory</Tab>
            <Tab>Achievements</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {userData.inventory.map((item) => (
                  <Box
                    key={item.id}
                    p={4}
                    bg={statBg}
                    rounded="lg"
                    shadow="base"
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{item.name}</Text>
                        <HStack>
                          <Text fontSize="sm" color="gray.500">
                            {item.type}
                          </Text>
                          <Text fontSize="sm" color="yellow.500">
                            {item.rarity}
                          </Text>
                        </HStack>
                      </VStack>
                      <Button
                        size="sm"
                        variant={item.equipped ? 'solid' : 'outline'}
                      >
                        {item.equipped ? 'Equipped' : 'Equip'}
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="stretch">
                {userData.achievements.map((achievement) => (
                  <Box
                    key={achievement.id}
                    p={4}
                    bg={statBg}
                    rounded="lg"
                    shadow="base"
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{achievement.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {achievement.description}
                        </Text>
                        {achievement.completed && (
                          <Text fontSize="sm" color="green.500">
                            Completed on {achievement.date}
                          </Text>
                        )}
                        {!achievement.completed && achievement.progress && (
                          <Text fontSize="sm" color="blue.500">
                            Progress: {achievement.progress}/{achievement.total}
                          </Text>
                        )}
                      </VStack>
                      {achievement.completed && (
                        <Box color="green.500" fontSize="xl">
                          ✓
                        </Box>
                      )}
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  )
}

export default Profile