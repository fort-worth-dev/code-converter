import dotenv from 'dotenv';

// Load environment variables as early as possible
dotenv.config();

// Validate required environment variables
if (!process.env.ANTHROPIC_API_KEY) {
  const errorMessage = 
    'ANTHROPIC_API_KEY is not set. Please create a .env file in the server directory with:\n' +
    'ANTHROPIC_API_KEY=your_api_key_here\n\n' +
    'Get your API key from: https://console.anthropic.com/';
  console.error(errorMessage);
  // Don't throw here to allow the app to start, but it will fail when trying to use the API
}

export default {};

