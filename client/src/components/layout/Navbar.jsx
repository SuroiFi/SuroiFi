import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  useColorMode,
  useColorModeValue,
  Image,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const NavLink = ({ to, children }) => (
    <Link
      as={RouterLink}
      to={to}
      px={4}
      py={2}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
      {children}
    </Link>
  )

  return (
    <Box
      bg={bgColor}
      px={4}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <Box as={RouterLink} to="/">
            <Image h="40px" src="/suroi-logo.svg" alt="SuroiFi" />
          </Box>
          <HStack as={'nav'} spacing={4}>
            <NavLink to="/game">Game</NavLink>
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <Button onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
          <WalletMultiButton />
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar