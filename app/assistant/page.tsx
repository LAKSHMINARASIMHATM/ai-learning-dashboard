'use client';

import React from "react"

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Lightbulb } from 'lucide-react';
import { useState } from 'react';

const initialMessages = [
  {
    id: 1,
    type: 'ai',
    content:
      "Hello! I'm your AI Learning Tutor. I'm here to help you master any topic and answer all your questions. What would you like to learn about today?",
  },
];

const suggestions = [
  "Explain React hooks to me",
  "Help me with TypeScript generics",
  "What's the best way to structure APIs?",
  "How do I optimize database queries?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: generateMockAIResponse(input),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">AI Learning Assistant</h2>
        <p className="text-muted-foreground">
          Get instant help, explanations, and guidance from your personal AI tutor
        </p>
      </div>

      <Card className="h-[600px] flex flex-col">
        {/* Chat Messages */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-5xl mb-4">🤖</div>
                <p className="text-muted-foreground">Start a conversation with your AI tutor</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-border p-6 space-y-4">
          {messages.length === 1 && !isLoading && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Lightbulb className="w-3 h-3" />
                Suggested topics
              </p>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left text-sm p-3 rounded-lg bg-muted hover:bg-muted/80 transition text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </DashboardLayout>
  );
}

function generateMockAIResponse(userInput: string): string {
  const responses: { [key: string]: string } = {
    hook: `React Hooks are functions that let you use state and other React features in functional components. The most common hooks are:

1. **useState** - Adds state to functional components
2. **useEffect** - Handles side effects like data fetching
3. **useContext** - Access context values without nesting
4. **useReducer** - Complex state management
5. **useCallback** - Memoize callback functions

Would you like me to explain any of these in detail?`,

    generics: `TypeScript Generics allow you to write reusable code that works with multiple types. Here's a basic example:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("hello");
\`\`\`

The <T> is a type variable that will be replaced with the actual type when the function is called.`,

    api: `Best practices for RESTful APIs:

1. **Use proper HTTP methods** - GET, POST, PUT, DELETE
2. **Version your API** - /api/v1/
3. **Use consistent naming** - /users, /products
4. **Proper status codes** - 200, 404, 500
5. **Error handling** - Return meaningful error messages
6. **Authentication** - Use JWT or OAuth
7. **Rate limiting** - Protect your API

Would you like examples of any of these?`,

    database: `To optimize database queries:

1. **Add indexes** on frequently searched columns
2. **Avoid SELECT *** - Only fetch needed columns
3. **Use JOINs efficiently** - Join tables at DB level
4. **Lazy load data** - Load related data only when needed
5. **Use pagination** - Don't load all records at once
6. **Monitor slow queries** - Use EXPLAIN PLAN

What's your current database setup?`,
  };

  const input_lower = userInput.toLowerCase();

  for (const [key, response] of Object.entries(responses)) {
    if (input_lower.includes(key)) {
      return response;
    }
  }

  return `That's a great question! Based on your learning path, I'd recommend exploring this topic step by step. Would you like me to:

1. Break it down into smaller concepts?
2. Provide code examples?
3. Link you to relevant learning resources?
4. Quiz you on your understanding?

Let me know how I can help!`;
}
