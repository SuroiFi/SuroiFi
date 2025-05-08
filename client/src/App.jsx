import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Game from './pages/Game'
import Marketplace from './pages/Marketplace'
import Profile from './pages/Profile'

const App = () => {
  return (
    <Box minH="100vh">
      <Navbar />
      <Container maxW="container.xl" py={8}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App