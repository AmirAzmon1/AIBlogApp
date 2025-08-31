// pages/characters/[characterId].js
import { useRouter } from 'next/router';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

function CharacterDetailPage({ character }) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [mounted, setMounted] = useState(false);
  const chatEndRef = useRef(null);

  // מניעת hydration errors
  useEffect(() => {
    setMounted(true);
    setChatHistory([]); 
    // Load chat history from localStorage
    const savedChat = localStorage.getItem(`chat_${character.id}`);
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        setChatHistory(parsedChat);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, [character.id]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (mounted && chatHistory.length > 0) {
      localStorage.setItem(`chat_${character.id}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, mounted, character.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { 
      role: 'user', 
      content: message, 
      timestamp: new Date(),
      id: Date.now() + Math.random()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          characterName: character.name,
          characterDescription: character.description
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const characterMessage = { 
          role: 'character', 
          content: data.response, 
          timestamp: new Date(),
          id: Date.now() + Math.random()
        };
        setChatHistory(prev => [...prev, characterMessage]);
        
        // Show note if using fallback responses
        if (data.note) {
          const noteMessage = { 
            role: 'system', 
            content: `ℹ️ ${data.note}`, 
            timestamp: new Date(),
            id: Date.now() + Math.random()
          };
          setChatHistory(prev => [...prev, noteMessage]);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = { 
          role: 'system', 
          content: errorData.message || 'Sorry, I encountered an error. Please try again.', 
          timestamp: new Date(),
          id: Date.now() + Math.random()
        };
        setChatHistory(prev => [...prev, errorMessage]);
        
        // Show suggestion if available
        if (errorData.suggestion) {
          const suggestionMessage = { 
            role: 'system', 
            content: `💡 ${errorData.suggestion}`, 
            timestamp: new Date(),
            id: Date.now() + Math.random()
          };
          setChatHistory(prev => [...prev, suggestionMessage]);
        }
      }
    } catch (error) {
      const errorMessage = { 
        role: 'system', 
        content: 'Network error. Please check your connection.', 
        timestamp: new Date(),
        id: Date.now() + Math.random()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem(`chat_${character.id}`);
  };

  const sendQuickMessage = (quickMessage) => {
    setMessage(quickMessage);
  };

  const quickMessages = [
    "Tell me about yourself",
    "What's your story?",
    "What do you like to do?",
    "What's your world like?",
    "What makes you unique?"
  ];

  if (!character) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Character Not Found</h1>
        <p className="text-gray-600 mt-2">The character you're looking for doesn't exist.</p>
        <Link href="/characters" className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Back to Characters
        </Link>
      </div>
    );
  }

  // מניעת render עד שהקומפוננטה מוכנה
  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/characters" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            ← Back to Characters
          </Link>
          <h1 className="text-3xl font-bold">{character.name}</h1>
        </div>
        <div className="text-center py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/characters" className="inline-flex items-center text-blue-600 hover:underline mb-4">
          ← Back to Characters
        </Link>
        <h1 className="text-3xl font-bold">{character.name}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Character Details */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Character Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{character.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{character.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="text-gray-900">
                  {character.createdAt ? new Date(character.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {character.imageUrl && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Character Image</h3>
              <img 
                src={character.imageUrl} 
                alt={character.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Enhanced Chat Component */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">💬 Chat with {character.name}</h2>
              {chatHistory.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  title="Clear chat history"
                >
                  🗑️ Clear
                </button>
              )}
            </div>
            
            {/* Enhanced Chat History */}
            <div className="h-80 overflow-y-auto mb-4 border rounded-lg p-4 bg-gradient-to-b from-gray-50 to-white">
              {chatHistory.length === 0 ? (
                <div className="space-y-4" >
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">👋</div>
                    <p className="text-gray-500 text-sm">
                      Start a conversation with {character.name}...
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Ask them anything about their world!
                    </p>
                  </div>
                  
                  {/* Setup Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="text-blue-600 text-sm">ℹ️</div>
                      <div className="text-xs text-blue-800">
                        <p className="font-medium mb-1">Setup Instructions:</p>
                        <p className="mb-2">To use OpenRouter-powered responses, create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file with:</p>
                        <code className="block bg-blue-100 p-2 rounded text-xs font-mono">
                          OPENROUTER_API_KEY=your_openrouter_api_key_here
                        </code>
                        <p className="mt-2 text-blue-700">Without it, you'll get fallback responses for testing.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-md' 
                          : msg.role === 'character'
                          ? 'bg-purple-600 text-white rounded-bl-md'
                          : 'bg-gray-400 text-white rounded-bl-md'
                      }`}>
                        {/* <div className="mb-1">
                          {msg.role === 'user' && '👤 You'}
                          {msg.role === 'character' && `🎭 ${character.name}`}
                          {msg.role === 'system' && '⚠️ System'}
                        </div> */}
                        <div className="leading-relaxed">{msg.content}</div>
                        <div className={`text-xs mt-2 opacity-70 ${
                          msg.role === 'user' ? 'text-blue-100' : 'text-purple-100'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-purple-600 text-white px-4 py-3 rounded-2xl rounded-bl-md text-sm shadow-sm">
                        <div className="mb-1">🎭 {character.name}</div>
                        <div className="flex items-center space-x-1">
                          <div className="animate-pulse">💭</div>
                          <span>is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Enhanced Message Input */}
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Type a message to ${character.name}...`}
                  className="flex-1 rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      📤 Send
                    </>
                  )}
                </button>
              </div>
              
              {/* Quick Message Suggestions */}
              {chatHistory.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 text-center">💡 Quick conversation starters:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickMessages.map((msg, index) => (
                      <button
                        key={index}
                        onClick={() => sendQuickMessage(msg)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>💡 Tip: Ask about their background, personality, or world!</span>
                </div>
                <div className="text-right">
                  {chatHistory.length > 0 && (
                    <span>{chatHistory.length} messages</span>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res, params }) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const url = baseUrl 
        ? `${baseUrl}/api/characters/${params.characterId}` 
        : `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}/api/characters/${params.characterId}`;
      
      const response = await fetch(url, { 
        headers: { cookie: req.headers.cookie || '' } 
      });
      
      if (!response.ok) {
        return { props: { character: null } };
      }
      
      const data = await response.json();
      return { props: { character: data.character } };
    } catch (error) {
      console.error('Error fetching character:', error);
      return { props: { character: null } };
    }
  },
});

export default CharacterDetailPage;