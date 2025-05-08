# SuroiFi API Documentation

## Overview
This document outlines the API endpoints for the SuroiFi game platform.

## Authentication
All API requests require a valid wallet address for authentication.

## Endpoints

### Game API

#### Create Game
```http
POST /api/game/create
```
Creates a new game session.

#### Join Game
```http
POST /api/game/:gameId/join
```
Joins an existing game session.

### NFT API

#### Mint NFT
```http
POST /api/nft/mint
```
Mints a new NFT.

#### List NFT
```http
POST /api/nft/:tokenId/list
```
Lists an NFT for sale.

### User API

#### Get Profile
```http
GET /api/user/:walletAddress
```
Retrieves user profile information.

#### Update Stats
```http
PATCH /api/user/:walletAddress/stats
```
Updates user game statistics.

## Error Handling
All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Rate Limiting
API requests are limited to 100 requests per minute per IP address.