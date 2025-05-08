import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaGamepad, FaStore, FaTrophy, FaUsers } from 'react-icons/fa'

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Icon as={icon} w={10} h={10} color="brand.500" />
      <Heading fontSize={'xl'}>{title}</Heading>
      <Text color={'gray.500'}>{text}</Text>
    </Stack>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <Box position={'relative'}>
      <Container maxW={'7xl'} py={16}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          textAlign={'center'}
          mb={16}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            Welcome to{' '}
            <Text as={'span'} color={'brand.500'}>
              SuroiFi
            </Text>
          </Heading>
          <Text color={'gray.500'} maxW={'3xl'}>
            A Solana-based Battle Royale GameFi project where you can play, earn,
            and own your in-game assets. Join the battle, collect unique NFTs,
            and become the ultimate survivor!
          </Text>
          <Stack spacing={6} direction={'row'}>
            <Button
              rounded={'full'}
              px={6}
              size="lg"
              onClick={() => navigate('/game')}
            >
              Play Now
            </Button>
            <Button
              rounded={'full'}
              px={6}
              size="lg"
              variant="outline"
              onClick={() => navigate('/marketplace')}
            >
              Explore NFTs
            </Button>
          </Stack>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
          <Feature
            icon={FaGamepad}
            title={'Battle Royale'}
            text={'Compete in fast-paced matches with unique gameplay mechanics.'}
          />
          <Feature
            icon={FaStore}
            title={'NFT Marketplace'}
            text={'Trade unique skins, weapons, and other in-game assets.'}
          />
          <Feature
            icon={FaTrophy}
            title={'Tournaments'}
            text={'Participate in tournaments to win SUR tokens and rare NFTs.'}
          />
          <Feature
            icon={FaUsers}
            title={'Community'}
            text={'Join our growing community and shape the future of SuroiFi.'}
          />
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default Home