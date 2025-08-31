// pages/api/chat.js
import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Debug logging
  console.log('Chat API called with:', { 
    message: req.body.message, 
    characterName: req.body.characterName,
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    openRouterKeyLength: process.env.OPENROUTER_API_KEY?.length || 0
  });

  try {
    const { message, characterName, characterDescription } = req.body;

    if (!message || !characterName) {
      return res.status(400).json({ message: 'Message and character name are required' });
    }

    // Check if OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      console.log('No OpenRouter API key found, using fallback');
      // Fallback response when OpenRouter is not configured
      const fallbackResponses = [
        `*In ${characterName}'s voice*: Hello there! I'm ${characterName}. ${characterDescription || 'I\'m excited to chat with you!'}`,
        `*As ${characterName}*: Greetings! I'm ${characterName}. What would you like to know about me?`,
        `*${characterName} speaking*: Hi! I'm ${characterName}. I'd love to tell you more about myself and my world.`,
        `*${characterName} responds*: Well hello! I'm ${characterName}. ${characterDescription || 'I\'m quite the character, aren\'t I?'}`,
        `*${characterName} says*: Greetings, friend! I'm ${characterName}. What brings you to chat with me today?`
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      // Simulate some delay to make it feel more realistic
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      return res.status(200).json({ 
        response: randomResponse,
        note: "OpenRouter API not configured - using fallback responses"
      });
    }

    console.log('OpenRouter API key found, making API call');
    
    // Use OpenRouter API
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Character Chat App'
      }
    });

    const systemPrompt = `You are ${characterName}. ${characterDescription || ''}

IMPORTANT RULES:
1. Stay completely in character as ${characterName}
2. Respond as if you ARE ${characterName}, not as a narrator
3. Keep responses concise (1-3 sentences max)
4. Be engaging and true to the character's personality
5. If you don't know something about the character, make it up based on the description
6. Never break character or explain that you're an AI`;

    console.log('Sending request to OpenRouter with prompt:', systemPrompt);

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // OpenRouter model format
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I cannot respond right now.';
    console.log('OpenRouter response received:', response);

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Provide a more helpful error message
    let errorMessage = 'Sorry, I encountered an error. Please try again.';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'OpenRouter API is not properly configured. Please check your environment variables.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Too many requests. Please wait a moment and try again.';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'OpenRouter quota exceeded. Please check your account.';
    }
    
    return res.status(500).json({ 
      message: errorMessage, 
      error: error.message,
      suggestion: "Check your .env.local file for OPENROUTER_API_KEY"
    });
  }
}