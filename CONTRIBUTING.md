# Contributing to SuroiFi

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis
- Solana CLI tools

### Local Development
1. Clone the repository
```bash
git clone https://github.com/yourusername/suroifi.git
cd suroifi
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development servers
```bash
# Start server
cd server
npm run dev

# Start client
cd ../client
npm run dev
```

## Code Style
- Use ESLint and Prettier for code formatting
- Follow the existing code style
- Write meaningful commit messages

## Testing
- Write tests for new features
- Ensure all tests pass before submitting PR
- Run tests with `npm test`

## Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Submit a pull request

## Code Review
- All submissions require review
- Follow reviewer feedback
- Keep PRs focused and manageable

## Documentation
- Update API documentation for new endpoints
- Document new features and changes
- Keep README.md up to date

## Reporting Issues
- Use the issue tracker
- Include steps to reproduce
- Provide relevant environment details

## Community
- Be respectful and inclusive
- Help others when possible
- Follow the code of conduct