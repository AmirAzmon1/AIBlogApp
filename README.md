# Next JS & OpenRouter API: Next-generation Next JS & AI apps

This is the starter repo for the [Next JS & Open AI / GPT: Next-generation Next JS & AI apps course](https://www.udemy.com/course/next-js-ai/?referralCode=CF9492ACD4991930F84E).

## OpenRouter API Setup

This project now uses OpenRouter API instead of OpenAI API directly. OpenRouter provides access to multiple AI models including GPT-3.5, GPT-4, Claude, and more.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site URL for OpenRouter headers
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Auth0 Configuration (if needed)
# AUTH0_SECRET='your-auth0-secret'
# AUTH0_BASE_URL='http://localhost:3000'
# AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
# AUTH0_CLIENT_ID='your-auth0-client-id'
# AUTH0_CLIENT_SECRET='your-auth0-client-secret'
```

### Getting OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

### Available Models

With OpenRouter, you can use various models by changing the model name in `pages/api/chat.js`:

- `openai/gpt-3.5-turbo` - GPT-3.5 Turbo
- `openai/gpt-4` - GPT-4
- `anthropic/claude-3-sonnet` - Claude 3 Sonnet
- `meta-llama/llama-2-70b-chat` - Llama 2 70B
- And many more!

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Character-based chat system
- OpenRouter API integration
- Multiple AI model support
- Auth0 authentication
- Responsive UI with Tailwind CSS
